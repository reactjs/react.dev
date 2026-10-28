/**
 * @import {State} from 'mdast-util-to-markdown'
 * @import {Code} from 'mdast'
 */

/**
 * Checks if a code block can be formatted as an indented code block.
 *
 * @param {Code} node
 *   Node to check.
 * @param {State} state
 *   Info passed around.
 * @returns {boolean}
 *   Whether the code can be formatted as an indented code block.
 */
export function formatCodeAsIndented(node, state) {
  return Boolean(
    state.options.fences === false &&
    node.value &&
    // If there’s no info…
    !node.lang &&
    // And there’s a non-whitespace character…
    /[^\n\r ]/.test(node.value) &&
    // And the value doesn’t start or end in a blank…
    !/^[\t ]*(?:[\n\r]|$)|(?:^|[\n\r])[\t ]*$/.test(node.value)
  )
}
