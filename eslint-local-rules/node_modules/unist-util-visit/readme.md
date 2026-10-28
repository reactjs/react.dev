# unist-util-visit

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]

[unist][github-unist] utility to walk the tree.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`visit(tree[, test], enter|visitors[, reverse])`](#visittree-test-entervisitors-reverse)
  * [`CONTINUE`](#continue)
  * [`EXIT`](#exit)
  * [`SKIP`](#skip)
  * [`Action`](#action)
  * [`ActionTuple`](#actiontuple)
  * [`BuildVisitor`](#buildvisitor)
  * [`BuildVisitors`](#buildvisitors)
  * [`Index`](#index)
  * [`Test`](#test)
  * [`Visitor`](#visitor)
  * [`VisitorExit`](#visitorexit)
  * [`VisitorResult`](#visitorresult)
  * [`VisitorResultExit`](#visitorresultexit)
  * [`Visitors`](#visitors)
* [Compatibility](#compatibility)
* [Related](#related)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This is a very important utility for working with unist as it lets you walk the
tree.

## When should I use this?

You can use this utility when you want to walk the tree.
You can use [`unist-util-visit-parents`][github-vp] if you care about the
entire stack of parents.

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npmjs-install]:

```sh
npm install unist-util-visit
```

In Deno with [`esm.sh`][esmsh]:

```js
import {CONTINUE, EXIT, SKIP, visit} from 'https://esm.sh/unist-util-visit@5'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {CONTINUE, EXIT, SKIP, visit} from 'https://esm.sh/unist-util-visit@5?bundle'
</script>
```

## Use

```js
import {fromMarkdown} from 'mdast-util-from-markdown'
import {visit} from 'unist-util-visit'

const tree = fromMarkdown('Some *emphasis*, **strong**, and `code`.')

visit(tree, 'text', function (node, index, parent) {
  console.log([node.value, parent ? parent.type : index])
})
```

Yields:

```js
[ 'Some ', 'paragraph' ]
[ 'emphasis', 'emphasis' ]
[ ', ', 'paragraph' ]
[ 'strong', 'strong' ]
[ ', and ', 'paragraph' ]
[ '.', 'paragraph' ]
```

## API

This package exports the identifiers
[`CONTINUE`][api-continue],
[`EXIT`][api-exit],
[`SKIP`][api-skip], and
[`visit`][api-visit].
It exports the [TypeScript][] types
[`ActionTuple`][api-action-tuple],
[`Action`][api-action],
[`BuildVisitor`][api-build-visitor],
[`BuildVisitors`][api-build-visitors],
[`Index`][api-index],
[`Test`][api-test],
[`VisitorExit`][api-visitor-exit],
[`VisitorResultExit`][api-visitor-result-exit],
[`VisitorResult`][api-visitor-result],
[`Visitors`][api-visitors], and
[`Visitor`][api-visitor].
There is no default export.

### `visit(tree[, test], enter|visitors[, reverse])`

This function works exactly the same as
[`unist-util-visit-parents`][github-vp],
but [`Visitor`][api-visitor] and [`VisitorExit`][api-visitor-exit] have a
different signature.

###### Signatures

* `visit(tree[, test], enter[, reverse])`
* `visit(tree[, test], visitors[, reverse])`

### `CONTINUE`

Continue traversing as normal (`true`).

### `EXIT`

Stop traversing immediately (`false`).

### `SKIP`

Do not traverse this node’s children (`'skip'`).

### `Action`

Union of the action types (TypeScript type).
See [`Action` in `unist-util-visit-parents`][github-vp-action].

### `ActionTuple`

List with an action and an index (TypeScript type).
See [`ActionTuple` in `unist-util-visit-parents`][github-vp-action-tuple].

### `BuildVisitor`

Build a typed `Visitor` function from a tree and a test (TypeScript type).
See [`BuildVisitor` in `unist-util-visit-parents`][github-vp-build-visitor].

### `BuildVisitors`

Build typed [`Visitors`][api-visitors] from a tree and a test (TypeScript
type).
See [`BuildVisitors` in `unist-util-visit-parents`][github-vp-build-visitors].

### `Index`

Move to the sibling at `index` next (TypeScript type).
See [`Index` in `unist-util-visit-parents`][github-vp-index].

### `Test`

[`unist-util-is`][github-unist-util-is] compatible test
(TypeScript type).

### `Visitor`

Handle a node (matching `test`, if given) before its children (TypeScript
type).
Like [`Visitor` in `unist-util-visit-parents`][github-vp-visitor],
but with `index` and `parent` instead of `parents`.

###### Parameters

* `node` ([`Node`][github-unist-node])
  — found node
* `index` (`number` or `undefined`)
  — index of `node` in `parent`,
  or `undefined` for the tree itself
* `parent` ([`Node`][github-unist-node] or `undefined`)
  — parent of `node`,
  or `undefined` for the tree itself

###### Returns

What to do next ([`VisitorResult`][api-visitor-result]).

### `VisitorExit`

Handle a node (matching `test`, if given) after its children (TypeScript type).
Like [`VisitorExit` in `unist-util-visit-parents`][github-vp-visitor-exit],
but with `index` and `parent` instead of `parents`.

###### Parameters

* `node` ([`Node`][github-unist-node])
  — found node
* `index` (`number` or `undefined`)
  — index of `node` in `parent`,
  or `undefined` for the tree itself
* `parent` ([`Node`][github-unist-node] or `undefined`)
  — parent of `node`,
  or `undefined` for the tree itself

###### Returns

What to do next ([`VisitorResultExit`][api-visitor-result-exit]).

### `VisitorResult`

Any value that can be returned from a visitor (TypeScript type).
See [`VisitorResult` in
`unist-util-visit-parents`][github-vp-visitor-result].

### `VisitorResultExit`

Any value that can be returned from an exit visitor (TypeScript type).
See [`VisitorResultExit` in
`unist-util-visit-parents`][github-vp-visitor-result-exit].

### `Visitors`

Handle nodes when entering and exiting them (TypeScript type).
See [`Visitors` in `unist-util-visit-parents`][github-vp-visitors].

###### Fields

* `enter` ([`Visitor`][api-visitor], optional)
  — handle a node before its children
* `exit` ([`VisitorExit`][api-visitor-exit])
  — handle a node after its children

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `unist-util-visit@^5`,
compatible with Node.js 16.

## Related

* [`unist-util-visit-parents`][github-vp]
  — walk the tree with a stack of parents
* [`unist-util-filter`](https://github.com/syntax-tree/unist-util-filter)
  — create a new tree with all nodes that pass a test
* [`unist-util-map`](https://github.com/syntax-tree/unist-util-map)
  — create a new tree with all nodes mapped by a given function
* [`unist-util-flatmap`](https://gitlab.com/staltz/unist-util-flatmap)
  — create a new tree by mapping (to an array) with the given function
* [`unist-util-remove`](https://github.com/syntax-tree/unist-util-remove)
  — remove nodes from a tree that pass a test
* [`unist-util-select`](https://github.com/syntax-tree/unist-util-select)
  — select nodes with CSS-like selectors

## Contribute

See [`contributing.md`][health-contributing] in [`syntax-tree/.github`][health]
for ways to get started.
See [`support.md`][health-support] for ways to get help.

This project has a [code of conduct][health-coc].
By interacting with this repository,
organization,
or community you agree to abide by its terms.

## License

[MIT][file-license] © [Titus Wormer][wooorm]

<!-- Definition -->

[api-action]: #action

[api-action-tuple]: #actiontuple

[api-build-visitor]: #buildvisitor

[api-build-visitors]: #buildvisitors

[api-continue]: #continue

[api-exit]: #exit

[api-index]: #index

[api-skip]: #skip

[api-test]: #test

[api-visit]: #visittree-test-entervisitors-reverse

[api-visitor]: #visitor

[api-visitor-exit]: #visitorexit

[api-visitor-result]: #visitorresult

[api-visitor-result-exit]: #visitorresultexit

[api-visitors]: #visitors

[badge-build-image]: https://github.com/syntax-tree/unist-util-visit/workflows/main/badge.svg

[badge-build-url]: https://github.com/syntax-tree/unist-util-visit/actions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/syntax-tree/unist-util-visit.svg

[badge-coverage-url]: https://codecov.io/github/syntax-tree/unist-util-visit

[badge-downloads-image]: https://img.shields.io/npm/dm/unist-util-visit.svg

[badge-downloads-url]: https://www.npmjs.com/package/unist-util-visit

[badge-size-image]: https://img.shields.io/bundlejs/size/unist-util-visit

[badge-size-url]: https://bundlejs.com/?q=unist-util-visit

[esmsh]: https://esm.sh

[file-license]: license

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-unist]: https://github.com/syntax-tree/unist

[github-unist-node]: https://github.com/syntax-tree/unist#nodes

[github-unist-util-is]: https://github.com/syntax-tree/unist-util-is

[github-vp]: https://github.com/syntax-tree/unist-util-visit-parents

[github-vp-action]: https://github.com/syntax-tree/unist-util-visit-parents#action

[github-vp-action-tuple]: https://github.com/syntax-tree/unist-util-visit-parents#actiontuple

[github-vp-build-visitor]: https://github.com/syntax-tree/unist-util-visit-parents#buildvisitor

[github-vp-build-visitors]: https://github.com/syntax-tree/unist-util-visit-parents#buildvisitors

[github-vp-index]: https://github.com/syntax-tree/unist-util-visit-parents#index

[github-vp-visitor]: https://github.com/syntax-tree/unist-util-visit-parents#visitor

[github-vp-visitor-exit]: https://github.com/syntax-tree/unist-util-visit-parents#visitorexit

[github-vp-visitor-result]: https://github.com/syntax-tree/unist-util-visit-parents#visitorresult

[github-vp-visitor-result-exit]: https://github.com/syntax-tree/unist-util-visit-parents#visitorresultexit

[github-vp-visitors]: https://github.com/syntax-tree/unist-util-visit-parents#visitors

[health]: https://github.com/syntax-tree/.github

[health-coc]: https://github.com/syntax-tree/.github/blob/main/code-of-conduct.md

[health-contributing]: https://github.com/syntax-tree/.github/blob/main/contributing.md

[health-support]: https://github.com/syntax-tree/.github/blob/main/support.md

[npmjs-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org

[wooorm]: https://wooorm.com
