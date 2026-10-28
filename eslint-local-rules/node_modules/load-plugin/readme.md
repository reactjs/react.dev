# load-plugin

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]

Load a submodule, plugin, or file.

## Contents

* [What is this?](#what-is-this)
* [When to use this?](#when-to-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`loadPlugin(name[, options])`](#loadpluginname-options)
  * [`resolvePlugin(name[, options])`](#resolvepluginname-options)
  * [`LoadOptions`](#loadoptions)
  * [`ResolveOptions`](#resolveoptions)
* [Compatibility](#compatibility)
* [Security](#security)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is useful when you want to load plugins.
It resolves things like Node.js does,
but supports a prefix (when given a prefix `remark` and the user provided value
`gfm` it can find `remark-gfm`),
can load from several places,
and optionally global too.

## When to use this?

This package is particularly useful when you want users to configure something
with plugins.
One example is `remark-cli` which can load remark plugins from configuration
files.

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install load-plugin
```

## Use

Say we’re in this project (with dependencies installed):

```js
import {loadPlugin, resolvePlugin} from 'load-plugin'

console.log(await resolvePlugin('lint', {prefix: 'remark'}))
// => 'file:///Users/tilde/Projects/oss/load-plugin/node_modules/remark-lint/index.js'

console.log(
  await resolvePlugin('validator-identifier', {prefix: '@babel/helper'})
)
// => 'file:///Users/tilde/Projects/oss/load-plugin/node_modules/@babel/helper-validator-identifier/lib/index.js'

console.log(await resolvePlugin('./index.js', {prefix: 'remark'}))
// => 'file:///Users/tilde/Projects/oss/load-plugin/index.js'

console.log(await loadPlugin('lint', {prefix: 'remark'}))
// => [Function: remarkLint]
```

## API

This package exports the identifiers
[`loadPlugin`][api-load-plugin] and [`resolvePlugin`][api-resolve-plugin].
There is no default export.

It exports the [TypeScript][] types
[`LoadOptions`][api-load-options] and [`ResolveOptions`][api-resolve-options].

### `loadPlugin(name[, options])`

Import `name` from `from` (and optionally the global `node_modules` directory).

Uses the Node.js [resolution algorithm][nodejs-resolution-algo] (through
[`import-meta-resolve`][github-import-meta-resolve]) to resolve CJS and ESM
packages and files.

If a `prefix` is given and `name` is not a path,
`$prefix-$name` is also searched (preferring these over non-prefixed
modules).
If `name` starts with a scope (`@scope/name`),
the prefix is applied after it: `@scope/$prefix-name`.

###### Parameters

* `name` (`string`)
  — specifier
* `options` ([`LoadOptions`][api-load-options], optional)
  — configuration

###### Returns

Promise to a whole module or specific export (`Promise<unknown>`).

### `resolvePlugin(name[, options])`

Resolve `name` from `from`.

###### Parameters

* `name` (`string`)
  — specifier
* `options` ([`ResolveOptions`][api-resolve-options], optional)
  — configuration

###### Returns

Promise to a file URL (`Promise<string>`).

### `LoadOptions`

Configuration for `loadPlugin` (TypeScript type).

This type extends `ResolveOptions` and adds:

###### Fields

* `key` (`boolean` or `string`, default: `'default'`)
  — identifier to take from the exports;
  for example when given `'x'`,
  the value of `export const x = 1` will be returned;
  when given `'default'`,
  the value of `export default …` is used,
  and when `false` the whole module object is returned

### `ResolveOptions`

Configuration for `resolvePlugin` (TypeScript type).

###### Fields

* `from` (`Array<URL | string> | URL | string`, optional)
  — place or places to search from;
  defaults to the current working directory
* `global` (`boolean`, default: whether global is detected)
  — whether to look for `name` in [global places][npm-node-modules];
  if this is nullish,
  `load-plugin` will detect if it’s currently running in global mode: either
  because it’s in Electron or because a globally installed package is running
  it;
  note that Electron runs its own version of Node instead of your system Node,
  meaning global packages cannot be found,
  unless you’ve set-up a [`prefix`][npm-prefix] in your `.npmrc` or are using
  [nvm][github-nvm] to manage your system node
* `prefix` (`string`, optional)
  — prefix to search for

## Compatibility

This projects is compatible with maintained versions of Node.js.

When we cut a new major release,
we drop support for unmaintained versions of Node.
This means we try to keep the current release line,
`load-plugin@6`,
compatible with Node.js 16.

## Security

This package reads the file system and imports things into Node.js.

## Contribute

Yes please!
See [How to Contribute to Open Source][open-source-guide-contribute].

## License

[MIT][file-license] © [Titus Wormer][wooorm]

<!-- Definitions -->

[api-load-plugin]: #loadpluginname-options

[api-load-options]: #loadoptions

[api-resolve-plugin]: #resolvepluginname-options

[api-resolve-options]: #resolveoptions

[badge-build-image]: https://github.com/wooorm/load-plugin/workflows/main/badge.svg

[badge-build-url]: https://github.com/wooorm/load-plugin/actions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/wooorm/load-plugin.svg

[badge-coverage-url]: https://codecov.io/github/wooorm/load-plugin

[badge-downloads-image]: https://img.shields.io/npm/dm/load-plugin.svg

[badge-downloads-url]: https://www.npmjs.com/package/load-plugin

[file-license]: license

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-import-meta-resolve]: https://github.com/wooorm/import-meta-resolve

[github-nvm]: https://github.com/nvm-sh/nvm

[nodejs-resolution-algo]: https://nodejs.org/api/esm.html#esm_resolution_algorithm

[npm-install]: https://docs.npmjs.com/cli/install

[npm-node-modules]: https://docs.npmjs.com/cli/v10/configuring-npm/folders#node-modules

[npm-prefix]: https://docs.npmjs.com/cli/v10/using-npm/config

[open-source-guide-contribute]: https://opensource.guide/how-to-contribute/

[typescript]: https://www.typescriptlang.org

[wooorm]: https://wooorm.com
