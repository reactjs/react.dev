/**
 * Transform all files.
 *
 * @param {Context} context
 *   Context.
 * @param {Settings} settings
 *   Settings.
 * @param {Callback} next
 *   Callback.
 * @returns {undefined}
 *   Nothing.
 */
export function transform(context: Context, settings: Settings, next: Callback): undefined;
/**
 * Context.
 */
export type Context = {
    /**
     *   Files.
     */
    files: Array<VFile>;
    /**
     *   Configuration.
     */
    configuration: Configuration;
    /**
     *   File set.
     */
    fileSet: FileSet;
};
import type { Settings } from '../index.js';
import type { Callback } from 'trough';
import type { VFile } from 'vfile';
import type { Configuration } from '../configuration.js';
import { FileSet } from '../file-set.js';
//# sourceMappingURL=transform.d.ts.map