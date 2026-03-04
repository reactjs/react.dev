---
name: docs-voice
description: Use when writing any React documentation. Provides voice, tone, and style rules for all doc types.
---

# React Docs Voice & Style

## Universal Rules

- **Capitalize React terms** when referring to the React concept in headings or as standalone concepts:
  - Core: Hook, Effect, State, Context, Ref, Component, Fragment
  - Concurrent: Transition, Action, Suspense
  - Server: Server Component, Client Component, Server Function, Server Action
  - Patterns: Error Boundary
  - Canary: Activity, View Transition, Transition Type
  - **In prose:** Use lowercase when paired with descriptors: "state variable", "state updates", "event handler". Capitalize when the concept stands alone or in headings: "State is isolated and private"
  - General usage stays lowercase: "the page transitions", "takes an action"
- **Product names:** ESLint, TypeScript, JavaScript, Next.js (not lowercase)
- **Bold** for key concepts: **state variable**, **event handler**
- **Italics** for new terms being defined: *event handlers*
- **Inline code** for APIs: `useState`, `startTransition`, `<Suspense>`
- **Avoid:** "simple", "easy", "just", time estimates
- Frame differences as "capabilities" not "advantages/disadvantages"
- Avoid passive voice and jargon

## Tone by Page Type

| Type | Tone | Example |
|------|------|---------|
| Learn | Conversational | "Here's what that looks like...", "You might be wondering..." |
| Reference | Technical | "Call `useState` at the top level...", "This Hook returns..." |
| Blog | Accurate | Focus on facts, not marketing |

**Note:** Pitfall and DeepDive components can use slightly more conversational phrasing ("You might wonder...", "It might be tempting...") even in Reference pages, since they're explanatory asides.

## Avoiding Jargon

**Pattern:** Explain behavior first, then name it.

✅ "React waits until all code in event handlers runs before processing state updates. This is called *batching*."

❌ "React uses batching to process state updates atomically."

**Terms to avoid or explain:**
| Jargon | Plain Language |
|--------|----------------|
| atomic | all-or-nothing, batched together |
| idempotent | same inputs, same output |
| deterministic | predictable, same result every time |
| memoize | remember the result, skip recalculating |
| referentially transparent | (avoid - describe the behavior) |
| invariant | rule that must always be true |
| reify | (avoid - describe what's being created) |

**Allowed technical terms in Reference pages:**
- "stale closures" - standard JS/React term, can be used in Caveats
- "stable identity" - React term for consistent object references across renders
- "reactive" - React term for values that trigger re-renders when changed
- These don't need explanation in Reference pages (readers are expected to know them)

**Use established analogies sparingly—once when introducing a concept, not repeatedly:**

| Concept | Analogy |
|---------|---------|
| Components/React | Kitchen (components as cooks, React as waiter) |
| Render phases | Restaurant ordering (trigger/render/commit) |
| State batching | Waiter collecting full order before going to kitchen |
| State behavior | Snapshot/photograph in time |
| State storage | React storing state "on a shelf" |
| State purpose | Component's memory |
| Pure functions | Recipes (same ingredients → same dish) |
| Pure functions | Math formulas (y = 2x) |
| Props | Adjustable "knobs" |
| Children prop | "Hole" to be filled by parent |
| Keys | File names in a folder |
| Curly braces in JSX | "Window into JavaScript" |
| Declarative UI | Taxi driver (destination, not turn-by-turn) |
| Imperative UI | Turn-by-turn navigation |
| State structure | Database normalization |
| Refs | "Secret pocket" React doesn't track |
| Effects/Refs | "Escape hatch" from React |
| Context | CSS inheritance / "Teleportation" |
| Custom Hooks | Design system |

## Common Prose Patterns

**Wrong vs Right code:**
```mdx
\`\`\`js
// 🚩 Don't mutate state:
obj.x = 10;
\`\`\`

\`\`\`js
// ✅ Replace with new object:
setObj({ ...obj, x: 10 });
\`\`\`
```

**Table comparisons:**
```mdx
| passing a function | calling a function |
| `onClick={handleClick}` | `onClick={handleClick()}` |
```

**Linking:**
```mdx
[Read about state](/learn/state-a-components-memory)
[See `useState` reference](/reference/react/useState)
```

## Code Style

- Prefer JSX over createElement
- Use const/let, never var
- Prefer named function declarations for top-level functions
- Arrow functions for callbacks that need `this` preservation

## Version Documentation

When APIs change between versions:

```mdx
Starting in React 19, render `<Context>` as a provider:
\`\`\`js
<SomeContext value={value}>{children}</SomeContext>
\`\`\`

In older versions:
\`\`\`js
<SomeContext.Provider value={value}>{children}</SomeContext.Provider>
\`\`\`
```

Patterns:
- "Starting in React 19..." for new APIs
- "In older versions of React..." for legacy patterns
