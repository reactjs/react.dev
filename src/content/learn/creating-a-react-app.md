---
title: Creating a React App
---

<Intro>

If you want to build a new app or website with React, we recommend starting with a framework.

</Intro>

If your app has constraints not well-served by existing frameworks, you prefer to build your own framework, or you just want to learn the basics of a React app, you can [build a React app from scratch](/learn/build-a-react-app-from-scratch).

## Full-stack frameworks {/*full-stack-frameworks*/}

These recommended frameworks support all the features you need to deploy and scale your app in production. They have integrated the latest React features and take advantage of React’s architecture.

<Note>

#### Full-stack frameworks do not require a server. {/*react-frameworks-do-not-require-a-server*/}

All the frameworks on this page support client-side rendering ([CSR](https://developer.mozilla.org/en-US/docs/Glossary/CSR)), single-page apps ([SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA)), and static-site generation ([SSG](https://developer.mozilla.org/en-US/docs/Glossary/SSG)). These apps can be deployed to a [CDN](https://developer.mozilla.org/en-US/docs/Glossary/CDN) or static hosting service without a server. Additionally, these frameworks allow you to add server-side rendering on a per-route basis, when it makes sense for your use case.

This allows you to start with a client-only app, and if your needs change later, you can opt-in to using server features on individual routes without rewriting your app. See your framework's documentation for configuring the rendering strategy.

</Note>

### Next.js (App Router) {/*nextjs-app-router*/}

**[Next.js's App Router](https://nextjs.org/docs) is a React framework that takes full advantage of React's architecture to enable full-stack React apps.**

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

Next.js is maintained by [Vercel](https://vercel.com/). You can [deploy a Next.js app](https://nextjs.org/docs/app/building-your-application/deploying) to any Node.js or serverless hosting, or to your own server. Next.js also supports [static export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) which doesn't require a server. Vercel additionally provides opt-in paid cloud services.

### React Router (v7) {/*react-router-v7*/}

**[React Router](https://reactrouter.com/start/framework/installation) is the most popular routing library for React and can be paired with Vite to create a full-stack React framework**. It emphasizes standard Web APIs and has several [ready to deploy templates](https://github.com/remix-run/react-router-templates) for various JavaScript runtimes and platforms.

To create a new React Router framework project, run:

<TerminalBlock>
npx create-react-router@latest
</TerminalBlock>

React Router is maintained by [Shopify](https://www.shopify.com).

### Expo (for native apps) {/*expo*/}

**[Expo](https://expo.dev/) is a React framework that lets you create universal Android, iOS, and web apps with truly native UIs.** It provides an SDK for [React Native](https://reactnative.dev/) that makes the native parts easier to use. To create a new Expo project, run:

<TerminalBlock>
npx create-expo-app@latest
</TerminalBlock>

If you're new to Expo, check out the [Expo tutorial](https://docs.expo.dev/tutorial/introduction/).

Expo is maintained by [Expo (the company)](https://expo.dev/about). Building apps with Expo is free, and you can submit them to the Google and Apple app stores without restrictions. Expo additionally provides opt-in paid cloud services.


## Other frameworks {/*other-frameworks*/}

There are other up-and-coming frameworks that are working towards our full stack React vision:

- [TanStack Start (Beta)](https://tanstack.com/): TanStack Start is a full-stack React framework powered by TanStack Router. It provides a full-document SSR, streaming, server functions, bundling, and more using tools like Nitro and Vite.
- [RedwoodJS](https://redwoodjs.com/): Redwood is a full stack React framework with lots of pre-installed packages and configuration that makes it easy to build full-stack web applications.

<DeepDive>

#### Which features make up the React team’s full-stack architecture vision? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Next.js's App Router bundler fully implements the official [React Server Components specification](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md). This lets you mix build-time, server-only, and interactive components in a single React tree.

For example, you can write a server-only React component as an `async` function that reads from a database or from a file. Then you can pass data down from it to your interactive components:

```js
// This component runs *only* on the server (or during the build).
async function Talks({ confId }) {
  // 1. You're on the server, so you can talk to your data layer. API endpoint not required.
  const talks = await db.Talks.findAll({ confId });

  // 2. Add any amount of rendering logic. It won't make your JavaScript bundle larger.
  const videos = talks.map(talk => talk.video);

  // 3. Pass the data down to the components that will run in the browser.
  return <SearchableVideoList videos={videos} />;
}
```

Next.js's App Router also integrates [data fetching with Suspense](/blog/2022/03/29/react-v18#suspense-in-data-frameworks). This lets you specify a loading state (like a skeleton placeholder) for different parts of your user interface directly in your React tree:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Server Components and Suspense are React features rather than Next.js features. However, adopting them at the framework level requires buy-in and non-trivial implementation work. At the moment, the Next.js App Router is the most complete implementation. The React team is working with bundler developers to make these features easier to implement in the next generation of frameworks.

</DeepDive>

## Start From Scratch {/*start-from-scratch*/}

If your app has constraints not well-served by existing frameworks, you prefer to build your own framework, or you just want to learn the basics of a React app, there are other options available for starting a React project from scratch.

Starting from scratch gives you more flexibility, but does require that you make choices on which tools to use for routing, data fetching, and other common usage patterns.  It's a lot like building your own framework, instead of using a framework that already exists. The [frameworks we recommend](#full-stack-frameworks) have built-in solutions for these problems.  

If you want to build your own solutions, see our guide to [build a React app from Scratch](/learn/build-a-react-app-from-scratch) for instructions on how to set up a new React project starting with a built tool like [Vite](https://vite.dev/), [Parcel](https://parceljs.org/), or [RSbuild](https://rsbuild.dev/).

-----

_If you’re a framework author interested in being included on this page, [please let us know](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+)._
