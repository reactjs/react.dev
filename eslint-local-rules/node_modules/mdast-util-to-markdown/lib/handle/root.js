/**
 * @import {Info, State} from 'mdast-util-to-markdown'
 * @import {Parents, Root} from 'mdast'
 */

import {phrasing} from 'mdast-util-phrasing'

/**
 * Serialize a root node.
 *
 * @param {Root} node
 *   Node to serialize.
 * @param {Parents | undefined} _
 *   Parent node.
 * @param {State} state
 *   Info passed around.
 * @param {Info} info
 *   Info on surrounding context.
 * @returns {string}
 *   Serialized markdown.
 */
export function root(node, _, state, info) {
  // Note: `html` nodes are ambiguous.
  const hasPhrasing = node.children.some(function (d) {
    return phrasing(d)
  })

  if (!hasPhrasing) return state.containerFlow(node, info)

  const exit = state.enter('phrasing')
  const value = state.containerPhrasing(node, info)
  exit()
  return value
}
