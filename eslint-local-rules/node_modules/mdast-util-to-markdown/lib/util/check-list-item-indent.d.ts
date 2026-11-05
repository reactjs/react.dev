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
export function checkListItemIndent(state: State): Exclude<Options["listItemIndent"], null | undefined>;
import type { State } from 'mdast-util-to-markdown';
import type { Options } from 'mdast-util-to-markdown';
//# sourceMappingURL=check-list-item-indent.d.ts.map