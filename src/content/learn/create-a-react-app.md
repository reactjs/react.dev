---
title: Creating a React App
---

<Intro>

If you want to build a new app or website with React, we recommend starting with a framework.

</Intro>

## Recommended React frameworks {/*bleeding-edge-react-frameworks*/}

These recommended frameworks support all the features you need to deploy and scale your app in production. They have integrated the latest React features and take advantage of React’s architecture.

<Note>

#### React frameworks do not require a server. {/*react-frameworks-do-not-require-a-server*/}

All of the frameworks on this page can create single-page apps. Single-page apps can be deployed to a [CDN](https://developer.mozilla.org/en-US/docs/Glossary/CDN) or static hosting service and do not need a server. If you would like to enable features that require a server (like server side rendering) you can opt-in on individual routes without rewriting your app.

</Note>

### Next.js (App Router) {/*nextjs-app-router*/}

**[Next.js's App Router](https://nextjs.org/docs) is a React framework that takes full advantage of React's architecture to enable full-stack React apps.**

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

Next.js is maintained by [Vercel](https://vercel.com/). You can [deploy a Next.js app](https://nextjs.org/docs/app/building-your-application/deploying) to any Node.js or serverless hosting, or to your own server. Next.js also supports [static export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) which doesn't require a server. Vercel additionally provides opt-in paid cloud services.

### React Router (v7) {/*react-router-v7*/}

**[React Router](https://reactrouter.com/start/framework/installation) is the most popular routing library for React and can be paired with Vite to create a full-stack React framework**.

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

## Build your own framework {/*build-your-own-framework*/}

When building a new app, we recommend starting with a framework. This is because most applications and websites require solutions to common problems such like routing, dating fetching, and code-splitting.

These challenges are not unique to React, but are common to all UI libraries. Without a framework, you may find yourself re-inventing the wheel by solving these problems on your own, essentially creating an inefficient framework in the process. This is why we decided to [Sunset Create React App](/blog/2025/02/12/sunsetting-create-react-app) and recommend starting with a framework.

If your app has unusual constraints not served well by a framework, or you prefer to solve these problems by building your own framework, you can start a React project from scratch with a build tool like [Parcel](https://parceljs.org/) or [Vite](https://vite.dev/). Before you start a React app from scratch please note that [frameworks do not require a server](#react-frameworks-do-not-require-a-server). 

To learn more about creating a React app from scratch see our docs for [building a framework](learn/building-a-framework).

