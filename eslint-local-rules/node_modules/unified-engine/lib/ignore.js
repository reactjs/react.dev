/**
 * @import {Ignore as IgnorePackageClass} from 'ignore'
 */

/**
 * @callback Callback
 *   Callback.
 * @param {Error | undefined} error
 *   Error.
 * @param {boolean | undefined} [result]
 *   Whether to ignore.
 * @returns {undefined}
 *   Nothing.
 *
 * @typedef Options
 *   Configuration.
 * @property {string} cwd
 *   Base.
 * @property {boolean | undefined} detectIgnore
 *   Whether to detect ignore files.
 * @property {string | undefined} ignoreName
 *   Basename of ignore files.
 * @property {URL | string | undefined} ignorePath
 *   Explicit path to an ignore file.
 * @property {ResolveFrom | undefined} ignorePathResolveFrom
 *   How to resolve.
 *
 * @typedef {'cwd' | 'dir'} ResolveFrom
 *   How to resolve.
 *
 * @typedef {IgnorePackageClass & ResultFields} Result
 *   Result.
 *
 * @typedef ResultFields
 *   Extra fields.
 * @property {string} filePath
 *   File path.
 *
 */

import path from 'node:path'
import ignore_ from 'ignore'
import {FindUp} from './find-up.js'

// @ts-expect-error: types of `ignore` are wrong.
const ignore = /** @type {import('ignore')['default']} */ (ignore_)

export class Ignore {
  /**
   * @param {Options} options
   *   Configuration.
   * @returns
   *   Self.
   */
  constructor(options) {
    /** @type {string} */
    this.cwd = options.cwd
    /** @type {ResolveFrom | undefined} */
    this.ignorePathResolveFrom = options.ignorePathResolveFrom

    /** @type {FindUp<Result>} */
    this.findUp = new FindUp({
      create,
      cwd: options.cwd,
      detect: options.detectIgnore,
      filePath: options.ignorePath,
      names: options.ignoreName ? [options.ignoreName] : []
    })
  }

  /**
   * @param {string} filePath
   *   File path.
   * @param {Callback} callback
   *   Callback
   * @returns {undefined}
   *   Nothing.
   */
  check(filePath, callback) {
    const self = this

    this.findUp.load(filePath, function (error, ignoreSet) {
      if (error) {
        callback(error)
      } else if (ignoreSet) {
        const normal = path.relative(
          path.resolve(
            self.cwd,
            self.ignorePathResolveFrom === 'cwd' ? '.' : ignoreSet.filePath
          ),
          path.resolve(self.cwd, filePath)
        )

        if (
          normal === '' ||
          normal === '..' ||
          normal.charAt(0) === path.sep ||
          normal.slice(0, 3) === '..' + path.sep
        ) {
          callback(undefined, false)
        } else {
          callback(undefined, ignoreSet.ignores(normal))
        }
      } else {
        callback(undefined, false)
      }
    })
  }
}

/**
 * @param {Buffer} buf
 *   File value.
 * @param {string} filePath
 *   File path.
 * @returns {Result}
 *   Result.
 */
function create(buf, filePath) {
  // Cast so we can patch `filePath`.
  const result = /** @type {Result} */ (ignore().add(String(buf)))
  result.filePath = path.dirname(filePath)
  return result
}
