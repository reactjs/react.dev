/**
 * Serialize a link node.
 *
 * @param {Link} node
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
export function link(node: Link, _: Parents | undefined, state: State, info: Info): string;
export namespace link {
    export { linkPeek as peek };
}
import type { Link } from 'mdast';
import type { Parents } from 'mdast';
import type { State } from 'mdast-util-to-markdown';
import type { Info } from 'mdast-util-to-markdown';
/**
 * Peek at this node.
 *
 * @param {Link} node
 *   Node to peek at.
 * @param {Parents | undefined} _
 *   Parent node.
 * @param {State} state
 *   Info passed around.
 * @returns {string}
 *   Start of the serialized markdown.
 */
declare function linkPeek(node: Link, _: Parents | undefined, state: State): string;
export {};
//# sourceMappingURL=link.d.ts.map