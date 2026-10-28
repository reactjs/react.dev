/**
 * Serialize the children of a parent that contains phrasing children.
 *
 * @param {PhrasingParents} parent
 *   Parent of phrasing nodes.
 * @param {State} state
 *   Info passed around about the current state.
 * @param {Info} info
 *   Info on where we are in the document we are generating.
 * @returns {string}
 *   Serialized result.
 */
export function containerPhrasing(parent: PhrasingParents, state: State, info: Info): string;
/**
 * Serialize a node as attention,
 * with its sequence chosen later.
 *
 * @param {PhrasingParents} node
 *   Node.
 * @param {Attention} attention
 *   Attention of the node.
 * @param {State} state
 *   Info passed around about the current state.
 * @param {Tracker} tracker
 *   Tracker.
 * @returns {AttentionResult}
 *   Attention.
 */
export function attentionItem(node: PhrasingParents, attention: Attention, state: State, tracker: Tracker): AttentionResult;
/**
 * Serialize phrasing with attention.
 *
 * Whether attention forms depends on everything around it.
 * This checks that it does and tries other sequences if not.
 *
 * @param {Array<Item>} items
 *   Phrasing items.
 * @param {string} before
 *   Characters before.
 * @param {string} after
 *   Characters after.
 * @returns {string}
 *   Serialized markdown.
 */
export function serialize(items: Array<Item>, before: string, after: string): string;
/**
 * Attention, of which the sequence is chosen later.
 */
export type AttentionResult = {
    /**
     *   Serialized children.
     */
    children: Array<Item>;
    /**
     *   Sequences that can be used, in order of preference.
     */
    sequences: Array<string>;
};
/**
 * Improvement of attention sequences.
 */
export type Improvement = {
    /**
     *   Chosen sequences for each attention.
     */
    chosen: Map<AttentionResult, string>;
    /**
     *   Tokens involved in the improvement.
     */
    tokens: Array<Token>;
    /**
     *   Mistake that led to this improvement, if any.
     */
    mistake: Mistake | undefined;
};
/**
 * Serialized phrasing.
 */
export type Item = AttentionResult | string;
/**
 * Sequence that does not form its attention.
 */
export type Mistake = {
    /**
     *   Attention to try other sequences for.
     */
    attention: Array<AttentionResult>;
    /**
     *   Index of the token.
     */
    index: number;
};
/**
 * Sequences next to each other with the same marker.
 */
export type Run = {
    /**
     *   Whether it can close.
     */
    close: boolean;
    /**
     *   Index after the last marker not used (to open).
     */
    end: number;
    /**
     *   Sequence of each marker.
     */
    markers: Array<Token>;
    /**
     *   Whether it can open.
     */
    open: boolean;
    /**
     *   Whether it can be split (built-in attention).
     */
    split: boolean;
    /**
     *   Index of the first marker not used (to close).
     */
    start: number;
    /**
     *   Sequences.
     */
    tokens: Array<Token>;
};
/**
 * Rendered phrasing.
 */
export type Token = {
    /**
     *   Attention, if this is one of its sequences.
     */
    attention: AttentionResult | undefined;
    /**
     *   Value.
     */
    value: string;
};
import type { PhrasingParents } from '../types.js';
import type { State } from 'mdast-util-to-markdown';
import type { Info } from 'mdast-util-to-markdown';
import type { Attention } from 'mdast-util-to-markdown';
import type { Tracker } from 'mdast-util-to-markdown';
//# sourceMappingURL=container-phrasing.d.ts.map