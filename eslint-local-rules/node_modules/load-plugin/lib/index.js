/**
 * @typedef {LoadOptionsExtraFields & ResolveOptions} LoadOptions
 *   Configuration for `loadPlugin`.
 *
 * @typedef LoadOptionsExtraFields
 *   Extra configuration for `loadPlugin`.
 * @property {boolean | string | null | undefined} [key]
 *   Identifier to take from the exports (default: `'default'`);
 *   for example when given `'x'`,
 *   the value of `export const x = 1` will be returned;
 *   when given `'default'`,
 *   the value of `export default …` is used,
 *   and when `false` the whole module object is returned.
 *
 * @typedef ResolveOptions
 *   Configuration for `resolvePlugin`.
 * @property {ReadonlyArray<Readonly<URL> | string> | Readonly<URL> | string | null | undefined} [from]
 *   Place or places to search from (optional);
 *   defaults to the current working directory.
 * @property {boolean | null | undefined} [global=boolean]
 *   Whether to look for `name` in global places (default: whether global is
 *   detected);
 *   if this is nullish,
 *   `load-plugin` will detect if it’s currently running in global mode: either
 *   because it’s in Electron or because a globally installed package is
 *   running it;
 *   note that Electron runs its own version of Node instead of your system
 *   Node,
 *   meaning global packages cannot be found,
 *   unless you’ve set-up a `prefix` in your `.npmrc` or are using nvm to
 *   manage your system node.
 * @property {string | null | undefined} [prefix]
 *   Prefix to search for (optional).
 */

import path from 'node:path'
import process from 'node:process'
import {pathToFileURL} from 'node:url'
// @ts-expect-error: untyped
import NpmConfig from '@npmcli/config'
// @ts-expect-error: untyped
import definitions from '@npmcli/config/lib/definitions/definitions.js'
import {resolve} from 'import-meta-resolve'

const electron = process.versions.electron !== undefined
const nvm = process.env.NVM_BIN
const windows = process.platform === 'win32'
/* c8 ignore next -- windows */
const argv = process.argv[1] || ''
/* c8 ignore next -- windows */
const nodeModules = windows ? 'node_modules' : 'lib/node_modules'

/** @type {Readonly<LoadOptions>} */
const defaultLoadOptions = {}
/** @type {Readonly<ResolveOptions>} */
const defaultResolveOptions = {}

/** @type {Promise<string> | string | undefined} */
let npmPrefix

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
export async function loadPlugin(name, options) {
  const settings = options || defaultLoadOptions
  const href = await resolvePlugin(name, settings)
  const module = /** @type {Record<string, unknown>} */ (await import(href))
  return typeof settings.key === 'string'
    ? module[settings.key]
    : settings.key === false
      ? module
      : module.default
}

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
export async function resolvePlugin(name, options) {
  const settings = options || defaultResolveOptions
  const prefix = settings.prefix
    ? settings.prefix + (settings.prefix.at(-1) === '-' ? '' : '-')
    : undefined
  const fromNonEmpty = settings.from || pathToFileURL(process.cwd() + '/')
  const from = /** @type {Array<Readonly<URL> | string>} */ (
    Array.isArray(fromNonEmpty) ? fromNonEmpty : [fromNonEmpty]
  )

  if (!npmPrefix) npmPrefix = inferNpmPrefix()
  if (typeof npmPrefix !== 'string') npmPrefix = await npmPrefix

  const globals =
    typeof settings.global === 'boolean'
      ? settings.global
      : electron || argv.startsWith(npmPrefix)

  /** @type {string | undefined} */
  let plugin
  /** @type {Error | undefined} */
  let lastError

  // Bare specifier.
  if (name.charAt(0) !== '.') {
    if (globals) {
      from.push(new URL(nodeModules, pathToFileURL(npmPrefix) + '/'))

      // If we’re in Electron,
      // we’re running in a modified Node that cannot really install global node
      // modules.
      // To find the actual modules,
      // the user has to set `prefix` somewhere in an `.npmrc` (which is picked up
      // by `@npmcli/config`).
      // Most people don’t do that,
      // and some use NVM instead to manage different versions of Node.
      // Luckily NVM leaks some environment variables that we can pick up on to try
      // and detect the actual modules.
      /* c8 ignore next 3 -- Electron. */
      if (electron && nvm) {
        from.push(new URL(nodeModules, pathToFileURL(nvm)))
      }
    }

    let scope = ''

    // Unprefix module.
    if (prefix) {
      // Scope?
      if (name.charAt(0) === '@') {
        const slash = name.indexOf('/')

        // Let’s keep the algorithm simple.
        // No need to care if this is a “valid” scope (I think?).
        // But we do check for the slash.
        if (slash !== -1) {
          scope = name.slice(0, slash + 1)
          name = name.slice(slash + 1)
        }
      }

      if (name.slice(0, prefix.length) !== prefix) {
        plugin = scope + prefix + name
      }

      name = scope + name
    }
  }

  let index = -1

  while (++index < from.length) {
    const source = from[index]
    const href = typeof source === 'string' ? source : source.href

    if (plugin) {
      try {
        return resolve(plugin, href)
      } catch (error) {
        lastError = /** @type {Error} */ (error)
      }
    }

    try {
      return resolve(name, href)
    } catch (error) {
      lastError = /** @type {Error} */ (error)
    }
  }

  throw lastError
}

/**
 * Find npm prefix.
 *
 * @returns {Promise<string>}
 */
async function inferNpmPrefix() {
  const config = new NpmConfig({
    argv: [],
    definitions,
    npmPath: ''
  })

  await config.load()

  /* c8 ignore next 6 -- typically defined */
  return (
    config.globalPrefix ||
    (windows
      ? path.dirname(process.execPath)
      : path.resolve(process.execPath, '../..'))
  )
}
