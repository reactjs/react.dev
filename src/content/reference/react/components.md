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

--

## Client and Server Components {/*client-and-server-components*/}

<Wip>
[React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) are only available in React’s canary and experimental channels. Learn more about [React's release channels here](/community/versioning-policy#all-release-channels).
</Wip>

There are two main types of components in React: Server Components and Client Components. Both types follow the same basic principles of React - they are reusable, composable, and stateful - but they are used in different scenarios and have different capabilities.

### Server Components {/*server-components*/}

Server Components are a new addition to React that allow developers to leverage the power of server-side rendering while maintaining the interactivity and richness of a client-side React application. They are rendered only on the server and have zero impact on the client-side bundle size, making them an excellent choice for parts of your application that are not interactive and don't need to be updated in response to user interaction.

### Client Components {/*client-components*/}

Client Components are the traditional React components that run on the client. They can access the full range of React features, including state, effects, and access to the DOM. They are essential for creating rich, interactive features where users expect immediate feedback.

In the following sections, we will delve deeper into the characteristics, capabilities, and use cases of both Server Components and Client Components.
