/**
 * @param {Context} context
 *   Context.
 * @param {Settings} settings
 *   Settings.
 * @returns {undefined}
 *   Nothing.
 */
export function configure(context: Context, settings: Settings): undefined;
/**
 * Context.
 */
export type Context = {
    /**
     * Configuration.
     */
    configuration?: Configuration | undefined;
};
import type { Settings } from '../index.js';
import { Configuration } from '../configuration.js';
//# sourceMappingURL=configure.d.ts.map