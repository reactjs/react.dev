---
name: docs-writer-reference
description: Reference page structure, templates, and writing patterns for src/content/reference/. For components, see /docs-components. For code examples, see /docs-sandpack.
---

# Reference Page Writer

## Quick Reference

### Page Type Decision Tree

1. Is it a Hook? Use **Type A (Hook/Function)**
2. Is it a React component (`<Something>`)? Use **Type B (Component)**
3. Is it a compiler configuration option? Use **Type C (Configuration)**
4. Is it a directive (`'use something'`)? Use **Type D (Directive)**
5. Is it an ESLint rule? Use **Type E (ESLint Rule)**
6. Is it listing multiple APIs? Use **Type F (Index/Category)**

### Component Selection

For component selection and patterns, invoke `/docs-components`.

---

## Voice & Style

**Voice:** Authoritative technical reference writer
**Tone:** Precise, comprehensive, neutral

For tone, capitalization, jargon, and prose patterns, invoke `/docs-voice`.

**Do:**
- Start with single-line description: "`useState` is a React Hook that lets you..."
- Include Parameters, Returns, Caveats sections for every API
- Document edge cases most developers will encounter
- Use section dividers between major sections
- Include "See more examples below" links
- Be assertive, not hedging - "This is designed for..." not "This helps avoid issues with..."
- State facts, not benefits - "The callback always accesses the latest values" not "This helps avoid stale closures"
- Use minimal but meaningful names - `onEvent` or `onTick` over `onSomething`

**Don't:**
- Skip the InlineToc component
- Omit error cases or caveats
- Use conversational language
- Mix teaching with reference (that's Learn's job)
- Document past bugs or fixed issues
- Include niche edge cases (e.g., `this` binding, rare class patterns)
- Add phrases explaining "why you'd want this" - the Usage section examples do that
- Exception: Pitfall and DeepDive asides can use slightly conversational phrasing

---

## Page Templates

### Type A: Hook/Function

**When to use:** Documenting React hooks and standalone functions (useState, useEffect, memo, lazy, etc.)

```mdx
---
title: hookName
---

<Intro>

`hookName` is a React Hook that lets you [brief description].

```js
const result = hookName(arg)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `hookName(arg)` {/*hookname*/}

Call `hookName` at the top level of your component to...

```js
[signature example with annotations]
```

[See more examples below.](#usage)

#### Parameters {/*parameters*/}
* `arg`: Description of the parameter.

#### Returns {/*returns*/}
Description of return value.

#### Caveats {/*caveats*/}
* Important caveat about usage.

---

## Usage {/*usage*/}

### Common Use Case {/*common-use-case*/}
Explanation with Sandpack examples...

---

## Troubleshooting {/*troubleshooting*/}

### Common Problem {/*common-problem*/}
How to solve it...
```

---

### Type B: Component

**When to use:** Documenting React components (Suspense, Fragment, Activity, StrictMode)

```mdx
---
title: <ComponentName>
---

<Intro>

`<ComponentName>` lets you [primary action].

```js
<ComponentName prop={value}>
  <Children />
</ComponentName>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<ComponentName>` {/*componentname*/}

[Component purpose and behavior]

#### Props {/*props*/}

* `propName`: Description of the prop...
* **optional** `optionalProp`: Description...

#### Caveats {/*caveats*/}

* [Caveats specific to this component]
```

**Key differences from Hook pages:**
- Title uses JSX syntax: `<ComponentName>`
- Uses `#### Props` instead of `#### Parameters`
- Reference heading uses JSX: `` ### `<ComponentName>` ``

---

### Type C: Configuration

**When to use:** Documenting React Compiler configuration options

```mdx
---
title: optionName
---

<Intro>

The `optionName` option [controls/specifies/determines] [what it does].

</Intro>

```js
{
  optionName: 'value' // Quick example
}
```

<InlineToc />

---

## Reference {/*reference*/}

### `optionName` {/*optionname*/}

[Description of the option's purpose]

#### Type {/*type*/}

```
'value1' | 'value2' | 'value3'
```

#### Default value {/*default-value*/}

`'value1'`

#### Options {/*options*/}

- **`'value1'`** (default): Description
- **`'value2'`**: Description
- **`'value3'`**: Description

#### Caveats {/*caveats*/}

* [Usage caveats]
```

---

### Type D: Directive

**When to use:** Documenting directives like 'use server', 'use client', 'use memo'

```mdx
---
title: "'use directive'"
titleForTitleTag: "'use directive' directive"
---

<RSC>

`'use directive'` is for use with [React Server Components](/reference/rsc/server-components).

</RSC>

<Intro>

`'use directive'` marks [what it marks] for [purpose].

```js {1}
function MyComponent() {
  'use directive';
  // ...
}
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `'use directive'` {/*use-directive*/}

Add `'use directive'` at the beginning of [location] to [action].

#### Caveats {/*caveats*/}

* `'use directive'` must be at the very beginning...
* The directive must be written with single or double quotes, not backticks.
* [Other placement/syntax caveats]
```

**Key characteristics:**
- Title includes quotes: `title: "'use server'"`
- Uses `titleForTitleTag` for browser tab title
- `<RSC>` block appears before `<Intro>`
- Caveats focus on placement and syntax requirements

---

### Type E: ESLint Rule

**When to use:** Documenting ESLint plugin rules

```mdx
---
title: rule-name
---

<Intro>
Validates that [what the rule checks].
</Intro>

## Rule Details {/*rule-details*/}

[Explanation of why this rule exists and React's underlying assumptions]

## Common Violations {/*common-violations*/}

[Description of violation patterns]

### Invalid {/*invalid*/}

Examples of incorrect code for this rule:

```js
// X Missing dependency
useEffect(() => {
  console.log(count);
}, []); // Missing 'count'
```

### Valid {/*valid*/}

Examples of correct code for this rule:

```js
// checkmark All dependencies included
useEffect(() => {
  console.log(count);
}, [count]);
```

## Troubleshooting {/*troubleshooting*/}

### [Problem description] {/*problem-slug*/}

[Solution]

## Options {/*options*/}

[Configuration options if applicable]
```

**Key characteristics:**
- Intro is a single "Validates that..." sentence
- Uses "Invalid"/"Valid" sections with emoji-prefixed code comments
- Rule Details explains "why" not just "what"

---

### Type F: Index/Category

**When to use:** Overview pages listing multiple APIs in a category

```mdx
---
title: "Built-in React [Type]"
---

<Intro>

*Concept* let you [purpose]. Brief scope statement.

</Intro>

---

## Category Name {/*category-name*/}

*Concept* explanation with [Learn section link](/learn/topic).

To [action], use one of these [Type]:

* [`apiName`](/reference/react/apiName) lets you [action].
* [`apiName`](/reference/react/apiName) declares [thing].

```js
function Example() {
  const value = useHookName(args);
}
```

---

## Your own [Type] {/*your-own-type*/}

You can also [define your own](/learn/topic) as JavaScript functions.
```

**Key characteristics:**
- Title format: "Built-in React [Type]"
- Italicized concept definitions
- Horizontal rules between sections
- Closes with "Your own [Type]" section

---

## Advanced Patterns

### Multi-Function Documentation

**When to use:** When a hook returns a function that needs its own documentation (useState's setter, useReducer's dispatch)

```md
### `hookName(args)` {/*hookname*/}

[Main hook documentation]

#### Parameters {/*parameters*/}
#### Returns {/*returns*/}
#### Caveats {/*caveats*/}

---

### `set` functions, like `setSomething(nextState)` {/*setstate*/}

The `set` function returned by `hookName` lets you [action].

#### Parameters {/*setstate-parameters*/}
#### Returns {/*setstate-returns*/}
#### Caveats {/*setstate-caveats*/}
```

**Key conventions:**
- Horizontal rule (`---`) separates main hook from returned function
- Heading IDs include prefix: `{/*setstate-parameters*/}` vs `{/*parameters*/}`
- Use generic names: "set functions" not "setCount"

---

### Compound Return Objects

**When to use:** When a function returns an object with multiple properties/methods (createContext)

```md
### `createContext(defaultValue)` {/*createcontext*/}

[Main function documentation]

#### Returns {/*returns*/}

`createContext` returns a context object.

**The context object itself does not hold any information.** It represents...

* `SomeContext` lets you provide the context value.
* `SomeContext.Consumer` is an alternative way to read context.

---

### `SomeContext` Provider {/*provider*/}

[Documentation for Provider]

#### Props {/*provider-props*/}

---

### `SomeContext.Consumer` {/*consumer*/}

[Documentation for Consumer]

#### Props {/*consumer-props*/}
```

---

## Writing Patterns

### Opening Lines by Page Type

| Page Type | Pattern | Example |
|-----------|---------|---------|
| Hook | `` `hookName` is a React Hook that lets you [action]. `` | "`useState` is a React Hook that lets you add a state variable to your component." |
| Component | `` `<ComponentName>` lets you [action]. `` | "`<Suspense>` lets you display a fallback until its children have finished loading." |
| API | `` `apiName` lets you [action]. `` | "`memo` lets you skip re-rendering a component when its props are unchanged." |
| Configuration | `` The `optionName` option [controls/specifies/determines] [what]. `` | "The `target` option specifies which React version the compiler generates code for." |
| Directive | `` `'directive'` [marks/opts/prevents] [what] for [purpose]. `` | "`'use server'` marks a function as callable from the client." |
| ESLint Rule | `` Validates that [condition]. `` | "Validates that dependency arrays for React hooks contain all necessary dependencies." |

---

### Parameter Patterns

**Simple parameter:**
```md
* `paramName`: Description of what it does.
```

**Optional parameter:**
```md
* **optional** `paramName`: Description of what it does.
```

**Parameter with special function behavior:**
```md
* `initialState`: The value you want the state to be initially. It can be a value of any type, but there is a special behavior for functions. This argument is ignored after the initial render.
  * If you pass a function as `initialState`, it will be treated as an _initializer function_. It should be pure, should take no arguments, and should return a value of any type.
```

**Callback parameter with sub-parameters:**
```md
* `subscribe`: A function that takes a single `callback` argument and subscribes it to the store. When the store changes, it should invoke the provided `callback`. The `subscribe` function should return a function that cleans up the subscription.
```

**Nested options object:**
```md
* **optional** `options`: An object with options for this React root.
  * **optional** `onCaughtError`: Callback called when React catches an error in an Error Boundary.
  * **optional** `onUncaughtError`: Callback called when an error is thrown and not caught.
  * **optional** `identifierPrefix`: A string prefix React uses for IDs generated by `useId`.
```

---

### Return Value Patterns

**Single value return:**
```md
`hookName` returns the current value. The value will be the same as `initialValue` during the first render.
```

**Array return (numbered list):**
```md
`useState` returns an array with exactly two values:

1. The current state. During the first render, it will match the `initialState` you have passed.
2. The [`set` function](#setstate) that lets you update the state to a different value and trigger a re-render.
```

**Object return (bulleted list):**
```md
`createElement` returns a React element object with a few properties:

* `type`: The `type` you have passed.
* `props`: The `props` you have passed except for `ref` and `key`.
* `ref`: The `ref` you have passed. If missing, `null`.
* `key`: The `key` you have passed, coerced to a string. If missing, `null`.
```

**Promise return:**
```md
`prerender` returns a Promise:
- If rendering is successful, the Promise will resolve to an object containing:
  - `prelude`: a [Web Stream](MDN-link) of HTML.
  - `postponed`: a JSON-serializable object for resumption.
- If rendering fails, the Promise will be rejected.
```

**Wrapped function return:**
```md
`cache` returns a cached version of `fn` with the same type signature. It does not call `fn` in the process.

When calling `cachedFn` with given arguments, it first checks if a cached result exists. If cached, it returns the result. If not, it calls `fn`, stores the result, and returns it.
```

---

### Caveats Patterns

**Standard Hook caveat (almost always first for Hooks):**
```md
* `useXxx` is a Hook, so you can only call it **at the top level of your component** or your own Hooks. You can't call it inside loops or conditions. If you need that, extract a new component and move the state into it.
```

**Stable identity caveat (for returned functions):**
```md
* The `set` function has a stable identity, so you will often see it omitted from Effect dependencies, but including it will not cause the Effect to fire.
```

**Strict Mode caveat:**
```md
* In Strict Mode, React will **call your render function twice** in order to help you find accidental impurities. This is development-only behavior and does not affect production.
```

**Caveat with code example:**
```md
* It's not recommended to _suspend_ a render based on a store value returned by `useSyncExternalStore`. For example, the following is discouraged:

  ```js
  const selectedProductId = useSyncExternalStore(...);
  const data = use(fetchItem(selectedProductId)) // X Don't suspend based on store value
  ```
```

**Canary caveat:**
```md
* <CanaryBadge /> If you want to pass `ref` to a Fragment, you can't use the `<>...</>` syntax.
```

---

### Troubleshooting Patterns

**Heading format (first person problem statements):**
```md
### I've updated the state, but logging gives me the old value {/*old-value*/}

### My initializer or updater function runs twice {/*runs-twice*/}

### I want to read the latest state from a callback {/*read-latest-state*/}
```

**Error message format:**
```md
### I'm getting an error: "Too many re-renders" {/*too-many-rerenders*/}

### I'm getting an error: "Rendered more hooks than during the previous render" {/*more-hooks*/}
```

**Lint error format:**
```md
### I'm getting a lint error: "[exact error message]" {/*lint-error-slug*/}
```

**Problem-solution structure:**
1. State the problem with code showing the issue
2. Explain why it happens
3. Provide the solution with corrected code
4. Link to Learn section for deeper understanding

---

### Code Comment Conventions

For code comment conventions (wrong/right, legacy/recommended, server/client labeling, bundle size annotations), invoke `/docs-sandpack`.

---

### Link Description Patterns

| Pattern | Example |
|---------|---------|
| "lets you" + action | "`memo` lets you skip re-rendering when props are unchanged." |
| "declares" + thing | "`useState` declares a state variable that you can update directly." |
| "reads" + thing | "`useContext` reads and subscribes to a context." |
| "connects" + thing | "`useEffect` connects a component to an external system." |
| "Used with" | "Used with [`useContext`.](/reference/react/useContext)" |
| "Similar to" | "Similar to [`useTransition`.](/reference/react/useTransition)" |

---

## Component Patterns

For comprehensive MDX component patterns (Note, Pitfall, DeepDive, Recipes, Deprecated, RSC, Canary, Diagram, Code Steps), invoke `/docs-components`.

For Sandpack-specific patterns and code style, invoke `/docs-sandpack`.

### Reference-Specific Component Rules

**Component placement in Reference pages:**
- `<RSC>` goes before `<Intro>` at top of page
- `<Deprecated>` goes after `<Intro>` for page-level deprecation
- `<Deprecated>` goes after method heading for method-level deprecation
- `<Canary>` wrapper goes inline within `<Intro>`
- `<CanaryBadge />` appears in headings, props lists, and caveats

**Troubleshooting-specific components:**
- Use first-person problem headings
- Cross-reference Pitfall IDs when relevant

**Callout spacing:**
- Never place consecutive Pitfalls or consecutive Notes
- Combine related warnings into one with titled subsections, or separate with prose/code
- Consecutive DeepDives OK for multi-part explorations
- See `/docs-components` Callout Spacing Rules

---

## Content Principles

### Intro Section
- **One sentence, ~15 words max** - State what the Hook does, not how it works
- ✅ "`useEffectEvent` is a React Hook that lets you separate events from Effects."
- ❌ "`useEffectEvent` is a React Hook that lets you extract non-reactive logic from your Effects into a reusable function called an Effect Event."

### Reference Code Example
- Show just the API call (5-10 lines), not a full component
- Move full component examples to Usage section

### Usage Section Structure
1. **First example: Core mental model** - Show the canonical use case with simplest concrete example
2. **Subsequent examples: Canonical use cases** - Name the *why* (e.g., "Avoid reconnecting to external systems"), show a concrete *how*
   - Prefer broad canonical use cases over multiple narrow concrete examples
   - The section title IS the teaching - "When would I use this?" should be answered by the heading

### What to Include vs. Exclude
- **Never** document past bugs or fixed issues
- **Include** edge cases most developers will encounter
- **Exclude** niche edge cases (e.g., `this` binding, rare class patterns)

### Caveats Section
- Include rules the linter enforces or that cause immediate errors
- Include fundamental usage restrictions
- Exclude implementation details unless they affect usage
- Exclude repetition of things explained elsewhere
- Keep each caveat to one sentence when possible

### Troubleshooting Section
- Error headings only: "I'm getting an error: '[message]'" format
- Never document past bugs - if it's fixed, it doesn't belong here
- Focus on errors developers will actually encounter today

### DeepDive Content
- **Goldilocks principle** - Deep enough for curious developers, short enough to not overwhelm
- Answer "why is it designed this way?" - not exhaustive technical details
- Readers who skip it should miss nothing essential for using the API
- If the explanation is getting long, you're probably explaining too much

---

## Domain-Specific Guidance

### Hooks

**Returned function documentation:**
- Document setter/dispatch functions as separate `###` sections
- Use generic names: "set functions" not "setCount"
- Include stable identity caveat for returned functions

**Dependency array documentation:**
- List what counts as reactive values
- Explain when dependencies are ignored
- Link to removing effect dependencies guide

**Recipes usage:**
- Group related examples with meaningful titleText
- Each recipe has brief intro, Sandpack, and `<Solution />`

---

### Components

**Props documentation:**
- Use `#### Props` instead of `#### Parameters`
- Mark optional props with `**optional**` prefix
- Use `<CanaryBadge />` inline for canary-only props

**JSX syntax in titles/headings:**
- Frontmatter title: `title: <Suspense>`
- Reference heading: `` ### `<Suspense>` {/*suspense*/} ``

---

### React-DOM

**Common props linking:**
```md
`<input>` supports all [common element props.](/reference/react-dom/components/common#common-props)
```

**Props categorization:**
- Controlled vs uncontrolled props grouped separately
- Form-specific props documented with action patterns
- MDN links for standard HTML attributes

**Environment-specific notes:**
```mdx
<Note>

This API is specific to Node.js. Environments with [Web Streams](MDN-link), like Deno and modern edge runtimes, should use [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) instead.

</Note>
```

**Progressive enhancement:**
- Document benefits for users without JavaScript
- Explain Server Function + form action integration
- Show hidden form field and `.bind()` patterns

---

### RSC

**RSC banner (before Intro):**
Always place `<RSC>` component before `<Intro>` for Server Component-only APIs.

**Serialization type lists:**
When documenting Server Function arguments, list supported types:
```md
Supported types for Server Function arguments:

* Primitives
	* [string](MDN-link)
	* [number](MDN-link)
* Iterables containing serializable values
	* [Array](MDN-link)
	* [Map](MDN-link)

Notably, these are not supported:
* React elements, or [JSX](/learn/writing-markup-with-jsx)
* Functions (other than Server Functions)
```

**Bundle size comparisons:**
- Show "Not included in bundle" for server-only imports
- Annotate client bundle sizes with gzip: `// 35.9K (11.2K gzipped)`

---

### Compiler

**Configuration page structure:**
- Type (union type or interface)
- Default value
- Options/Valid values with descriptions

**Directive documentation:**
- Placement requirements are critical
- Mode interaction tables showing combinations
- "Use sparingly" + "Plan for removal" patterns for escape hatches

**Library author guides:**
- Audience-first intro
- Benefits/Why section
- Numbered step-by-step setup

---

### ESLint

**Rule Details section:**
- Explain "why" not just "what"
- Focus on React's underlying assumptions
- Describe consequences of violations

**Invalid/Valid sections:**
- Standard intro: "Examples of [in]correct code for this rule:"
- Use X emoji for invalid, checkmark for valid
- Show inline comments explaining the violation

**Configuration options:**
- Show shared settings (preferred)
- Show rule-level options (backward compatibility)
- Note precedence when both exist

---

## Edge Cases

For deprecated, canary, and version-specific component patterns (placement, syntax, examples), invoke `/docs-components`.

**Quick placement rules:**
- `<Deprecated>` after `<Intro>` for page-level, after heading for method-level
- `<Canary>` wrapper inline in Intro, `<CanaryBadge />` in headings/props/caveats
- Version notes use `<Note>` with "Starting in React 19..." pattern

**Removed APIs on index pages:**
```md
## Removed APIs {/*removed-apis*/}

These APIs were removed in React 19:

* [`render`](https://18.react.dev/reference/react-dom/render): use [`createRoot`](/reference/react-dom/client/createRoot) instead.
```

Link to previous version docs (18.react.dev) for removed API documentation.

---

## Critical Rules

1. **Heading IDs required:** `## Title {/*title-id*/}` (lowercase, hyphens)
2. **Sandpack main file needs `export default`**
3. **Active file syntax:** ` ```js src/File.js active `
4. **Error headings in Troubleshooting:** Use `### I'm getting an error: "[message]" {/*id*/}`
5. **Section dividers (`---`)** required between headings (see Section Dividers below)
6. **InlineToc required:** Always include `<InlineToc />` after Intro
7. **Consistent parameter format:** Use `* \`paramName\`: description` with `**optional**` prefix for optional params
8. **Numbered lists for array returns:** When hooks return arrays, use numbered lists in Returns section
9. **Generic names for returned functions:** Use "set functions" not "setCount"
10. **Props vs Parameters:** Use `#### Props` for Components (Type B), `#### Parameters` for Hooks/APIs (Type A)
11. **RSC placement:** `<RSC>` component goes before `<Intro>`, not after
12. **Canary markers:** Use `<Canary>` wrapper inline in Intro, `<CanaryBadge />` in headings/props
13. **Deprecated placement:** `<Deprecated>` goes after `<Intro>` for page-level, after heading for method-level
14. **Code comment emojis:** Use X for wrong, checkmark for correct in code examples
15. **No consecutive Pitfalls/Notes:** Combine into one component with titled subsections, or separate with prose/code (see `/docs-components`)

For component heading level conventions (DeepDive, Pitfall, Note, Recipe headings), see `/docs-components`.

### Section Dividers

Use `---` horizontal rules to visually separate major sections:

- **After `<InlineToc />`** - Before `## Reference` heading
- **Between API subsections** - Between different function/hook definitions (e.g., between `useState()` and `set functions`)
- **Before `## Usage`** - Separates API reference from examples
- **Before `## Troubleshooting`** - Separates content from troubleshooting
- **Between EVERY Usage subsections** - When switching to a new major use case

Always have a blank line before and after `---`.

### Section ID Conventions

| Section | ID Format |
|---------|-----------|
| Main function | `{/*functionname*/}` |
| Returned function | `{/*setstate*/}`, `{/*dispatch*/}` |
| Sub-section of returned function | `{/*setstate-parameters*/}` |
| Troubleshooting item | `{/*problem-description-slug*/}` |
| Pitfall | `{/*pitfall-description*/}` |
| Deep dive | `{/*deep-dive-topic*/}` |
