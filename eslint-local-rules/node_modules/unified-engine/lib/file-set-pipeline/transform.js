/**
 * @import {Callback} from 'trough'
 * @import {VFile} from 'vfile'
 * @import {Configuration} from '../configuration.js'
 * @import {Settings} from '../index.js'
 */

/**
 * @typedef Context
 *   Context.
 * @property {Array<VFile>} files
 *   Files.
 * @property {Configuration} configuration
 *   Configuration.
 * @property {FileSet} fileSet
 *   File set.
 */

import {filePipeline} from '../file-pipeline/index.js'
import {FileSet} from '../file-set.js'

/**
 * Transform all files.
 *
 * @param {Context} context
 *   Context.
 * @param {Settings} settings
 *   Settings.
 * @param {Callback} next
 *   Callback.
 * @returns {undefined}
 *   Nothing.
 */
export function transform(context, settings, next) {
  const fileSet = new FileSet()

  context.fileSet = fileSet

  fileSet.on('add', function (/** @type {VFile} */ file) {
    filePipeline.run(
      {
        configuration: context.configuration,
        fileSet,
        // Needed `any`s
        // type-coverage:ignore-next-line
        processor: settings.processor(),
        settings
      },
      file,
      /**
       * @param {Error | undefined} error
       *   Error.
       * @returns {undefined}
       *   Nothing.
       */
      function (error) {
        // Does not occur, all failures in `filePipeLine` are failed on each
        // file.
        /* c8 ignore next 4 -- extra handling that currently isn’t used. */
        if (error) {
          const message = file.message('Cannot transform file', {cause: error})
          message.fatal = true
        }

        fileSet.emit('one', file)
      }
    )
  })

  fileSet.on('done', next)

  if (context.files.length === 0) {
    next()
  } else {
    let index = -1
    while (++index < context.files.length) {
      fileSet.add(context.files[index])
    }
  }
}
