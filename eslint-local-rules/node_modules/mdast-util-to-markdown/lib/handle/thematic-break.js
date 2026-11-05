/**
 * @import {State} from 'mdast-util-to-markdown'
 * @import {Parents, ThematicBreak} from 'mdast'
 */

import {checkRuleRepetition} from '../util/check-rule-repetition.js'
import {checkRule} from '../util/check-rule.js'

/**
 * Serialize a thematic break node.
 *
 * @param {ThematicBreak} _
 *   Node to serialize.
 * @param {Parents | undefined} _1
 *   Parent node.
 * @param {State} state
 *   Info passed around.
 * @returns {string}
 *   Serialized markdown.
 */
export function thematicBreak(_, _1, state) {
  const value = (
    checkRule(state) + (state.options.ruleSpaces ? ' ' : '')
  ).repeat(checkRuleRepetition(state))

  return state.options.ruleSpaces ? value.slice(0, -1) : value
}
