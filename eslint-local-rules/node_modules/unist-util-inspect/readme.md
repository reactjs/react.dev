# unist-util-inspect

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[unist][] utility to inspect trees.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`inspect(tree[, options])`](#inspecttree-options)
  * [`inspectColor(tree[, options])`](#inspectcolortree-options)
  * [`inspectNoColor(tree[, options])`](#inspectnocolortree-options)
  * [`Options`](#options)
* [Types](#types)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This is a utility pretty prints the tree.

## When should I use this?

This utility pretty prints the tree in a format that is made custom for unist
trees, which is terser than the often verbose and repetitive JSON,
to more easily spot bugs and see what’s going on in the tree.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install unist-util-inspect
```

In Deno with [`esm.sh`][esmsh]:

```js
import {inspect} from 'https://esm.sh/unist-util-inspect@8'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {inspect} from 'https://esm.sh/unist-util-inspect@8?bundle'
</script>
```

## Use

```js
import {u} from 'unist-builder'
import {inspect} from 'unist-util-inspect'

const tree = u('root', [
  u('literal', '1'),
  u('parent', [
    u('void', {id: 'a'}),
    u('literal', '2'),
    u('node', {id: 'b'}, [])
  ])
])

console.log(inspect(tree))
```

Yields:

```text
root[2]
├─0 literal "1"
└─1 parent[3]
    ├─0 void
    │     id: "a"
    ├─1 literal "2"
    └─2 node[0]
          id: "b"
```

## API

This package exports the identifiers [`inspect`][api-inspect],
[`inspectColor`][api-inspectcolor], and [`inspectNoColor`][api-inspectnocolor].
There is no default export.

### `inspect(tree[, options])`

Inspect a tree, with color in Node, without color in browsers.

###### Parameters

* `tree` ([`Node`][node])
  — tree to inspect
* `options` ([`Options`][api-options], optional)
  — configuration

###### Returns

Pretty printed `tree` (`string`).

### `inspectColor(tree[, options])`

> 🪦 **Deprecated**: use `color` option of `inspect`.

Inspect a tree, with color.
Otherwise same as [`inspect`][api-inspect].

### `inspectNoColor(tree[, options])`

> 🪦 **Deprecated**: use `color` option of `inspect`.

Inspect a tree, without color.
Otherwise same as [`inspect`][api-inspect].

### `Options`

Configuration (TypeScript type).

###### Fields

* `color` (`boolean`, default: `true` in Node, `false` otherwise)
  — whether to use ANSI colors
* `showPositions` (`boolean`, default: `true`)
  — whether to include positional information

## Types

This package is fully typed with [TypeScript][].
It exports the additional type [`Options`][api-options].

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `unist-util-inspect@^8`,
compatible with Node.js 16.

## Contribute

See [`contributing.md`][contributing] in [`syntax-tree/.github`][health] for
ways to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definition -->

[build-badge]: https://github.com/syntax-tree/unist-util-inspect/workflows/main/badge.svg

[build]: https://github.com/syntax-tree/unist-util-inspect/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/unist-util-inspect.svg

[coverage]: https://codecov.io/github/syntax-tree/unist-util-inspect

[downloads-badge]: https://img.shields.io/npm/dm/unist-util-inspect.svg

[downloads]: https://www.npmjs.com/package/unist-util-inspect

[size-badge]: https://img.shields.io/badge/dynamic/json?label=minzipped%20size&query=$.size.compressedSize&url=https://deno.bundlejs.com/?q=unist-util-inspect

[size]: https://bundlejs.com/?q=unist-util-inspect

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/syntax-tree/unist/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[license]: license

[author]: https://wooorm.com

[health]: https://github.com/syntax-tree/.github

[contributing]: https://github.com/syntax-tree/.github/blob/main/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/main/support.md

[coc]: https://github.com/syntax-tree/.github/blob/main/code-of-conduct.md

[unist]: https://github.com/syntax-tree/unist

[node]: https://github.com/syntax-tree/unist#node

[api-inspect]: #inspecttree-options

[api-inspectcolor]: #inspectcolortree-options

[api-inspectnocolor]: #inspectnocolortree-options

[api-options]: #options
