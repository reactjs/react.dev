/**
 * @import {Event} from 'micromark-util-types'
 */
/**
 * @typedef {[number, number, Array<Event>]} Change
 * @typedef {[number, number, number]} Jump
 */
/**
 * Tracks a bunch of edits.
 *
 * Port of `edit_map.rs` from `markdown-rs`:
 * <https://github.com/wooorm/markdown-rs/blob/1506572f/src/util/edit_map.rs>.
 *
 * Deal with several changes in events, batching them together.
 *
 * Preferably, changes should be kept to a minimum.
 * Sometimes, it’s needed to change the list of events, because parsing can be
 * messy, and it helps to expose a cleaner interface of events to the compiler
 * and other users.
 * It can also help to merge many adjacent similar events.
 * And, in other cases, it’s needed to parse subcontent: pass some events
 * through another tokenizer and inject the result.
 */
export class EditMap {
    /**
     * Changes by index, so `add` does not need to scan `map` (which is
     * quadratic for documents with many edits at different places).
     *
     * @type {Map<number, Change>}
     */
    index: Map<number, Change>;
    /**
     * Record of changes.
     *
     * @type {Array<Change>}
     */
    map: Array<Change>;
    /**
     * Create an edit: a remove and/or add at a certain place.
     *
     * @param {number} index
     *   Index at which to apply the edit.
     * @param {number} remove
     *   Count of items to remove at the index.
     * @param {Array<Event>} add
     *   Items to add at the index.
     * @returns {undefined}
     *   Nothing.
     */
    add(index: number, remove: number, add: Array<Event>): undefined;
    /**
     * Create an edit: but insert `add` before existing additions, instead of
     * after them.
     *
     * @param {number} index
     *   Index at which to apply the edit.
     * @param {number} remove
     *   Count of items to remove at the index.
     * @param {Array<Event>} add
     *   Items to add at the index.
     * @returns {undefined}
     *   Nothing.
     */
    addBefore(index: number, remove: number, add: Array<Event>): undefined;
    /**
     * Done, change the events.
     *
     * @param {Array<Event>} events
     *   List of events to apply the edits to.
     * @returns {undefined}
     *   Nothing.
     */
    consume(events: Array<Event>): undefined;
}
export type Change = [number, number, Array<Event>];
export type Jump = [number, number, number];
import type { Event } from 'micromark-util-types';
//# sourceMappingURL=index.d.ts.map