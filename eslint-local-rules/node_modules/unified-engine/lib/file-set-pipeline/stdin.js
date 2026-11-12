/**
 * @import {Callback} from 'trough'
 * @import {Settings} from '../index.js'
 */

/**
 * @typedef Context
 *   Context.
 * @property {Array<VFile | string>} files
 *   Files.
 */

import concatStream from 'concat-stream'
import createDebug from 'debug'
import {VFile} from 'vfile'

const debug = createDebug('unified-engine:file-set-pipeline:stdin')

/**
 * @param {Context} context
 *   Context.
 * @param {Settings} settings
 *   Settings.
 * @param {Callback} next
 *   Callback.
 * @returns {undefined}
 *   Nothing.
 */
export function stdin(context, settings, next) {
  if (settings.files && settings.files.length > 0) {
    debug('Ignoring `streamIn`')

    /** @type {Error | undefined} */
    let error

    if (settings.filePath) {
      error = new Error(
        'Do not pass both `filePath` and real files.\nDid you mean to pass stdin instead of files?'
      )
    }

    next(error)

    return
  }

  if ('isTTY' in settings.streamIn && settings.streamIn.isTTY) {
    debug('Cannot read from `tty` stream')
    next(new Error('No input'))

    return
  }

  debug('Reading from `streamIn`')

  settings.streamIn.pipe(
    concatStream({encoding: 'string'}, function (value) {
      const file = new VFile({path: settings.filePath})

      debug('Read from `streamIn`')

      file.cwd = settings.cwd
      file.value = value
      file.data.unifiedEngineGiven = true
      file.data.unifiedEngineStreamIn = true

      context.files = [file]

      // If `out` was not set, set `out`.
      settings.out = settings.out === undefined ? true : settings.out

      next()
    })
  )
}
