/**
 * @import {Callback} from 'trough'
 * @import {VFile} from 'vfile'
 * @import {Context} from './index.js'
 */

import assert from 'node:assert/strict'
import createDebug from 'debug'
import {statistics} from 'vfile-statistics'

const debug = createDebug('unified-engine:file-pipeline:transform')

/**
 * Transform the tree associated with a file with configured plugins.
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
export function transform(context, file, next) {
  if (statistics(file).fatal || file.data.unifiedEngineIgnored) {
    next()
  } else {
    assert(context.tree, '`tree` is defined at this point')
    debug('Transforming document `%s`', file.path)
    context.processor.run(context.tree, file, function (error, node) {
      debug('Transformed document (error: %s)', error)
      context.tree = node
      next(error)
    })
  }
}
