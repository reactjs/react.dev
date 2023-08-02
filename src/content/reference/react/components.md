---
title: "Built-in React Components"
---

<Intro>

React exposes a few built-in components that you can use in your JSX.

</Intro>

---

## Built-in components {/*built-in-components*/}

* [`<Fragment>`](/reference/react/Fragment), alternatively written as `<>...</>`, lets you group multiple JSX nodes together.
* [`<Profiler>`](/reference/react/Profiler) lets you measure rendering performance of a React tree programmatically.
* [`<Suspense>`](/reference/react/Suspense) lets you display a fallback while the child components are loading.
* [`<StrictMode>`](/reference/react/StrictMode) enables extra development-only checks that help you find bugs early.

---

## Your own components {/*your-own-components*/}

You can also [define your own components](/learn/your-first-component) as JavaScript functions.

---

## Client and server components {/*client-and-server-components*/}

<Wip>
[React server components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) are only available in React’s canary and experimental channels. Learn more about [React's release channels here](/community/versioning-policy#all-release-channels).
</Wip>

<Note>

React server components require the use of [a supported framework](/learn/start-a-new-react-project#bleeding-edge-react-frameworks). If you're aren't working with a framework that support React server components, all the components you interact with are treated as client components.

</Note>

There are two main types of components in React: server components and client components. Both types follow the same basic principles of React - they are reusable, composable, and stateful - but they are used in different scenarios and have different capabilities.

### Server components {/*server-components*/}

Server components allow developers to leverage the power of server-side rendering while maintaining the interactivity and richness of a client-side React application. They are rendered only on the server and have zero impact on the client-side bundle size, making them an excellent choice for parts of your application that are not interactive and don't need to be updated in response to user interaction.

### Client components {/*client-components*/}

Client components can access the full range of React features, including state, effects, and access to the DOM. They are essential for creating rich, interactive features where users expect immediate feedback. Client component must have the [`'use client'` directive](/reference/react/use-client#use-client) place at the top of the file they are defined in.

In the following sections, we will delve deeper into the characteristics, capabilities, and use cases of both server components and client Components.
