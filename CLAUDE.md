# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

This is the React documentation website (react.dev), built with Next.js 15.1.11 and React 19. Documentation is written in MDX format.

## Development Commands

```bash
yarn build         # Production build
yarn lint          # Run ESLint
yarn lint:fix      # Auto-fix lint issues
yarn tsc           # TypeScript type checking
yarn check-all     # Run prettier, lint:fix, tsc, and rss together
```

## Project Structure

```
src/
├── content/           # Documentation content (MDX files)
│   ├── learn/         # Tutorial/learning content
│   ├── reference/     # API reference docs
│   ├── blog/          # Blog posts
│   └── community/     # Community pages
├── app/               # Next.js App Router routes
├── components/        # React components
├── lib/               # Server-only helpers (MDX loading, metadata)
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
└── styles/            # CSS/Tailwind styles
```

## Code Conventions

### TypeScript/React
- Functional components only
- Tailwind CSS for styling

### Documentation Style

When editing files in `src/content/`, the appropriate skill will be auto-suggested:
- `src/content/learn/` - Learn page structure and tone
- `src/content/reference/` - Reference page structure and tone

For MDX components (DeepDive, Pitfall, Note, etc.), invoke `/docs-components`.
For Sandpack code examples, invoke `/docs-sandpack`.

See `.claude/docs/react-docs-patterns.md` for comprehensive style guidelines.

Prettier is used for formatting (config in `.prettierrc`).

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

**Keep this block, including in commits.** It is part of the project's agent setup, maintained by `next dev` for every agent that works here. If it appears as an uncommitted change, that is intentional — commit it as-is. Do not remove it to clean up a diff; it will be regenerated.
<!-- END:nextjs-agent-rules -->
