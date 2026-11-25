# unist-util-visit-parents

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[unist][] utility to walk the tree with a stack of parents.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`visitParents(tree[, test], enter|visitors[, reverse])`](#visitparentstree-test-entervisitors-reverse)
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
* [Types](#types)
* [Compatibility](#compatibility)
* [Related](#related)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This is a very important utility for working with unist as it lets you walk the
tree.

## When should I use this?

You can use this utility when you want to walk the tree and want to know about
every parent of each node.
You can use [`unist-util-visit`][unist-util-visit] if you don’t care about the
entire stack of parents.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install unist-util-visit-parents
```

In Deno with [`esm.sh`][esmsh]:

```js
import {visitParents} from 'https://esm.sh/unist-util-visit-parents@6'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {visitParents} from 'https://esm.sh/unist-util-visit-parents@6?bundle'
</script>
```

## Use

```js
import {visitParents} from 'unist-util-visit-parents'
import {fromMarkdown} from 'mdast-util-from-markdown'

const tree = fromMarkdown('Some *emphasis*, **strong**, and `code`.')

visitParents(tree, 'strong', function (node, ancestors) {
  console.log(node.type, ancestors.map(ancestor => ancestor.type))
})
```

Yields:

```js
strong ['root', 'paragraph']
```

## API

This package exports the identifiers [`CONTINUE`][api-continue],
[`EXIT`][api-exit], [`SKIP`][api-skip], and [`visitParents`][api-visitparents].
There is no default export.

### `visitParents(tree[, test], enter|visitors[, reverse])`

Visit nodes, with ancestral information.

This algorithm performs *[depth-first][]* *[tree traversal][tree-traversal]*
in *[preorder][]* (**NLR**) or if `reverse` is given,
in *reverse preorder* (**NRL**).
An [`exit`][api-visitors] visitor is called in *[postorder][]* (**LRN**)
or if `reverse` is given, in *reverse postorder* (**RLN**).

You can choose which nodes are visited by passing a `test`.
For complex tests, you should test yourself in a visitor, as it will be
faster and will have improved type information.

Walking the tree is an intensive task.
Make use of the return values of the visitor when possible.
Instead of walking a tree multiple times, walk it once, use
[`unist-util-is`][unist-util-is] to check if a node matches, and then perform
different operations.

You can change the tree.
Changes inside a node made when entering it are walked,
changes made when exiting it are not.
See [`Visitor`][api-visitor] and [`VisitorExit`][api-visitorexit] for more
info.

###### Signatures

* `visitParents(tree[, test], enter[, reverse])`
* `visitParents(tree[, test], visitors[, reverse])`

###### Parameters

* `tree` ([`Node`][node])
  — tree to traverse
* `test` ([`Test`][api-test], optional)
  — [`unist-util-is`][unist-util-is]-compatible test
* `enter` ([`Visitor`][api-visitor])
  — handle each node when entering it
* `visitors` ([`Visitors`][api-visitors])
  — handle each node when exiting it,
  and optionally when entering it
* `reverse` (`boolean`, default: `false`)
  — walk children from last to first;
  for `enter`, reverse preorder (NRL) instead of preorder (NLR);
  for `exit`, reverse postorder (RLN) instead of postorder (LRN)

###### Returns

Nothing (`undefined`).

### `CONTINUE`

Continue traversing as normal (`true`).

### `EXIT`

Stop traversing immediately (`false`).

### `SKIP`

Do not traverse this node’s children (`'skip'`).
Only works when entering a node.

### `Action`

Union of the action types (TypeScript type).

###### Type

```ts
type Action = typeof CONTINUE | typeof EXIT | typeof SKIP
```

### `ActionTuple`

List with one or two values, the first an action, the second an index
(TypeScript type).

###### Type

```ts
type ActionTuple = [
  (Action | null | undefined | void)?,
  (Index | null | undefined)?
]
```

### `BuildVisitor`

Build a typed `Visitor` function from a tree and a test (TypeScript type).

It will infer which values are passed as `node` and which as `parents`.

###### Type parameters

* `Tree` ([`Node`][node], default: `Node`)
  — tree type
* `Check` ([`Test`][api-test], default: `Test`)
  — test type

###### Returns

[`Visitor`][api-visitor].

### `BuildVisitors`

Build typed [`Visitors`][api-visitors] from a tree and a test (TypeScript
type).

It will infer which values are passed as `node` and which as `parents`.

###### Type parameters

* `Tree` ([`Node`][node], default: `Node`)
  — tree type
* `Check` ([`Test`][api-test], default: `Test`)
  — test type

###### Returns

[`Visitors`][api-visitors].

### `Index`

Move to the sibling at `index` next (after node itself is completely
traversed) (TypeScript type).

Useful if mutating the tree, such as removing the node the visitor is currently
on, or any of its previous siblings.
Results less than `0` or greater than or equal to `children.length` stop
traversing the parent.

###### Type

```ts
type Index = number
```

### `Test`

[`unist-util-is`][unist-util-is] compatible test (TypeScript type).

### `Visitor`

Handle a node (matching `test`, if given) before its children (TypeScript
type).

Changes inside `node` are walked next.
Replacing or removing it is easier in `exit`.
When replacing or removing it here,
return `SKIP` (as otherwise its old children are walked),
or `[SKIP, index]` to continue with the node now at `index`.
Changing next siblings (in walk order) is fine;
changing previous siblings needs a new `Index`.
Removing an ancestor or changing its previous siblings is not supported.

###### Parameters

* `node` ([`Node`][node])
  — found node
* `parents` ([`Array<Node>`][node])
  — ancestors of `node`
* `index` (`number` or `undefined`)
  — index of `node` in its parent (the last of `parents`),
  or `undefined` for the tree itself

###### Returns

What to do next ([`VisitorResult`][api-visitorresult]).

Passing a tuple back ([`ActionTuple`][api-actiontuple]) only makes sense as
`[SKIP, Index]`.

### `VisitorExit`

Handle a node (matching `test`, if given) after its children (TypeScript type).

Changes inside `node` are not walked,
which makes this a good place to change `node` based on its children,
or to replace or remove it.
When removing `node` or changing previous siblings (in walk order),
return a new `Index`.
Removing an ancestor or changing its previous siblings is not supported.

###### Parameters

* `node` ([`Node`][node])
  — found node
* `parents` ([`Array<Node>`][node])
  — ancestors of `node`
* `index` (`number` or `undefined`)
  — index of `node` in its parent (the last of `parents`),
  or `undefined` for the tree itself

###### Returns

What to do next ([`VisitorResultExit`][api-visitorresultexit]).

`CONTINUE` (`true`, nothing) continues as normal,
`EXIT` (`false`) stops traversing,
and `Index` continues at that sibling.

### `VisitorResult`

Any value that can be returned from an enter visitor (TypeScript type).

Like [`VisitorResultExit`][api-visitorresultexit] but `SKIP` can be returned to
not walk children of the node,
and [`ActionTuple`][api-actiontuple] can be used to combine an action with an
index.

###### Type

```ts
type VisitorResult =
  | Action
  | ActionTuple
  | Index
  | null
  | undefined
  | void
```

### `VisitorResultExit`

Any value that can be returned from an exit visitor (TypeScript type).

###### Type

```ts
type VisitorResultExit = Index | boolean | null | undefined | void
```

### `Visitors`

Handle nodes when entering and exiting them (TypeScript type).
The `enter` visitor is optional while `exit` is required.

Pass an `enter` visitor directly to only handle nodes when entering them.

`enter` is called before children (if any) are walked and `exit` after that.
`exit` is still called when `enter` returns `SKIP`.
Both `enter` and `exit` are only called for nodes that match an optional `test`.

###### Fields

* `enter` ([`Visitor`][api-visitor], optional)
  — handle a node before its children
* `exit` ([`VisitorExit`][api-visitorexit])
  — handle a node after its children

## Types

This package is fully typed with [TypeScript][].
It exports the additional types [`Action`][api-action],
[`ActionTuple`][api-actiontuple],
[`BuildVisitor`][api-buildvisitor],
[`BuildVisitors`][api-buildvisitors],
[`Index`][api-index],
[`Test`][api-test],
[`Visitor`][api-visitor],
[`VisitorExit`][api-visitorexit],
[`VisitorResult`][api-visitorresult],
[`VisitorResultExit`][api-visitorresultexit], and
[`Visitors`][api-visitors].

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`unist-util-visit-parents@^6`, compatible with Node.js 16.

## Related

* [`unist-util-visit`][unist-util-visit]
  — walk the tree with one parent
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

See [`contributing.md`][contributing] in [`syntax-tree/.github`][health] for
ways to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definition -->

[api-action]: #action

[api-actiontuple]: #actiontuple

[api-buildvisitor]: #buildvisitor

[api-buildvisitors]: #buildvisitors

[api-continue]: #continue

[api-exit]: #exit

[api-index]: #index

[api-skip]: #skip

[api-test]: #test

[api-visitor]: #visitor

[api-visitorexit]: #visitorexit

[api-visitorresult]: #visitorresult

[api-visitorresultexit]: #visitorresultexit

[api-visitors]: #visitors

[api-visitparents]: #visitparentstree-test-entervisitors-reverse

[author]: https://wooorm.com

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[build]: https://github.com/syntax-tree/unist-util-visit-parents/actions

[build-badge]: https://github.com/syntax-tree/unist-util-visit-parents/workflows/main/badge.svg

[chat]: https://github.com/syntax-tree/unist/discussions

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[coc]: https://github.com/syntax-tree/.github/blob/HEAD/code-of-conduct.md

[collective]: https://opencollective.com/unified

[contributing]: https://github.com/syntax-tree/.github/blob/HEAD/contributing.md

[coverage]: https://codecov.io/github/syntax-tree/unist-util-visit-parents

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/unist-util-visit-parents.svg

[depth-first]: https://github.com/syntax-tree/unist#depth-first-traversal

[downloads]: https://www.npmjs.com/package/unist-util-visit-parents

[downloads-badge]: https://img.shields.io/npm/dm/unist-util-visit-parents.svg

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[health]: https://github.com/syntax-tree/.github

[license]: license

[node]: https://github.com/syntax-tree/unist#node

[npm]: https://docs.npmjs.com/cli/install

[postorder]: https://github.com/syntax-tree/unist#postorder

[preorder]: https://github.com/syntax-tree/unist#preorder

[size]: https://bundlejs.com/?q=unist-util-visit-parents

[size-badge]: https://img.shields.io/badge/dynamic/json?label=minzipped%20size&query=$.size.compressedSize&url=https://deno.bundlejs.com/?q=unist-util-visit-parents

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[support]: https://github.com/syntax-tree/.github/blob/HEAD/support.md

[tree-traversal]: https://github.com/syntax-tree/unist#tree-traversal

[typescript]: https://www.typescriptlang.org

[unist]: https://github.com/syntax-tree/unist

[unist-util-is]: https://github.com/syntax-tree/unist-util-is

[unist-util-visit]: https://github.com/syntax-tree/unist-util-visit
