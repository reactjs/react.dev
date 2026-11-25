/**
 * @import {AttentionInfo, Info, State} from 'mdast-util-to-markdown'
 * @import {Parents, Strong} from 'mdast'
 */

import {checkStrong} from '../util/check-strong.js'
import {attentionItem, serialize} from '../util/container-phrasing.js'

strong.attention = attention
strong.peek = peek

/**
 * Serialize a strong node.
 *
 * Attention is properly handled by `containerPhrasing`.
 *
 * @param {Strong} node
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
export function strong(node, _, state, info) {
  const exit = state.enter('phrasing')
  const item = attentionItem(node, attention, state, state.createTracker(info))
  const value = serialize([item], info.before, info.after)
  exit()
  return value
}

/**
 * Serialize a strong node as attention.
 *
 * @param {Strong} _
 *   Node to serialize.
 * @param {State} state
 *   Info passed around.
 * @returns {AttentionInfo}
 *   Info on how to serialize the node.
 */
function attention(_, state) {
  const marker = checkStrong(state)
  return {
    construct: 'strong',
    markers: marker === '*' ? ['*', '_'] : ['_', '*'],
    sizes: [2]
  }
}

/**
 * Peek at this node.
 *
 * @param {Strong} _
 *   Node to serialize.
 * @param {Parents | undefined} _1
 *   Parent node.
 * @param {State} state
 *   Info passed around.
 * @returns {string}
 *   Start of the serialized markdown.
 */
function peek(_, _1, state) {
  return state.options.strong || '*'
}
