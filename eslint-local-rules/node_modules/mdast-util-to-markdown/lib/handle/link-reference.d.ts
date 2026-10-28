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
export function linkReference(node: LinkReference, _: Parents | undefined, state: State, info: Info): string;
export namespace linkReference {
    export { linkReferencePeek as peek };
}
import type { LinkReference } from 'mdast';
import type { Parents } from 'mdast';
import type { State } from 'mdast-util-to-markdown';
import type { Info } from 'mdast-util-to-markdown';
/**
 * Peek at this node.
 *
 * @returns {string}
 *   Start of the serialized markdown.
 */
declare function linkReferencePeek(): string;
export {};
//# sourceMappingURL=link-reference.d.ts.map