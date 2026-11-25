/**
 * Create a report from one or more files.
 *
 * @param {Array<VFile> | VFile} files
 *   Files or error to report.
 * @param {Options | null | undefined} [options]
 *   Configuration.
 * @returns {string}
 *   Report.
 */
export function reporter(files: Array<VFile> | VFile, options?: Options | null | undefined): string;
export type VFile = import('vfile').VFile;
export type VFileMessage = import('vfile-message').VFileMessage;
export type Statistics = import('vfile-statistics').Statistics;
/**
 * Configuration (optional).
 */
export type Options = {
    /**
     * Use ANSI colors in report (default: `true` when in Node.js and
     * [color is supported][supports-color], or `false`).
     *
     * [supports-color]: https://github.com/chalk/supports-color
     */
    color?: boolean | null | undefined;
    /**
     * Label to use for files without file path (default: `'<stdin>'`); if one
     * file and no `defaultName` is given, no name will show up in the report.
     */
    defaultName?: string | null | undefined;
    /**
     * Show message notes, URLs, and ancestor stack trace if available (default:
     * `false`).
     */
    verbose?: boolean | null | undefined;
    /**
     * Do not show files without messages (default: `false`).
     */
    quiet?: boolean | null | undefined;
    /**
     * Show errors only (default: `false`); this hides info and warning messages,
     * and sets `quiet: true`.
     */
    silent?: boolean | null | undefined;
    /**
     * Max number of nodes to show in ancestors trace (default: `10`); ancestors
     * can be shown when `verbose: true`.
     */
    traceLimit?: number | null | undefined;
};
/**
 * Info passed around.
 */
export type State = {
    /**
     *   Default name to use.
     */
    defaultName: string | undefined;
    /**
     *   Whether explicitly a single file is passed.
     */
    oneFileMode: boolean;
    /**
     *   Whether notes should be shown.
     */
    verbose: boolean;
    /**
     *   Whether to hide files without messages.
     */
    quiet: boolean;
    /**
     *   Whether to hide warnings and info messages.
     */
    silent: boolean;
    /**
     *   Max number of nodes to show in ancestors trace.
     */
    traceLimit: number;
    /**
     *   Bold style.
     */
    bold: string;
    /**
     *   Underline style.
     */
    underline: string;
    /**
     *   Regular style.
     */
    normalIntensity: string;
    /**
     *   Regular style.
     */
    noUnderline: string;
    /**
     *   Color.
     */
    red: string;
    /**
     *   Color.
     */
    cyan: string;
    /**
     *   Color.
     */
    green: string;
    /**
     *   Color.
     */
    yellow: string;
    /**
     *   Regular color.
     */
    defaultColor: string;
};
export type CodeSplit = {
    index: number;
    size: number;
};
