/**
 * @import {Pipeline} from 'trough'
 */

/**
 * @typedef {(CompleterCallback | CompleterRegular) & {pluginId?: string | symbol | undefined}} Completer
 *   Completer.
 *
 * @callback CompleterCallback
 *   Handle a set having processed, in callback-style.
 * @param {FileSet} set
 *   File set.
 * @param {CompleterCallbackNext} next
 *   Callback called when done.
 * @returns {undefined | void}
 *   Result.
 *
 *   Note: `void` included because TS sometimes infers it.
 *
 * @callback CompleterCallbackNext
 *   Callback called when done.
 * @param {Error | null | undefined} [error]
 *   Error.
 * @returns {undefined}
 *   Nothing.
 *
 * @callback CompleterRegular
 *   Handle a set having processed.
 * @param {FileSet} set
 *   File set.
 * @returns {Promise<undefined> | undefined | void}
 *   Nothing.
 *
 *   Note: `void` included because TS sometimes infers it.
 */

import {EventEmitter} from 'node:events'
import {trough} from 'trough'
import {VFile} from 'vfile'

export class FileSet extends EventEmitter {
  /**
   * FileSet.
   *
   * A FileSet is created to process multiple files through unified processors.
   * This set, containing all files, is exposed to plugins as an argument to the
   * attacher.
   */
  constructor() {
    super()

    const self = this

    /**
     * @deprecated
     *   Internal field that should be considered private.
     * @type {number}
     */
    this.actual = 0
    /**
     * This is used by the `queue` to stash async work.
     *
     * @deprecated
     *   Internal field that should be considered private.
     * @type {Record<string, Function>}
     */
    this.complete = {}
    /**
     * @deprecated
     *   Internal field that should be considered private.
     * @type {number}
     */
    this.expected = 0
    /**
     * @deprecated
     *   Internal field that should be considered private.
     * @type {Array<VFile>}
     */
    this.files = []
    /**
     * @deprecated
     *   Internal field that should be considered private.
     * @type {Array<string>}
     */
    this.origins = []
    /**
     * @deprecated
     *   Internal field that should be considered private.
     * @type {Pipeline}
     */
    this.pipeline = trough()
    /**
     * @deprecated
     *   Internal field that should be considered private.
     * @type {Array<Completer>}
     */
    this.plugins = []

    // Called when a single file has completed it’s pipeline, triggering `done`
    // when all files are complete.
    this.on('one', function () {
      self.actual++

      if (self.actual >= self.expected) {
        self.emit('done')
      }
    })
  }

  /**
   * Get files in a set.
   */
  valueOf() {
    return this.files
  }

  /**
   * Add middleware to be called when done.
   *
   * @param {Completer} completer
   *   Plugin.
   * @returns
   *   Self.
   */
  use(completer) {
    const pipeline = this.pipeline
    let duplicate = false

    if (completer && completer.pluginId) {
      duplicate = this.plugins.some(function (value) {
        return value.pluginId === completer.pluginId
      })
    }

    if (!duplicate && this.plugins.includes(completer)) {
      duplicate = true
    }

    if (!duplicate) {
      this.plugins.push(completer)
      pipeline.use(completer)
    }

    return this
  }

  /**
   * Add a file.
   *
   * The given file is processed like other files with a few differences:
   *
   * *   Ignored when their file path is already added
   * *   Never written to the file system or `streamOut`
   * *   Not included in the  report
   *
   * @param {VFile | string} file
   *   File or file path.
   * @returns
   *   Self.
   */
  add(file) {
    const self = this

    if (typeof file === 'string') {
      file = new VFile({path: file})
    }

    // Prevent files from being added multiple times.
    if (this.origins.includes(file.history[0])) {
      return this
    }

    this.origins.push(file.history[0])

    // Add.
    this.valueOf().push(file)
    this.expected++

    // Force an asynchronous operation.
    // This ensures that files which fall through the file pipeline immediately
    // (such as, when already fatally failed) still queue up correctly.
    setImmediate(function () {
      self.emit('add', file)
    })

    return this
  }
}
