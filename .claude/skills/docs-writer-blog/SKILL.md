---
name: docs-writer-blog
description: Use when writing or editing files in src/content/blog/. Provides blog post structure and conventions.
---

# Blog Post Writer

## Persona

**Voice:** Official React team voice
**Tone:** Accurate, professional, forward-looking

## Voice & Style

For tone, capitalization, jargon, and prose patterns, invoke `/docs-voice`.

---

## Frontmatter Schema

All blog posts use this YAML frontmatter structure:

```yaml
---
title: "Title in Quotes"
author: Author Name(s)
date: YYYY/MM/DD
description: One or two sentence summary.
---
```

### Field Details

| Field | Format | Example |
|-------|--------|---------|
| `title` | Quoted string | `"React v19"`, `"React Conf 2024 Recap"` |
| `author` | Unquoted, comma + "and" for multiple | `The React Team`, `Dan Abramov and Lauren Tan` |
| `date` | `YYYY/MM/DD` with forward slashes | `2024/12/05` |
| `description` | 1-2 sentences, often mirrors intro | Summarizes announcement or content |

### Title Patterns by Post Type

| Type | Pattern | Example |
|------|---------|---------|
| Release | `"React vX.Y"` or `"React X.Y"` | `"React v19"` |
| Upgrade | `"React [VERSION] Upgrade Guide"` | `"How to Upgrade to React 18"` |
| Labs | `"React Labs: [Topic] – [Month Year]"` | `"React Labs: What We've Been Working On – February 2024"` |
| Conf | `"React Conf [YEAR] Recap"` | `"React Conf 2024 Recap"` |
| Feature | `"Introducing [Feature]"` or descriptive | `"Introducing react.dev"` |
| Security | `"[Severity] Security Vulnerability in [Component]"` | `"Critical Security Vulnerability in React Server Components"` |

---

## Author Byline

Immediately after frontmatter, add a byline:

```markdown
---

Month DD, YYYY by [Author Name](social-link)

---
```

### Conventions

- Full date spelled out: `December 05, 2024`
- Team posts link to `/community/team`: `[The React Team](/community/team)`
- Individual authors link to Twitter/X or Bluesky
- Multiple authors: Oxford comma before "and"
- Followed by horizontal rule `---`

**Examples:**

```markdown
December 05, 2024 by [The React Team](/community/team)

---
```

```markdown
May 3, 2023 by [Dan Abramov](https://bsky.app/profile/danabra.mov), [Sophie Alpert](https://twitter.com/sophiebits), and [Andrew Clark](https://twitter.com/acdlite)

---
```

---

## Universal Post Structure

All blog posts follow this structure:

1. **Frontmatter** (YAML)
2. **Author byline** with date
3. **Horizontal rule** (`---`)
4. **`<Intro>` component** (1-3 sentences)
5. **Horizontal rule** (`---`) (optional)
6. **Main content sections** (H2 with IDs)
7. **Closing section** (Changelog, Thanks, etc.)

---

## Post Type Templates

### Major Release Announcement

```markdown
---
title: "React vX.Y"
author: The React Team
date: YYYY/MM/DD
description: React X.Y is now available on npm! In this post, we'll give an overview of the new features.
---

Month DD, YYYY by [The React Team](/community/team)

---

<Intro>

React vX.Y is now available on npm!

</Intro>

In our [Upgrade Guide](/blog/YYYY/MM/DD/react-xy-upgrade-guide), we shared step-by-step instructions for upgrading. In this post, we'll give an overview of what's new.

- [What's new in React X.Y](#whats-new)
- [Improvements](#improvements)
- [How to upgrade](#how-to-upgrade)

---

## What's new in React X.Y {/*whats-new*/}

### Feature Name {/*feature-name*/}

[Problem this solves. Before/after code examples.]

For more information, see the docs for [`Feature`](/reference/react/Feature).

---

## Improvements in React X.Y {/*improvements*/}

### Improvement Name {/*improvement-name*/}

[Description of improvement.]

---

## How to upgrade {/*how-to-upgrade*/}

See [How to Upgrade to React X.Y](/blog/YYYY/MM/DD/react-xy-upgrade-guide) for step-by-step instructions.

---

## Changelog {/*changelog*/}

### React {/*react*/}

* Add `useNewHook` for [purpose]. ([#12345](https://github.com/facebook/react/pull/12345) by [@contributor](https://github.com/contributor))

---

_Thanks to [Name](url) for reviewing this post._
```

### Upgrade Guide

```markdown
---
title: "React [VERSION] Upgrade Guide"
author: Author Name
date: YYYY/MM/DD
description: Step-by-step instructions for upgrading to React [VERSION].
---

Month DD, YYYY by [Author Name](social-url)

---

<Intro>

[Summary of upgrade and what this guide covers.]

</Intro>

<Note>

#### Stepping stone version {/*stepping-stone*/}

[If applicable, describe intermediate upgrade steps.]

</Note>

In this post, we will guide you through the steps for upgrading:

- [Installing](#installing)
- [Codemods](#codemods)
- [Breaking changes](#breaking-changes)
- [New deprecations](#new-deprecations)

---

## Installing {/*installing*/}

```bash
npm install --save-exact react@^X.Y.Z react-dom@^X.Y.Z
```

## Codemods {/*codemods*/}

<Note>

#### Run all React [VERSION] codemods {/*run-all-codemods*/}

```bash
npx codemod@latest react/[VERSION]/migration-recipe
```

</Note>

## Breaking changes {/*breaking-changes*/}

### Removed: `apiName` {/*removed-api-name*/}

`apiName` was deprecated in [Month YYYY (vX.X.X)](link).

```js
// Before
[old code]

// After
[new code]
```

<Note>

Codemod [description]:

```bash
npx codemod@latest react/[VERSION]/codemod-name
```

</Note>

## New deprecations {/*new-deprecations*/}

### Deprecated: `apiName` {/*deprecated-api-name*/}

[Explanation and migration path.]

---

Thanks to [Contributor](link) for reviewing this post.
```

### React Labs Research Update

```markdown
---
title: "React Labs: What We've Been Working On – [Month Year]"
author: Author1, Author2, and Author3
date: YYYY/MM/DD
description: In React Labs posts, we write about projects in active research and development.
---

Month DD, YYYY by [Author1](url), [Author2](url), and [Author3](url)

---

<Intro>

In React Labs posts, we write about projects in active research and development. We've made significant progress since our [last update](/blog/previous-labs-post), and we'd like to share our progress.

</Intro>

[Optional: Roadmap disclaimer about timelines]

---

## Feature Name {/*feature-name*/}

<Note>

`<FeatureName />` is now available in React's Canary channel.

</Note>

[Description of feature, motivation, current status.]

### Subsection {/*subsection*/}

[Details, examples, use cases.]

---

## Research Area {/*research-area*/}

[Problem space description. Status communication.]

This research is still early. We'll share more when we're further along.

---

_Thanks to [Reviewer](url) for reviewing this post._

Thanks for reading, and see you in the next update!
```

### React Conf Recap

```markdown
---
title: "React Conf [YEAR] Recap"
author: Author1 and Author2
date: YYYY/MM/DD
description: Last week we hosted React Conf [YEAR]. In this post, we'll summarize the talks and announcements.
---

Month DD, YYYY by [Author1](url) and [Author2](url)

---

<Intro>

Last week we hosted React Conf [YEAR] [where we announced [key announcements]].

</Intro>

---

The entire [day 1](youtube-url) and [day 2](youtube-url) streams are available online.

## Day 1 {/*day-1*/}

_[Watch the full day 1 stream here.](youtube-url)_

[Description of day 1 opening and keynote highlights.]

Watch the full day 1 keynote here:

<YouTubeIframe src="https://www.youtube.com/embed/VIDEO_ID" />

## Day 2 {/*day-2*/}

_[Watch the full day 2 stream here.](youtube-url)_

[Day 2 summary.]

<YouTubeIframe src="https://www.youtube.com/embed/VIDEO_ID" />

## Q&A {/*q-and-a*/}

* [Q&A Title](youtube-url) hosted by [Host](url)

## And more... {/*and-more*/}

We also heard talks including:
* [Talk Title](youtube-url) by [Speaker](url)

## Thank you {/*thank-you*/}

Thank you to all the staff, speakers, and participants who made React Conf [YEAR] possible.

See you next time!
```

### Feature/Tool Announcement

```markdown
---
title: "Introducing [Feature Name]"
author: Author Name
date: YYYY/MM/DD
description: Today we are announcing [feature]. In this post, we'll explain [what this post covers].
---

Month DD, YYYY by [Author Name](url)

---

<Intro>

Today we are [excited/thrilled] to announce [feature]. [What this means for users.]

</Intro>

---

## tl;dr {/*tldr*/}

* Key announcement point with [relevant link](/path).
* What users can do now.
* Availability or adoption information.

## What is [Feature]? {/*what-is-feature*/}

[Explanation of the feature/tool.]

## Why we built this {/*why-we-built-this*/}

[Motivation, history, problem being solved.]

## Getting started {/*getting-started*/}

To install [feature]:

<TerminalBlock>
npm install package-name
</TerminalBlock>

[You can find more documentation here.](/path/to/docs)

## What's next {/*whats-next*/}

[Future plans and next steps.]

## Thank you {/*thank-you*/}

[Acknowledgments to contributors.]

---

Thanks to [Reviewer](url) for reviewing this post.
```

### Security Announcement

```markdown
---
title: "[Severity] Security Vulnerability in [Component]"
author: The React Team
date: YYYY/MM/DD
description: Brief summary of the vulnerability. A fix has been published. We recommend upgrading immediately.

---

Month DD, YYYY by [The React Team](/community/team)

---

<Intro>

[One or two sentences summarizing the vulnerability.]

We recommend upgrading immediately.

</Intro>

---

On [date], [researcher] reported a security vulnerability that allows [description].

This vulnerability was disclosed as [CVE-YYYY-NNNNN](https://www.cve.org/CVERecord?id=CVE-YYYY-NNNNN) and is rated CVSS [score].

The vulnerability is present in versions [list] of:

* [package-name](https://www.npmjs.com/package/package-name)

## Immediate Action Required {/*immediate-action-required*/}

A fix was introduced in versions [linked versions]. Upgrade immediately.

### Affected frameworks {/*affected-frameworks*/}

[List of affected frameworks with npm links.]

### Vulnerability overview {/*vulnerability-overview*/}

[Technical explanation of the vulnerability.]

## Update Instructions {/*update-instructions*/}

### Framework Name {/*update-framework-name*/}

```bash
npm install package@version
```

## Timeline {/*timeline*/}

* **November 29th**: [Researcher] reported the vulnerability.
* **December 1st**: Fix was created and validated.
* **December 3rd**: Fix published and CVE disclosed.

## Attribution {/*attribution*/}

Thank you to [Researcher Name](url) for discovering and reporting this vulnerability.
```

---

## Heading Conventions

### ID Syntax

All headings require IDs using CSS comment syntax:

```markdown
## Heading Text {/*heading-id*/}
```

### ID Rules

- Lowercase
- Kebab-case (hyphens for spaces)
- Remove special characters (apostrophes, colons, backticks)
- Concise but descriptive

### Heading Patterns

| Context | Example |
|---------|---------|
| Feature section | `## New Feature: Automatic Batching {/*new-feature-automatic-batching*/}` |
| New hook | `### New hook: \`useActionState\` {/*new-hook-useactionstate*/}` |
| API in backticks | `### \`<Activity />\` {/*activity*/}` |
| Removed API | `#### Removed: \`propTypes\` {/*removed-proptypes*/}` |
| tl;dr section | `## tl;dr {/*tldr*/}` |

---

## Component Usage Guide

### Blog-Appropriate Components

| Component | Usage in Blog |
|-----------|---------------|
| `<Intro>` | **Required** - Opening summary after byline |
| `<Note>` | Callouts, caveats, important clarifications |
| `<Pitfall>` | Warnings about common mistakes |
| `<DeepDive>` | Optional technical deep dives (use sparingly) |
| `<TerminalBlock>` | CLI/installation commands |
| `<ConsoleBlock>` | Console error/warning output |
| `<ConsoleBlockMulti>` | Multi-line console output |
| `<YouTubeIframe>` | Conference video embeds |
| `<Diagram>` | Visual explanations |
| `<InlineToc />` | Auto-generated table of contents |

### `<Intro>` Pattern

Always wrap opening paragraph:

```markdown
<Intro>

React 19 is now available on npm!

</Intro>
```

### `<Note>` Patterns

**Simple note:**
```markdown
<Note>

For React Native users, React 18 ships with the New Architecture.

</Note>
```

**Titled note (H4 inside):**
```markdown
<Note>

#### React 18.3 has also been published {/*react-18-3*/}

To help with the upgrade, we've published `react@18.3`...

</Note>
```

### `<TerminalBlock>` Pattern

```markdown
<TerminalBlock>
npm install react@latest react-dom@latest
</TerminalBlock>
```

### `<YouTubeIframe>` Pattern

```markdown
<YouTubeIframe src="https://www.youtube.com/embed/VIDEO_ID" />
```

---

## Link Patterns

### Internal Links

| Type | Pattern | Example |
|------|---------|---------|
| Blog post | `/blog/YYYY/MM/DD/slug` | `/blog/2024/12/05/react-19` |
| API reference | `/reference/react/HookName` | `/reference/react/useState` |
| Learn section | `/learn/topic-name` | `/learn/react-compiler` |
| Community | `/community/team` | `/community/team` |

### External Links

| Type | Pattern |
|------|---------|
| GitHub PR | `[#12345](https://github.com/facebook/react/pull/12345)` |
| GitHub user | `[@username](https://github.com/username)` |
| Twitter/X | `[@username](https://x.com/username)` |
| Bluesky | `[Name](https://bsky.app/profile/handle)` |
| CVE | `[CVE-YYYY-NNNNN](https://www.cve.org/CVERecord?id=CVE-YYYY-NNNNN)` |
| npm package | `[package](https://www.npmjs.com/package/package)` |

### "See docs" Pattern

```markdown
For more information, see the docs for [`useActionState`](/reference/react/useActionState).
```

---

## Changelog Format

### Bullet Pattern

```markdown
* Add `useTransition` for concurrent rendering. ([#10426](https://github.com/facebook/react/pull/10426) by [@acdlite](https://github.com/acdlite))
* Fix `useReducer` observing incorrect props. ([#22445](https://github.com/facebook/react/pull/22445) by [@josephsavona](https://github.com/josephsavona))
```

**Structure:** `Verb` + backticked API + description + `([#PR](url) by [@user](url))`

**Verbs:** Add, Fix, Remove, Make, Improve, Allow, Deprecate

### Section Organization

```markdown
## Changelog {/*changelog*/}

### React {/*react*/}

* [changes]

### React DOM {/*react-dom*/}

* [changes]
```

---

## Acknowledgments Format

### Post-closing Thanks

```markdown
---

Thanks to [Name](url), [Name](url), and [Name](url) for reviewing this post.
```

Or italicized:

```markdown
_Thanks to [Name](url) for reviewing this post._
```

### Update Notes

For post-publication updates:

```markdown
<Note>

[Updated content]

-----

_Updated January 26, 2026._

</Note>
```

---

## Tone & Length by Post Type

| Type | Tone | Length | Key Elements |
|------|------|--------|--------------|
| Release | Celebratory, informative | Medium-long | Feature overview, upgrade link, changelog |
| Upgrade | Instructional, precise | Long | Step-by-step, codemods, breaking changes |
| Labs | Transparent, exploratory | Medium | Status updates, roadmap disclaimers |
| Conf | Enthusiastic, community-focused | Medium | YouTube embeds, speaker credits |
| Feature | Excited, explanatory | Medium | tl;dr, "why", getting started |
| Security | Urgent, factual | Short-medium | Immediate action, timeline, CVE |

---

## Do's and Don'ts

**Do:**
- Focus on facts over marketing
- Say "upcoming" explicitly for unreleased features
- Include FAQ sections for major announcements
- Credit contributors and link to GitHub
- Use "we" voice for team posts
- Link to upgrade guides from release posts
- Include table of contents for long posts
- End with acknowledgments

**Don't:**
- Promise features not yet available
- Rewrite history (add update notes instead)
- Break existing URLs
- Use hyperbolic language ("revolutionary", "game-changing")
- Skip the `<Intro>` component
- Forget heading IDs
- Use heavy component nesting in blogs
- Make time estimates or predictions

---

## Updating Old Posts

- Never break existing URLs; add redirects when URLs change
- Don't rewrite history; add update notes instead:
  ```markdown
  <Note>

  [Updated information]

  -----

  _Updated Month Year._

  </Note>
  ```

---

## Critical Rules

1. **Heading IDs required:** `## Title {/*title-id*/}`
2. **`<Intro>` required:** Every post starts with `<Intro>` component
3. **Byline required:** Date + linked author(s) after frontmatter
4. **Date format:** Frontmatter uses `YYYY/MM/DD`, byline uses `Month DD, YYYY`
5. **Link to docs:** New APIs must link to reference documentation
6. **Security posts:** Always include "We recommend upgrading immediately"

---

## Components Reference

For complete MDX component patterns, invoke `/docs-components`.

Blog posts commonly use: `<Intro>`, `<Note>`, `<Pitfall>`, `<TerminalBlock>`, `<ConsoleBlock>`, `<YouTubeIframe>`, `<DeepDive>`, `<Diagram>`.

Prefer inline explanations over heavy component usage.
