/**
 * @import {Node} from 'unist'
 * @import {VFile} from 'vfile'
 * @import {Context} from './index.js'
 */

import createDebug from 'debug'
import parseJson from 'parse-json'
import {statistics} from 'vfile-statistics'

const debug = createDebug('unified-engine:file-pipeline:parse')

/**
 * Fill a file with a tree.
 *
 * @param {Context} context
 *   Context.
 * @param {VFile} file
 *   File.
 * @returns {undefined}
 *   Nothing.
 */
export function parse(context, file) {
  if (statistics(file).fatal || file.data.unifiedEngineIgnored) {
    return
  }

  if (context.settings.treeIn) {
    debug('Not parsing already parsed document')

    try {
      // Assume it’s a valid node.
      const tree = /** @type {Node} */ (
        /** @type {unknown} */ (parseJson(file.toString()))
      )
      context.tree = tree
    } catch (error) {
      const cause = /** @type {Error} */ (error)
      const message = file.message('Cannot read file as JSON', {cause})
      message.fatal = true
    }

    // Add the preferred extension to ensure the file, when serialized, is
    // correctly recognised.
    // Only add it if there is a path — not if the file is for example stdin.
    if (file.path) {
      file.extname = context.settings.extensions[0]
    }

    file.value = ''

    return
  }

  debug('Parsing `%s`', file.path)

  context.tree = context.processor.parse(file)

  debug('Parsed document')
}
