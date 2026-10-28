/**
 * @import {VFile} from 'vfile'
 * @import {Context} from './index.js'
 */

import assert from 'node:assert/strict'
import createDebug from 'debug'
import {inspectColor, inspectNoColor} from 'unist-util-inspect'
import {statistics} from 'vfile-statistics'

// To do: next major: do not use `inspectColor`, `inspectNoColor`, directly.

const debug = createDebug('unified-engine:file-pipeline:stringify')

/**
 * Stringify a tree.
 *
 * @param {Context} context
 *   Context.
 * @param {VFile} file
 *   File.
 * @returns {undefined}
 *   Nothing.
 */
export function stringify(context, file) {
  /** @type {unknown} */
  let value

  if (statistics(file).fatal || file.data.unifiedEngineIgnored) {
    debug('Not compiling failed or ignored document')
    return
  }

  if (
    !context.settings.output &&
    !context.settings.out &&
    !context.settings.alwaysStringify
  ) {
    debug('Not compiling document without output settings')
    return
  }

  debug('Compiling `%s`', file.path)

  if (context.settings.inspect) {
    // Add a `txt` extension if there is a path.
    if (file.path) {
      file.extname = '.txt'
    }

    value =
      (context.settings.color ? inspectColor : inspectNoColor)(context.tree) +
      '\n'
  } else if (context.settings.treeOut) {
    // Add a `json` extension to ensure the file is correctly seen as JSON.
    // Only add it if there is a path — not if the file is for example stdin.
    if (file.path) {
      file.extname = '.json'
    }

    // Add the line feed to create a valid UNIX file.
    value = JSON.stringify(context.tree, undefined, 2) + '\n'
  } else {
    assert(context.tree, '`tree` is defined if we came this far')
    value = context.processor.stringify(context.tree, file)
  }

  if (value === null || value === undefined) {
    // Empty.
  } else if (typeof value === 'string' || isUint8Array(value)) {
    file.value = value
  } else {
    file.result = value
  }

  debug('Serialized document')
}

/**
 * Assert `value` is an `Uint8Array`.
 *
 * @param {unknown} value
 *   Thing.
 * @returns {value is Uint8Array}
 *   Whether `value` is an `Uint8Array`.
 */
function isUint8Array(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'byteLength' in value &&
      'byteOffset' in value
  )
}
