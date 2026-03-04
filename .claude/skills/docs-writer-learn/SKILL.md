---
name: docs-writer-learn
description: Use when writing or editing files in src/content/learn/. Provides Learn page structure and tone.
---

# Learn Page Writer

## Persona

**Voice:** Patient teacher guiding a friend through concepts
**Tone:** Conversational, warm, encouraging

## Voice & Style

For tone, capitalization, jargon, and prose patterns, invoke `/docs-voice`.

## Page Structure Variants

### 1. Standard Learn Page (Most Common)

```mdx
---
title: Page Title
---

<Intro>
1-3 sentences introducing the concept. Use *italics* for new terms.
</Intro>

<YouWillLearn>

* Learning outcome 1
* Learning outcome 2
* Learning outcome 3-5

</YouWillLearn>

## Section Name {/*section-id*/}

Content with Sandpack examples, Pitfalls, Notes, DeepDives...

## Another Section {/*another-section*/}

More content...

<Recap>

* Summary point 1
* Summary point 2
* Summary points 3-9

</Recap>

<Challenges>

#### Challenge title {/*challenge-id*/}

Description...

<Hint>
Optional guidance (single paragraph)
</Hint>

<Sandpack>
{/* Starting code */}
</Sandpack>

<Solution>
Explanation...

<Sandpack>
{/* Fixed code */}
</Sandpack>
</Solution>

</Challenges>
```

### 2. Chapter Introduction Page

For pages that introduce a chapter (like describing-the-ui.md, managing-state.md):

```mdx
<YouWillLearn isChapter={true}>

* [Sub-page title](/learn/sub-page-name) to learn...
* [Another page](/learn/another-page) to learn...

</YouWillLearn>

## Preview Section {/*section-id*/}

Preview description with mini Sandpack example

<LearnMore path="/learn/sub-page-name">

Read **[Page Title](/learn/sub-page-name)** to learn how to...

</LearnMore>

## What's next? {/*whats-next*/}

Head over to [First Page](/learn/first-page) to start reading this chapter page by page!
```

**Important:** Chapter intro pages do NOT include `<Recap>` or `<Challenges>` sections.

### 3. Tutorial Page

For step-by-step tutorials (like tutorial-tic-tac-toe.md):

```mdx
<Intro>
Brief statement of what will be built
</Intro>

<Note>
Alternative learning path offered
</Note>

Table of contents (prose listing of major sections)

## Setup {/*setup*/}
...

## Main Content {/*main-content*/}
Progressive code building with ### subsections

No YouWillLearn, Recap, or Challenges

Ends with ordered list of "extra credit" improvements
```

### 4. Reference-Style Learn Page

For pages with heavy API documentation (like typescript.md):

```mdx
<YouWillLearn>

* [Link to section](#section-anchor)
* [Link to another section](#another-section)

</YouWillLearn>

## Sections with ### subsections

## Further learning {/*further-learning*/}

No Recap or Challenges
```

## Heading ID Conventions

All headings require IDs in `{/*kebab-case*/}` format:

```markdown
## Section Title {/*section-title*/}
### Subsection Title {/*subsection-title*/}
#### DeepDive Title {/*deepdive-title*/}
```

**ID Generation Rules:**
- Lowercase everything
- Replace spaces with hyphens
- Remove apostrophes, quotes
- Remove or convert special chars (`:`, `?`, `!`, `.`, parentheses)

**Examples:**
- "What's React?" → `{/*whats-react*/}`
- "Step 1: Create the context" → `{/*step-1-create-the-context*/}`
- "Conditional (ternary) operator (? :)" → `{/*conditional-ternary-operator--*/}`

## Teaching Patterns

### Problem-First Teaching

Show broken/problematic code BEFORE the solution:

1. Present problematic approach with `// 🔴 Avoid:` comment
2. Explain WHY it's wrong (don't just say it is)
3. Show the solution with `// ✅ Good:` comment
4. Invite experimentation

### Progressive Complexity

Build understanding in layers:
1. Show simplest working version
2. Identify limitation or repetition
3. Introduce solution incrementally
4. Show complete solution
5. Invite experimentation: "Try changing..."

### Numbered Step Patterns

For multi-step processes:

**As section headings:**
```markdown
### Step 1: Action to take {/*step-1-action*/}
### Step 2: Next action {/*step-2-next-action*/}
```

**As inline lists:**
```markdown
To implement this:
1. **Declare** `inputRef` with the `useRef` Hook.
2. **Pass it** as `<input ref={inputRef}>`.
3. **Read** the input DOM node from `inputRef.current`.
```

### Interactive Invitations

After Sandpack examples, encourage experimentation:
- "Try changing X to Y. See how...?"
- "Try it in the sandbox above!"
- "Click each button separately:"
- "Have a guess!"
- "Verify that..."

### Decision Questions

Help readers build intuition:
> "When you're not sure whether some code should be in an Effect or in an event handler, ask yourself *why* this code needs to run."

## Component Placement Order

1. `<Intro>` - First after frontmatter
2. `<YouWillLearn>` - After Intro (standard/chapter pages)
3. Body content with `<Note>`, `<Pitfall>`, `<DeepDive>` placed contextually
4. `<Recap>` - Before Challenges (standard pages only)
5. `<Challenges>` - End of page (standard pages only)

For component structure and syntax, invoke `/docs-components`.

## Code Examples

For Sandpack file structure, naming conventions, code style, and pedagogical markers, invoke `/docs-sandpack`.

## Cross-Referencing

### When to Link

**Link to /learn:**
- Explaining concepts or mental models
- Teaching how things work together
- Tutorials and guides
- "Why" questions

**Link to /reference:**
- API details, Hook signatures
- Parameter lists and return values
- Rules and restrictions
- "What exactly" questions

### Link Formats

```markdown
[concept name](/learn/page-name)
[`useState`](/reference/react/useState)
[section link](/learn/page-name#section-id)
[MDN](https://developer.mozilla.org/...)
```

## Section Dividers

**Important:** Learn pages typically do NOT use `---` dividers. The heading hierarchy provides sufficient structure. Only consider dividers in exceptional cases like separating main content from meta/contribution sections.

## Do's and Don'ts

**Do:**
- Use "you" to address the reader
- Show broken code before fixes
- Explain behavior before naming concepts
- Build concepts progressively
- Include interactive Sandpack examples
- Use established analogies consistently
- Place Pitfalls AFTER explaining concepts
- Invite experimentation with "Try..." phrases

**Don't:**
- Use "simple", "easy", "just", or time estimates
- Reference concepts not yet introduced
- Skip required components for page type
- Use passive voice without reason
- Place Pitfalls before teaching the concept
- Use `---` dividers between sections
- Create unnecessary abstraction in examples
- Place consecutive Pitfalls or Notes without separating prose (combine or separate)

## Critical Rules

1. **All headings require IDs:** `## Title {/*title-id*/}`
2. **Chapter intros use `isChapter={true}` and `<LearnMore>`**
3. **Tutorial pages omit YouWillLearn/Recap/Challenges**
4. **Problem-first teaching:** Show broken → explain → fix
5. **No consecutive Pitfalls/Notes:** See `/docs-components` Callout Spacing Rules

For component patterns, invoke `/docs-components`. For Sandpack patterns, invoke `/docs-sandpack`.
