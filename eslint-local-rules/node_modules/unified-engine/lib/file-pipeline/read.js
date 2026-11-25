/**
 * @import {Callback} from 'trough'
 * @import {VFile} from 'vfile'
 * @import {Context} from './index.js'
 */

import fs from 'node:fs'
import path from 'node:path'
import createDebug from 'debug'
import {statistics} from 'vfile-statistics'

const debug = createDebug('unified-engine:file-pipeline:read')

/**
 * Fill a file with its value when not already filled.
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
export function read(context, file, next) {
  let filePath = file.path

  if (
    (file.value !== null && file.value !== undefined) ||
    file.data.unifiedEngineStreamIn
  ) {
    debug('Not reading file `%s` with `value`', filePath)
    next()
  } else if (statistics(file).fatal || file.data.unifiedEngineIgnored) {
    debug('Not reading failed or ignored file `%s`', filePath)
    next()
  } else {
    filePath = path.resolve(context.settings.cwd, filePath)

    debug('Reading `%s` in `%s`', filePath, 'utf8')
    fs.readFile(filePath, 'utf8', function (error, value) {
      debug('Read `%s` (error: %s)', filePath, error)

      file.value = value || ''

      next(error)
    })
  }
}
