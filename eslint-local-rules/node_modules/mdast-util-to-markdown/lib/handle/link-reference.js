/**
 * @import {Info, State} from 'mdast-util-to-markdown'
 * @import {LinkReference, Parents} from 'mdast'
 */

linkReference.peek = linkReferencePeek

/**
 * Serialize a link reference node.
 *
 * @param {LinkReference} node
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
export function linkReference(node, _, state, info) {
  const type = node.referenceType
  const exit = state.enter('linkReference')
  let subexit = state.enter('label')
  const tracker = state.createTracker(info)
  let value = tracker.move('[')
  const text = state.containerPhrasing(node, {
    before: value,
    after: ']',
    ...tracker.current()
  })
  value += tracker.move(text + '][')

  subexit()
  // Hide that we’re in phrasing as things like attention or code cannot form
  // in references.
  // Character escapes and references *do* work.
  // It is important to know about other constructs, such as table cells.
  const stack = state.stack
  state.stack = stack.filter(function (d) {
    return d !== 'phrasing'
  })
  subexit = state.enter('reference')
  // Note: for proper tracking, we should reset the output positions when we end
  // up making a `shortcut` reference, because then there is no brace output.
  // Practically, in that case, there is no content, so it doesn’t matter that
  // we’ve tracked one too many characters.
  const reference = state.safe(state.associationId(node), {
    before: value,
    after: ']',
    ...tracker.current()
  })
  subexit()
  state.stack = stack
  exit()

  if (type === 'full' || !text || text !== reference) {
    value += tracker.move(reference + ']')
  } else if (type === 'shortcut') {
    // Remove the unwanted `[`.
    value = value.slice(0, -1)
  } else {
    value += tracker.move(']')
  }

  return value
}

/**
 * Peek at this node.
 *
 * @returns {string}
 *   Start of the serialized markdown.
 */
function linkReferencePeek() {
  return '['
}
