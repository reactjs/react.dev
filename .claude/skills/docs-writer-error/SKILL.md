---
name: docs-writer-error
description: Use when writing or editing error pages in src/content/errors/. Provides error page structure, research workflow, and troubleshooting guide conventions.
---

# Error Page Writer

## Persona

**Voice:** Empathetic debugger helping a frustrated developer
**Tone:** Direct, diagnostic, reassuring — never condescending

## Voice & Style

For tone, capitalization, jargon, and prose patterns, invoke `/docs-voice`.

**Key tone adjustments for error pages:**
- Developers arrive mid-debugging. Be concise and actionable.
- Lead with "what happened" before "how to fix it."
- Avoid "simply", "just", "easy" — the developer is already stuck.
- Use "you" to address the reader directly.
- Name the specific React behavior that triggered the error.

## Workflow: Research First

Before writing any error page, you must research the error thoroughly.

### Step 1: Invoke `/react-expert` in Error Code Mode

Run:
```
/react-expert error <CODE>
```

This dispatches 7 parallel research agents that will:
- Find every throw site for this error in the React source
- Find test files that trigger this error
- Search GitHub issues for user reports of this error
- Search the web for Stack Overflow questions, blog posts, and forum discussions to understand how real developers encounter and struggle with this error
- Find PRs and commits for design context

Wait for the research to complete. The output will be saved to `.claude/research/error-<CODE>.md`.

### Step 2: Analyze the Research

From the research output, determine:
1. **What the error message means** — use throw site conditions and `%s` argument context
2. **Common causes** — prioritize by:
   - Frequency in web search results and GitHub issues (most common first)
   - What developers struggle with most (from web-researcher findings)
   - What scenarios are reproducible in Sandpack
3. **Developer pain points** — what confuses people about this error? Use this to inform the prose explanation.
4. **Related docs** — which existing react.dev pages help explain the concepts involved

### Step 3: Write the Error Page

Place the file at `src/content/errors/{code}.md`. Use the template below.

## Page Template

```mdx
<Intro>

This page explains this React error and common ways to fix it.

</Intro>

The full text of the error is:

<ErrorDecoder />

<Note>

In the minified production build of React, full error messages are replaced with short codes to reduce bundle size. We recommend using the development build when debugging, as it includes additional warnings and debug information.

</Note>

## What This Error Means {/*what-this-error-means*/}

[One-line opener ending with `:` — identifies the error condition]:

` ` `js {N}
[Minimal code showing the broken pattern, with // 🔴 marker and line highlight]
` ` `

[1-2 paragraphs explaining why this causes an error — what React was doing, what concept is involved.]

[See the examples below for common causes and how to fix them.](#common-causes)

## Common Causes {/*common-causes*/}

### Cause Title {/*cause-title*/}

[Explanation. 1-2 paragraphs.]

Here is an example of code that would trigger this error:

<Sandpack>

` ` `js
// 🔴 This will cause the error
[problem code]
` ` `

</Sandpack>

[Transition sentence explaining the fix:]

<Sandpack>

` ` `js
// ✅ Fixed: [what changed]
[solution code]
` ` `

</Sandpack>

[Optional: 1-2 sentences of supplementary context, e.g., related patterns or edge cases.]

## Related Documentation {/*related-documentation*/}

- [Link text](/path/to/page)
```

## Section Guidelines

### Boilerplate (Required, Verbatim)

The `<Intro>` block, `<ErrorDecoder />`, and the `<Note>` about minified builds must appear on every custom error page exactly as shown in the template. Do not modify, reword, or omit any part. The intro leads with purpose ("explains this React error and common ways to fix it"), and the minification context is placed in a `<Note>` after the error decoder. The generic error page (`generic.md`) uses a different boilerplate — this skill only covers custom error pages.

### What This Error Means

**Structure (in order):**
1. Open with "This error occurs when [condition]:" — one sentence, ending with a colon, linking to relevant docs if applicable.
2. Show a plain fenced code block (not Sandpack) with the broken pattern — use `{N}` line highlighting on the problematic line and a `// 🔴` comment marker.
3. Explain why this causes an error in 1-2 paragraphs — what React was doing, what concept is involved. Address the developer pain points found in research — if people commonly misunderstand why this error happens, address that confusion directly.
4. End with: `[See the examples below for common causes and how to fix them.](#common-causes)`

**Rules:**
- The code block is a quick illustrative snippet, NOT an interactive Sandpack — it gives the reader instant visual recognition of the broken pattern.
- Use line highlighting (`{N}`) to point to the exact problematic line.
- The `// 🔴` marker comment in the code block may reference the error concept (e.g., `// 🔴 Invalid Hook call!`).
- If the message has `%s` placeholders, explain what each represents in the explanation paragraphs.
- The explanation paragraphs follow the code — "show, then explain."
- Keep the code block minimal (under ~15 lines) — just enough to show the pattern.

**Opening sentence patterns** (all end with `:`):

| Category | Pattern |
|----------|---------|
| Hooks | "This error occurs when a Hook is called in a way that violates the [Rules of Hooks](/reference/rules/rules-of-hooks):" |
| Rendering | "This error occurs when React encounters [invalid element/children] during rendering:" |
| Hydration | "This error occurs when the HTML generated by the server does not match what the client renders:" |
| Server Components | "This error occurs when a value that is not serializable is passed from a Server Component to a Client Component:" |
| Suspense | "This error occurs when a component suspends during rendering without a `<Suspense>` boundary to catch it:" |

### Common Causes

- 1-4 causes per page. Most errors have 2-3.
- Each cause gets its own `###` heading under `## Common Causes`.
- Each cause must include: prose explanation, and either a Problem/Solution Sandpack pair, or plain code blocks. Build/configuration causes may use diagnostic commands and fix snippets instead.
- Use descriptive headings: "Calling a Hook inside a condition", not "Cause 1".
- **Order by real-world frequency**: Use web search and GitHub issue data from the research to determine which causes developers hit most often. The most common cause goes first.
- **Address real confusion**: If the research shows developers struggle to understand why a particular pattern causes this error, explain it clearly in the prose.

### Related Documentation

- At least one link. Bulleted list.
- Learn pages for concepts, Reference pages for APIs.
- Format API links with backticks: [`useState`](/reference/react/useState)

## Sandpack Guidelines

For general Sandpack conventions, invoke `/docs-sandpack`.

### Problem Sandpacks

- Mark problematic code with `// 🔴`.
- Keep examples minimal — only code needed to trigger the error.
- When the error being documented also triggers a lint rule, include `// eslint-disable-next-line` to suppress the lint error so the Sandpack demonstrates the runtime behavior.
- Must have `export default` in main file.
- **Base examples on real-world patterns** found in web search results — not abstract/contrived scenarios.

### Solution Sandpacks

- Mark fix with `// ✅ Fixed: [description]`.
- Change only what's necessary. Don't refactor unrelated code.
- Must be runnable and produce a visible result.

### Transition Sentences Between Pairs

- "To fix this, move the Hook call to the top level of your component:"
- "Instead, convert the value to a supported type before passing it:"
- "To fix this, wrap the component in a `<Suspense>` boundary:"

### When Sandpack Can't Reproduce the Error

Use plain fenced code blocks instead:

```mdx
This error occurs during server rendering. The problematic pattern looks like this:

` ` `js
// 🔴 This will cause the error during server rendering
function App() {
  return <ServerComponent data={new Map()} />;
}
` ` `
```

### Multi-File Sandpacks

Use when the error involves component relationships (parent/child, server/client):

```mdx
<Sandpack>

` ` `js src/App.js active
import Child from './Child';

export default function App() {
  // 🔴 Passing an invalid value to Child
  return <Child data={Symbol('test')} />;
}
` ` `

` ` `js src/Child.js
export default function Child({ data }) {
  return <div>{String(data)}</div>;
}
` ` `

</Sandpack>
```

## Component Usage

For full component patterns, invoke `/docs-components`.

| Component | Use For |
|-----------|---------|
| `<Note>` | Edge cases, version differences |
| `<Pitfall>` | A fix that introduces a new common mistake |
| `<DeepDive>` | Why React enforces this rule (optional) |
| `<ConsoleBlock level="error">` | Showing exact console output |

Use `<ConsoleBlock>` sparingly — only when the dev-mode message differs meaningfully from the production error.

## Handling Error Variations

### Errors That Are React Bugs

For errors saying "This is likely caused by a bug in React":

```mdx
## What This Error Means {/*what-this-error-means*/}

This error indicates an internal invariant violation in React. It is not caused by your application code.

If you encounter this error, please [file an issue](https://github.com/facebook/react/issues/new?template=bug_report.md) on the React GitHub repository with a reproduction.
```

Keep these pages minimal. Do not invent common causes.

### Server-Specific Errors

- Note that these errors occur on the server, not in the browser.
- Use plain code blocks instead of Sandpack.
- Link to RSC documentation.

### Hooks Errors

- Always link to [Rules of Hooks](/reference/rules/rules-of-hooks).
- Common causes: conditional calls, calls in loops, calls outside components, mismatched React versions.

## Do's and Don'ts

**Do:**
- Invoke `/react-expert error <CODE>` before writing
- Use the boilerplate verbatim (intro, error decoder, minification note)
- Explain what `%s` placeholders represent
- Show problem code before solution (problem-first)
- Keep Sandpack examples minimal
- Order causes by real-world frequency (from research)
- Base examples on real developer scenarios (from web search)
- Address common developer confusion (from research)
- Link to at least one related docs page
- Use `// 🔴` and `// ✅` markers

**Don't:**
- Write error pages without research
- Add frontmatter to error pages
- Modify the boilerplate text (intro, error decoder, or minification note)
- Repeat the error message in prose
- Include more than 4 causes
- Use contrived/abstract examples when real-world patterns exist
- Use `<Challenges>`, `<Recipes>`, `<YouWillLearn>`, or `<Recap>`
- Use `<InlineToc />`
- Use `---` section dividers
- Place consecutive `<Pitfall>` or `<Note>` without separating prose

## Critical Rules

1. **Research first:** Always invoke `/react-expert error <CODE>` before writing.
2. **Boilerplate is sacred:** `<Intro>`, `<ErrorDecoder />`, and the minification `<Note>` must appear verbatim on every custom error page.
3. **No frontmatter:** Error pages have no YAML frontmatter.
4. **All headings require IDs:** `## Title {/*title-id*/}` in kebab-case.
5. **Problem-first Sandpacks:** Show broken code before the fix.
6. **One pair per cause:** Each cause gets one problem + one solution Sandpack (or plain code blocks). Exception: build/configuration causes (e.g., duplicate packages) may use diagnostic commands and fix snippets instead of a strict problem/solution pair.
7. **Real-world examples:** Base Sandpack examples on patterns from web research, not contrived scenarios.
8. **No consecutive callouts:** Separate `<Pitfall>`/`<Note>` with prose.
9. **Minimal examples:** Keep Sandpack files under 50 lines when possible.
10. **File naming:** `{code}.md` in `src/content/errors/`.
11. **`export default` required:** All Sandpack main files need it.

For component patterns, invoke `/docs-components`. For Sandpack patterns, invoke `/docs-sandpack`.
