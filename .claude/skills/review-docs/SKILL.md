---
name: review-docs
description: Use when reviewing React documentation for structure, components, and style compliance
---
CRITICAL: do not load these skills yourself.

Run these tasks in parallel for the given file(s). Each agent checks different aspects—not all apply to every file:

- [ ] Ask docs-reviewer agent to review {files} with docs-writer-learn (only for files in src/content/learn/).
- [ ] Ask docs-reviewer agent to review {files} with docs-writer-reference (only for files in src/content/reference/).
- [ ] Ask docs-reviewer agent to review {files} with docs-writer-blog (only for files in src/content/blog/).
- [ ] Ask docs-reviewer agent to review {files} with docs-voice (all documentation files).
- [ ] Ask docs-reviewer agent to review {files} with docs-components (all documentation files).
- [ ] Ask docs-reviewer agent to review {files} with docs-sandpack (files containing Sandpack examples).

If no file is specified, check git status for modified MDX files in `src/content/`.

The docs-reviewer will return a checklist of the issues it found. Respond with the full checklist and line numbers from all agents, and prompt the user to create a plan to fix these issues.


