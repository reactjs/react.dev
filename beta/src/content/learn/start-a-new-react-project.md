---
title: Start a New React Project
---

<Intro>

If you want to build a new app or a new website fully with React, we recommend picking one of the React-powered frameworks popular in the community. Frameworks provide features that most apps and sites eventually need, including routing, data fetching, and generating HTML.

</Intro>

<Note>

**You need to install [Node.js](https://nodejs.org/en/) for local development.** You can *also* choose to use Node.js in production, but you don't have to. Many React frameworks support export to a static HTML/CSS/JS folder.

</Note>

## Production-grade React frameworks {/*production-grade-react-frameworks*/}

### Next.js {/*nextjs*/}

**[Next.js](https://nextjs.org/) is the most popular React framework.** It's versatile and lets you create React apps of any size--from a personal blog website to a complex dynamic application. To create a new Next.js project, run in your terminal:

<TerminalBlock>
npm init next-app
</TerminalBlock>

If you're new to Next.js, check out the [Next.js tutorial.](https://nextjs.org/learn/foundations/about-nextjs)

Next.js is maintained by [Vercel](https://vercel.com/). You can [deploy a Next.js app](https://nextjs.org/docs/deployment) to any other Node.js hosting, to some Serverless hosts, or to your own server. [Fully static Next.js apps](https://nextjs.org/docs/advanced-features/static-html-export) can be deployed to any static hosting.

### Gatsby {/*gatsby*/}

**[Gatsby](https://www.gatsbyjs.org/) is a popular React framework with a focus on static websites.** Its rich plugin ecosystem lets you pull data from different sources during the build time using GraphQL. To create a new Gatsby project, run:

<TerminalBlock>
npm init gatsby
</TerminalBlock>

If you're new to Gatsby, check out the [Gatsby tutorial.](https://www.gatsbyjs.com/docs/tutorial/)

Gatsby is maintained by [Netlify](https://www.netlify.com/). You can [deploy a fully static Gatsby site](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting) to any other static hosting. If you opt into using server-only features, make sure your hosting provider supports them for Gatsby.

### Remix {/*remix*/}

**[Remix](https://remix.run/) is a full-stack React framework with nested routing.** It lets you break your app into nested parts that can load data in parallel and refresh in response to the user actions. To create a new Remix project, run:

<TerminalBlock>
npm init remix
</TerminalBlock>

If you're new to Remix, check out the Remix [blog tutorial](https://remix.run/docs/en/main/tutorials/blog) (short) and [app tutorial](https://remix.run/docs/en/main/tutorials/jokes) (long).

Remix is maintained by [Shopify](https://www.shopify.com/). When you create a Remix project, you need to [pick your deployment target](https://remix.run/docs/en/main/guides/deployment). It can deploy to any Node.js or Serverless JavaScript environment for which it's possible to create an [adapter](https://remix.run/docs/en/main/other-api/adapter).

### Expo {/*expo*/}

**[Expo](https://expo.dev/) is a React framework that lets you create universal Android, iOS, and web apps with truly native UIs.** It provides an SDK for [React Native](https://reactnative.dev/) that makes the native parts easier to use. To create a new Expo project, run:

<TerminalBlock>
npm init expo-app
</TerminalBlock>

If you're new to Expo, check out the [Expo tutorial](https://docs.expo.dev/tutorial/introduction/).

Expo is maintained by [Expo (the company)](https://expo.dev/about). Building apps with Expo is free, and you can submit them to the App Stores without any restrictions. Expo additionally provides opt-in paid cloud services.

<DeepDive>

#### Can I use React without a framework? {/*can-i-use-react-without-a-framework*/}

You can definitely use React without a framework--that's how you'd [add React to a part of your page.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) However, if you're building a new app or a site fully with React, we recommend using a framework.

If you're hesitant about starting with a framework, you can use `react` and `react-dom` from npm directly with a build tool like [Vite](https://vitejs.dev/guide/). **We do not recommend this approach for most new projects.**

Even if you don't need routing or data fetching at first, you'll likely want to add some libraries for them. As your JavaScript bundle grows with every new feature, you might have to figure out how to split code for every route individually. As your data fetching needs get more complex, you are likely to encounter server-client network waterfalls that make your app feel very slow. As your audience includes more users with poor network conditions and low-end devices, you might need to generate HTML from your components to display content early--either on the server, or during the build time. Changing your setup to run some of your code on the server or during the build can be very tricky.

**These problems are not React-specific. Every [featured Vite template](https://vitejs.dev/guide/#trying-vite-online) suffers from these problems.** To solve these problems efficiently, you'll need to integrate your bundler with your router and with your data fetching library. You'll need to coordinate different libraries, add build plugins, design custom conventions, and enforce them. As your dependencies release new versions, it's easy to fall behind. Then, if it is ever too much work to upgrade, you risk getting stuck with a bespoke unsupported setup. Essentially, by that point you'll have created a framework--but with no community or upgrade path.

**React frameworks on this page solve these problems by default, with no extra work from your side.** They let you start very lean and then scale your app with your needs. Each React framework has a community, so finding answers to questions and upgrading the tooling is easier. Frameworks also give structure to your code, helping you and others retain context and skills between different projects.

If you're still not convinced and would like to roll your own custom setup, we can't stop you--go for it! It doesn't always work out, but that's how every framework on this page was started.

</DeepDive>

## Bleeding-edge React frameworks {/*bleeding-edge-react-frameworks*/}

### Next.js App Router {/*nextjs-app-router*/}

<Pitfall>

Next.js App Router is **currently in beta and is not yet recommended for production.** To experiment with the Next.js App Router in an existing Next.js project, [follow this incremental migration guide](https://beta.nextjs.org/docs/upgrade-guide#migrating-from-pages-to-app).

</Pitfall>

**[Next.js App Router](https://beta.nextjs.org/docs/getting-started) is a framework focused on implementing the React team's full-stack React Architecture vision.** It lets you fetch data in asynchronous components that run on the server or even during the build.

Next.js is maintained by [Vercel](https://vercel.com/). You can [deploy a Next.js app](https://nextjs.org/docs/deployment) to any other Node.js hosting, to some Serverless hosts, or to your own server. Static export is [planned but not yet supported](https://beta.nextjs.org/docs/app-directory-roadmap#configuration) for the App Router Beta.

<DeepDive>

#### Which React Architecture features does the Next.js App Router implement? {/*which-react-architecture-features-does-the-nextjs-app-router-implement*/}

The Next.js App Router bundler fully implements the official [React Server Components specification](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md). This lets you mix build-time, server-only, and interactive components in a single React tree.

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

The Next.js App Router also integrates data fetching with [Suspense](/reference/react/Suspense). This lets you specify a loading state (like a skeleton placeholder) for different parts of your user interface directly in your React tree:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Server Components and Suspense are React features rather than Next.js features. However, adopting them at the framework level requires buy-in and non-trivial implementation work. At the moment, Next.js App Router is the most complete implementation. The React team is working with the bundler developers to make these features easier to implement for the next generation of React frameworks.

</DeepDive>
