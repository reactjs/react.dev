/**
 * @import {Info, State} from 'mdast-util-to-markdown'
 * @import {Parents, Text} from 'mdast'
 */

/**
 * Serialize a text node.
 *
 * @param {Text} node
 *   Node to serialize.
 * @param {Parents | undefined} parent
 *   Parent node.
 * @param {State} state
 *   Info passed around.
 * @param {Info} info
 *   Info on surrounding context.
 * @returns {string}
 *   Serialized markdown.
 */
export function text(node, parent, state, info) {
  /* c8 ignore next -- parent always passed */
  const siblings = parent ? parent.children : []
  const index = state.indexStack[state.indexStack.length - 1]

  return state.safe(node.value, {
    ...info,
    afterNode: siblings[index + 1],
    beforeNode: siblings[index - 1]
  })
}
