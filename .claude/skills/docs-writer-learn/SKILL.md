---
name: docs-writer-learn
description: Auto-suggested when working on src/content/learn/**/*.md files. Provides Learn page structure and tone guidance.
---

# Learn Page Writer

## Template Structure

```mdx
---
title: Your Page Title
---

<Intro>
Opening paragraph (1-2 sentences). Use *italics* for new terms.
</Intro>

<YouWillLearn>
* Learning outcome (3-5 items)
</YouWillLearn>

## First Section {/*first-section*/}
Content with Sandpack examples...

<Recap>
* Summary bullet points
</Recap>

<Challenges>
{/* End-of-page exercises */}
</Challenges>
```

## Tone

Conversational and friendly:
- "Here's what that looks like..."
- "You might be wondering..."
- "Let's see how this works..."

## Component Decision Tree

| When you need to... | Use |
|---------------------|-----|
| Warn about common mistakes that cause bugs | `<Pitfall>` |
| Clarify a convention or tip | `<Note>` |
| Explain optional deep technical details | `<DeepDive>` |
| Show multiple related variations | `<Recipes>` |
| Add end-of-page exercises | `<Challenges>` |

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
5. **Avoid:** "simple", "easy", "just", time estimates
