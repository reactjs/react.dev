---
name: docs-components
description: Comprehensive MDX component patterns (Note, Pitfall, DeepDive, Recipes, etc.) for all documentation types. Authoritative source for component usage, examples, and heading conventions.
---

# MDX Component Patterns

## Quick Reference

### Component Decision Tree

| Need | Component |
|------|-----------|
| Helpful tip or terminology | `<Note>` |
| Common mistake warning | `<Pitfall>` |
| Advanced technical explanation | `<DeepDive>` |
| Canary-only feature | `<Canary>` or `<CanaryBadge />` |
| Server Components only | `<RSC>` |
| Deprecated API | `<Deprecated>` |
| Experimental/WIP | `<Wip>` |
| Visual diagram | `<Diagram>` |
| Multiple related examples | `<Recipes>` |
| Interactive code | `<Sandpack>` (see `/docs-sandpack`) |
| Console error display | `<ConsoleBlock>` |
| End-of-page exercises | `<Challenges>` (Learn pages only) |

### Heading Level Conventions

| Component | Heading Level |
|-----------|---------------|
| DeepDive title | `####` (h4) |
| Titled Pitfall | `#####` (h5) |
| Titled Note | `####` (h4) |
| Recipe items | `####` (h4) |
| Challenge items | `####` (h4) |

### Callout Spacing Rules

Callout components (Note, Pitfall, DeepDive) require a **blank line after the opening tag** before content begins.

**Never place consecutively:**
- `<Pitfall>` followed by `<Pitfall>` - Combine into one with titled subsections, or separate with prose
- `<Note>` followed by `<Note>` - Combine into one, or separate with prose

**Allowed consecutive patterns:**
- `<DeepDive>` followed by `<DeepDive>` - OK for multi-part explorations (see useMemo.md)
- `<Pitfall>` followed by `<DeepDive>` - OK when DeepDive explains "why" behind the Pitfall

**Separation content:** Prose paragraphs, code examples (Sandpack), or section headers.

**Why:** Consecutive warnings create a "wall of cautions" that overwhelms readers and causes important warnings to be skimmed.

**Incorrect:**
```mdx
<Pitfall>
Don't do X.
</Pitfall>

<Pitfall>
Don't do Y.
</Pitfall>
```

**Correct - combined:**
```mdx
<Pitfall>

##### Don't do X {/*pitfall-x*/}
Explanation.

##### Don't do Y {/*pitfall-y*/}
Explanation.

</Pitfall>
```

**Correct - separated:**
```mdx
<Pitfall>
Don't do X.
</Pitfall>

This leads to another common mistake:

<Pitfall>
Don't do Y.
</Pitfall>
```

---

## `<Note>`

Important clarifications, conventions, or tips. Less severe than Pitfall.

### Simple Note

```mdx
<Note>

The optimization of caching return values is known as [_memoization_](https://en.wikipedia.org/wiki/Memoization).

</Note>
```

### Note with Title

Use `####` (h4) heading with an ID.

```mdx
<Note>

#### There is no directive for Server Components. {/*no-directive*/}

A common misunderstanding is that Server Components are denoted by `"use server"`, but there is no directive for Server Components. The `"use server"` directive is for Server Functions.

</Note>
```

### Version-Specific Note

```mdx
<Note>

Starting in React 19, you can render `<SomeContext>` as a provider.

In older versions of React, use `<SomeContext.Provider>`.

</Note>
```

---

## `<Pitfall>`

Common mistakes that cause bugs. Use for errors readers will likely make.

### Simple Pitfall

```mdx
<Pitfall>

We recommend defining components as functions instead of classes. [See how to migrate.](#alternatives)

</Pitfall>
```

### Titled Pitfall

Use `#####` (h5) heading with an ID.

```mdx
<Pitfall>

##### Calling different memoized functions will read from different caches. {/*pitfall-different-caches*/}

To access the same cache, components must call the same memoized function.

</Pitfall>
```

### Pitfall with Wrong/Right Code

```mdx
<Pitfall>

##### `useFormStatus` will not return status information for a `<form>` rendered in the same component. {/*pitfall-same-component*/}

```js
function Form() {
  // 🔴 `pending` will never be true
  const { pending } = useFormStatus();
  return <form action={submit}></form>;
}
```

Instead call `useFormStatus` from inside a component located inside `<form>`.

</Pitfall>
```

---

## `<DeepDive>`

Optional deep technical content. **First child must be `####` heading with ID.**

### Standard DeepDive

```mdx
<DeepDive>

#### Is using an updater always preferred? {/*is-updater-preferred*/}

You might hear a recommendation to always write code like `setAge(a => a + 1)` if the state you're setting is calculated from the previous state. There's no harm in it, but it's also not always necessary.

In most cases, there is no difference between these two approaches. React always makes sure that for intentional user actions, like clicks, the `age` state variable would be updated before the next click.

</DeepDive>
```

### Comparison DeepDive

For comparing related concepts:

```mdx
<DeepDive>

#### When should I use `cache`, `memo`, or `useMemo`? {/*cache-memo-usememo*/}

All mentioned APIs offer memoization but differ in what they memoize, who can access the cache, and when their cache is invalidated.

#### `useMemo` {/*deep-dive-usememo*/}

In general, you should use `useMemo` for caching expensive computations in Client Components across renders.

#### `cache` {/*deep-dive-cache*/}

In general, you should use `cache` in Server Components to memoize work that can be shared across components.

</DeepDive>
```

---

## `<Recipes>`

Multiple related examples showing variations. Each recipe needs `<Solution />`.

```mdx
<Recipes titleText="Basic useState examples" titleId="examples-basic">

#### Counter (number) {/*counter-number*/}

In this example, the `count` state variable holds a number.

<Sandpack>
{/* code */}
</Sandpack>

<Solution />

#### Text field (string) {/*text-field-string*/}

In this example, the `text` state variable holds a string.

<Sandpack>
{/* code */}
</Sandpack>

<Solution />

</Recipes>
```

**Common titleText/titleId combinations:**
- "Basic [hookName] examples" / `examples-basic`
- "Examples of [concept]" / `examples-[concept]`
- "The difference between [A] and [B]" / `examples-[topic]`

---

## `<Challenges>`

End-of-page exercises. **Learn pages only.** Each challenge needs problem + solution Sandpack.

```mdx
<Challenges>

#### Fix the bug {/*fix-the-bug*/}

Problem description...

<Hint>
Optional hint text.
</Hint>

<Sandpack>
{/* problem code */}
</Sandpack>

<Solution>

Explanation...

<Sandpack>
{/* solution code */}
</Sandpack>

</Solution>

</Challenges>
```

**Guidelines:**
- Only at end of standard Learn pages
- No Challenges in chapter intros or tutorials
- Each challenge has `####` heading with ID

---

## `<Deprecated>`

For deprecated APIs. Content should explain what to use instead.

### Page-Level Deprecation

```mdx
<Deprecated>

In React 19, `forwardRef` is no longer necessary. Pass `ref` as a prop instead.

`forwardRef` will be deprecated in a future release. Learn more [here](/blog/2024/04/25/react-19#ref-as-a-prop).

</Deprecated>
```

### Method-Level Deprecation

```mdx
### `componentWillMount()` {/*componentwillmount*/}

<Deprecated>

This API has been renamed from `componentWillMount` to [`UNSAFE_componentWillMount`.](#unsafe_componentwillmount)

Run the [`rename-unsafe-lifecycles` codemod](codemod-link) to automatically update.

</Deprecated>
```

---

## `<RSC>`

For APIs that only work with React Server Components.

### Basic RSC

```mdx
<RSC>

`cache` is only for use with [React Server Components](/reference/rsc/server-components).

</RSC>
```

### Extended RSC (for Server Functions)

```mdx
<RSC>

Server Functions are for use in [React Server Components](/reference/rsc/server-components).

**Note:** Until September 2024, we referred to all Server Functions as "Server Actions".

</RSC>
```

---

## `<Canary>` and `<CanaryBadge />`

For features only available in Canary releases.

### Canary Wrapper (inline in Intro)

```mdx
<Intro>

`<Fragment>` lets you group elements without a wrapper node.

<Canary>Fragments can also accept refs, enabling interaction with underlying DOM nodes.</Canary>

</Intro>
```

### CanaryBadge in Section Headings

```mdx
### <CanaryBadge /> FragmentInstance {/*fragmentinstance*/}
```

### CanaryBadge in Props Lists

```mdx
* <CanaryBadge /> **optional** `ref`: A ref object from `useRef` or callback function.
```

### CanaryBadge in Caveats

```mdx
* <CanaryBadge /> If you want to pass `ref` to a Fragment, you can't use the `<>...</>` syntax.
```

---

## `<Diagram>`

Visual explanations of module dependencies, render trees, or data flow.

```mdx
<Diagram name="use_client_module_dependency" height={250} width={545} alt="A tree graph with the top node representing the module 'App.js'. 'App.js' has three children...">
`'use client'` segments the module dependency tree, marking `InspirationGenerator.js` and all dependencies as client-rendered.
</Diagram>
```

**Attributes:**
- `name`: Diagram identifier (used for image file)
- `height`: Height in pixels
- `width`: Width in pixels
- `alt`: Accessible description of the diagram

---

## `<CodeStep>` (Use Sparingly)

Numbered callouts in prose. Pairs with code block annotations.

### Syntax

In code blocks:
```mdx
```js [[1, 4, "age"], [2, 4, "setAge"], [3, 4, "42"]]
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
}
```
```

Format: `[[step_number, line_number, "text_to_highlight"], ...]`

In prose:
```mdx
1. The <CodeStep step={1}>current state</CodeStep> initially set to the <CodeStep step={3}>initial value</CodeStep>.
2. The <CodeStep step={2}>`set` function</CodeStep> that lets you change it.
```

### Guidelines

- Maximum 2-3 different colors per explanation
- Don't highlight every keyword - only key concepts
- Use for terms in prose, not entire code blocks
- Maintain consistent usage within a section

✅ **Good use** - highlighting key concepts:
```mdx
React will compare the <CodeStep step={2}>dependencies</CodeStep> with the dependencies you passed...
```

🚫 **Avoid** - excessive highlighting:
```mdx
When an <CodeStep step={1}>Activity</CodeStep> boundary is <CodeStep step={2}>hidden</CodeStep> during its <CodeStep step={3}>initial</CodeStep> render...
```

---

## `<ConsoleBlock>`

Display console output (errors, warnings, logs).

```mdx
<ConsoleBlock level="error">
Uncaught Error: Too many re-renders.
</ConsoleBlock>
```

**Levels:** `error`, `warning`, `info`

---

## Component Usage by Page Type

### Reference Pages

For component placement rules specific to Reference pages, invoke `/docs-writer-reference`.

Key placement patterns:
- `<RSC>` goes before `<Intro>` at top of page
- `<Deprecated>` goes after `<Intro>` for page-level deprecation
- `<Deprecated>` goes after method heading for method-level deprecation
- `<Canary>` wrapper goes inline within `<Intro>`
- `<CanaryBadge />` appears in headings, props lists, and caveats

### Learn Pages

For Learn page structure and patterns, invoke `/docs-writer-learn`.

Key usage patterns:
- Challenges only at end of standard Learn pages
- No Challenges in chapter intros or tutorials
- DeepDive for optional advanced content
- CodeStep should be used sparingly

### Blog Pages

For Blog page structure and patterns, invoke `/docs-writer-blog`.

Key usage patterns:
- Generally avoid deep technical components
- Note and Pitfall OK for clarifications
- Prefer inline explanations over DeepDive

---

## Other Available Components

**Version/Status:** `<Experimental>`, `<ExperimentalBadge />`, `<RSCBadge />`, `<NextMajor>`, `<Wip>`

**Visuals:** `<DiagramGroup>`, `<Illustration>`, `<IllustrationBlock>`, `<CodeDiagram>`, `<FullWidth>`

**Console:** `<ConsoleBlockMulti>`, `<ConsoleLogLine>`

**Specialized:** `<TerminalBlock>`, `<BlogCard>`, `<TeamMember>`, `<YouTubeIframe>`, `<ErrorDecoder />`, `<LearnMore>`, `<Math>`, `<MathI>`, `<LanguageList>`

See existing docs for usage examples of these components.
