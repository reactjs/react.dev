/**
 * @import {Pipeline} from 'trough'
 * @import {Processor} from 'unified'
 * @import {Node} from 'unist'
 * @import {VFileMessage} from 'vfile-message'
 * @import {VFile} from 'vfile'
 * @import {Configuration} from '../configuration.js'
 * @import {Settings} from '../index.js'
 * @import {FileSet} from '../file-set.js'
 */

/**
 * @typedef Context
 *   Context.
 * @property {Configuration} configuration
 *   Configuration.
 * @property {FileSet} fileSet
 *   File set.
 * @property {Processor} processor
 *   Processor.
 * @property {Settings} settings
 *   Settings.
 * @property {Node | undefined} [tree]
 *   Tree.
 *
 * @callback Next
 *   Callback.
 * @returns {undefined}
 *   Nothing.
 */

import {trough} from 'trough'
import {configure} from './configure.js'
import {copy} from './copy.js'
import {fileSystem} from './file-system.js'
import {parse} from './parse.js'
import {queue} from './queue.js'
import {read} from './read.js'
import {stdout} from './stdout.js'
import {stringify} from './stringify.js'
import {transform} from './transform.js'

// This pipeline ensures each of the pipes always runs: even if the read pipe
// fails, queue and write run.
export const filePipeline = trough()
  .use(chunk(trough().use(configure).use(read).use(parse).use(transform)))
  .use(chunk(trough().use(queue)))
  .use(chunk(trough().use(stringify).use(copy).use(stdout).use(fileSystem)))

/**
 * Factory to run a pipe.
 * Wraps a pipe to trigger an error on the `file` in `context`, but still call
 * `next`.
 *
 * @param {Pipeline} pipe
 *   Pipe.
 * @returns
 *   Run function.
 */
function chunk(pipe) {
  return run

  /**
   * Run the bound pipe and handle any errors.
   *
   * @param {Context} context
   *   Context.
   * @param {VFile} file
   *   File.
   * @param {Next} next
   *   Callback.
   * @returns {undefined}
   *   Nothing.
   */
  function run(context, file, next) {
    pipe.run(
      context,
      file,
      /**
       * @param {VFileMessage | undefined} error
       *   Error.
       * @returns {undefined}
       *   Nothing.
       */
      function (error) {
        const messages = file.messages

        if (error) {
          const index = messages.indexOf(error)

          if (index === -1) {
            const message = file.message('Cannot process file', {
              cause: error
            })
            message.fatal = true
          } else {
            messages[index].fatal = true
          }
        }

        next()
      }
    )
  }
}
