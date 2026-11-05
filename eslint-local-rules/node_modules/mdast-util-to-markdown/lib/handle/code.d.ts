/**
 * Serialize a code node.
 *
 * @param {Code} node
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
export function code(node: Code, _: Parents | undefined, state: State, info: Info): string;
import type { Code } from 'mdast';
import type { Parents } from 'mdast';
import type { State } from 'mdast-util-to-markdown';
import type { Info } from 'mdast-util-to-markdown';
//# sourceMappingURL=code.d.ts.map