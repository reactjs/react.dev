---
name: react-expert
description: Use when researching React APIs or concepts for documentation. Use when you need authoritative usage examples, caveats, warnings, or errors for a React feature.
---

# React Expert Research Skill

## Overview

This skill produces exhaustive documentation research on any React API or concept by searching authoritative sources (tests, source code, PRs, issues) rather than relying on LLM training knowledge.

<CRITICAL>
**Skepticism Mandate:** You must be skeptical of your own knowledge. Claude is often trained on outdated or incorrect React patterns. Treat source material as the sole authority. If findings contradict your prior understanding, explicitly flag this discrepancy.

**Red Flags - STOP if you catch yourself thinking:**
- "I know this API does X" → Find source evidence first
- "Common pattern is Y" → Verify in test files
- Generating example code → Must have source file reference
</CRITICAL>

## Invocation

```
/react-expert useTransition
/react-expert suspense boundaries
/react-expert startTransition
```

## Sources (Priority Order)

1. **React Repo Tests** - Most authoritative for actual behavior
2. **React Source Code** - Warnings, errors, implementation details
3. **Git History** - Commit messages with context
4. **GitHub PRs & Comments** - Design rationale (via `gh` CLI)
5. **GitHub Issues** - Confusion/questions (facebook/react + reactjs/react.dev)
6. **React Working Group** - Design discussions for newer APIs
7. **Flow Types** - Source of truth for type signatures
8. **TypeScript Types** - Note discrepancies with Flow
9. **Current react.dev docs** - Baseline (not trusted as complete)

**No web search** - No Stack Overflow, blog posts, or web searches. GitHub API via `gh` CLI is allowed. **Exception:** Error code research mode (see below) explicitly allows web search to understand real-world developer pain points.

## Workflow

### Step 1: Setup React Repo

First, ensure the React repo is available locally:

```bash
# Check if React repo exists, clone or update
if [ -d ".claude/react" ]; then
  cd .claude/react && git pull origin main
else
  git clone --depth=100 https://github.com/facebook/react.git .claude/react
fi
```

Get the current commit hash for the research document:
```bash
cd .claude/react && git rev-parse --short HEAD
```

### Step 2: Dispatch 6 Parallel Research Agents

Spawn these agents IN PARALLEL using the Task tool. Each agent receives the skepticism preamble:

> "You are researching React's `<TOPIC>`. CRITICAL: Do NOT rely on your prior knowledge about this API. Your training may contain outdated or incorrect patterns. Only report what you find in the source files. If your findings contradict common understanding, explicitly highlight this discrepancy."

| Agent | subagent_type | Focus | Instructions |
|-------|---------------|-------|--------------|
| test-explorer | Explore | Test files for usage patterns | Search `.claude/react/packages/*/src/__tests__/` for test files mentioning the topic. Extract actual usage examples WITH file paths and line numbers. |
| source-explorer | Explore | Warnings/errors in source | Search `.claude/react/packages/*/src/` for console.error, console.warn, and error messages mentioning the topic. Document trigger conditions. |
| git-historian | Explore | Commit messages | Run `git log --all --grep="<topic>" --oneline -50` in `.claude/react`. Read full commit messages for context. |
| pr-researcher | Explore | PRs introducing/modifying API | Run `gh pr list -R facebook/react --search "<topic>" --state all --limit 20`. Read key PR descriptions and comments. |
| issue-hunter | Explore | Issues showing confusion | Search issues in both `facebook/react` and `reactjs/react.dev` repos. Look for common questions and misunderstandings. |
| types-inspector | Explore | Flow + TypeScript signatures | Find Flow types in `.claude/react/packages/*/src/*.js` (look for `@flow` annotations). Find TS types in `.claude/react/packages/*/index.d.ts`. Note discrepancies. |

### Step 3: Agent Prompts

Use these exact prompts when spawning agents:

#### test-explorer
```
You are researching React's <TOPIC>.

CRITICAL: Do NOT rely on your prior knowledge about this API. Your training may contain outdated or incorrect patterns. Only report what you find in the source files.

Your task: Find test files in .claude/react that demonstrate <TOPIC> usage.

1. Search for test files: Glob for `**/__tests__/**/*<topic>*` and `**/__tests__/**/*.js` then grep for <topic>
2. For each relevant test file, extract:
   - The test description (describe/it blocks)
   - The actual usage code
   - Any assertions about behavior
   - Edge cases being tested
3. Report findings with exact file paths and line numbers

Format your output as:
## Test File: <path>
### Test: "<test description>"
```javascript
<exact code from test>
```
**Behavior:** <what the test asserts>
```

#### source-explorer
```
You are researching React's <TOPIC>.

CRITICAL: Do NOT rely on your prior knowledge about this API. Only report what you find in the source files.

Your task: Find warnings, errors, and implementation details for <TOPIC>.

1. Search .claude/react/packages/*/src/ for:
   - console.error mentions of <topic>
   - console.warn mentions of <topic>
   - Error messages mentioning <topic>
   - The main implementation file
2. For each warning/error, document:
   - The exact message text
   - The condition that triggers it
   - The source file and line number

Format your output as:
## Warnings & Errors
| Message | Trigger Condition | Source |
|---------|------------------|--------|
| "<exact message>" | <condition> | <file:line> |

## Implementation Notes
<key details from source code>
```

#### git-historian
```
You are researching React's <TOPIC>.

CRITICAL: Do NOT rely on your prior knowledge. Only report what you find in git history.

Your task: Find commit messages that explain <TOPIC> design decisions.

1. Run: cd .claude/react && git log --all --grep="<topic>" --oneline -50
2. For significant commits, read full message: git show <hash> --stat
3. Look for:
   - Initial introduction of the API
   - Bug fixes (reveal edge cases)
   - Behavior changes
   - Deprecation notices

Format your output as:
## Key Commits
### <short hash> - <subject>
**Date:** <date>
**Context:** <why this change was made>
**Impact:** <what behavior changed>
```

#### pr-researcher
```
You are researching React's <TOPIC>.

CRITICAL: Do NOT rely on your prior knowledge. Only report what you find in PRs.

Your task: Find PRs that introduced or modified <TOPIC>.

1. Run: gh pr list -R facebook/react --search "<topic>" --state all --limit 20 --json number,title,url
2. For promising PRs, read details: gh pr view <number> -R facebook/react
3. Look for:
   - The original RFC/motivation
   - Design discussions in comments
   - Alternative approaches considered
   - Breaking changes

Format your output as:
## Key PRs
### PR #<number>: <title>
**URL:** <url>
**Summary:** <what it introduced/changed>
**Design Rationale:** <why this approach>
**Discussion Highlights:** <key points from comments>
```

#### issue-hunter
```
You are researching React's <TOPIC>.

CRITICAL: Do NOT rely on your prior knowledge. Only report what you find in issues.

Your task: Find issues that reveal common confusion about <TOPIC>.

1. Search facebook/react: gh issue list -R facebook/react --search "<topic>" --state all --limit 20 --json number,title,url
2. Search reactjs/react.dev: gh issue list -R reactjs/react.dev --search "<topic>" --state all --limit 20 --json number,title,url
3. For each issue, identify:
   - What the user was confused about
   - What the resolution was
   - Any gotchas revealed

Format your output as:
## Common Confusion
### Issue #<number>: <title>
**Repo:** <facebook/react or reactjs/react.dev>
**Confusion:** <what they misunderstood>
**Resolution:** <correct understanding>
**Gotcha:** <if applicable>
```

#### types-inspector
```
You are researching React's <TOPIC>.

CRITICAL: Do NOT rely on your prior knowledge. Only report what you find in type definitions.

Your task: Find and compare Flow and TypeScript type signatures for <TOPIC>.

1. Flow types (source of truth): Search .claude/react/packages/*/src/*.js for @flow annotations related to <topic>
2. TypeScript types: Search .claude/react/packages/*/index.d.ts and @types/react
3. Compare and note any discrepancies

Format your output as:
## Flow Types (Source of Truth)
**File:** <path>
```flow
<exact type definition>
```

## TypeScript Types
**File:** <path>
```typescript
<exact type definition>
```

## Discrepancies
<any differences between Flow and TS definitions>
```

### Step 4: Synthesize Results

After all agents complete, combine their findings into a single research document.

**DO NOT add information from your own knowledge.** Only include what agents found in sources.

### Step 5: Save Output

Write the final document to `.claude/research/<topic>.md`

Replace spaces in topic with hyphens (e.g., "suspense boundaries" → "suspense-boundaries.md")

## Output Document Template

```markdown
# React Research: <topic>

> Generated by /react-expert on YYYY-MM-DD
> Sources: React repo (commit <hash>), N PRs, M issues

## Summary

[Brief summary based SOLELY on source findings, not prior knowledge]

## API Signature

### Flow Types (Source of Truth)

[From types-inspector agent]

### TypeScript Types

[From types-inspector agent]

### Discrepancies

[Any differences between Flow and TS]

## Usage Examples

### From Tests

[From test-explorer agent - with file:line references]

### From PRs/Issues

[Real-world patterns from discussions]

## Caveats & Gotchas

[Each with source link]

- **<gotcha>** - Source: <link>

## Warnings & Errors

| Message | Trigger Condition | Source File |
|---------|------------------|-------------|
[From source-explorer agent]

## Common Confusion

[From issue-hunter agent]

## Design Decisions

[From git-historian and pr-researcher agents]

## Source Links

### Commits
- <hash>: <description>

### Pull Requests
- PR #<number>: <title> - <url>

### Issues
- Issue #<number>: <title> - <url>
```

## Error Code Research Mode

When invoked with `error` as the first argument, this skill switches to error-code research mode.

### Invocation

```
/react-expert error 310
/react-expert error 31
```

### Step 1: Setup React Repo

Same as standard mode (see above).

### Step 2: Look Up Error Message

Fetch the error codes JSON:

```bash
curl -s https://raw.githubusercontent.com/facebook/react/main/scripts/error-codes/codes.json | python3 -c "import sys,json; codes=json.load(sys.stdin); print(codes.get('<CODE>', 'NOT FOUND'))"
```

Record the exact message template. Note the number of `%s` placeholders.

### Step 3: Dispatch 7 Parallel Research Agents

Spawn these agents IN PARALLEL using the Task tool. Each agent receives the skepticism preamble plus the error message template.

| Agent | subagent_type | Focus |
|-------|---------------|-------|
| error-source-finder | Explore | Find all throw sites for this error code |
| test-explorer | Explore | Find tests that trigger this error |
| source-explorer | Explore | Find related warnings and dev-mode messages |
| pr-researcher | Explore | Find PRs that introduced or modified this error |
| issue-hunter | Explore | Find GitHub issues reporting this error |
| web-researcher | general-purpose | Web search for real-world developer struggles |
| git-historian | Explore | Find commits related to this error |

### Step 4: Error-Specific Agent Prompts

#### error-source-finder
```
You are researching React error code <CODE>.
Error message: "<MESSAGE>"

CRITICAL: Do NOT rely on your prior knowledge. Only report what you find in source files.

Your task: Find every location in the React source that throws error code <CODE>.

1. Search: grep -rn "<CODE>" .claude/react/packages/*/src/ (look for the error code in error/invariant calls)
2. Also search: grep -rn "error(<CODE>" .claude/react/packages/*/src/
3. For each throw site, document:
   - The exact file path and line number
   - The condition (if statement / validation) that triggers the throw
   - What each %s argument resolves to at that call site
   - The function/module context
4. Determine which throw sites correspond to user-facing scenarios vs internal invariants

Format:
## Throw Sites
### Site 1: <file>:<line>
**Condition:** <the if/validation check>
**Arguments:** %s1 = <value>, %s2 = <value>
**Context:** <function name and what it does>
**User-facing:** Yes/No
```

#### test-explorer (error mode)
```
You are researching React error code <CODE>.
Error message: "<MESSAGE>"

CRITICAL: Do NOT rely on your prior knowledge. Only report what you find in source files.

Your task: Find test files in .claude/react that trigger or test error <CODE>.

1. Search for the error code in test files: grep -rn "<CODE>" .claude/react/packages/*/src/__tests__/
2. Search for the error message text in tests
3. For each test, extract:
   - The test description (describe/it blocks)
   - The code that triggers the error
   - How the test asserts the error is thrown
4. Report findings with exact file paths and line numbers

Format:
## Test File: <path>
### Test: "<test description>"
```javascript
<exact code from test>
```
**Triggers error by:** <what the test does to cause the error>
```

#### source-explorer (error mode)
```
You are researching React error code <CODE>.
Error message: "<MESSAGE>"

CRITICAL: Do NOT rely on your prior knowledge. Only report what you find in source files.

Your task: Find related warnings and dev-mode messages for error <CODE>.

1. Find the file(s) where error <CODE> is thrown
2. Look for related console.error/console.warn calls near the throw sites
3. Check if there's a different dev-mode message that provides more detail
4. Document any related error codes thrown from the same functions

Format:
## Dev-Mode Messages
| Message | Relationship to Error <CODE> | Source |
|---------|------------------------------|--------|
| "<message>" | <how it relates> | <file:line> |

## Related Error Codes
| Code | Message | Thrown From Same Location? |
|------|---------|--------------------------|
```

#### web-researcher (error mode only)
```
You are researching React error code <CODE>.
Error message: "<MESSAGE>"

IMPORTANT: Web search IS allowed for error code research. Use WebSearch and WebFetch tools.

Your task: Find how real developers encounter and struggle with this error.

1. Search for:
   - "react error <CODE>"
   - "react minified error <CODE>"
   - "Minified React error #<CODE>"
   - The error message text itself
2. Look at Stack Overflow, GitHub Discussions, Reddit r/reactjs, and blog posts
3. For each relevant result, document:
   - What the developer was trying to do
   - What caused the error in their case
   - What solution worked
   - What they struggled with or found confusing
4. Identify the most common real-world scenarios

Format:
## Real-World Occurrences
### Source: <URL>
**Scenario:** <what the developer was doing>
**Cause:** <what triggered the error>
**Solution:** <what fixed it>
**Confusion:** <what they found confusing>

## Summary of Common Patterns
1. Most common cause: ...
2. Second most common: ...
3. What confuses people most: ...
```

#### pr-researcher (error mode)
```
You are researching React error code <CODE>.
Error message: "<MESSAGE>"

CRITICAL: Do NOT rely on your prior knowledge. Only report what you find in PRs.

Your task: Find PRs related to error <CODE>.

1. Run: gh pr list -R facebook/react --search "error <CODE>" --state all --limit 20 --json number,title,url
2. Also search: gh pr list -R facebook/react --search "<key words from error message>" --state all --limit 20 --json number,title,url
3. For promising PRs, read details: gh pr view <number> -R facebook/react
4. Look for: when this error was introduced, why, any changes to its behavior

Format:
## Key PRs
### PR #<number>: <title>
**URL:** <url>
**Summary:** <what it introduced/changed about this error>
**Design Rationale:** <why this error exists>
```

#### issue-hunter (error mode)
```
You are researching React error code <CODE>.
Error message: "<MESSAGE>"

CRITICAL: Do NOT rely on your prior knowledge. Only report what you find in issues.

Your task: Find GitHub issues where users report error <CODE>.

1. Search: gh issue list -R facebook/react --search "error <CODE>" --state all --limit 20 --json number,title,url
2. Search: gh issue list -R facebook/react --search "Minified React error #<CODE>" --state all --limit 20 --json number,title,url
3. Search: gh issue list -R reactjs/react.dev --search "error <CODE>" --state all --limit 20 --json number,title,url
4. For each issue, identify:
   - What triggered the error
   - The resolution
   - Common misunderstandings

Format:
## Issues
### Issue #<number>: <title>
**Repo:** <repo>
**Trigger:** <what caused the error>
**Resolution:** <how it was resolved>
**Misunderstanding:** <if applicable>
```

#### git-historian (error mode)
```
You are researching React error code <CODE>.
Error message: "<MESSAGE>"

CRITICAL: Do NOT rely on your prior knowledge. Only report what you find in git history.

Your task: Find commits related to error <CODE>.

1. Run: cd .claude/react && git log --all --grep="<CODE>" --oneline -30
2. Also: cd .claude/react && git log --all --grep="<key words from message>" --oneline -30
3. For significant commits, read full message: git show <hash> --stat
4. Look for when this error was introduced, modified, or discussed

Format:
## Key Commits
### <short hash> - <subject>
**Date:** <date>
**Context:** <why this change was made>
**Impact:** <what changed about this error>
```

### Step 5: Synthesize Results

After all agents complete, combine findings into a research document. Prioritize:
1. Throw sites and their conditions
2. Real-world causes (ordered by frequency from web research)
3. Developer pain points and confusion
4. Design rationale

**DO NOT add information from your own knowledge.** Only include what agents found.

### Step 6: Save Output

Write to `.claude/research/error-<CODE>.md`

### Error Research Output Template

```markdown
# React Error Research: Error #<CODE>

> Generated by /react-expert error <CODE> on YYYY-MM-DD
> Error message: "<message template>"
> Sources: React repo (commit <hash>), N throw sites, M issues, K web results

## Error Message

<exact template>

**Placeholders:** %s1 = <what it represents>, %s2 = ...

## Throw Sites

[From error-source-finder]

## Common Real-World Causes

[Synthesized from all agents — ordered by frequency from web research]

1. **<cause>** — seen in N Stack Overflow posts, M GitHub issues
2. **<cause>** — seen in ...

## Developer Pain Points

[From web-researcher — what confuses people]

## Dev-Mode Messages

[From source-explorer — messages shown in development that differ from production]

## Test Coverage

[From test-explorer — how React's own tests exercise this error]

## Design Decisions

[From git-historian and pr-researcher — why this error exists]

## GitHub Issues

[From issue-hunter]

## Source Links

### Commits
- <hash>: <description>

### Pull Requests
- PR #<number>: <title> - <url>

### Issues
- Issue #<number>: <title> - <url>

### Web Sources
- <url>: <brief description>
```

## Common Mistakes to Avoid

1. **Trusting prior knowledge** - If you "know" something about the API, find the source evidence anyway
2. **Generating example code** - Every code example must come from an actual source file
3. **Skipping agents** - All 6 agents must run; each provides unique perspective
4. **Summarizing without sources** - Every claim needs a file:line or PR/issue reference
5. **Using web search** - No Stack Overflow, no blog posts, no social media

## Verification Checklist

Before finalizing the research document:

- [ ] React repo is at `.claude/react` with known commit hash
- [ ] All 6 agents were spawned in parallel
- [ ] Every code example has a source file reference
- [ ] Warnings/errors table has source locations
- [ ] No claims made without source evidence
- [ ] Discrepancies between Flow/TS types documented
- [ ] Source links section is complete
