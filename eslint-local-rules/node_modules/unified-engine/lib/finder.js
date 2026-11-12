/**
 * @import {Stats} from 'node:fs'
 * @import {Ignore as IgnorePackageClass} from 'ignore'
 * @import {Ignore} from './ignore.js'
 */

/**
 * @callback CheckCallback
 *   Callback called when a file is checked.
 * @param {NodeJS.ErrnoException | undefined} error
 *   Error.
 * @param {CheckResult | undefined} [result]
 *   Result.
 * @returns {undefined}
 *   Nothing.
 *
 * @typedef {CheckOptionsFields & Options} CheckOptions
 *   Check options.
 *
 * @typedef CheckOptionsFields
 *   Extra options for `check`.
 * @property {IgnorePackageClass} extraIgnore
 *   Extra ignore.
 *
 * @typedef CheckResult
 *   Result.
 * @property {Stats | undefined} stats
 *   Stats.
 * @property {boolean | undefined} ignored
 *   Whether the file is ignored.
 *
 * @callback ExpandCallback
 *   Callback called when files are expanded.
 * @param {Error | undefined} error
 *   Error.
 * @param {ExpandResult | undefined} [result]
 *   Result.
 * @returns {undefined}
 *   Nothing.
 *
 * @typedef ExpandResult
 *   Results.
 * @property {Array<VFile | string>} input
 *   Input.
 * @property {Array<VFile>} output
 *   Output.
 *
 * @callback FindCallback
 *   Callback called when files are found.
 * @param {Error | undefined} error
 *   Error.
 * @param {FindResult | undefined} [result]
 *   Result.
 * @returns {undefined}
 *   Nothing.
 *
 * @typedef FindResult
 *   Results.
 * @property {boolean} oneFileMode
 *   Whether we looked for an explicit single file only.
 * @property {Array<VFile>} files
 *   Results.
 *
 * @typedef Options
 *   Configuration.
 * @property {string} cwd
 *   Base.
 * @property {Array<string>} extensions
 *   Extnames.
 * @property {boolean | undefined} silentlyIgnore
 *   Whether to silently ignore errors.
 *
 *   The default is to throw if an explicitly given file is explicitly ignored.
 * @property {Array<string>} ignorePatterns
 *   Extra ignore patterns.
 * @property {Ignore} ignore
 *   Ignore.
 *
 * @callback SearchCallback
 *   Callback called after searching.
 * @param {Error | undefined} error
 *   Error.
 * @param {Array<VFile> | undefined} [result]
 *   Result.
 * @returns {undefined}
 *   Nothing.
 *
 * @typedef {Options & SearchOptionsFields} SearchOptions
 *   Search options.
 *
 * @typedef SearchOptionsFields
 *   Extra search fields.
 * @property {boolean | undefined} [nested]
 *   Whether this is a nested search.
 */

import path from 'node:path'
import fs from 'node:fs'
import {glob, hasMagic} from 'glob'
import ignore_ from 'ignore'
import {VFile} from 'vfile'

// @ts-expect-error: types of `ignore` are wrong.
const ignore = /** @type {import('ignore')['default']} */ (ignore_)

/**
 * Search `input`, a mix of globs, paths, and files.
 *
 * @param {Array<VFile | string>} input
 *   Files, file paths, and globs.
 * @param {Options} options
 *   Configuration (required).
 * @param {FindCallback} callback
 *   Callback.
 * @returns {undefined}
 *   Nothing.
 */
export function finder(input, options, callback) {
  expand(input, options, function (error, result) {
    /* c8 ignore next 2 -- glob errors are unusual. */
    if (error || !result) {
      callback(error)
    } else {
      callback(undefined, {
        files: result.output,
        oneFileMode: oneFileMode(result)
      })
    }
  })
}

/**
 * Expand the given glob patterns, search given and found folders, and map
 * to vfiles.
 *
 * @param {Array<VFile | string>} input
 *   List of files, file paths, and globs.
 * @param {Options} options
 *   Configuration (required).
 * @param {ExpandCallback} next
 *   Callback.
 * @returns {undefined}
 *   Nothing.
 */
function expand(input, options, next) {
  /** @type {Array<VFile | string>} */
  const paths = []
  let actual = 0
  let expected = 0
  let index = -1
  /** @type {boolean | undefined} */
  let failed

  while (++index < input.length) {
    let file = input[index]
    if (typeof file === 'string') {
      if (hasMagic(file)) {
        expected++
        glob(file, {cwd: options.cwd}).then(
          function (files) {
            /* c8 ignore next 3 -- glob errors are unusual. */
            if (failed) {
              return
            }

            actual++
            paths.push(...files)

            if (actual === expected) {
              search(paths, options, done1)
            }
          },
          /**
           * @param {Error} error
           *   Error.
           * @returns {undefined}
           *   Nothing.
           */
          /* c8 ignore next 8 -- glob errors are unusual. */
          function (error) {
            if (failed) {
              return
            }

            failed = true
            done1(error)
          }
        )
      } else {
        // `relative` to make the paths canonical.
        file =
          path.relative(options.cwd, path.resolve(options.cwd, file)) || '.'
        paths.push(file)
      }
    } else {
      const fp = file.path ? path.relative(options.cwd, file.path) : options.cwd
      file.cwd = options.cwd
      file.path = fp
      file.history = [fp]
      paths.push(file)
    }
  }

  if (!expected) {
    search(paths, options, done1)
  }

  /**
   * @param {Error | undefined} error
   *   Error.
   * @param {Array<VFile> | undefined} [files]
   *   List of files.
   * @returns {undefined}
   *   Nothing.
   */
  function done1(error, files) {
    /* c8 ignore next 2 -- `search` currently does not give errors. */
    if (error || !files) {
      next(error)
    } else {
      next(undefined, {input: paths, output: files})
    }
  }
}

/**
 * Search `paths`.
 *
 * @param {Array<VFile | string>} input
 *   List of files, file paths, and globs.
 * @param {SearchOptions} options
 *   Configuration (required).
 * @param {SearchCallback} next
 *   Callback.
 * @returns {undefined}
 *   Nothing.
 */
function search(input, options, next) {
  const extraIgnore = ignore().add(options.ignorePatterns)
  let expected = 0
  let actual = 0
  let index = -1
  /** @type {Array<VFile>} */
  const files = []

  while (++index < input.length) {
    each(input[index])
  }

  if (!expected) {
    next(undefined, files)
  }

  /**
   * @param {VFile | string} file
   *   File or file path.
   * @returns {undefined}
   *   Nothing.
   */
  function each(file) {
    const extname = typeof file === 'string' ? path.extname(file) : file.extname

    // Normalise globs.
    if (typeof file === 'string') {
      file = file.split('/').join(path.sep)
    }

    const part = base(file)

    if (options.nested && part && part === 'node_modules') {
      return
    }

    expected++

    check(
      file,
      {...options, extraIgnore},
      /**
       * @returns {undefined}
       *   Nothing.
       */
      function (error, result) {
        const ignored = result && result.ignored
        const folder = result && result.stats && result.stats.isDirectory()

        if (ignored && (options.nested || options.silentlyIgnore)) {
          return one(undefined, [])
        }

        if (!ignored && folder) {
          fs.readdir(
            path.resolve(options.cwd, filePath(file)),
            function (error, basenames) {
              /* c8 ignore next 11 -- should not happen: the folder is `stat`ed ok, but reading it is not. */
              if (error) {
                const otherFile = new VFile({path: filePath(file)})
                otherFile.cwd = options.cwd

                try {
                  otherFile.fail('Cannot read folder')
                } catch {
                  // Empty.
                }

                one(undefined, [otherFile])
              } else {
                search(
                  basenames.map(function (name) {
                    return path.join(filePath(file), name)
                  }),
                  {...options, nested: true},
                  one
                )
              }
            }
          )
          return
        }

        if (
          !folder &&
          options.nested &&
          options.extensions.length > 0 &&
          (!extname || !options.extensions.includes(extname))
        ) {
          return one(undefined, [])
        }

        file = typeof file === 'string' ? new VFile({path: file}) : file
        file.cwd = options.cwd

        if (ignored) {
          const message = file.message(
            'Cannot process specified file: it’s ignored'
          )
          message.fatal = true
        }

        if (error && error.code === 'ENOENT') {
          if (error.syscall === 'stat') {
            const message = file.message('No such file or folder', {
              cause: error
            })
            message.fatal = true
          } else {
            const message = file.message('Cannot find file', {cause: error})
            message.fatal = true
          }
        }

        one(undefined, [file])
      }
    )

    /**
     * Error is never given. Always given `results`.
     *
     * @param {Error | undefined} _
     *   Error.
     * @param {Array<VFile> | undefined} [results]
     *   Results.
     * @returns {undefined}
     *   Nothing.
     */
    function one(_, results) {
      /* istanbul ignore else - Always given. */
      if (results) {
        files.push(...results)
      }

      actual++

      if (actual === expected) {
        next(undefined, files)
      }
    }
  }
}

/**
 * @param {VFile | string} file
 *   File.
 * @param {CheckOptions} options
 *   Configuration.
 * @param {CheckCallback} callback
 *   Callback.
 * @returns {undefined}
 *   Nothing.
 */
function check(file, options, callback) {
  const fp = path.resolve(options.cwd, filePath(file))
  const normal = path.relative(options.cwd, fp)
  let expected = 1
  let actual = 0
  /** @type {Stats | undefined} */
  let stats
  /** @type {boolean | undefined} */
  let ignored

  if (
    typeof file === 'string' ||
    file.value === null ||
    file.value === undefined
  ) {
    expected++
    fs.stat(fp, function (error, value) {
      stats = value
      onStatOrCheck(error || undefined)
    })
  }

  options.ignore.check(fp, function (error, value) {
    ignored = value

    // `ignore.check` is sometimes sync, we need to force async behavior.
    setImmediate(onStatOrCheck, error || undefined)
  })

  /**
   * @param {Error | undefined} error
   *   Error.
   * @returns {undefined}
   *   Nothing.
   */
  function onStatOrCheck(error) {
    actual++

    if (error) {
      callback(error)
      actual = -1
    } else if (actual === expected) {
      callback(undefined, {
        ignored:
          ignored ||
          (normal === '' ||
          normal === '..' ||
          normal.charAt(0) === path.sep ||
          normal.slice(0, 3) === '..' + path.sep
            ? false
            : options.extraIgnore.ignores(normal)),
        stats
      })
    }
  }
}

/**
 * @param {VFile | string} file
 *   File.
 * @returns {string | undefined}
 *   Basename.
 */
function base(file) {
  return typeof file === 'string' ? path.basename(file) : file.basename
}

/**
 * @param {VFile | string} file
 *   File.
 * @returns {string}
 *   File path.
 */
function filePath(file) {
  return typeof file === 'string' ? file : file.path
}

/**
 * @param {ExpandResult} result
 *   Result.
 * @returns {boolean}
 *   Whether we looked for an explicit single file only.
 */
function oneFileMode(result) {
  return (
    result.output.length === 1 &&
    result.input.length === 1 &&
    result.output[0].path === result.input[0]
  )
}
