// @ts-check
'use strict'

/**
 * Preloaded into every worker with `-r <synckit>/register.cjs`, so it is in place before the
 * worker module and before any `--require` / `--import` hook that module depends on.
 *
 * If that module then fails to load — or raises any uncaught failure before the main thread
 * hears from it, including one that only surfaces after a top-level `await` — nothing would
 * ever tell the main thread: it is blocked in `Atomics.wait()` and cannot process the worker's
 * `error` event. This file reports each such failure through the transferred port instead:
 * it carries the error and bumps the notification byte in this worker's slice of the shared
 * buffer (`shared.cjs`) to wake the wait. The failure guard disarms itself while it reports and
 * arms again after a failure that leaves the worker serving, so a worker that keeps going keeps
 * reporting; the exit report below stays armed, because a worker that ends can never serve
 * another call.
 *
 * It is a plain CommonJS file at the package root, with no build step and no loader of its
 * own, so a test runner that maps the package to its source preloads exactly what the
 * published package ships. It registers no hooks and patches nothing.
 *
 * The build requires this file instead of inlining it, so the preload and a bundled entry share
 * one module instance and the state below can be plain module state.
 */

// type-coverage:ignore-next-line -- node types mark workerData as any
const { isMainThread, workerData } = require('node:worker_threads')

const {
  NOTIFY_INDEX,
  compareNodeVersion,
  extractProperties,
  getFlag,
} = require('./shared.cjs')

// Both are keyed by the worker's slice: one slice is one worker, and one guard must be armed even
// when the preload and the worker module's own import of synckit both reach this file.
/** @type {WeakSet<Int32Array>} */
const armed = new WeakSet()
/** @type {WeakSet<Int32Array>} */
const registered = new WeakSet()

/**
 * The part of synckit's worker data the guard needs.
 *
 * @typedef {object} WorkerLoadGuardData
 * @property {Int32Array} [sharedBufferView] This worker's slice of the shared buffer.
 * @property {import('node:worker_threads').MessagePort} [workerPort] The port a failure is reported on.
 */

/**
 * Whether a value is an `Error`, including one from another realm.
 *
 * `Error.isError` recognises errors across realms, where `instanceof Error` fails; it is not
 * available in every supported runtime, so fall back to `instanceof`.
 *
 * @param {unknown} value
 * @returns {value is Error} Whether the value is an error.
 */
const isError = value => Error.isError?.(value) ?? value instanceof Error

// Node made `throw` the default for unhandled rejections in 15; 14 warns and carries on, and the
// `--unhandled-rejections` value overrides that either way. The flag follows the naming of the
// `*_FLAG` constants in `src/constants.ts`, but the guard is its only reader, so it lives here.
const UNHANDLED_REJECTIONS_FLAG = '--unhandled-rejections'
const UNHANDLED_REJECTIONS_THROW_NODE_VERSION = '15'
const THROWING_REJECTION_MODES = new Set(['strict', 'throw'])

/**
 * Whether an unhandled rejection stops this worker rather than only warning.
 *
 * Read from the flag when it is set, in either form and from any source `getFlag` reads, and from
 * the Node major's default otherwise. An empty value is a flag without one, which only a start-up
 * error can produce. This is a best-effort match: the flag is not the only way a mode can be set.
 *
 * @returns {boolean} Whether a rejection is raised as an uncaught exception.
 */
const unhandledRejectionsThrow = () => {
  const mode = getFlag(UNHANDLED_REJECTIONS_FLAG)
  if (mode != null) {
    return THROWING_REJECTION_MODES.has(mode)
  }
  return compareNodeVersion(UNHANDLED_REJECTIONS_THROW_NODE_VERSION) >= 0
}

/**
 * Reports a failure to load the worker module, and wakes the main thread.
 *
 * @param {WorkerLoadGuardData | null | undefined} [data] The worker data, when there is one.
 */
const installWorkerLoadGuard = data => {
  // a loader thread re-runs the `-r` preload with `workerData` null, and there is nothing to
  // guard there
  const { sharedBufferView, workerPort } = data ?? {}
  if (!sharedBufferView || !workerPort || armed.has(sharedBufferView)) {
    return
  }

  armed.add(sharedBufferView)

  // set while this worker is stopping itself after a fatal report, so the `exit` handler below
  // does not turn that one failure into a second message and a second notification
  let exiting = false

  // whether an unhandled rejection stops the runtime is the runtime's business: the flag, the
  // throwing modes and the Node default are read here, through the flag helpers `shared.cjs` lends
  const rejectionThrows = unhandledRejectionsThrow()

  // A reason no failure can be, so that a reason which *is* `undefined` still reports the first time
  const notReported = Symbol('synckit:not-reported')

  // Under `--unhandled-rejections=strict` the runtime raises one rejection twice — as an uncaught
  // exception and then as an unhandled rejection — with the same reason object (measured), and each
  // event would otherwise post its own message and bump the notification counter. The call that
  // consumed the first would leave the second for the next call, which would then be handed a
  // failure from an earlier one. Identity tells the pair apart, and clearing on the next tick is
  // enough: the second event arrives before it, a later failure after it
  /** @type {unknown} */
  let lastReported = notReported

  /**
   * Reports a failure to the main thread and wakes whoever waits for it.
   *
   * @param {unknown} error
   * @param {boolean} fatal
   */
  const report = (error, fatal) => {
    // the caller sees the reason exactly as it was thrown, even when it is falsy, with its own
    // properties re-attached by `withProperties` on the other side. A reason that cannot cross
    // falls back to the bare error, then to a synthetic message that names it, and finally to a
    // constant message that never touches the reason, so a report is always delivered. Building
    // each payload inside the try catches a throwing property copy or getter like a failed post,
    // so the notification below is always reached
    //
    // a worker that never reached `runAsWorker` never loaded its module, and naming that is more
    // useful than the reason it failed with; one that did register failed while serving, which must
    // not be described as a load failure — `fatal` is true for both
    const loadFailure = !registered.has(sharedBufferView)

    const payloads = [
      () => ({ error, properties: extractProperties(error) }),
      () => ({ error }),
      () => ({
        error: new Error(
          `Worker ${loadFailure ? 'module failed to load' : 'failed'}: ${
            isError(error) ? error.message : String(error)
          }`,
        ),
      }),
      () => ({
        error: new Error(
          loadFailure ? 'Worker module failed to load' : 'Worker failed',
        ),
      }),
    ]

    for (const payload of payloads) {
      try {
        workerPort.postMessage({ workerFailure: true, fatal, ...payload() })
        break
      } catch {}
    }

    // this report is one notification: wake whoever waits for it
    Atomics.add(sharedBufferView, NOTIFY_INDEX, 1)
    Atomics.notify(sharedBufferView, NOTIFY_INDEX)

    // a fatal failure leaves nothing to serve, and no caller may be waiting to consume the report
    // (the main-side termination needs one), so stop the worker here as well. The exit is the one
    // just reported, so the handler below stays quiet about it.
    if (fatal && !exiting) {
      exiting = true
      // eslint-disable-next-line n/no-process-exit -- a fatal failure leaves nothing to serve
      process.exit(1)
    }
  }

  /**
   * @param {unknown} error
   * @param {'uncaughtException' | 'unhandledRejection'} event
   */
  const guard = (error, event) => {
    // the paired event for a failure already reported: dropping it here keeps one message and one
    // notification per failure, and leaves nothing behind for the next call to trip over
    if (error === lastReported) {
      return
    }
    lastReported = error
    process.nextTick(() => {
      lastReported = notReported
    })

    // disarm while reporting, so a throw from our own report cannot be caught right back here;
    // below they are put back unless this failure is stopping the worker
    process.off('uncaughtException', onUncaughtException)
    process.off('unhandledRejection', onUnhandledRejection)

    // The failure is fatal unless the worker both reached `runAsWorker` and has something left to
    // handle what follows: only then would it have survived and kept serving without the guard,
    // and only then can it be used for the next call. A handler that exits or rethrows is caught
    // by the exit report below, so a worker that dies is never waited on.
    //
    // An `unhandledRejection` listener cannot handle an uncaught exception, so only an
    // `uncaughtException` listener counts there. A rejection is different: under a throwing mode
    // (`throw`/`strict`, the default from Node 15) the runtime promotes a later one to an
    // uncaught exception, which a remaining `uncaughtException` listener does handle; under
    // `warn`/`none` a later one only warns and is ignored, so the worker keeps serving either way.
    const handled =
      process.listenerCount(event) > 0 ||
      (event === 'unhandledRejection' &&
        (!rejectionThrows || process.listenerCount('uncaughtException') > 0))

    const fatal = !registered.has(sharedBufferView) || !handled
    report(error, fatal)

    // a non-fatal failure leaves the worker serving, so arm again and report the next one too;
    // a fatal report has already stopped the worker
    if (!fatal) {
      process.on('uncaughtException', onUncaughtException)
      process.on('unhandledRejection', onUnhandledRejection)
    }
  }

  /** @param {unknown} error */
  function onUncaughtException(error) {
    guard(error, 'uncaughtException')
  }

  /** @param {unknown} reason */
  function onUnhandledRejection(reason) {
    guard(reason, 'unhandledRejection')
  }

  process.on('uncaughtException', onUncaughtException)
  process.on('unhandledRejection', onUnhandledRejection)

  // However this worker ends — a handler that calls `process.exit()`, the module exiting on its
  // own, or a clean shutdown — it cannot answer another call, and the guard may have been
  // disarmed long before. This is the last chance to say so, unless the exit is the fatal one just
  // reported above.
  process.on('exit', code => {
    if (exiting) {
      return
    }

    exiting = true
    report(new Error(`Worker exited with code ${code}`), true)
  })
}

/**
 * Marks the worker module as having reached `runAsWorker`, so that a failure after it is not
 * treated as a failure to load.
 *
 * @param {Int32Array} sharedBufferView
 */
const markWorkerRegistered = sharedBufferView => {
  // mirror `installWorkerLoadGuard`: without a view there is no slice to mark, and a `WeakSet`
  // rejects a non-object key
  if (!sharedBufferView) {
    return
  }

  registered.add(sharedBufferView)
}

if (!isMainThread) {
  installWorkerLoadGuard(workerData)
}

module.exports = {
  installWorkerLoadGuard,
  markWorkerRegistered,
}
