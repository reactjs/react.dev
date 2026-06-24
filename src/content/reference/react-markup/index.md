---
title: React Markup APIs
---

<Intro>

The `react-markup` package provides the ability to render standalone HTML from Server Components for use in embedded contexts such as e-mails and RSS/Atom feeds. 
It cannot use Client Components and does not hydrate. It is intended to be paired with the generic React package, which is shipped as `react` to npm.

</Intro>

## APIs {/*apis*/}

These APIs can be imported from the React Server environment (e.g. in Server Actions):

* [`renderToHTML`](/reference/react-markup/renderToHTML) renders a non-interactive React tree with support for Server Components but not Client Components. 