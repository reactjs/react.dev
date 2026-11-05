import { BrowserVersion, Options, AllVersionsOptions, AllBrowsersBrowserVersion, NestedBrowserVersions, TimelineOptions, TimelineEvent, BrowserTimeline } from "./types.js";
export declare function _resetHasWarned(): void;
/**
 * Returns browser versions compatible with specified Baseline targets.
 * Defaults to returning the minimum versions of the core browser set that support Baseline Widely available.
 * Takes an optional configuration `Object` with four optional properties:
 * - `listAllCompatibleVersions`: `false` (default) or `true`
 * - `includeDownstreamBrowsers`: `false` (default) or `true`
 * - `widelyAvailableOnDate`: date in format `YYYY-MM-DD`
 * - `targetYear`: year in format `YYYY`
 * - `supressWarnings`: `false` (default) or `true`
 */
export declare function getCompatibleVersions(userOptions?: Options): BrowserVersion[];
/**
 * Returns all browser versions known to this module with their level of Baseline support as a JavaScript `Array` (`"array"`), `Object` (`"object"`) or a CSV string (`"csv"`).
 * Takes an optional configuration `Object` with three optional properties:
 * - `includeDownstreamBrowsers`: `false` (default) or `true`
 * - `outputFormat`: `"array"` (default), `"object"` or `"csv"`
 * - `useSupports`: `false` (default) or `true`, replaces `wa_compatible` property with optional `supports` property which returns `widely` or `newly` available when present.
 * - `supressWarnings`: `false` (default) or `true`
 */
export declare function getAllVersions(userOptions?: AllVersionsOptions): AllBrowsersBrowserVersion[] | NestedBrowserVersions | string;
export declare function getTimeline(userOptions?: TimelineOptions & {
    groupBy?: "date";
}): TimelineEvent[];
export declare function getTimeline(userOptions: TimelineOptions & {
    groupBy: "browser";
}): BrowserTimeline;
