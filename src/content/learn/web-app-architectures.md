---
title: Web App Architectures
---

<Intro>

Different web apps have different needs. Learn the most common patterns and architectures to help build your app with great performance, and decide which tools and patterns work best for your project.

</Intro>

## Application Architectures {/*application-architectures*/}

Modern web apps have a broad range of architecture designs, and the needs of each app can vary based on the intended features and target audience.

### Architecture Categories {/*architecture-categories*/}

Historically, most apps have been classified into three architectural categories:

#### Multi-Page Apps {/*multi-page-apps*/}

Multi-Page Apps are the original pattern found on the web. This pattern typically involves a web app server that responds to requests by running calculations, fetching data from a database, and returning plain HTML.

MPAs are fast to load, because the browser only has to process the HTML and CSS for display without needing to load and run much JS.  However, they can take longer for individual user interactions, because every click or form submission requires sending a full request to the server and waiting for the new page to be sent back.

#### Single-Page Apps (SPA) {/*single-page-apps*/}

A standard Single-Page App consists of static HTML, JS, and CSS files that are served to the client. The client loads the JS for the app, and the JS then renders and displays all of the content on the client, inside the browser.  An SPA client typically relies on fetching data from a server API, usually with the data in JSON format.

SPAs can provide faster user interactions, because they can immediately respond to user input. SPAs are simple to deploy, because they consist of static files that can be uploaded to a CDN or any other web server.  The architecture can be simpler, because there's just the client code running in the browser, and no mixture of different rendering patterns.

However, SPAs also can take longer for the initial load due to increased JS bundle sizes.  Additionally, data fetching can require handling more loading states and may have more network waterfalls leading to slower loading times.


#### Static Site Generation (SSG) {/*static-site-generation*/}

Static sites involve generating plain HTML files from code and data sources at build time.  This could include using Markdown files to create a blog, or fetching database entries to generate item pages for an ecommerce site.

Static sites load extremely fast, because the server just needs to return the HTML file that was requested.  But, they would need additional JS to run on the client to add interactivity.

### Rendering Strategies {/*rendering-strategies*/}

Another way to look at application architectures is to group them based on how each page gets rendered.

* **Single-page apps (SPA)** load a single HTML page and dynamically updates the page as the user interacts with the app. SPAs are fast and responsive, but they can have slower initial load times. SPAs are the default architecture for most build tools.

* **Streaming Server-side rendering (SSR)** renders a page on the server and sends the fully rendered page to the client. SSR can improve performance, but it can be more complex to set up and maintain than a single-page app. Adding streaming of responses can speed up performance as well. See [Vite's SSR guide]( https://vite.dev/guide/ssr).

* **Static site generation (SSG)** generates static HTML files for your app at build time. SSG can improve performance, but it can be more complex to set up and maintain than server-side rendering.

* **React Server Components (RSC)** lets you mix build-time, server-only, and interactive components in a single React tree. RSC can improve performance because only the rendered output for parts of the page needs to be sent for the client, minimizing JS bundle size and network traffic.


Your rendering strategies need to integrate with your router so apps built with your framework can choose the rendering strategy on a per-route level. This will enable different rendering strategies without having to rewrite your whole app. For example, the landing page for your app might benefit from being statically generated (SSG), while a page with a content feed might perform best with server-side rendering. 

Using the right rendering strategy for the right routes can improve app performance, as shown by scores on the [Core Web Vitals metrics](https://web.dev/explore/learn-core-web-vitals).  This can include decreasing the time it takes for the first byte of content to be loaded ([Time to First Byte](https://web.dev/articles/ttfb)), the first piece of content to render ([First Contentful Paint](https://web.dev/articles/fcp)), and the largest visible content of the app to render ([Largest Contentful Paint](https://web.dev/articles/lcp)).

### Modern App Architectures {/*modern-app-architectures*/}

In practice, today's web apps are often a mixture of all of those techniques.  

A single app codebase might do initial static site generation at build time to produce initial HTML files for most of the pages.  It could then load React into each page on the client side to add more interactivity, providing faster loading time than a plain SPA but better interactivity than a plain SSG.  Similarly, the same codebase could have some pages that let the server generate the initial HTML, then add React for the interactivity on the client side.  Either way, once the initial page load happens, the app behaves more like an SPA as the user interacts and navigates.

Some frameworks let you generate an initial set of static pages, then incrementally regenerate them over time or cache the results of a requested page for faster loading in the future.

Modern React frameworks let you mix and match these approaches, either by configuring which approach to use for a specific page, enabling or disabling features, or choosing to use only the client-side features of the framework to export an SPA that doesn't need an application server.

If you're building a project from scratch, that usually limits you to client-side SPA functionality, because server-side functionality requires more specific integration work.


## Common Application Patterns {/*common-application-patterns*/}

We've found that most React apps have similar needs for data fetching and routing, and benefit from performance patterns like code splitting.

If you're using an existing React Framework, it includes solutions to these standard patterns already.  If you're starting from scratch, you'll need to choose and configure libraries to solve these problems, which will take additional work.

### Routing {/*routing*/}

Routing determines what content or pages to display when a user visits a particular URL. You need to set up a router to map URLs to different parts of your app. You'll also need to handle nested routes, route parameters, and query parameters.  Routers can be configured within your code, or defined based on your component folder and file structures.

Routers are a core part of modern applications, and are usually integrated with data fetching (including prefetching data for a whole page for faster loading), code splitting (to minimize client bundle sizes), and page rendering approaches (to decide how each page gets generated).

At a basic level, routing _could_ be as simple as having a `useState` to switch between routes. But doing this means that you can't share links to your app - every link would go to the same page - and structuring your app becomes difficult over time:

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

Existing frameworks like Next, React Router v7, and Expo include built-in routing solutions.  If you're starting from scratch, you'll need to add routing support yourself, with a library like [React Router](https://reactrouter.com/) or [Tanstack Router](https://tanstack.com/router/latest).  With a routing library, you can add additional routes to the app, which provides opinions on the structure of your app, and allows you to start sharing links to routes. For example, with React Router you can define routes:

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

Fetching data from a server or other data source is a key part of most applications. Doing this properly requires handling loading states, error states, and caching the fetched data, which can be complex.

Integrating routing and data fetching is particularly important to prevent network waterfalls. In a SPA, if you fetch data during a component's initial render, the first data fetch is delayed until all code has loaded and components have finished rendering. This is commonly known as a waterfall: instead of fetching data at the same time as your code is loading, you need to first wait for your code to load before fetching data. To address these waterfalls, your app needs to fetch the data for each route in parallel with sending code to the browser.

React frameworks provide multiple forms of built-in data fetching functionality. This includes Server-Side Rendering to fetch initial data for a page, Server Actions, and React Server Components.  These can help avoid network waterfalls. They also typically enable use of Suspense for managing display of loading states.

For data fetching on the client side, the basic approach would be to use `fetch` in an effect to load the data:

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

However, writing your own fetching logic and managing loading states quickly becomes unmaintainable.

If you do need to fetch data on the client, there are purpose-built data fetching libraries that [do the hard work of fetching and caching the data for you](https://tkdodo.eu/blog/why-you-want-react-query), letting you focus on what data your app needs and how to display it.  These libraries are typically used directly in your components, but can also be integrated into routing loaders for faster pre-fetching and better performance, and in server rendering as well.

Even with these data fetching libraries, note that fetching data directly in components can lead to slower loading times due to network request waterfalls, where parent components fetch data, render children, and then the children fetch additional data.  This is slow because the requests happen in sequence.  Because of that, we recommend prefetching data in router loaders or on the server as much as possible!  This allows a page's data to be fetched all at once as the page is being displayed.



### Code Splitting {/*code-splitting*/}

Code-splitting is the process of breaking your app into smaller bundles that can be loaded on demand. An app's code size increases with every new feature and additional dependency. Apps can become slow to load because all of the code for the entire app needs to be sent before it can be used. 

If you're just getting started, you might not consider code splitting at all.

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

Build tools have basic support for code splitting, usually by looking for `import()` statements to identify where to split into separate files.

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

Modern React frameworks that integrate build tools and routing can automatically do code splitting for you.

Splitting code by route, when integrated with bundling and data fetching, can reduce the initial load time of your app and improve CWV metrics like the time it takes for the largest visible content of the app to render ([Largest Contentful Paint](https://web.dev/articles/lcp)).


## Why We Recommend Frameworks {/*why-we-recommend-frameworks*/}

Although you could solve all these pieces yourself in a build tool like Create React App, Vite, or Parcel, it is hard to do well. Just like when Create React App itself integrated several build tools together, you need a tool to integrate all of these features together to provide the best experience to users.

This category of tools that integrates build tools, rendering, routing, data fetching, and code splitting are known as "frameworks" -- or if you prefer to call React itself a framework, you might call them "metaframeworks".

Frameworks impose some opinions about structuring your app in order to provide a much better user experience, in the same way build tools impose some opinions to make tooling easier. This is why we started recommending frameworks like [Next.js](https://nextjs.org/), [React Router](https://reactrouter.com/), and [Expo](https://expo.dev/) for new projects.

Frameworks provide the same getting started experience as Create React App, but also provide solutions to problems users need to solve anyway in real production apps.

## Architecture Considerations {/*architecture-considerations*/}

There are many factors that go into deciding the right architecture(s) for each application.  Here are some important points to take into consideration.

### Application Types {/*application-types*/}

One way to approach deciding on the right architectures is to look at the kind of application you are building.

The post [Application Holotypes: A Guide to Architecture Decisions](https://jasonformat.com/application-holotypes/) describes a spectrum of applications, each with their own variation of architectural needs. For example, a social media app might work well as a Single Page App, whereas an ecommerce site might benefit from a Server-Side Rendering architecture with some client interactivity.

The [Patterns.dev guide on rendering and architectural patterns](https://www.patterns.dev/vanilla/rendering-patterns) also gives excellent insight into the different architectural techniques available and when to apply them.

### Server rendering is optional {/*server-rendering-is-optional*/}

The frameworks we recommend all provide the option to create a [client-side rendered (CSR)](https://developer.mozilla.org/en-US/docs/Glossary/CSR) app.

In some cases, CSR is the right choice for a page, but many times it's not. Even if most of your app is client-side, there are often individual pages that could benefit from server rendering features like [static-site generation (SSG)](https://developer.mozilla.org/en-US/docs/Glossary/SSG) or [server-side rendering (SSR)](https://developer.mozilla.org/en-US/docs/Glossary/SSR), for example a Terms of Service page, or documentation.

Server rendering generally sends less JavaScript to the client, and a full HTML document which produces a faster [First Contentful Paint (FCP)](https://web.dev/articles/fcp) by reducing [Total Blocking Time (TBD)](https://web.dev/articles/tbt), which can also lower [Interaction to Next Paint (INP)](https://web.dev/articles/inp). This is why the [Chrome team has encouraged](https://web.dev/articles/rendering-on-the-web) developers to consider static or server-side render over a full client-side approach to achieve the best possible performance.

There are tradeoffs to using a server, and it is not always the best option for every page. Generating pages on the server incurs additional cost and takes time to generate which can increase [Time to First Byte (TTFB)](https://web.dev/articles/ttfb). The best performing apps are able to pick the right rendering strategy on a per-page basis, based on the tradeoffs of each strategy.

Frameworks provide the option to use a server on any page if you want to, but do not force you to use a server. This allows you to pick the right rendering strategy for each page in your app.



### Server Rendering is not just for SEO {/*server-rendering-is-not-just-for-seo*/}

A common misunderstanding is that server rendering is only for [SEO](https://developer.mozilla.org/en-US/docs/Glossary/SEO).

While server rendering can improve SEO, it also improves performance by reducing the amount of JavaScript the user needs to download and parse before they can see the content on the screen.

This is why the Chrome team [has encouraged](https://web.dev/articles/rendering-on-the-web) developers to consider static or server-side render over a full client-side approach to achieve the best possible performance.

### What About Server Components? {/*server-components*/}

The frameworks we recommend also include support for React Server Components.

Server Components help solve these problems by moving routing and data fetching to the server, and allowing code splitting to be done for client components based on the data you render, instead of just the route rendered, and reducing the amount of JavaScript shipped for the best possible [loading sequence](https://www.patterns.dev/vanilla/loading-sequence).

Server Components do not require a server. They can be run at build time on your CI server to create a static-site generated app (SSG) app, at runtime on a web server for a server-side rendered (SSR) app.

See [Introducing zero-bundle size React Server Components](/blog/2020/12/21/data-fetching-with-react-server-components) and [the docs](/reference/rsc/server-components) for more info.



### Which features make up the React team’s full-stack architecture vision? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

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
