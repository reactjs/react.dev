/**
 * Serialize a list item node.
 *
 * @param {ListItem} node
 *   Node to serialize.
 * @param {Parents | undefined} parent
 *   Parent node.
 * @param {State} state
 *   Info passed around.
 * @param {Info} info
 *   Info on surrounding context.
 * @returns {string}
 *   Serialized markdown.
 */
export function listItem(node: ListItem, parent: Parents | undefined, state: State, info: Info): string;
import type { ListItem } from 'mdast';
import type { Parents } from 'mdast';
import type { State } from 'mdast-util-to-markdown';
import type { Info } from 'mdast-util-to-markdown';
//# sourceMappingURL=list-item.d.ts.map