/**
 * @import {Callback} from 'trough'
 * @import {VFile} from 'vfile'
 * @import {Context} from './index.js'
 */

import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import createDebug from 'debug'

const debug = createDebug('unified-engine:file-pipeline:copy')

/**
 * Move a file.
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
export function copy(context, file, next) {
  const output = context.settings.output
  const currentPath = file.path

  if (
    output === undefined ||
    typeof output === 'boolean' ||
    file.data.unifiedEngineIgnored
  ) {
    debug('Not copying')
    next()
    return
  }

  const outputPath = typeof output === 'object' ? fileURLToPath(output) : output

  const outpath = path.resolve(context.settings.cwd, outputPath)

  debug('Copying `%s`', currentPath)

  fs.stat(outpath, function (error, stats) {
    if (error) {
      if (
        error.code !== 'ENOENT' ||
        outputPath.charAt(outputPath.length - 1) === path.sep
      ) {
        return next(new Error('Cannot read output folder', {cause: error}))
      }

      // This is either given an error, or the parent exists which is a folder,
      // but we should keep the basename of the given file.
      fs.stat(path.dirname(outpath), function (error) {
        if (error) {
          next(new Error('Cannot access parent folder', {cause: error}))
        } else {
          done(false)
        }
      })
    } else {
      done(stats.isDirectory())
    }
  })

  /**
   * @param {boolean} folder
   *   Whether the output is a folder.
   * @returns {undefined}
   *   Nothing.
   */
  function done(folder) {
    if (!folder && context.fileSet.expected > 1) {
      next(
        new Error(
          'Cannot write multiple files to single output `' + outpath + '`'
        )
      )
      return
    }

    file[folder ? 'dirname' : 'path'] = path.relative(file.cwd, outpath)

    debug('Copying document from %s to %s', currentPath, file.path)

    next()
  }
}
