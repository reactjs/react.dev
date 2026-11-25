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
export function fileSystem(context: Context, settings: Settings, next: Callback): undefined;
/**
 * Context.
 */
export type Context = {
    /**
     *   Files.
     */
    files: Array<VFile | string>;
    /**
     * Configuration.
     */
    configuration?: Configuration | undefined;
};
import type { Settings } from '../index.js';
import type { Callback } from 'trough';
import type { VFile } from 'vfile';
import type { Configuration } from '../configuration.js';
//# sourceMappingURL=file-system.d.ts.map