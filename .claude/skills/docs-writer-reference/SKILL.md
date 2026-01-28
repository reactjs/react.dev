---
name: docs-writer-reference
description: Auto-suggested when working on src/content/reference/**/*.md files. Provides Reference page structure and tone guidance.
---

# Reference Page Writer

## Template Structure

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

## Formatting Details

### Intro Section
- Single non-wrapping opening line describing the API purpose:
  - Hooks: `` `useHookName` is a React Hook that lets you [capability]. ``
  - Other APIs: `` `apiName` lets you [capability]. ``
- Code signature showing usage with `?` for optional parameters:
  ```js
  const [state, setState] = useState(initialState)
  const cachedFn = useCallback(fn, dependencies)
  const [optimisticState, addOptimistic] = useOptimistic(state, updateFn?);
  ```

### Parameters Section
- Use bullet format: `* \`paramName\`: description`
- Mark optional params: `* **optional** \`paramName\`: description`
- Optional params in signature use `?`: `useOptimistic(state, updateFn?)`

### Returns Section
- Single return: prose description
- Multiple returns (like useState): use numbered list:
  ```
  1. `state`: The current state value...
  2. `setState`: A function to update the state...
  ```

### Code Examples
- Show import and 5-10 lines of practical usage
- Link to usage: `[See more examples below.](#usage)`

## Tone

Precise and technical: "Call `useState` at the top level...", "This Hook returns..."

## Component Decision Tree

| When you need to... | Use |
|---------------------|-----|
| Warn about common mistakes that cause bugs | `<Pitfall>` |
| Clarify a convention or tip | `<Note>` |
| Explain optional deep technical details | `<DeepDive>` |
| Show multiple related variations | `<Recipes>` |

For component patterns, invoke `/docs-components`. For Sandpack patterns, invoke `/docs-sandpack`.

## Critical Rules

1. **Heading IDs required:** `## Title {/*title-id*/}` (lowercase, hyphens)
2. **Capitalize React terms** when referring to the React concept (not general usage):
   - Core: Hook, Effect, State, Context, Ref, Component, Fragment
   - Concurrent: Transition, Action, Suspense
   - Server: Server Component, Client Component, Server Function, Server Action
   - Patterns: Error Boundary
   - Canary: Activity, View Transition, Transition Type
   - General usage stays lowercase: "the page transitions" (not React), "takes an action" (not React)
3. **DeepDive must start with `####` heading**
4. **Sandpack main file needs `export default`**
5. **Active file syntax:** ` ```js src/File.js active `
6. **Avoid:** "simple", "easy", "just", time estimates
7. **Error headings in Troubleshooting:** Use `### I'm getting an error: "[message]" {/*id*/}`
