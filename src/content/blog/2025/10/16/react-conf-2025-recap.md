---
title: "React Conf 2025 Recap"
author: Matt Carroll
date: 2025/10/16
description: Last week we hosted React Conf 2025, in this post, we summarize the talks and announcements from the event...
---

Oct 16, 2025 by [Matt Carroll](https://x.com/mattcarrollcode).

---

<Intro>

Last week we hosted React Conf 2025 where we announced the [React Foundation](/blog/2025/10/07/introducing-the-react-foundation) and showcased new features coming to React and React Native.

</Intro>

---

React Conf 2025 was held October 7-9, 2025 in Henderson, Nevada. 

The entire [day 1](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=1067s) and [day 2](https://www.youtube.com/watch?v=p9OcztRyDl0&t=2299s) streams are available online and you can view photos from the event [here](https://conf.react.dev/photos).

In this post, we'll summarize the talks and announcements from the event.


## Day 1 Keynote {/*day-1-keynote*/}

_Watch the full day 1 stream [here.](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=1067s)_

In the day 1 keynote, Joe Savona shared the updates from the team and community since the last React Conf and highlights from React 19.0 and 19.1.

Mofei Zhang highlighted the new features in React 19.2 including: 
* [`<Activity />`](https://react.dev/reference/react/Activity) component to manage visibility. 
* [`useEffectEvent`](https://react.dev/reference/react/useEffectEvent) to fire events from Effects.
* [Performance Tracks](https://react.dev/reference/dev-tools/react-performance-tracks) — a new profiling tool in DevTools.
* [Partial Pre-Rendering](https://react.dev/blog/2025/10/01/react-19-2#partial-pre-rendering) to pre-render part of an app ahead of time, and resume rendering it later.

Jack Pope announced new features in Canary including:

* [`<ViewTransition />`](https://react.dev/reference/react/ViewTransition) — a new component to animate page transitions.
* [Fragment Refs](https://react.dev/reference/react/Fragment#fragmentinstance) — a new way to interact with the DOM nodes wrapped by a Fragment.

Lauren Tan announced [React Compiler v1.0](https://react.dev/blog/2025/10/07/react-compiler-1) and recommended all apps use the compiler for benefits like:
* [Automatic memoization](learn/react-compiler/introduction#what-does-react-compiler-do) with an advanced Compiler that understands React code.
* [New lint rules](learn/react-compiler/installation#eslint-integration) powered by the Compiler to teach best practices.
* [Default support](/learn/react-compiler/installation#basic-setup) for new apps in Vite, Next.js, and Expo.
* [Migration guides](/learn/react-compiler/incremental-adoption) for existing apps migrating to the Compiler.

Finally, Seth Webster gave a surprise announcement of the [React Foundation](/blog/2025/10/07/introducing-the-react-foundation) to steward React's open source development and community.

Watch day 1 here:

<YouTubeIframe src="https://www.youtube.com/embed/zyVRg2QR6LA?si=z-8t_xCc12HwGJH_&t=1067s" />

## Day 2 Keynote {/*day-2-keynote*/}

_Watch the full day 2 stream [here.](https://www.youtube.com/watch?v=p9OcztRyDl0&t=2299s)_

Jorge Cohen and Nicola Corti kicked off day 2 highlighting React Native’s incredible growth with 4M weekly downloads (100% growth YoY), and some notable app migrations from Shopify, Zalando, and HelloFresh, award winning apps like RISE, RUNNA, and Partyful, and AI apps from Mistral, Replit, and v0.

Riccardo Cipolleschi shared two major announcements for React Native:
- [React Native 0.82 will be New Architecture only](https://reactnative.dev/blog/2025/10/08/react-native-0.82#new-architecture-only).
- [Experimental Hermes V1 support](https://reactnative.dev/blog/2025/10/08/react-native-0.82#experimental-hermes-v1). 

Ruben Norte and Alex Hunt finished out the keynote by announcing:
- [New web-aligned DOM APIs](https://reactnative.dev/blog/2025/10/08/react-native-0.82#dom-node-apis) for improved compatibility with React on the web.
- [New Performance APIs](https://reactnative.dev/blog/2025/10/08/react-native-0.82#web-performance-apis-canary) with a new network panel and desktop app.

Watch day 2 here:

<YouTubeIframe src="https://www.youtube.com/embed/p9OcztRyDl0?si=qPTHftsUE07cjZpS&t=2299s" />


## React team talks {/*react-team-talks*/}

Throughout the conference, there were talks from the React team including:
* [Async React Part I](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=10907s) and [Part II](https://www.youtube.com/watch?v=p9OcztRyDl0&t=29073s) [(Ricky Hanlon)](https://x.com/rickhanlonii): showed what's possible using the last 10 years of innovation.
* [Exploring React Performance](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=20274s) [(Joe Savona)](https://x.com/en_js): showed the results of our React performance research.
* [View Transitions and Activity](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=4870s) [(Chance Strickland)](https://x.com/chancethedev): Chance worked with the React team to showcase how to use `<Activity />` and `<ViewTranstion />` to build fast, native-feeling animations.
* [Profiling with React Performance tracks](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=8276s) [(Ruslan Lesiutin)](https://x.com/ruslanlesiutin) showed how to use the new React Performance Tracks to debug performance issues and build great apps.
* [Reimagining Lists in React Native](https://www.youtube.com/watch?v=p9OcztRyDl0&t=10382s) [(Luna Wei)](https://x.com/lunaleaps) introduced Virtual View, a new primitive for lists that manages visibility with mode-based rendering (hidden/pre-render/visible).
* [React Strict DOM](https://www.youtube.com/watch?v=p9OcztRyDl0&t=9026s) [(Nicolas Gallagher)](https://nicolasgallagher.com/) talked about Meta's approach to using web code on native.

### React framework talks {/*react-framework-talks*/}

The second half of day 1 had a series of talks from React Framework teams including:

* [React Native, Amplified](https://www.youtube.com/watch?v=p9OcztRyDl0&t=5737s) by [Giovanni Laquidara](https://x.com/giolaq) and [Eric Faisl](https://x.com/efahsl).
* [React Everywhere: Bringing React Into Native Apps](https://www.youtube.com/watch?v=p9OcztRyDl0&t=18213s) by [Mike Grabowski](https://x.com/grabbou).
* [How Parcel Bundles React Server Components](https://www.youtube.com/watch?v=p9OcztRyDl0&t=19538s) by [Devon Govett](https://x.com/devonovett)
* [Designing Page Transitions](https://www.youtube.com/watch?v=p9OcztRyDl0&t=20640s) by [Delba de Oliveira](https://x.com/delba_oliveira)
* [Build Fast, Deploy Faster — Expo in 2025](https://www.youtube.com/watch?v=p9OcztRyDl0&t=21350s) by [Evan Bacon](https://x.com/baconbrix)
* [The React Router take on RSC](https://www.youtube.com/watch?v=p9OcztRyDl0&t=22367s) by [Kent C. Dodds](https://x.com/kentcdodds)
* [RedwoodSDK: Web Standards Meet Full-Stack React](https://www.youtube.com/watch?v=p9OcztRyDl0&t=24992s) by [Peter Pistorius](https://x.com/appfactory) and [Aurora Scharff](https://x.com/aurorascharff)
* [TanStack Start](https://www.youtube.com/watch?v=p9OcztRyDl0&t=26065s) by [Tanner Linsley](https://x.com/tannerlinsley)

## Q&A {/*q-and-a*/}
There were three Q&A panels during the conference:

* [React Team at Meta Q&A](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=26304s) hosted by [Shruti Kapoor](https://x.com/shrutikapoor08)
* [React Frameworks Q&A](https://www.youtube.com/watch?v=p9OcztRyDl0&t=26812s) hosted by [Jack Herrington](https://x.com/jherr)
* [React and AI Panel](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=18741s) hosted by [Lee Robinson](https://x.com/leerob)

## And more... {/*and-more*/}

We also heard talks from the community including:
* [Building an MCP Server](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=24204s) by [James Swinton](https://x.com/JamesSwintonDev) ([AG Grid](https://www.ag-grid.com/?utm_source=react-conf&utm_medium=react-conf-homepage&utm_campaign=react-conf-sponsorship-2025))
* [Modern Emails using React](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=25521s) by [Zeno Rocha](https://x.com/zenorocha) ([Resend](https://resend.com/))
* [Why React Native Apps Make All the Money](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=24917s) by [Perttu Lähteenlahti](https://x.com/plahteenlahti) ([RevenueCat](https://www.revenuecat.com/))
* [The invisible craft of great UX](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=23400s) by [Michał Dudak](https://x.com/michaldudak) ([MUI](https://mui.com/))

## Thanks {/*thanks*/}

TODO