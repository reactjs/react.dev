# mdast-util-to-markdown

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[mdast][github-mdast]** utility that turns a syntax tree into markdown.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`toMarkdown(tree[, options])`](#tomarkdowntree-options)
  * [`defaultHandlers`](#defaulthandlers)
  * [`Attention`](#attention)
  * [`AttentionInfo`](#attentioninfo)
  * [`ConstructName`](#constructname)
  * [`ConstructNameMap`](#constructnamemap)
  * [`Handle`](#handle)
  * [`Handlers`](#handlers)
  * [`Info`](#info)
  * [`Join`](#join)
  * [`Map`](#map)
  * [`Options`](#options)
  * [`SafeConfig`](#safeconfig)
  * [`State`](#state)
  * [`Tracker`](#tracker)
  * [`Unsafe`](#unsafe)
* [List of extensions](#list-of-extensions)
* [Syntax](#syntax)
* [Syntax tree](#syntax-tree)
* [Types](#types)
* [Compatibility](#compatibility)
* [Security](#security)
* [Related](#related)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is a utility that takes an [mdast][github-mdast]
syntax tree as input and turns it into serialized markdown.

This utility is a low level project.
It’s used in [`remark-stringify`][github-remark-stringify],
which focusses on making it easier to transform content by abstracting
these internals away.

## When should I use this?

If you want to handle syntax trees manually, use this.
For an easier time processing content, use the **[remark][github-remark]**
ecosystem instead.

You can combine this utility with other utilities to add syntax extensions.
Notable examples that deeply integrate with it are
[`mdast-util-gfm`][github-mdast-util-gfm],
[`mdast-util-mdx`][github-mdast-util-mdx],
[`mdast-util-frontmatter`][github-mdast-util-frontmatter],
[`mdast-util-math`][github-mdast-util-math], and
[`mdast-util-directive`][github-mdast-util-directive].

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install mdast-util-to-markdown
```

In Deno with [`esm.sh`][esmsh]:

```js
import {toMarkdown} from 'https://esm.sh/mdast-util-to-markdown@2'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {toMarkdown} from 'https://esm.sh/mdast-util-to-markdown@2?bundle'
</script>
```

## Use

Say our module `example.js` looks as follows:

```js
/**
 * @import {Root} from 'mdast'
 */

import {toMarkdown} from 'mdast-util-to-markdown'

/** @type {Root} */
const tree = {
  type: 'root',
  children: [
    {
      type: 'blockquote',
      children: [
        {type: 'thematicBreak'},
        {
          type: 'paragraph',
          children: [
            {type: 'text', value: '- a\nb !'},
            {
              type: 'link',
              url: 'example.com',
              children: [{type: 'text', value: 'd'}]
            }
          ]
        }
      ]
    }
  ]
}

console.log(toMarkdown(tree))
```

…now running `node example.js` yields:

```markdown
> ***
>
> \- a
> b \![d](example.com)
```

> 👉 **Note**: observe the properly escaped characters which would otherwise
> turn into a list and image respectively.

## API

This package exports the identifiers [`defaultHandlers`][api-default-handlers]
and [`toMarkdown`][api-to-markdown].
There is no default export.

### `toMarkdown(tree[, options])`

Turn an **[mdast][github-mdast]** syntax tree into markdown.

###### Parameters

* `tree` ([`Node`][github-mdast-nodes])
  — tree to serialize
* `options` ([`Options`][api-options], optional)
  — configuration

###### Returns

Serialized markdown representing `tree` (`string`).

### `defaultHandlers`

Default (CommonMark) handlers ([`Handlers`][api-handlers]).

### `Attention`

Serialize a node as attention (emphasis, strong, strikethrough) (TypeScript
type).

Set as the `attention` field of a [`Handle`][api-handle]
(`handle.attention = x`).
This switches to a different algorithm,
where attention is properly handled by `containerPhrasing`.

###### Parameters

* `node` (`any`)
  — expected mdast node
* `state` ([`State`][api-state])
  — info passed around about the current state

###### Returns

Info on how to serialize `node` ([`AttentionInfo`][api-attention-info]).

### `AttentionInfo`

Info on how to serialize attention (TypeScript type).

###### Fields

* `construct` ([`ConstructName`][api-construct-name])
  — construct to enter (such as `'emphasis'`)
* `markers` (`Array<string>`)
  — markers that can be used in order of preference (such as `['*', '_']`);
  one or more strings, each just one ASCII punctuation character
* `sizes` (`Array<number>`)
  — sizes of sequences that can be used in order of preference (such as `[2]`
  for strong or `[2, 1]` for GFM strikethrough);
  one or more numbers, each a positive integer

### `ConstructName`

Construct names for things generated by `mdast-util-to-markdown` (TypeScript
type).

This is an enum of strings, each being a semantic label, useful to know when
serializing whether we’re for example in a double (`"`) or single (`'`) quoted
title.

###### Type

```ts
type ConstructName = ConstructNameMap[keyof ConstructNameMap]
```

### `ConstructNameMap`

Interface of registered constructs (TypeScript type).

###### Type

```ts
interface ConstructNameMap { /* see code */ }
```

When working on extensions that use new constructs, extend the corresponding
interface to register its name:

```ts
declare module 'mdast-util-to-markdown' {
  interface ConstructNameMap {
    // Register a new construct name (value is used, key should match it).
    gfmStrikethrough: 'gfmStrikethrough'
  }
}
```

### `Handle`

Handle a particular node (TypeScript type).

###### Parameters

* `node` (`any`)
  — expected mdast node
* `parent` ([`Node`][github-mdast-nodes], optional)
  — parent of `node`
* `state` ([`State`][api-state])
  — info passed around about the current state
* `info` ([`Info`][api-info])
  — info on the surrounding of the node that is serialized

###### Returns

Serialized markdown representing `node` (`string`).

### `Handlers`

Handle particular nodes (TypeScript type).

Each key is a node type (`Node['type']`), each value its corresponding handler
([`Handle`][api-handle]).

###### Type

```ts
type Handlers = Record<Node['type'], Handle>
```

### `Info`

Info on the surrounding of the node that is serialized (TypeScript type).

###### Fields

* `now` ([`Point`][github-unist-point])
  — current point
* `lineShift` (`number`)
  — number of columns each line will be shifted by wrapping nodes
* `before` (`string`)
  — characters before this (guaranteed to be one, can be more)
* `after` (`string`)
  — characters after this (guaranteed to be one, can be more)

### `Join`

How to join two blocks (TypeScript type).

“Blocks” are typically joined by one blank line.
Sometimes it’s nicer to have them flush next to each other, yet other times
they cannot occur together at all.

Join functions receive two adjacent siblings and their parent and what they
return defines how many blank lines to use between them.

###### Parameters

* `left` ([`Node`][github-mdast-nodes])
  — first of two adjacent siblings
* `right` ([`Node`][github-mdast-nodes])
  — second of two adjacent siblings
* `parent` ([`Node`][github-mdast-nodes])
  — parent of the two siblings
* `state` ([`State`][api-state])
  — info passed around about the current state

###### Returns

How many blank lines to use between the siblings (`boolean`, `number`,
optional).

Where `true` is as passing `1` and `false` means the nodes cannot be
joined by a blank line, such as two adjacent block quotes or indented code
after a list, in which case a comment will be injected to break them up:

```markdown
> Quote 1

<!---->

> Quote 2
```

> 👉 **Note**: abusing this feature will break markdown.
> One such example is when returning `0` for two paragraphs, which will result
> in the text running together, and in the future to be seen as one paragraph.

### `Map`

Map function to pad a single line (TypeScript type).

###### Parameters

* `value` (`string`)
  — a single line of serialized markdown
* `line` (`number`)
  — line number relative to the fragment
* `blank` (`boolean`)
  — whether the line is considered blank in markdown

###### Returns

Padded line (`string`).

### `Options`

Configuration (TypeScript type).

##### Fields

The following fields influence how markdown is serialized.

###### `options.bullet`

Marker to use for bullets of items in unordered lists (`'*'`, `'+'`, or `'-'`,
default: `'*'`).

There are three cases where the primary bullet cannot be used:

* when three or more list items are on their own, the last one is empty, and
  `bullet` is also a valid `rule`: `* - +`; this would turn into a thematic
  break if serialized with three primary bullets; `bulletOther` is used for
  the last item
* when a thematic break is the first child of a list item and `bullet` is the
  same character as `rule`: `- ***`; this would turn into a single thematic
  break if serialized with primary bullets; `bulletOther` is used for the
  item
* when two unordered lists appear next to each other: `* a\n- b`;
  `bulletOther` is used for such lists

###### `options.bulletOther`

Marker to use in certain cases where the primary bullet doesn’t work (`'*'`,
`'+'`, or `'-'`, default: `'-'` when `bullet` is `'*'`, `'*'` otherwise).

Cannot be equal to `bullet`.

###### `options.bulletOrdered`

Marker to use for bullets of items in ordered lists (`'.'` or `')'`, default:
`'.'`).

There is one case where the primary bullet for ordered items cannot be used:

* when two ordered lists appear next to each other: `1. a\n2) b`; to solve
  that, `'.'` will be used when `bulletOrdered` is `')'`, and `'.'` otherwise

###### `options.closeAtx`

Whether to add the same number of number signs (`#`) at the end of an ATX
heading as the opening sequence (`boolean`, default: `false`).

###### `options.emphasis`

Preferred marker to use for emphasis (`'*'` or `'_'`, default: `'*'`).

The other marker is sometimes used, to form for example emphasis next to or
inside of other emphasis (`*a*_b_`).

###### `options.fence`

Marker to use for fenced code (``'`'`` or `'~'`, default: ``'`'``).

###### `options.fences`

Whether to use fenced code always (`boolean`, default: `true`).
The default is to use fenced code if there is a language defined, if the code is
empty, or if it starts or ends in blank lines.

###### `options.incrementListMarker`

Whether to increment the counter of ordered lists items (`boolean`, default:
`true`).

###### `options.listItemIndent`

How to indent the content of list items (`'mixed'`, `'one'`, or `'tab'`,
default: `'one'`).
Either with the size of the bullet plus one space (when `'one'`), a tab stop
(`'tab'`), or depending on the item and its parent list (`'mixed'`, uses `'one'`
if the item and list are tight and `'tab'` otherwise).

###### `options.quote`

Marker to use for titles (`'"'` or `"'"`, default: `'"'`).

###### `options.resourceLink`

Whether to always use resource links (`boolean`, default: `false`).
The default is to use autolinks (`<https://example.com>`) when possible
and resource links (`[text](url)`) otherwise.

###### `options.rule`

Marker to use for thematic breaks (`'*'`, `'-'`, or `'_'`, default: `'*'`).

###### `options.ruleRepetition`

Number of markers to use for thematic breaks (`number`, default: `3`, min: `3`).

###### `options.ruleSpaces`

Whether to add spaces between markers in thematic breaks (`boolean`, default:
`false`).

###### `options.setext`

Whether to use setext headings when possible (`boolean`, default: `false`).
The default is to always use ATX headings (`# heading`) instead of setext
headings (`heading\n=======`).
Setext headings cannot be used for empty headings or headings with a rank of
three or more.

###### `options.strong`

Preferred marker to use for strong (`'*'` or `'_'`, default: `'*'`).

The other marker is sometimes used, to form for example strong next to or
inside of other strong (`**a**__b__`).

###### `options.tightDefinitions`

Whether to join definitions without a blank line (`boolean`, default: `false`).

The default is to add blank lines between any flow (“block”) construct.
Turning this option on is a shortcut for a [`Join`][api-join] function like so:

```js
function joinTightDefinitions(left, right) {
  if (left.type === 'definition' && right.type === 'definition') {
    return 0
  }
}
```

###### `options.handlers`

Handle particular nodes ([`Handlers`][api-handlers], optional).

###### `options.join`

How to join blocks ([`Array<Join>`][api-join], optional).

###### `options.unsafe`

Schemas that define when characters cannot occur
([`Array<Unsafe>`][api-unsafe], optional).

###### `options.extensions`

List of extensions (`Array<Options>`, default: `[]`).
Each extension is an object with the same interface as `Options` itself.

### `SafeConfig`

Configuration passed to `state.safe` (TypeScript type).

###### Fields

* `before` (`string`)
  — characters before this (guaranteed to be one, can be more)
* `beforeNode` ([`Node`][github-mdast-nodes], optional)
  — node directly before the value
* `after` (`string`)
  — characters after this (guaranteed to be one, can be more)
* `afterNode` ([`Node`][github-mdast-nodes], optional)
  — node directly after the value
* `encode` (`Array<string>`, optional)
  — extra characters that *must* be encoded (as character references) instead
  of escaped (character escapes).
  Only ASCII punctuation will use character escapes, so you never need to
  pass non-ASCII-punctuation here

### `State`

Info passed around about the current state (TypeScript type).

###### Fields

* `stack` ([`Array<ConstructName>`][api-construct-name])
  — stack of constructs we’re in
* `indexStack` (`Array<number>`)
  — positions of child nodes in their parents
* `associationId` (`(node: Association) => string`)
  — get an identifier from an association to match it to others (see
  [`Association`][github-mdast-association])
* `enter` (`(construct: ConstructName) => () => undefined`)
  — enter a construct (returns a corresponding exit function)
  (see [`ConstructName`][api-construct-name])
* `indentLines` (`(value: string, map: Map) => string`)
  — pad serialized markdown (see [`Map`][api-map])
* `compilePattern` (`(pattern: Unsafe) => RegExp`)
  — compile an unsafe pattern to a regex (see [`Unsafe`][api-unsafe])
* `containerFlow` (`(parent: Node, info: Info) => string`)
  — serialize flow children (see [`Info`][api-info])
* `containerPhrasing` (`(parent: Node, info: Info) => string`)
  — serialize phrasing children (see [`Info`][api-info])
* `createTracker` (`(info: Info) => Tracker`)
  — track positional info in the output (see [`Info`][api-info],
  [`Tracker`][api-tracker])
* `safe` (`(value: string, config: SafeConfig) => string`)
  — make a string safe for embedding (see [`SafeConfig`][api-safe-config])
* `options` ([`Options`][api-options])
  — applied user configuration
* `unsafe` ([`Array<Unsafe>`][api-unsafe])
  — applied unsafe patterns
* `join` ([`Array<Join>`][api-join])
  — applied join handlers
* `handle` ([`Handle`][api-handle])
  — call the configured handler for the given node
* `handlers` ([`Handlers`][api-handlers])
  — applied handlers
* `bulletCurrent` (`string` or `undefined`)
  — list marker currently in use
* `bulletLastUsed` (`string` or `undefined`)
  — list marker previously in use

### `Tracker`

Track positional info in the output (TypeScript type).

This info isn’t used yet but such functionality will allow line wrapping,
source maps, etc.

###### Fields

* `current` (`() => Info`)
  — get current tracked info
* `shift` (`(value: number) => undefined`)
  — define a relative increased line shift (the typical indent for lines)
* `move` (`(value: string) => string`)
  — move past some generated markdown

### `Unsafe`

Schema that defines when a character cannot occur (TypeScript type).

###### Fields

* `afterNode` (`Array<string>`, optional)
  — `character` is bad when these nodes are after it
* `after` (`string`, optional)
  — `character` is bad when this is after it
* `atBreak` (`boolean`, optional)
  — `character` is bad at a break (potentially w/ `before` between)
* `beforeNode` (`Array<string>`, optional)
  — `character` is bad when these nodes are before it
* `before` (`string`, optional)
  — `character` is bad when this is before it
* `character` (`string`)
  — single unsafe character
* `inConstruct` ([`Array<ConstructName>`][api-construct-name],
  `ConstructName`, optional)
  — constructs where this is bad
* `notInConstruct` ([`Array<ConstructName>`][api-construct-name],
  `ConstructName`, optional)
  — constructs where this is fine again
* `unicode` (`boolean`, default: `false`)
  — compile the regex with `u`

## List of extensions

* [`syntax-tree/mdast-util-directive`][github-mdast-util-directive]
  — directives
* [`syntax-tree/mdast-util-frontmatter`][github-mdast-util-frontmatter]
  — frontmatter (YAML, TOML, more)
* [`syntax-tree/mdast-util-gfm`][github-mdast-util-gfm]
  — GFM
* [`syntax-tree/mdast-util-gfm-autolink-literal`](https://github.com/syntax-tree/mdast-util-gfm-autolink-literal)
  — GFM autolink literals
* [`syntax-tree/mdast-util-gfm-footnote`](https://github.com/syntax-tree/mdast-util-gfm-footnote)
  — GFM footnotes
* [`syntax-tree/mdast-util-gfm-strikethrough`](https://github.com/syntax-tree/mdast-util-gfm-strikethrough)
  — GFM strikethrough
* [`syntax-tree/mdast-util-gfm-table`](https://github.com/syntax-tree/mdast-util-gfm-table)
  — GFM tables
* [`syntax-tree/mdast-util-gfm-task-list-item`](https://github.com/syntax-tree/mdast-util-gfm-task-list-item)
  — GFM task list items
* [`syntax-tree/mdast-util-math`][github-mdast-util-math]
  — math
* [`syntax-tree/mdast-util-mdx`][github-mdast-util-mdx]
  — MDX
* [`syntax-tree/mdast-util-mdx-expression`](https://github.com/syntax-tree/mdast-util-mdx-expression)
  — MDX expressions
* [`syntax-tree/mdast-util-mdx-jsx`](https://github.com/syntax-tree/mdast-util-mdx-jsx)
  — MDX JSX
* [`syntax-tree/mdast-util-mdxjs-esm`](https://github.com/syntax-tree/mdast-util-mdxjs-esm)
  — MDX ESM

## Syntax

Markdown is serialized according to CommonMark but care is taken to format in
such a way that the resulting markdown should work with most markdown parsers.
Extensions can add support for custom syntax.

## Syntax tree

The syntax tree is [mdast][github-mdast].

## Types

This package is fully typed with [TypeScript][].
It exports the additional types
[`Attention`][api-attention],
[`AttentionInfo`][api-attention-info],
[`ConstructName`][api-construct-name],
[`ConstructNameMap`][api-construct-name-map],
[`Handle`][api-handle],
[`Handlers`][api-handlers],
[`Info`][api-info],
[`Join`][api-join],
[`Map`][api-map],
[`Options`][api-options],
[`SafeConfig`][api-safe-config],
[`State`][api-State], and
[`Unsafe`][api-Unsafe].

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `mdast-util-to-markdown@^2`,
compatible with Node.js 16.

## Security

`mdast-util-to-markdown` will do its best to serialize markdown to match the
syntax tree, but there are several cases where that is impossible.
It’ll do its best, but complete roundtripping is impossible given that any value
could be injected into the tree.

As markdown is sometimes used for HTML, and improper use of HTML can open you up
to a [cross-site scripting (XSS)][wikipedia-xss] attack,
use of `mdast-util-to-markdown`
and parsing it again later could potentially be unsafe.
When parsing markdown afterwards and then going to HTML, use something like
[`hast-util-sanitize`][github-hast-util-sanitize] to make the tree safe.

## Related

* [`syntax-tree/mdast-util-from-markdown`](https://github.com/syntax-tree/mdast-util-from-markdown)
  — parse markdown to mdast
* [`micromark/micromark`](https://github.com/micromark/micromark)
  — parse markdown
* [`remarkjs/remark`][github-remark]
  — process markdown

## Contribute

See [`contributing.md`][health-contributing] in
[`syntax-tree/.github`][health] for
ways to get started.
See [`support.md`][health-support] for ways to get help.

This project has a [code of conduct][health-coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][wooorm]

<!-- Definitions -->

[api-attention]: #attention

[api-attention-info]: #attentioninfo

[api-construct-name]: #constructname

[api-construct-name-map]: #constructnamemap

[api-default-handlers]: #defaulthandlers

[api-handle]: #handle

[api-handlers]: #handlers

[api-info]: #info

[api-join]: #join

[api-map]: #map

[api-options]: #options

[api-safe-config]: #safeconfig

[api-state]: #state

[api-to-markdown]: #tomarkdowntree-options

[api-tracker]: #tracker

[api-unsafe]: #unsafe

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[build]: https://github.com/syntax-tree/mdast-util-to-markdown/actions

[build-badge]: https://github.com/syntax-tree/mdast-util-to-markdown/workflows/main/badge.svg

[chat]: https://github.com/syntax-tree/unist/discussions

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[collective]: https://opencollective.com/unified

[coverage]: https://codecov.io/github/syntax-tree/mdast-util-to-markdown

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/mdast-util-to-markdown.svg

[downloads]: https://www.npmjs.com/package/mdast-util-to-markdown

[downloads-badge]: https://img.shields.io/npm/dm/mdast-util-to-markdown.svg

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[github-hast-util-sanitize]: https://github.com/syntax-tree/hast-util-sanitize

[github-mdast]: https://github.com/syntax-tree/mdast

[github-mdast-association]: https://github.com/syntax-tree/mdast#association

[github-mdast-nodes]: https://github.com/syntax-tree/mdast#nodes

[github-mdast-util-directive]: https://github.com/syntax-tree/mdast-util-directive

[github-mdast-util-frontmatter]: https://github.com/syntax-tree/mdast-util-frontmatter

[github-mdast-util-gfm]: https://github.com/syntax-tree/mdast-util-gfm

[github-mdast-util-math]: https://github.com/syntax-tree/mdast-util-math

[github-mdast-util-mdx]: https://github.com/syntax-tree/mdast-util-mdx

[github-remark]: https://github.com/remarkjs/remark

[github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify

[github-unist-point]: https://github.com/syntax-tree/unist#point

[health]: https://github.com/syntax-tree/.github

[health-coc]: https://github.com/syntax-tree/.github/blob/main/code-of-conduct.md

[health-contributing]: https://github.com/syntax-tree/.github/blob/main/contributing.md

[health-support]: https://github.com/syntax-tree/.github/blob/main/support.md

[license]: license

[npm]: https://docs.npmjs.com/cli/install

[size]: https://bundlejs.com/?q=mdast-util-to-markdown

[size-badge]: https://img.shields.io/badge/dynamic/json?label=minzipped%20size&query=$.size.compressedSize&url=https://deno.bundlejs.com/?q=mdast-util-to-markdown

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[typescript]: https://www.typescriptlang.org

[wikipedia-xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[wooorm]: https://wooorm.com
