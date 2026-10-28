/**
 * Import `name` from `from` (and optionally the global `node_modules` directory).
 *
 * Uses the Node.js resolution algorithm (through `import-meta-resolve`) to
 * resolve CJS and ESM packages and files.
 *
 * If a `prefix` is given and `name` is not a path,
 * `$prefix-$name` is also searched (preferring these over non-prefixed
 * modules).
 * If `name` starts with a scope (`@scope/name`),
 * the prefix is applied after it: `@scope/$prefix-name`.
 *
 * @param {string} name
 *   Specifier.
 * @param {Readonly<LoadOptions> | null | undefined} [options]
 *   Configuration (optional).
 * @returns {Promise<unknown>}
 *   Promise to a whole module or specific export.
 */
export function loadPlugin(name: string, options?: Readonly<LoadOptions> | null | undefined): Promise<unknown>;
/**
 * Resolve `name` from `from`.
 *
 * @param {string} name
 *   Specifier.
 * @param {Readonly<ResolveOptions> | null | undefined} [options]
 *   Configuration (optional).
 * @returns {Promise<string>}
 *   Promise to a file URL.
 */
export function resolvePlugin(name: string, options?: Readonly<ResolveOptions> | null | undefined): Promise<string>;
/**
 * Configuration for `loadPlugin`.
 */
export type LoadOptions = LoadOptionsExtraFields & ResolveOptions;
/**
 * Extra configuration for `loadPlugin`.
 */
export type LoadOptionsExtraFields = {
    /**
     * Identifier to take from the exports (default: `'default'`);
     * for example when given `'x'`,
     * the value of `export const x = 1` will be returned;
     * when given `'default'`,
     * the value of `export default …` is used,
     * and when `false` the whole module object is returned.
     */
    key?: boolean | string | null | undefined;
};
/**
 * Configuration for `resolvePlugin`.
 */
export type ResolveOptions = {
    /**
     * Place or places to search from (optional);
     * defaults to the current working directory.
     */
    from?: ReadonlyArray<Readonly<URL> | string> | Readonly<URL> | string | null | undefined;
    /**
     * Whether to look for `name` in global places (default: whether global is
     * detected);
     * if this is nullish,
     * `load-plugin` will detect if it’s currently running in global mode: either
     * because it’s in Electron or because a globally installed package is
     * running it;
     * note that Electron runs its own version of Node instead of your system
     * Node,
     * meaning global packages cannot be found,
     * unless you’ve set-up a `prefix` in your `.npmrc` or are using nvm to
     * manage your system node.
     */
    global?: boolean | null | undefined;
    /**
     * Prefix to search for (optional).
     */
    prefix?: string | null | undefined;
};
//# sourceMappingURL=index.d.ts.map