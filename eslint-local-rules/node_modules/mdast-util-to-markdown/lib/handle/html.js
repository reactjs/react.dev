/**
 * @import {Html} from 'mdast'
 */

html.peek = htmlPeek

/**
 * Serialize an HTML node.
 *
 * @param {Html} node
 *   Node to serialize.
 * @returns {string}
 *   Serialized markdown.
 */
export function html(node) {
  return node.value || ''
}

/**
 * Peek at this node.
 *
 * @returns {string}
 *   Start of the serialized markdown.
 */
function htmlPeek() {
  return '<'
}
