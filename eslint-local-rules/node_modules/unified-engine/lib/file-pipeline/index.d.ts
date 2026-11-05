export const filePipeline: import("../../node_modules/trough/lib/index.js").Pipeline;
/**
 * Context.
 */
export type Context = {
    /**
     *   Configuration.
     */
    configuration: Configuration;
    /**
     *   File set.
     */
    fileSet: FileSet;
    /**
     *   Processor.
     */
    processor: Processor;
    /**
     *   Settings.
     */
    settings: Settings;
    /**
     * Tree.
     */
    tree?: Node | undefined;
};
/**
 * Callback.
 */
export type Next = () => undefined;
import type { Configuration } from '../configuration.js';
import type { FileSet } from '../file-set.js';
import type { Processor } from 'unified';
import type { Settings } from '../index.js';
import type { Node } from 'unist';
//# sourceMappingURL=index.d.ts.map