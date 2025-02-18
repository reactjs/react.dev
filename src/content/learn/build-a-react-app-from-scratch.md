---
title: Build a React app from Scratch
---

<Intro>

If your app has constraints not well-served by existing frameworks, you prefer to build your own framework, or you just want to learn the basics of a React app, you can build a React app from scratch.

</Intro>

<DeepDive>

#### Consider using a framework {/*consider-using-a-framework*/}

Starting from scratch is an easy way to get started using React, but a major tradeoff to be aware of is that going this route is often the same as building your own adhoc framework. As your requirements evolve, you may need to solve more framework-like problems that our recommended frameworks already have well developed and supported solutions for. 

For example, if in the future your app needs support for server-side rendering (SSR), static site generation (SSG), and/or React Server Components (RSC), you will have to implement those on your own. Similarly, future React features that require integrating at the framework level will have to be implemented on your own if you want to use them.

Our recommended frameworks also help you build better performing apps. For example, reducing or eliminating waterfalls from network requests makes for a better user experience. This might not be a high priority when you are building a toy project, but if your app gains users you may want to improve its performance.

Going this route also makes it more difficult to get support, since the way you develop routing, data-fetching, and other features will be unique to your situation. You should only choose this option if you are comfortable tackling these problems on your own, or if you’re confident that you will never need these features.

For a list of recommended frameworks, check out [Creating a React App](/learn/creating-a-react-app).

</DeepDive>


## Step 1: Install a build tool {/*step-1-install-a-build-tool*/}

The first step is to install a build tool like `vite`, `parcel`, or `rsbuild`. These build tools provide features to package and run source code, provide a development server for local development and a build command to deploy your app to a production server.

### Vite {/*vite*/}

[Vite](https://vite.dev/) is a build tool that aims to provide a faster and leaner development experience for modern web projects.

<TerminalBlock>
{`npm create vite@latest my-app -- --template react`}
</TerminalBlock>

Vite is opinionated and comes with sensible defaults out of the box. Vite has a rich ecosystem of plugins to support fast refresh, JSX,  Babel/SWC, and other common features. See Vite's [React plugin](https://vite.dev/plugins/#vitejs-plugin-react) or [React SWC plugin](https://vite.dev/plugins/#vitejs-plugin-react-swc) and [React SSR example project](https://vite.dev/guide/ssr.html#example-projects) to get started.

Vite is already being used as a build tool in one of our [recommended frameworks](/learn/creating-a-react-app): [React Router](https://reactrouter.com/start/framework/installation).

### Parcel {/*parcel*/}

[Parcel](https://parceljs.org/) combines a great out-of-the-box development experience with a scalable architecture that can take your project from just getting started to massive production applications.

<TerminalBlock>
{`npm install --save-dev parcel`}
</TerminalBlock>

Parcel supports fast refresh, JSX, TypeScript, Flow, and styling out of the box. See [Parcel's React recipe](https://parceljs.org/recipes/react/#getting-started) to get started.

### Rsbuild {/*rsbuild*/}

[Rsbuild](https://rsbuild.dev/) is an Rspack-powered build tool that provides a seamless development experience for React applications. It comes with carefully tuned defaults and performance optimizations ready to use.

<TerminalBlock>
{`npx create-rsbuild --template react`}
</TerminalBlock>

Rsbuild includes built-in support for React features like fast refresh, JSX, TypeScript, and styling. See [Rsbuild's React guide](https://rsbuild.dev/guide/framework/react) to get started.

<Note>

#### Metro for React Native {/*react-native*/}

If you'd you're starting from scratch with React Native you'll need to use [Metro](https://metrobundler.dev/), the JavaScript bundler for React Native. Metro supports bundling for platforms like iOS and Android, but lacks many features when compared to the tools here. We recommend starting with Vite, Parcel, or Rsbuild unless your project requires React Native support.

</Note>

## Step 2: Build Common Application Patterns {/*step-2-build-common-application-patterns*/}

The build tools listed above start off with a client-only, single-page app (SPA), but don't include any further solutions for common functionality like routing, data fetching, or styling.

The React ecosystem includes many tools for these problems. We've listed a few that are widely used as a starting point, but feel free to choose other tools if those work better for you.

### Routing {/*routing*/}

Routing determines what content or pages to display when a user visits a particular URL. You need to set up a router to map URLs to different parts of your app. You'll also need to handle nested routes, route parameters, and query parameters.  Routers can be configured within your code, or defined based on your component folder and file structures.

Routers are a core part of modern applications, and are usually integrated with data fetching (including prefetching data for a whole page for faster loading), code splitting (to minimize client bundle sizes), and page rendering approaches (to decide how each page gets generated).

We suggest using:

- [React Router](https://reactrouter.com/start/framework/custom)
- [Tanstack Router](https://tanstack.com/router/latest)


### Data Fetching {/*data-fetching*/}

Fetching data from a server or other data source is a key part of most applications. Doing this properly requires handling loading states, error states, and caching the fetched data, which can be complex.

Purpose-built data fetching libraries do the hard work of fetching and caching the data for you, letting you focus on what data your app needs and how to display it.  These libraries are typically used directly in your components, but can also be integrated into routing loaders for faster pre-fetching and better performance, and in server rendering as well.

Note that fetching data directly in components can lead to slower loading times due to network request waterfalls, so we recommend prefetching data in router loaders or on the server as much as possible!  This allows a page's data to be fetched all at once as the page is being displayed.

If you're fetching data from most backends or REST-style APIs, we suggest using:

- [React Query](https://react-query.tanstack.com/)
- [SWR](https://swr.vercel.app/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)

If you're fetching data from a GraphQL API, we suggest using:

- [Apollo](https://www.apollographql.com/docs/react)
- [Relay](https://relay.dev/)


### Code-splitting {/*code-splitting*/}

Code-splitting is the process of breaking your app into smaller bundles that can be loaded on demand. An app's code size increases with every new feature and additional dependency. Apps can become slow to load because all of the code for the entire app needs to be sent before it can be used. Caching, reducing features/dependencies, and moving some code to run on the server can help mitigate slow loading but are incomplete solutions that can sacrifice functionality if overused.

Similarly, if you rely on the apps using your framework to split the code, you might encounter situations where loading becomes slower than if no code splitting were happening at all. For example, [lazily loading](/reference/react/lazy) a chart delays sending the code needed to render the chart, splitting the chart code from the rest of the app. [Parcel supports code splitting with React.lazy](https://parceljs.org/recipes/react/#code-splitting). However, if the chart loads its data *after* it has been initially rendered you are now waiting twice. This is a waterfall: rather than fetching the data for the chart and sending the code to render it simultaneously, you must wait for each step to complete one after the other.

Splitting code by route, when integrated with bundling and data fetching, can reduce the initial load time of your app and the time it takes for the largest visible content of the app to render ([Largest Contentful Paint](https://web.dev/articles/lcp)).

For code-splitting instructions, see your build tool docs:
- [Vite build optimizations](https://v3.vitejs.dev/guide/features.html#build-optimizations)
- [Parcel code splitting](https://parceljs.org/features/code-splitting/)
- [Rsbuild code splitting](https://rsbuild.dev/guide/optimization/code-splitting)

### Improving Application Performance {/*improving-application-performance*/}

Since the build tool you select only support single page apps (SPAs) you'll need to implement other [rendering patterns](https://www.patterns.dev/vanilla/rendering-patterns) like server-side rendering (SSR), static site generation (SSG), and/or React Server Components (RSC). Even if you don't need these features at first, in the future there may be some routes that would benefit SSR, SSG or RSC.

* **Single-page apps (SPA)** load a single HTML page and dynamically updates the page as the user interacts with the app. SPAs are easier to get started with, but they can have slower initial load times. SPAs are the default architecture for most build tools.

* **Streaming Server-side rendering (SSR)** renders a page on the server and sends the fully rendered page to the client. SSR can improve performance, but it can be more complex to set up and maintain than a single-page app. With the addition of streaming, SSR can be very complex to set up and maintain. See [Vite's SSR guide]( https://vite.dev/guide/ssr).

* **Static site generation (SSG)** generates static HTML files for your app at build time. SSG can improve performance, but it can be more complex to set up and maintain than server-side rendering. See [Vite's SSG guide](https://vite.dev/guide/ssr.html#pre-rendering-ssg).

* **React Server Components (RSC)** lets you mix build-time, server-only, and interactive components in a single React tree. RSC can improve performance, but it currently requires deep expertise to set up and maintain. See [Parcel's RSC examples](https://github.com/parcel-bundler/rsc-examples).

Your rendering strategies need to integrate with your router so apps built with your framework can choose the rendering strategy on a per-route level. This will enable different rendering strategies without having to rewrite your whole app. For example, the landing page for your app might benefit from being statically generated (SSG), while a page with a content feed might perform best with server-side rendering. 

Using the right rendering strategy for the right routes can decrease the time it takes for the first byte of content to be loaded ([Time to First Byte](https://web.dev/articles/ttfb)), the first piece of content to render ([First Contentful Paint](https://web.dev/articles/fcp)), and the largest visible content of the app to render ([Largest Contentful Paint](https://web.dev/articles/lcp)).

### And more... {/*and-more*/}

These are just a few examples of the features a new app will need to consider when building from scratch. Many limitations you'll hit can be difficult to solve as each problem is interconnected with the others and can require deep expertise in problem areas you may not be familiar with. 

If you don't want to solve these problems on your own, you can [get started with a framework](/learn/creating-a-react-app) that provides these features out of the box. 
