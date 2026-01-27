# React Documentation Patterns Reference

Comprehensive reference for React documentation patterns. Use this when writing or reviewing docs.

---

## Document Templates

### Learn Page Template (`src/content/learn/`)

```mdx
---
title: Your Page Title
---

<Intro>

Opening paragraph introducing the topic. Use *italics* for new terms being defined. Keep it to 1-2 sentences that hook the reader.

</Intro>

<YouWillLearn>

* Bullet point of what reader will learn
* Another learning outcome
* Keep to 3-5 items

</YouWillLearn>

## First Section {/*first-section*/}

Content with <Sandpack> examples...

<Recap>

* Summary bullet of key point
* Another summary point

</Recap>

<Challenges>

#### Challenge Title {/*challenge-id*/}

Challenge description...

<Sandpack>
{/* problem code */}
</Sandpack>

<Solution>

Explanation and solution...

<Sandpack>
{/* solution code */}
</Sandpack>

</Solution>

</Challenges>
```

### Reference Page Template (`src/content/reference/`)

```mdx
---
title: hookName
---

<Intro>

`hookName` is a React Hook that lets you [brief description].

\`\`\`js
const result = hookName(arg)
\`\`\`

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `hookName(arg)` {/*hookname*/}

Call `hookName` at the top level of your component to...

\`\`\`js
import { hookName } from 'react';

function MyComponent() {
  const result = hookName(initialValue);
  // ...
\`\`\`

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `arg`: Description of the parameter.

#### Returns {/*returns*/}

Description of return value.

#### Caveats {/*caveats*/}

* Caveat about usage.
* Another important caveat.

---

## Usage {/*usage*/}

### Common Use Case {/*common-use-case*/}

Explanation with <Sandpack> examples...

---

## Troubleshooting {/*troubleshooting*/}

### Common Problem {/*common-problem*/}

How to solve it...
```

---

## Tone & Voice Guidelines

### Learn Pages
- Conversational, friendly
- Address the reader as "you"
- "Here's what that looks like..."
- "You might be wondering..."
- "Let's see how this works..."

### Reference Pages
- Precise, technical
- Still use "you" but more direct
- "Call `useState` at the top level..."
- "This Hook returns..."

### Universal Rules
- **Capitalize React terms:** Hook, Effect, State, Context, Ref, Component, Transition
- **Capitalize:** Server Component, Client Component, Server Action, Error Boundary, Suspense
- **Use proper product names:** ESLint, TypeScript, JavaScript (not lowercase)
- **Use bold** for key concepts: **state variable**, **event handler**
- **Use italics** for new terms being defined: *event handlers*
- Avoid "simple", "easy", "just" - these can be dismissive
- Prefer concrete examples over abstract explanations
- No time estimates ("quick", "takes X minutes")
- Frame feature differences as "capabilities" not "advantages/disadvantages"
- Avoid passive voice and jargon

### Avoiding Jargon

React docs explain technical concepts in plain language. Follow these patterns:

**Don't use CS jargon without explanation:**
- ❌ "State updates are atomic"
- ✅ "React waits until all state updates are done before re-rendering"

- ❌ "Components must be idempotent"
- ✅ "Given the same inputs, a component always returns the same output"

- ❌ "Rendering must be deterministic"
- ✅ "React expects the same inputs to produce the same result"

**Terms to avoid or always explain:**
- "atomic" → describe what actually happens (all-or-nothing, batched together)
- "idempotent" → "same inputs, same output"
- "deterministic" → "predictable", "same result every time"
- "memoize/memoization" → "remember the result", "skip recalculating"
- "referentially transparent" → avoid entirely, explain the behavior
- "invariant" → "rule that must always be true", "requirement"
- "reify" → avoid entirely, describe what's being created

**Use analogies the docs already establish:**
- Rendering = preparing food in a kitchen
- Committing = placing the order on the table
- Batching = waiter collecting the full order before going to kitchen
- State = snapshot/photograph at a moment in time
- Pure functions = math formulas (y = 2x always gives same result)

**Pattern: Explain behavior, then name it**
```markdown
React waits until all code in the event handlers has run before
processing your state updates. This is called *batching*.
```

Not:
```markdown
React uses batching to process state updates atomically.
```

---

## Code Style Rules (Enforced in PR Review)

These rules are strictly enforced during PR review:

### Component Definitions
```js
// ✅ Correct - function declaration
function MyInput({ value, onChange, ref }) {
  return <input value={value} onChange={onChange} ref={ref} />;
}
export default MyInput;

// 🚫 Wrong - arrow function for component
const MyInput = ({ value, onChange, ref }) => {
  return <input value={value} onChange={onChange} ref={ref} />;
};
```

### Event Handlers
```js
// ✅ Correct - use 'e' for event parameter
<button onClick={(e) => e.preventDefault()}>

// 🚫 Wrong - using 'event' (can conflict with global)
<button onClick={(event) => event.preventDefault()}>
```

### createRoot Pattern
```js
// ✅ Correct - two lines
const root = createRoot(document.getElementById('root'));
root.render(<App />);

// 🚫 Wrong - chained
createRoot(document.getElementById('root')).render(<App />);
```

### State vs Ref Decision
```js
// ✅ Use ref when value is not used for rendering
const isMounted = useRef(false);

// 🚫 Don't use state if not rendering based on it
const [isMounted, setIsMounted] = useState(false); // triggers re-render
```

### Hydration-Safe Code
```js
// ✅ Correct - same output on server and client
function App() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}

// 🚫 Wrong - different output causes hydration mismatch
function App() {
  const isClient = typeof window !== 'undefined';
  return <div>{isClient ? 'Client' : 'Server'}</div>;
}
```

## Line Length Guidelines

Keep lines short enough to avoid horizontal scrolling on small screens:
- Prose: ~80 characters
- Code: ~60-70 characters preferred
- If longer, break into multiple lines

## Anti-Patterns to Avoid

| Pattern | Problem | Fix |
|---------|---------|-----|
| `const Comp = () => {}` | Not standard for components | `function Comp() {}` |
| `onClick={(event) => ...}` | Conflicts with global | `onClick={(e) => ...}` |
| `useState` for non-rendered values | Unnecessary re-renders | Use `useRef` instead |
| Reading `window` during render | Hydration mismatch | Check in useEffect |
| Single-line if statements | Harder to read/debug | Use multiline with braces |
| Chained `createRoot().render()` | Less clear | Two separate statements |
| `//...` without space | Inconsistent style | Use `// ...` with space |
| Tabs for indentation | Inconsistent rendering | Use 2 spaces |
| Deprecated `ReactDOM.render` | Outdated API | Use `createRoot` |
| Fake package names | Confusing readers | Use `'./your-storage-layer'` |
| `PropsWithChildren` | Outdated pattern | Use `children?: React.ReactNode` |
| Missing `key` in lists | Causes warnings | Always include `key` prop |

---

## forwardRef and memo Patterns

### forwardRef with Named Function
```js
// ✅ Correct - named function for display name
const MyInput = forwardRef(function MyInput(props, ref) {
  return <input {...props} ref={ref} />;
});

// 🚫 Wrong - anonymous function
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

### memo with Named Function
```js
// ✅ Correct - preserves component name
const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
});

// 🚫 Wrong - loses component name in DevTools
const Greeting = memo(({ name }) => {
  return <h1>Hello, {name}</h1>;
});
```

---

## MDX Component Decision Tree

### `<Pitfall>`
**Use for:** Common mistakes that cause bugs or unexpected behavior.

```mdx
<Pitfall>

React components must start with a capital letter or they won't work!

</Pitfall>
```

### `<Note>`
**Use for:** Important clarifications, conventions, or tips.

```mdx
<Note>

The convention is to name state variables like `[something, setSomething]`.

</Note>
```

### `<DeepDive>`
**Use for:** Optional deep technical content. **Must have `####` heading as first child.**

```mdx
<DeepDive>

#### Why does this work? {/*why-does-this-work*/}

Technical explanation that's optional for understanding the main concept...

</DeepDive>
```

### `<Sandpack>`
**Use for:** Interactive code examples.

```mdx
<Sandpack>

\`\`\`js
export default function App() {
  return <h1>Hello</h1>;
}
\`\`\`

\`\`\`css
h1 { color: blue; }
\`\`\`

</Sandpack>
```

### `<Recipes>`
**Use for:** Multiple related examples showing variations.

```mdx
<Recipes titleText="Examples of useState" titleId="examples-basic">

#### Counter (number) {/*counter-number*/}

Description...

<Sandpack>
{/* code */}
</Sandpack>

<Solution />

#### Text field (string) {/*text-field-string*/}

Description...

<Sandpack>
{/* code */}
</Sandpack>

<Solution />

</Recipes>
```

### `<Challenges>`
**Use for:** End-of-page exercises (Learn pages only).

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

---

## Sandpack Patterns

> **Comprehensive guidelines:** See `.claude/skills/docs-sandpack/SKILL.md` for complete Sandpack patterns including package.json usage, hidden/active files, file structure, and code size limits.

### Quick Reference

| Pattern | When to Use |
|---------|-------------|
| `hidden` | package.json, data files, API mocks, infrastructure |
| `active` | File containing primary teaching concept |
| Single file | Basic hooks, simple concepts (70% of examples) |
| Multi-file | Imports, context, component reuse (30% of examples) |

### File Naming
- Main file: ` ```js ` (no prefix)
- Supporting files: ` ```js src/FileName.js `
- Active file (reference pages): ` ```js src/File.js active `
- Hidden files: ` ```js src/data.js hidden `
- CSS: ` ```css `
- Package.json (for dependencies): ` ```json package.json `

### Line Highlighting
```mdx
\`\`\`js {2-4}
function Example() {
  // These lines (2-4)
  // will be
  // highlighted
  return null;
}
\`\`\`
```

### Code References (for callouts)
```mdx
\`\`\`js [[1, 4, "age"], [2, 4, "setAge"]]
// Creates numbered callouts pointing to specific code
\`\`\`
```

### Expected Errors (for intentionally broken examples)
```mdx
\`\`\`js {expectedErrors: {'react-compiler': [7]}}
// Line 7 will show as expected error
\`\`\`
```

### Multiple Files
```mdx
<Sandpack>

\`\`\`js src/App.js
import Gallery from './Gallery.js';

export default function App() {
  return <Gallery />;
}
\`\`\`

\`\`\`js src/Gallery.js
export default function Gallery() {
  return <h1>Gallery</h1>;
}
\`\`\`

\`\`\`css
h1 { color: purple; }
\`\`\`

</Sandpack>
```

### External Dependencies
```mdx
<Sandpack>

\`\`\`js
import { useImmer } from 'use-immer';
// ...
\`\`\`

\`\`\`json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "use-immer": "0.5.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest"
  }
}
\`\`\`

</Sandpack>
```

---

## Common Patterns

### Showing Wrong vs Right Code

```mdx
\`\`\`js
// 🚩 Don't mutate state like this:
obj.x = 10;
setObj(obj);
\`\`\`

\`\`\`js
// ✅ Replace state with a new object:
setObj({
  ...obj,
  x: 10
});
\`\`\`
```

### Table Comparisons

```mdx
| passing a function (correct)     | calling a function (incorrect)     |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |
```

### Linking to Other Pages

```mdx
[Read more about state](/learn/state-a-components-memory)
[See the `useState` reference](/reference/react/useState)
```

### Inline Code Annotations

Use `<CodeStep>` for numbered callouts in prose:

```mdx
The <CodeStep step={1}>current state</CodeStep> is initially set to the <CodeStep step={3}>initial state</CodeStep> you provided.
```

### Troubleshooting Sections

Error headings must follow this format:

```markdown
### I'm getting an error: "Too many re-renders" {/*too-many-re-renders*/}

This error usually means...
```

Not:
```markdown
### Too many re-renders error {/*too-many-re-renders*/}
```

---

## Blog Post Guidelines

### Updating Old Blog Posts
- Never break existing links; add redirects when URLs change
- Do not rewrite history; add update notes with dates instead of replacing text
- Use format: `**Update (Month Year):** New information here.`

### Announcing Features
- Do not promise or oversell features that are not yet available
- If a feature is "upcoming," say so explicitly
- Include FAQ sections for anticipated developer questions
- Focus on correctness over marketing language

---

## React 19+ Documentation Patterns

### Documenting API Changes
When APIs change between versions, document both patterns:

```mdx
Starting in React 19, you can render `<SomeContext>` as a provider:

\`\`\`js
<SomeContext value={value}>
  {children}
</SomeContext>
\`\`\`

In older versions of React, use `<SomeContext.Provider>`:

\`\`\`js
<SomeContext.Provider value={value}>
  {children}
</SomeContext.Provider>
\`\`\`
```

### Version Notes
- Use "Starting in React 19..." for new patterns
- Use "In older versions of React..." for legacy patterns
- Add version badges where appropriate
