/**
 * @import {Callback} from 'trough'
 * @import {VFile} from 'vfile'
 * @import {Configuration} from '../configuration.js'
 * @import {Settings} from '../index.js'
 */

/**
 * @typedef Context
 *   Context.
 * @property {Array<VFile | string>} files
 *   Files.
 * @property {Configuration | undefined} [configuration]
 *   Configuration.
 */

import {finder} from '../finder.js'
import {Ignore} from '../ignore.js'

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
export function fileSystem(context, settings, next) {
  if (context.files.length === 0) {
    next()
  } else {
    finder(
      context.files,
      {
        cwd: settings.cwd,
        extensions: settings.extensions,
        ignore: new Ignore({
          cwd: settings.cwd,
          detectIgnore: settings.detectIgnore,
          ignoreName: settings.ignoreName,
          ignorePath: settings.ignorePath,
          ignorePathResolveFrom: settings.ignorePathResolveFrom
        }),
        ignorePatterns: settings.ignorePatterns,
        silentlyIgnore: settings.silentlyIgnore
      },
      /**
       * @returns {undefined}
       */
      function (error, result) {
        /* c8 ignore next 4 -- glob errors are unusual. */
        if (!result) {
          next(error)
          return
        }

        const output = result.files

        // Sort alphabetically.
        // Everything is unique so we do not care about cases where left and right
        // are equal.
        output.sort(sortAlphabetically)

        // Mark as given.
        // This allows outputting files, which can be pretty dangerous, so it’s
        // “hidden”.
        let index = -1
        while (++index < output.length) {
          output[index].data.unifiedEngineGiven = true
        }

        context.files = output

        // If `out` was not set, detect it based on whether one file was given.
        if (settings.out === undefined) {
          settings.out = result.oneFileMode
        }

        next(error)
      }
    )
  }

  /**
   * @param {VFile} left
   *   File.
   * @param {VFile} right
   *   Other file.
   * @returns {number}
   *   Order.
   */
  function sortAlphabetically(left, right) {
    return left.path < right.path ? -1 : 1
  }
}
