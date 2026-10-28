/**
 * @import {State} from 'mdast-util-to-markdown'
 * @import {Heading} from 'mdast'
 */

import {EXIT, visit} from 'unist-util-visit'
import {toString} from 'mdast-util-to-string'

/**
 * Checks if a heading can be formatted as a setext heading.
 *
 * @param {Heading} node
 *   Node to check.
 * @param {State} state
 *   Info passed around.
 * @returns {boolean}
 *   Whether the heading can be formatted as a setext heading.
 */
export function formatHeadingAsSetext(node, state) {
  let literalWithBreak = false

  // Look for literals with a line break.
  // Note that this also
  visit(node, function (node) {
    if (
      ('value' in node && /\r?\n|\r/.test(node.value)) ||
      node.type === 'break'
    ) {
      literalWithBreak = true
      return EXIT
    }
  })

  return Boolean(
    (!node.depth || node.depth < 3) &&
    toString(node) &&
    (state.options.setext || literalWithBreak)
  )
}
