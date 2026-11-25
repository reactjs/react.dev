/**
 * Serialize an inline code node.
 *
 * @param {InlineCode} node
 *   Node to serialize.
 * @param {Parents | undefined} _
 *   Parent node.
 * @param {State} state
 *   Info passed around.
 * @returns {string}
 *   Serialized markdown.
 */
export function inlineCode(node: InlineCode, _: Parents | undefined, state: State): string;
export namespace inlineCode {
    export { inlineCodePeek as peek };
}
import type { InlineCode } from 'mdast';
import type { Parents } from 'mdast';
import type { State } from 'mdast-util-to-markdown';
/**
 * Peek at this node.
 *
 * @returns {string}
 *   Start of the serialized markdown.
 */
declare function inlineCodePeek(): string;
export {};
//# sourceMappingURL=inline-code.d.ts.map