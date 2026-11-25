/**
 * @typedef Context
 *   Context.
 * @property {Array<VFile>} files
 *   Files.
 * @property {Configuration | undefined} [configuration]
 *   Configuration.
 */
/**
 * @param {Context} context
 *   Context.
 * @param {Settings} settings
 *   Settings.
 * @returns {Promise<undefined>}
 *   Nothing.
 */
export function log(context: Context, settings: Settings): Promise<undefined>;
/**
 * Context.
 */
export type Context = {
    /**
     *   Files.
     */
    files: Array<VFile>;
    /**
     * Configuration.
     */
    configuration?: Configuration | undefined;
};
import type { Settings } from '../index.js';
import type { VFile } from 'vfile';
import type { Configuration } from '../configuration.js';
//# sourceMappingURL=log.d.ts.map