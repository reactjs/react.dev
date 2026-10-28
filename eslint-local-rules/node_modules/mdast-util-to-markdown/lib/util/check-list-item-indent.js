/**
 * @import {Options, State} from 'mdast-util-to-markdown'
 */

/**
 * Checks the preferred list item indent option.
 *
 * @param {State} state
 *   Info passed around.
 * @returns {Exclude<Options['listItemIndent'], null | undefined>}
 *   Preferred list item indent.
 */
export function checkListItemIndent(state) {
  const style = state.options.listItemIndent || 'one'

  if (style !== 'tab' && style !== 'one' && style !== 'mixed') {
    throw new Error(
      'Cannot serialize items with `' +
        style +
        '` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`'
    )
  }

  return style
}
