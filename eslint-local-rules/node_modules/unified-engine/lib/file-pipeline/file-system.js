/**
 * @import {Callback} from 'trough'
 * @import {VFile} from 'vfile'
 * @import {Context} from './index.js'
 */

import fs from 'node:fs'
import path from 'node:path'
import createDebug from 'debug'
import {statistics} from 'vfile-statistics'

const debug = createDebug('unified-engine:file-pipeline:file-system')

/**
 * Write a virtual file to the file-system.
 * Ignored when `output` is not given.
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
export function fileSystem(context, file, next) {
  if (!context.settings.output) {
    debug('Ignoring writing to file-system')
    next()
    return
  }

  if (!file.data.unifiedEngineGiven || file.data.unifiedEngineIgnored) {
    debug('Ignoring programmatically added or ignored file')
    next()
    return
  }

  let destinationPath = file.path

  if (!destinationPath) {
    debug('Cannot write file without a `destinationPath`')
    next(new Error('Cannot write file without an output path'))
    return
  }

  if (statistics(file).fatal) {
    debug('Cannot write file with a fatal error')
    next()
    return
  }

  destinationPath = path.resolve(context.settings.cwd, destinationPath)
  debug('Writing document to `%s`', destinationPath)

  file.stored = true
  fs.writeFile(destinationPath, file.toString(), next)
}
