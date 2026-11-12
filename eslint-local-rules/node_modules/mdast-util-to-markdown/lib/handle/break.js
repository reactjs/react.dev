/**
 * @import {Break, Parents} from 'mdast'
 * @import {Info, State} from 'mdast-util-to-markdown'
 */

import {patternInScope} from '../util/pattern-in-scope.js'

/**
 * Serialize a break node.
 *
 * @param {Break} _
 *   Node to serialize.
 * @param {Parents | undefined} _1
 *   Parent node.
 * @param {State} state
 *   Info passed around.
 * @param {Info} info
 *   Info on surrounding context.
 * @returns {string}
 *   Serialized markdown.
 */
export function hardBreak(_, _1, state, info) {
  let index = -1

  while (++index < state.unsafe.length) {
    const pattern = state.unsafe[index]

    // If we can’t put unconditional eols in this construct (setext headings,
    // tables), use a space instead.
    if (
      pattern.character === '\n' &&
      !pattern.before &&
      !pattern.after &&
      patternInScope(state.stack, pattern)
    ) {
      return /[\t ]/.test(info.before) ? '' : ' '
    }
  }

  return '\\\n'
}
