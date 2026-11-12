/**
 * @import {Callback} from 'trough'
 * @import {VFile} from 'vfile'
 * @import {Context} from './index.js'
 */

import createDebug from 'debug'
import {statistics} from 'vfile-statistics'

const debug = createDebug('unified-engine:file-pipeline:queue')

const own = {}.hasOwnProperty

/**
 * Queue all files which came this far.
 * When the last file gets here, run the file-set pipeline and flush the queue.
 *
 * @param {Context} context
 *   Context.
 * @param {VFile} file
 *   File.
 * @param {Callback} next
 *   Callback.
 * @returns {undefined}
 *   Nothing.
 */
export function queue(context, file, next) {
  let origin = file.history[0]
  const map = context.fileSet.complete
  let complete = true

  debug('Queueing `%s`', origin)

  map[origin] = next

  const files = context.fileSet.valueOf()
  let index = -1
  while (++index < files.length) {
    each(files[index])
  }

  if (!complete) {
    debug('Not flushing: some files cannot be flushed')
    return
  }

  context.fileSet.complete = {}
  context.fileSet.pipeline.run(context.fileSet, done)

  /**
   * @param {VFile} file
   *   File.
   * @returns {undefined}
   *   Nothing.
   */
  function each(file) {
    const key = file.history[0]

    if (statistics(file).fatal || file.data.unifiedEngineIgnored) {
      return
    }

    if (typeof map[key] === 'function') {
      debug('`%s` can be flushed', key)
    } else {
      debug('Interupting flush: `%s` is not finished', key)
      complete = false
    }
  }

  /**
   * @param {Error | undefined} error
   *   Error.
   * @returns {undefined}
   *   Nothing.
   */
  function done(error) {
    debug('Flushing: all files can be flushed')

    // Flush.
    for (origin in map) {
      if (own.call(map, origin)) {
        map[origin](error)
      }
    }
  }
}
