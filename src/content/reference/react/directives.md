---
title: "Directives"
canary: true
---

<Canary>

These directives are needed only if you're [using React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) or building a library compatible with them.

</Canary>

<Intro>

Directives provide instructions to [bundlers compatible with React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks).

</Intro>

---

## Source code directives {/*source-code-directives*/}

* [`'use client'`](/reference/react/use-client) marks source files whose components execute on the client.
* [`'use server'`](/reference/react/use-server) marks server-side functions that can be called from client-side code.