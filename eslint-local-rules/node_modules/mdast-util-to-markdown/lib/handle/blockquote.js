/**
 * @import {Blockquote, Parents} from 'mdast'
 * @import {Info, Map, State} from 'mdast-util-to-markdown'
 */

/**
 * Serialize a blockquote node.
 *
 * @param {Blockquote} node
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
export function blockquote(node, _, state, info) {
  const exit = state.enter('blockquote')
  const tracker = state.createTracker(info)
  tracker.move('> ')
  tracker.shift(2)
  const value = state.indentLines(
    state.containerFlow(node, tracker.current()),
    map
  )
  exit()
  return value
}

/**
 * Indent lines w/ blockquote markers.
 *
 * @type {Map}
 */
function map(line, _, blank) {
  return '>' + (blank ? '' : ' ') + line
}
