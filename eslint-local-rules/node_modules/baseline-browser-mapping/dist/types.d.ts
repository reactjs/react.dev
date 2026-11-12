export type BrowserVersion = {
    browser: string;
    version: string;
    release_date?: string;
    engine?: string;
    engine_version?: string;
};
export type Options = {
    /**
     * Whether to include only the minimum compatible browser versions or all compatible versions.
     * Defaults to `false`.
     */
    listAllCompatibleVersions?: boolean;
    /**
     * Whether to include browsers that use the same engines as a core Baseline browser.
     * Defaults to `false`.
     */
    includeDownstreamBrowsers?: boolean;
    /**
     * Pass a date in the format 'YYYY-MM-DD' to get versions compatible with Widely available on the specified date.
     * If left undefined and a `targetYear` is not passed, defaults to Widely available as of the current date.
     * > NOTE: cannot be used with `targetYear`.
     */
    widelyAvailableOnDate?: string | number;
    /**
     * Pass a year between 2015 and the current year to get browser versions compatible with all
     * Newly Available features as of the end of the year specified.
     * > NOTE: cannot be used with `widelyAvailableOnDate`.
     */
    targetYear?: number;
    /**
     * Pass a boolean that determines whether KaiOS is included in browser mappings.  KaiOS implements
     * the Gecko engine used in Firefox.  However, KaiOS also has a different interaction paradigm to
     * other browsers and requires extra consideration beyond simple feature compatibility to provide
     * an optimal user experience.  Defaults to `false`.
     */
    includeKaiOS?: boolean;
    overrideLastUpdated?: number;
    /**
     * Pass a boolean to suppress the warning about stale data.
     * Defaults to `false`.
     */
    suppressWarnings?: boolean;
};
export type AllVersionsOptions = {
    /**
     * Whether to return the output as a JavaScript `Array` (`"array"`), `Object` (`"object"`) or a CSV string (`"csv"`).
     * Defaults to `"array"`.
     */
    outputFormat?: string;
    /**
     * Whether to include browsers that use the same engines as a core Baseline browser.
     * Defaults to `false`.
     */
    includeDownstreamBrowsers?: boolean;
    /**
     * Whether to use the new "supports" property in place of "wa_compatible"
     * Defaults to `false`
     */
    useSupports?: boolean;
    /**
     * Whether to include KaiOS in the output. KaiOS implements the Gecko engine used in Firefox.
     * However, KaiOS also has a different interaction paradigm to other browsers and requires extra
     * consideration beyond simple feature compatibility to provide an optimal user experience.
     */
    includeKaiOS?: boolean;
    /**
     * Pass a boolean to suppress the warning about old data.
     * Defaults to `false`.
     */
    suppressWarnings?: boolean;
};
export interface AllBrowsersBrowserVersion extends BrowserVersion {
    year: number | string;
    supports?: string;
    wa_compatible?: boolean;
}
export type NestedBrowserVersions = {
    [browser: string]: {
        [version: string]: AllBrowsersBrowserVersion;
    };
};
export type TimelineOptions = {
    /**
     * Whether to return the timeline as a chronologically sorted array of events grouped by date ("date"),
     * or as an object grouped by browser with their respective history of version changes ("browser").
     * Defaults to "date".
     */
    groupBy?: "date" | "browser";
    /**
     * Whether to include all compatible browsers in each timeline event,
     * or only the browsers that changed on that date.
     * Only applicable when groupBy is "date".
     * Defaults to `false`.
     */
    listAllBrowsers?: boolean;
    /**
     * Whether to include browsers that use the same engines as a core Baseline browser.
     * Defaults to `false`.
     */
    includeDownstreamBrowsers?: boolean;
    /**
     * Whether to include KaiOS in the timeline.
     * Defaults to `false`.
     */
    includeKaiOS?: boolean;
};
export type TimelineEvent = {
    date: string;
    browsers: BrowserVersion[];
};
export type BrowserTimelineEntry = {
    date: string;
    version: string;
    release_date?: string;
    engine?: string;
    engine_version?: string;
};
export type BrowserTimeline = {
    [browser: string]: BrowserTimelineEntry[];
};
