/**
 * @import {AttentionInfo, Info, State} from 'mdast-util-to-markdown'
 * @import {Emphasis, Parents} from 'mdast'
 */

import {checkEmphasis} from '../util/check-emphasis.js'
import {attentionItem, serialize} from '../util/container-phrasing.js'

emphasis.attention = attention
emphasis.peek = peek

/**
 * Serialize an emphasis node.
 *
 * Attention is properly handled by `containerPhrasing`.
 *
 * @param {Emphasis} node
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
export function emphasis(node, _, state, info) {
  const exit = state.enter('phrasing')
  const item = attentionItem(node, attention, state, state.createTracker(info))
  const value = serialize([item], info.before, info.after)
  exit()
  return value
}

/**
 * Serialize an emphasis node as attention.
 *
 * @param {Emphasis} _
 *   Node to serialize.
 * @param {State} state
 *   Info passed around.
 * @returns {AttentionInfo}
 *   Info on how to serialize the node.
 */
function attention(_, state) {
  const marker = checkEmphasis(state)
  return {
    construct: 'emphasis',
    markers: marker === '*' ? ['*', '_'] : ['_', '*'],
    sizes: [1]
  }
}

/**
 * Peek at this node.
 *
 * @param {Emphasis} _
 *   Node to serialize.
 * @param {Parents | undefined} _1
 *   Parent node.
 * @param {State} state
 *   Info passed around.
 * @returns {string}
 *   Start of the serialized markdown.
 */
function peek(_, _1, state) {
  return state.options.emphasis || '*'
}
