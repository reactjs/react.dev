---
title: "Sunsetting Create React App"
author: Matt Carroll and Ricky Hanlon
date: 2025/02/14
description: Today, we’re deprecating Create React App for new apps, and encouraging existing apps to migrate to a framework. We’re also providing docs for when a framework isn’t a good fit for your project, or you prefer to start by building a framework.
---

February 14, 2025 by [Matt Carroll](https://twitter.com/mattcarrollcode) and [Ricky Hanlon](https://bsky.app/profile/ricky.fm)

---

<Intro>

Today, we’re deprecating [Create React App](https://create-react-app.dev/) for new apps, and encouraging existing apps to migrate to a [framework](/learn/creating-a-react-app). We’re also providing docs for when a framework isn’t a good fit for your project, or you prefer to start by [building a framework](/learn/building-a-react-framework).

</Intro>

-----

When we released Create React App in 2016, there was no clear way to build a new React app.

To create a React app, you had to install a bunch of tools and wire them up together yourself to support basic features like JSX, linting, and hot reloading. This was very tricky to do correctly, so the [community](https://github.com/react-boilerplate/react-boilerplate) [created](https://github.com/kriasoft/react-starter-kit) [boilerplates](https://github.com/petehunt/react-boilerplate) for [common](https://github.com/gaearon/react-hot-boilerplate) [setups](https://github.com/erikras/react-redux-universal-hot-example). However, boilerplates were difficult to update and fragmentation made it difficult for React to release new features.

Create React App solved these problems by combining several tools into a single recommended configuration. This allowed apps a simple way to upgrade to new tooling features, and allowed the React team to deploy non-trivial tooling changes (Fast Refresh support, React Hooks lint rules) to the broadest possible audience.

This model became so popular that there's an entire category of tools working this way today.

## Deprecating Create React App {/*deprecating-create-react-app*/}

Although Create React App makes it easy to get started, [there are several limitations](#limitations-of-create-react-app) that make it difficult to build high performant production apps. In principle, we could solve these problems by essentially evolving it into a [framework](#why-we-recommend-frameworks).

However, since Create React App currently has no active maintainers, and there are many existing frameworks that solve these problems already, we’ve decided to deprecate Create React App.

Starting today, if you install a new app, you will see a deprecation warning:

<ConsoleBlockMulti>
<ConsoleLogLine level="error">

create-react-app is deprecated.
{'\n\n'}
You can find a list of up-to-date React frameworks on react.dev
For more info see: react.dev/link/cra
{'\n\n'}
This error message will only be shown once per install.

</ConsoleLogLine>
</ConsoleBlockMulti>

We recommend [creating new React apps](/learn/creating-a-react-app) with a framework. All the frameworks we recommend support client-only SPAs, and can be deployed to a CDN or static hosting service without a server.

For existing apps, these guides will help you migrate to a client-only SPA:

* [Next.js’ Create React App migration guide](https://nextjs.org/docs/app/building-your-application/upgrading/from-create-react-app)
* [React Router’s framework adoption guide](https://reactrouter.com/upgrading/component-routes).
* [Expo Webpack to Expo Router migration guide](https://docs.expo.dev/router/migrate/from-expo-webpack/)

Create React App will continue working in maintenance mode, and we've published a new version of Create React App to work with React 19.

If your app has unusual constraints, or you prefer to solve these problems by building your own framework, or you just want to learn how react works from scratch, you can roll your own custom setup with React using Vite, Parcel or Rsbuild.

To help users get started with Vite, Parcel or Rsbuild, we've published new docs for [Building a Framework](/learn/building-a-react-framework). Continue reading to learn more about the [limitations of Create React App](#limitations-of-create-react-app) and [why we recommend frameworks](#why-we-recommend-frameworks).

<Note>

#### Do you recommend Vite? {/*do-you-recommend-vite*/}

We provide several Vite-based recommendations.

React Router v7 is a Vite based framework which allows you to use Vite's fast development server and build tooling with a framework that provides routing and data fetching. Just like the other frameworks we recommend, you can build a SPA with React Router v7.

We also recommend using Vite when [adding React to an existing project](/learn/add-react-to-an-existing-project), or [building a framework](/learn/building-a-react-framework).

Just like Svelte has Sveltekit, Vue has Nuxt, and Solid has SolidStart, React recommends using a framework that integrates with build tools like Vite for new projects.

</Note>

## Limitations of Create React App {/*limitations-of-create-react-app*/}

Create React App and build tools like it make it easy to get started building a React app. After running `npx create-react-app my-app`, you get a fully configured React app with a development server, linting, and a production build.

For example, if you're building an internal admin tool, you can start with a landing page:

```js
export default function App() {
  return (
    <div>
      <h1>Welcome to the Admin Tool!</h1>
    </div>
  )
}
```

This allows you to immediately start coding in React with features like JSX, default linting rules, and a bundler to run in both development and production. However, this setup is missing the tools you need to build a real production app.

Most production apps need solutions to problems like routing, data fetching, and code splitting.

### Routing {/*routing*/}

Create React App does not include a specific routing solution. If you're just getting started, one option is to use `useState` to switch between routes. But doing this means that you can't share links to your app - every link would go to the same page - and structuring your app becomes difficult over time:

```js
import {useState} from 'react';

import Home from './Home';
import Dashboard from './Dashboard';

export default function App() {
  // ❌ Routing in state does not create URLs
  const [route, setRoute] = useState('home');
  return (
    <div>
      {route === 'home' && <Home />}
      {route === 'dashboard' && <Dashbord />}
    </div>
  )
}
```

This is why most apps that use Create React App solve add routing with a routing library like [React Router](https://reactrouter.com/) or [Tanstack Router](https://tanstack.com/router/latest). With a routing library, you can add additional routes to the app, which provides opinions on the structure of your app, and allows you to start sharing links to routes. For example, with React Router you can define routes:

```js
import {RouterProvider, createBrowserRouter} from 'react-router';

import Home from './Home';
import Dashboard from './Dashboard';

// ✅ Each route has it's own URL
const router = createBrowserRouter([
  {path: '/', element: <Home />},
  {path: '/dashboard', element: <Dashboard />}
]);

export default function App() {
  return (
    <RouterProvider value={router} />
  )
}
```

With this change, you can share a link to `/dashboard` and the app will navigate to the dashboard page . Once you have a routing library, you can add additional features like nested routes, route guards, and route transitions, which are difficult to implement without a routing library.

There's a tradeoff being made here: the routing library adds complexity to the app, but it also adds features that are difficult to implement without it.

### Data Fetching {/*data-fetching*/}

Another common problem in Create React App is data fetching. Create React App does not include a specific data fetching solution. If you're just getting started, a common option is to use `fetch` in an effect to load data.

But doing this means that the data is fetched after the component renders, which can cause network waterfalls. Network waterfalls are caused by fetching data when your app renders instead of in parallel while the code is downloading:

```js
export default function Dashboard() {
  const [data, setData] = useState(null);

  // ❌ Fetching data in a component causes network waterfalls
  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  return (
    <div>
      {data.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  )
}
```

Fetching in an effect means the user has to wait longer to see the content, even though the data could have been fetched earlier. To solve this, you can use a data fetching library like [React Query](https://react-query.tanstack.com/), [SWR](https://swr.vercel.app/), [Apollo](https://www.apollographql.com/docs/react), or [Relay](https://relay.dev/) which provide options to prefetch data so the request is started before the component renders.

These libraries work best when integrated with your routing "loader" pattern to specify data dependencies at the route level, which allows the router to optimize your data fetches:

```js
export async function loader() {
  const response = await fetch(`/api/data`);
  const data = await response.json();
  return data;
}

// ✅ Fetching data in parallel while the code is downloading
export default function Dashboard({loaderData}) {
  return (
    <div>
      {loaderData.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  )
}
```

On initial load, the router can fetch the data immediately before the route is rendered. As the user navigates around the app, the router is able to fetch both the data and the route at the same time, parallelizing the fetches. This reduces the time it takes to see the content on the screen, and can improve the user experience.

However, this requires correctly configuring the loaders in your app and trades off complexity for performance.

### Code Splitting {/*code-splitting*/}

Another common problem in Create React App is [code splitting](https://www.patterns.dev/vanilla/bundle-splitting). Create React App does not include a specific code splitting solution. If you're just getting started, you might not consider code splitting at all.

This means your app is shipped as a single bundle:

```txt
- bundle.js    75kb
```

But for ideal performance, you should "split" your code into separate bundles so the user only needs to download what they need. This decreases the time the user needs to wait to load your app, by only downloading the code they need to see the page they are on.

```txt
- core.js      25kb
- home.js      25kb
- dashboard.js 25kb
```

One way to do code-splitting is with `React.lazy`. However, this means that the code is not fetched until the component renders, which can cause network waterfalls. A more optimal solution is to use a router feature that fetches the code in parallel while the code is downloading. For example, React Router provides a `lazy` option to specify that a route should be code split and optimize when it is loaded:

```js
import Home from './Home';
import Dashboard from './Dashboard';

// ✅ Routes are downloaded before rendering
const router = createBrowserRouter([
  {path: '/', lazy: () => import('./Home')},
  {path: '/dashboard', lazy: () => import('Dashboard')}
]);
```

Optimized code-splitting is tricky to get right, and it's easy to make mistakes that can cause the user to download more code than they need. It works best when integrated with your router and data loading solutions to maximize caching, parallelize fetches, and support ["import on interaction"](https://www.patterns.dev/vanilla/import-on-interaction) patterns.

### And more... {/*and-more*/}

These are just a few examples of the limitations of Create React App.

Once you've integrated routing, data-fetching, and code splitting, you now also need to consider pending states, navigation interruptions, error messages to the user, and revalidation of the data. There are entire categories of problems that users need to solve like:

<div style={{display: 'flex', width: '100%', justifyContent: 'space-around'}}>
  <ul>
    <li>Accessibility</li>
    <li>Asset loading</li>
    <li>Authentication</li>
    <li>Caching</li>
  </ul>
  <ul>
    <li>Error handling</li>
    <li>Mutating data</li>
    <li>Navigations</li>
    <li>Optimistic updates</li>
  </ul>
  <ul>
    <li>Progressive enhancement</li>
    <li>Server-side rendering</li>
    <li>Static site generation</li>
    <li>Streaming</li>
  </ul>
</div>

All of these work together to create the most optimal [loading sequence](https://www.patterns.dev/vanilla/loading-sequence).

Solving each of these problems individually in Create React App can be difficult as each problem is interconnected with the others and can require deep expertise in problem areas users may not be familiar with. In order to solve these problems, users end up building their own bespoke solutions on top of Create React App, which was the problem Create React App originally tried to solve.

## Why we Recommend Frameworks {/*why-we-recommend-frameworks*/}

Although you could solve all these pieces yourself in a build tool like Create React App, Vite, or Parcel, it is hard to do well. Just like when Create React App itself integrated several build tools together, you need a tool to integrate all of these features together to provide the best experience to users.

This category of tools that integrates build tools, rendering, routing, data fetching, and code splitting are known as "frameworks" -- or if you prefer to call React itself a framework, you might call them "metaframeworks".

Frameworks impose some opinions about structuring your app in order to provide a much better user experience, in the same way build tools impose some opinions to make tooling easier. This is why we started recommending frameworks like [Next.js](https://nextjs.org/), [React Router](https://reactrouter.com/), and [Expo](https://expo.dev/) for new projects.

Frameworks provide the same getting started experience as Create React App, but also provide solutions to problems users need to solve anyway in real production apps.

<DeepDive>

#### Server rendering is optional {/*server-rendering-is-optional*/}

The frameworks we recommend all provide the option to create a [client-side rendered (CSR)](https://developer.mozilla.org/en-US/docs/Glossary/CSR) app.

In some cases, CSR is the right choice for a page, but many times it's not. Even if most of your app is client-side, there are often individual pages that could benefit from server rendering features like [static-site generation (SSG)](https://developer.mozilla.org/en-US/docs/Glossary/SSG) or [server-side rendering (SSR)](https://developer.mozilla.org/en-US/docs/Glossary/SSR), for example a Terms of Service page, or documentation.

Server rendering generally sends less JavaScript to the client, and a full HTML document which produces a faster [First Contentful Paint (FCP)](https://web.dev/articles/fcp) by reducing [Total Blocking Time (TBD)](https://web.dev/articles/tbt), which can also lower [Interaction to Next Paint (INP)](https://web.dev/articles/inp). This is why the [Chrome team has encouraged](https://web.dev/articles/rendering-on-the-web) developers to consider static or server-side render over a full client-side approach to achieve the best possible performance.

There are tradeoffs to using a server, and it is not always the best option for every page. Generating pages on the server incurs additional cost and takes time to generate which can increase [Time to First Byte (TTFB)](https://web.dev/articles/ttfb). The best performing apps are able to pick the right rendering strategy on a per-page basis, based on the tradeoffs of each strategy.

Frameworks provide the option to use a server on any page if you want to, but do not force you to use a server. This allows you to pick the right rendering strategy for each page in your app.

#### What About Server Components {/*server-components*/}

The frameworks we recommend also include support for React Server Components.

Server Components help solve these problems by moving routing and data fetching to the server, and allowing code splitting to be done for client components based on the data you render, instead of just the route rendered, and reducing the amount of JavaScript shipped for the best possible [loading sequence](https://www.patterns.dev/vanilla/loading-sequence).

Server Components do not require a server. They can be run at build time on your CI server to create a static-site generated app (SSG) app, at runtime on a web server for a server-side rendered (SSR) app.

See [Introducing zero-bundle size React Server Components](/blog/2020/12/21/data-fetching-with-react-server-components) and [the docs](/reference/rsc/server-components) for more info.

</DeepDive>

<Note>

#### Server Rendering is not just for SEO {/*server-rendering-is-not-just-for-seo*/}

A common misunderstanding is that server rendering is only for [SEO](https://developer.mozilla.org/en-US/docs/Glossary/SEO).

While server rendering can improve SEO, it also improves performance by reducing the amount of JavaScript the user needs to download and parse before they can see the content on the screen.

This is why the Chrome team [has encouraged](https://web.dev/articles/rendering-on-the-web) developers to consider static or server-side render over a full client-side approach to achieve the best possible performance.

</Note>

---

_Thank you to [Dan Abramov](https://bsky.app/profile/danabra.mov) for creating Create React App, and [Joe Haddad](https://github.com/Timer), [Ian Schmitz](https://github.com/ianschmitz), [Brody McKee](https://github.com/mrmckeb), and [many others](https://github.com/facebook/create-react-app/graphs/contributors) for maintaining Create React App over the years. Thank you to [Brooks Lybrand](https://bsky.app/profile/brookslybrand.bsky.social), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Devon Govett](https://bsky.app/profile/devongovett.bsky.social), [Eli White](https://x.com/Eli_White), [Jack Herrington](https://bsky.app/profile/jherr.dev), [Joe Savona](https://x.com/en_JS), [Lauren Tan](https://bsky.app/profile/no.lol), [Lee Robinson](https://x.com/leeerob), [Mark Erikson](https://bsky.app/profile/acemarke.dev), [Ryan Florence](https://x.com/ryanflorence), [Sophie Alpert](https://bsky.app/profile/sophiebits.com), [Tanner Linsley](https://bsky.app/profile/tannerlinsley.com), and [Theo Browne](https://x.com/theo) for reviewing and providing feedback on this post._

