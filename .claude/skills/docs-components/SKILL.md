---
name: docs-components
description: MDX component patterns for React documentation. Invoke when adding DeepDive, Pitfall, Note, Recipes, or Challenges to docs.
---

# MDX Component Patterns

## `<Pitfall>`

Common mistakes that cause bugs. Use for errors readers will likely make.

```mdx
<Pitfall>

React components must start with a capital letter or they won't work!

</Pitfall>
```

## `<Note>`

Important clarifications, conventions, or tips. Less severe than Pitfall.

```mdx
<Note>

The convention is to name state variables like `[something, setSomething]`.

</Note>
```

## `<DeepDive>`

Optional deep technical content. **First child must be `####` heading with ID.**

```mdx
<DeepDive>

#### Why does this work? {/*why-does-this-work*/}

Technical explanation that's optional for understanding the main concept...

</DeepDive>
```

## `<Recipes>`

Multiple related examples showing variations. Each recipe needs `<Solution />`.

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

## `<CodeStep>` (Use Sparingly)

Numbered callouts in prose. Pairs with code block annotations.

**Important:** Use at most 2-3 colors in any given explanation. Excessive highlighting is distracting.

✅ **Good use** - highlighting key concepts:
```mdx
React will compare the <CodeStep step={2}>dependencies</CodeStep> with the dependencies you passed...
```

🚫 **Avoid** - excessive highlighting:
```mdx
When an <CodeStep step={1}>Activity</CodeStep> boundary is <CodeStep step={2}>hidden</CodeStep> during its <CodeStep step={3}>initial</CodeStep> render...
```

**Guidelines:**
- Maximum 2-3 different colors per explanation
- Don't highlight every keyword - only key concepts
- Use for terms in prose, not entire code blocks
- Maintain consistent usage within a section

---

## Other Available Components

**Version/Status:** `<Canary>`, `<CanaryBadge />`, `<Experimental>`, `<ExperimentalBadge />`, `<Deprecated>`, `<RSC>`, `<RSCBadge />`, `<NextMajor>`, `<Wip>`

**Visuals:** `<Diagram>`, `<DiagramGroup>`, `<Illustration>`, `<IllustrationBlock>`, `<CodeDiagram>`, `<FullWidth>`

**Console:** `<ConsoleBlock level="error|warning">`, `<ConsoleBlockMulti>`, `<ConsoleLogLine>`

**Specialized:** `<TerminalBlock>`, `<BlogCard>`, `<TeamMember>`, `<YouTubeIframe>`, `<ErrorDecoder />`, `<LearnMore>`, `<Math>`, `<MathI>`, `<LanguageList>`

See existing docs for usage examples of these components.
