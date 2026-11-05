/**
 * @import {Options, State} from 'mdast-util-to-markdown'
 */

/**
 * Checks the preferred rule repetition option.
 *
 * @param {State} state
 *   Info passed around.
 * @returns {Exclude<Options['ruleRepetition'], null | undefined>}
 *   Preferred rule repetition.
 */
export function checkRuleRepetition(state) {
  const repetition = state.options.ruleRepetition || 3

  if (repetition < 3) {
    throw new Error(
      'Cannot serialize rules with repetition `' +
        repetition +
        '` for `options.ruleRepetition`, expected `3` or more'
    )
  }

  return repetition
}
