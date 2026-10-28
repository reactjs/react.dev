/**
 * @import {Callback} from 'trough'
 * @import {VFile} from 'vfile'
 * @import {Context} from './index.js'
 */

import createDebug from 'debug'
import {statistics} from 'vfile-statistics'

const debug = createDebug('unified-engine:file-pipeline:stdout')

/**
 * Write a virtual file to `streamOut`.
 * Ignored when `output` is given, more than one file was processed, or `out`
 * is false.
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
export function stdout(context, file, next) {
  if (!file.data.unifiedEngineGiven) {
    debug('Ignoring programmatically added file')
    next()
  } else if (
    statistics(file).fatal ||
    file.data.unifiedEngineIgnored ||
    context.settings.output ||
    !context.settings.out
  ) {
    debug('Ignoring writing to `streamOut`')
    next()
  } else {
    debug('Writing document to `streamOut`')
    context.settings.streamOut.write(file.toString(), next)
  }
}
