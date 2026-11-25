/**
 * @import {Info, State} from 'mdast-util-to-markdown'
 * @import {Parents, Text} from 'mdast'
 */
/**
 * Serialize a text node.
 *
 * @param {Text} node
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
export function text(node: Text, parent: Parents | undefined, state: State, info: Info): string;
import type { Text } from 'mdast';
import type { Parents } from 'mdast';
import type { State } from 'mdast-util-to-markdown';
import type { Info } from 'mdast-util-to-markdown';
//# sourceMappingURL=text.d.ts.map