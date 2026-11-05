/**
 * @param {Context} context
 *   Context.
 * @param {Settings} settings
 *   Settings.
 * @param {Callback} next
 *   Callback.
 * @returns {undefined}
 *   Nothing.
 */
export function stdin(context: Context, settings: Settings, next: Callback): undefined;
/**
 * Context.
 */
export type Context = {
    /**
     *   Files.
     */
    files: Array<VFile | string>;
};
import type { Settings } from '../index.js';
import type { Callback } from 'trough';
import { VFile } from 'vfile';
//# sourceMappingURL=stdin.d.ts.map