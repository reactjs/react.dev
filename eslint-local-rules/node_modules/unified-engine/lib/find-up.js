/**
 * @template Value
 *   Value type.
 * @callback Callback
 *   Callback called when something is found.
 * @param {Error | undefined} error
 *   Error.
 * @param {Value | undefined} [result]
 *   Value.
 * @returns {undefined}
 *   Nothing.
 */

/**
 * @template Value
 *   Value type.
 * @callback Create
 *   Transform a file to a certain value.
 * @param {Buffer} value
 *   File contents.
 * @param {string} filePath
 *   File path.
 * @returns {Promise<Value | undefined> | Value | undefined}
 *   Value.
 */

/**
 * @typedef FindValue
 *   Bare interface of value.
 * @property {string | undefined} filePath
 *   File path.
 */

/**
 * @template Value
 *   Value type.
 * @typedef Options
 *   Configuration.
 * @property {string} cwd
 *   Base.
 * @property {URL | string | undefined} filePath
 *   File path of a given file.
 * @property {boolean | undefined} [detect=false]
 *   Whether to detect files (default: `false`).
 * @property {Array<string>} names
 *   Basenames of files to look for.
 * @property {Create<Value>} create
 *   Turn a found file into a value.
 */

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import createDebug from 'debug'
import {wrap} from 'trough'

const debug = createDebug('unified-engine:find-up')

/**
 * @template {FindValue} Value
 *   Value to find.
 */
export class FindUp {
  /**
   * @param {Options<Value>} options
   *   Configuration.
   * @returns
   *   Self.
   */
  constructor(options) {
    /** @type {Record<string, Array<Callback<Value>> | Value | Error | undefined>} */
    this.cache = {}
    /** @type {string} */
    this.cwd = options.cwd
    /** @type {boolean | undefined} */
    this.detect = options.detect
    /** @type {Array<string>} */
    this.names = options.names
    /** @type {Create<Value>} */
    this.create = options.create

    /** @type {string | undefined} */
    this.givenFilePath = options.filePath
      ? path.resolve(
          options.cwd,
          typeof options.filePath === 'object'
            ? fileURLToPath(options.filePath)
            : options.filePath
        )
      : undefined

    /** @type {Array<Callback<Value>> | Error | Value | undefined} */
    this.givenFile
  }

  /**
   * @param {string} filePath
   *   File path to look from.
   * @param {Callback<Value>} callback
   *   Callback called when done.
   * @returns {undefined}
   *   Nothing.
   */
  load(filePath, callback) {
    const self = this
    const givenFile = this.givenFile
    const {givenFilePath} = this

    if (givenFilePath) {
      if (givenFile) {
        apply(callback, givenFile)
      } else {
        const self = this
        const cbs = [callback]
        this.givenFile = cbs
        debug('Checking given file `%s`', givenFilePath)
        fs.readFile(givenFilePath, function (cause, buf) {
          if (cause) {
            /** @type {NodeJS.ErrnoException} */
            const result = new Error(
              'Cannot read given file `' +
                path.relative(self.cwd, givenFilePath) +
                '`',
              {cause}
            )
            // In `finder.js`, we check for `syscall`, to improve the error.
            result.code = 'ENOENT'
            result.path = cause.path
            result.syscall = cause.syscall
            loaded(result)
          } else {
            wrap(self.create, function (cause, /** @type {Value} */ result) {
              if (cause) {
                debug(cause.message)
                loaded(
                  new Error(
                    'Cannot parse given file `' +
                      path.relative(self.cwd, givenFilePath) +
                      '`',
                    {cause}
                  )
                )
              } else {
                debug('Read given file `%s`', givenFilePath)
                loaded(result)
              }
            })(buf, givenFilePath)
          }

          /**
           * @param {Error | Value} result
           *   Result.
           * @returns {undefined}
           *   Nothing.
           */
          function loaded(result) {
            self.givenFile = result
            applyAll(cbs, result)
          }
        })
      }

      return
    }

    if (!this.detect) {
      return callback(undefined)
    }

    filePath = path.resolve(this.cwd, filePath)
    const parent = path.dirname(filePath)

    if (parent in this.cache) {
      apply(callback, this.cache[parent])
    } else {
      this.cache[parent] = [callback]
      find(parent)
    }

    /**
     * @param {string} folder
     *   Folder.
     * @returns {undefined}
     *   Nothing.
     */
    function find(folder) {
      let index = -1

      next()

      /**
       * @returns {undefined}
       *   Nothing.
       */
      function next() {
        // Try to read the next file.
        // We do not use `readdir` because on huge folders, that could be
        // *very* slow.
        if (++index < self.names.length) {
          fs.readFile(path.join(folder, self.names[index]), done)
        } else {
          const parent = path.dirname(folder)

          if (folder === parent) {
            debug('No files found for `%s`', filePath)
            found(undefined)
          } else if (parent in self.cache) {
            apply(found, self.cache[parent])
          } else {
            self.cache[parent] = [found]
            find(parent)
          }
        }
      }

      /**
       * @param {NodeJS.ErrnoException | null} error
       *   Error.
       * @param {Buffer | undefined} [buf]
       *   File value.
       * @returns {undefined}
       *   Nothing.
       */
      function done(error, buf) {
        const fp = path.join(folder, self.names[index])

        if (error) {
          if (error.code === 'ENOENT') {
            return next()
            /* c8 ignore next 11 -- hard to test other errors. */
          }

          debug(error.message)
          return found(
            new Error(
              'Cannot read file `' + path.relative(self.cwd, fp) + '`',
              {cause: error}
            )
          )
        }

        wrap(self.create, function (cause, /** @type {Value} */ result) {
          if (cause) {
            found(
              new Error(
                'Cannot parse file `' + path.relative(self.cwd, fp) + '`',
                {cause}
              )
            )
          } else if (result && result.filePath) {
            debug('Read file `%s`', fp)
            found(undefined, result)
          } else {
            next()
          }
        })(buf, fp)
      }

      /**
       * @type {Callback<Value>}
       *   Callback called when done.
       */
      function found(error, result) {
        const cbs = self.cache[folder]
        assert(Array.isArray(cbs), 'always a list if found')
        self.cache[folder] = error || result
        applyAll(cbs, error || result)
        return undefined
      }
    }

    /**
     * @param {Array<Callback<Value>>} cbs
     *   Callbacks.
     * @param {Error | Value | undefined} result
     *   Result.
     * @returns {undefined}
     *   Nothing.
     */
    function applyAll(cbs, result) {
      let index = cbs.length

      while (index--) {
        apply(cbs[index], result)
      }
    }

    /**
     * @param {Callback<Value>} value
     *   Callback.
     * @param {Array<Callback<Value>> | Error | Value | undefined} result
     *   Result.
     * @returns {undefined}
     *   Nothing.
     */
    function apply(value, result) {
      if (Array.isArray(result)) {
        result.push(value)
      } else if (result instanceof Error) {
        value(result)
      } else {
        value(undefined, result)
      }
    }
  }
}
