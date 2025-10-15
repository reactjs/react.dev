---
title: "React Conf 2025 Recap"
author: Matt Carroll
date: 2025/10/16
description: Last week we hosted React Conf 2025, a two-day conference in Henderson, Nevada where 700+ attendees gathered in-person to discuss the latest in UI engineering. In this post, we'll summarize the talks and announcements from the event.
---

Oct 16, 2025 by [Matt Carroll](https://x.com/mattcarrollcode).

---

<Intro>

Last week we hosted React Conf 2025, a two-day conference in Henderson, Nevada where 700+ attendees gathered in-person to discuss the latest in UI engineering and celebrate 10 years of React Native.

</Intro>

---

At React Conf 2025 we announced new canary features like [&lt;ViewTransition />](https://react.dev/reference/react/ViewTransition) and [Fragment Refs](https://react.dev/reference/react/Fragment#fragmentinstance), 19.2 features like [&lt;Activity />](https://react.dev/reference/react/Activity), [useEffectEvent](https://react.dev/reference/react/useEffectEvent), [Performance Tracks](https://react.dev/reference/dev-tools/react-performance-tracks), and [Partial Pre-Rendering](https://react.dev/blog/2025/10/01/react-19-2#partial-pre-rendering) on day 1. We also announced [React Compiler v1.0](https://react.dev/blog/2025/10/07/react-compiler-1) and the [React Foundation](https://react.dev/blog/2025/10/07/introducing-the-react-foundation). On day 2, we announced the [Async React Working Group](https://github.com/reactwg/async-react), [React Native 0.82 will be new architecture only](https://reactnative.dev/blog/2025/10/08/react-native-0.82#new-architecture-only), [experimental Hermes V1 support](https://reactnative.dev/blog/2025/10/08/react-native-0.82#experimental-hermes-v1), and new [DOM Node APIs](https://reactnative.dev/blog/2025/10/08/react-native-0.82#dom-node-apis).

The entire [day 1](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=1067s) and [day 2](https://www.youtube.com/watch?v=p9OcztRyDl0&t=2299s) streams are available online and you can view photos from the event [here](https://conf.react.dev/photos). In this post, we'll summarize the talks and announcements from the event.

## Day 1 {/*day-1*/}

_Watch the full day 1 stream [here.](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=1067s)_

React Conf emcee [Michael Chan](https://x.com/chantastic) kicked off day 1 and [Seth Webster](https://x.com/sethwebster), the head of React, introduced the conference. To start the keynote, [Joe Savona](https://x.com/en_js) shared the updates from the team and community since the last React Conf including [React 19](https://react.dev/blog/2024/12/05/react-19), [over 6B lifetime React downloads](https://npm-stat.com/charts.html?package=react&from=2015-01-01&to=2025-10-07), and [owner stacks](https://react.dev/reference/react/captureOwnerStack).

[Mofei Zhang](https://x.com/zmofei) and [Jack Pope](https://x.com/__jackpope) announced new [React 19.2](https://react.dev/blog/2025/10/01/react-19-2) and [Canary channel](/community/versioning-policy#canary-channel) features including:

* [&lt;ViewTransition />](https://react.dev/reference/react/ViewTransition) <CanaryBadge /> — a new component for native browser animations deeply integrated with React's concurrent rendering. See [Chance Strickland’s](https://x.com/chancethedev) talk [View Transitions and Activity](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=4870s) for more on how to build smooth, native-feeling animations.
* [&lt;Activity />](https://react.dev/reference/react/Activity) component to manage visibility. See [Chance Strickland’s](https://x.com/chancethedev) talk [View Transitions and Activity](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=4870s) for more on how to efficiently manage hidden content.
* [Performance Tracks](https://react.dev/reference/dev-tools/react-performance-tracks) — a new profiling tool in DevTools. For a deep dive on [Performance Tracks](https://react.dev/reference/dev-tools/react-performance-tracks) see [Ruslan Lesiutin’s](https://x.com/ruslanlesiutin) talk [Profiling with React Performance tracks](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=8276s).
* [Fragment Refs](https://react.dev/reference/react/Fragment#fragmentinstance) <CanaryBadge /> — a new composition pattern for platform APIs without extra wrappers.
* [useEffectEvent](https://react.dev/reference/react/useEffectEvent) to extract non-reactive logic from your Effects.
* [Partial Pre-Rendering](https://react.dev/blog/2025/10/01/react-19-2#partial-pre-rendering) to pre-render part of an app ahead of time, and resume rendering it later.

[Lauren Tan](https://x.com/potetotes) announced that [React Compiler v1.0 is now available](https://react.dev/blog/2025/10/07/react-compiler-1) and recommends new apps use React Compiler and all apps use the React Compiler-powered ESLint plugin. In [In case you missed the memo](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=9534s), [Cody Olsen](https://bsky.app/profile/codey.bsky.social) from Sanity shared how adopting React Compiler improved performance by 20-30% and caught subtle bugs through its advanced static analysis and ESLint rules. [Seth Webster](https://x.com/sethwebster) announced the formation of the [React Foundation](https://react.dev/blog/2025/10/07/introducing-the-react-foundation).

The rest of the talks from day 1 include:

* [Exploring React Performance](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=20274s) by [Joe Savona](https://x.com/en_js) details the research the React team has been working on to improve React performance and the importance of data modeling
* [Modern Emails using React](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=25521s) by [Zeno Rocha](https://x.com/zenorocha) ([Resend](https://resend.com/))
* [Building an MCP Server](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=24204s) by [James Swinton](https://x.com/JamesSwintonDev) ([AG Grid](https://www.ag-grid.com/?utm_source=react-conf&utm_medium=react-conf-homepage&utm_campaign=react-conf-sponsorship-2025))
* [Why React Native Apps Make All the Money](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=24917s) by [Perttu Lähteenlahti](https://x.com/plahteenlahti) ([RevenueCat](https://www.revenuecat.com/))
* [The invisible craft of great UX](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=23400s) by [Michał Dudak](https://x.com/michaldudak) ([MUI](https://mui.com/))
* [React and AI](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=18741s) panel with [Christopher Chedeau](https://x.com/vjeux), [Kent C. Dodds](https://x.com/kentcdodds), [Shawn Wang](https://x.com/swyx), [Lee Robinson](https://x.com/leerob), and [Theo Browne](https://x.com/theo)
* [React Team Q&A](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=26304s) hosted by [Shruti Kapoor](https://x.com/shrutikapoor08), featuring [Mofei Zhang](https://x.com/zmofei), [Joe Savona](https://x.com/en_js), [Ruslan Lesiutin](https://x.com/ruslanlesiutin), [Lauren Tan](https://x.com/potetotes), [Ricky Hanlon](https://x.com/rickhanlonii), [Jack Pope](https://x.com/__jackpope), and [Seth Webster](https://x.com/sethwebster).

Watch day 1 here:

<YouTubeIframe src="https://www.youtube.com/embed/zyVRg2QR6LA?si=z-8t_xCc12HwGJH_&t=1067s" />

## Day 2 {/*day-2*/}

_Watch the full day 2 stream [here.](https://www.youtube.com/watch?v=p9OcztRyDl0&t=2299s)_

[Jorge Cohen](https://x.com/JorgeWritesCode) & [Nicola Corti](https://x.com/cortinico) kicked off day 2 highlighting React Native’s incredible growth with 4M weekly downloads (100% growth YoY), and some notable app migrations from Shopify, Zalando, and HelloFresh, award winning apps like RISE, RUNNA, and Partyful, and AI apps from Mistral, Replit, and v0.

[Riccardo Cipolleschi](https://x.com/CipolleschiR) announced [React Native 0.82 will be New Architecture only](https://reactnative.dev/blog/2025/10/08/react-native-0.82#new-architecture-only), and [experimental Hermes V1 support](https://reactnative.dev/blog/2025/10/08/react-native-0.82#experimental-hermes-v1). [Ruben Norte](https://bsky.app/profile/rubennorte.bsky.social) and [Alex Hunt](https://x.com/huntie) finished out the keynote by announcing new web-aligned [DOM](https://reactnative.dev/blog/2025/10/08/react-native-0.82#dom-node-apis) & [Performance](https://reactnative.dev/blog/2025/10/08/react-native-0.82#web-performance-apis-canary) APIs, and a new network panel & desktop app.

[Ricky Hanlon](https://x.com/rickhanlonii) closed the conference with the continuation of his Async React talk ([part 1](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=10907s), [part 2](https://www.youtube.com/watch?v=p9OcztRyDl0&t=29073s)), demonstrating how [transitions](https://react.dev/reference/react/useTransition), [useOptimistic](https://react.dev/reference/react/useOptimistic), [&lt;Suspense>](https://react.dev/reference/react/Suspense), and [&lt;ViewTransition />](https://react.dev/reference/react/ViewTransition) work together. He announced the [Async React Working Group](https://github.com/reactwg/async-react) to help the community adopt these patterns in routers, data libraries, and design components.

### Community & React team talks {/*community-and-react-team-talks*/}

* [React Native, Amplified](https://www.youtube.com/watch?v=p9OcztRyDl0&t=5737s) by [Giovanni Laquidara](https://x.com/giolaq) and [Eric Faisl](https://x.com/efahsl) talked about how to build with React for [Vega OS](https://developer.amazon.com/apps-and-games/vega)—a new operating system that powers Amazon’s new devices.
* [React Everywhere: Bringing React Into Native Apps](https://www.youtube.com/watch?v=p9OcztRyDl0&t=18213s) by [Mike Grabowski](https://x.com/grabbou) showed how to add React Native to existing iOS/Android apps with minimal changes
* [Reimagining Lists in React Native](https://www.youtube.com/watch?v=p9OcztRyDl0&t=10382s) by [Luna Wei](https://x.com/lunaleaps) introduced Virtual View, a new primitive for lists that manages visibility with mode-based rendering (hidden/pre-render/visible)
* [React Strict DOM](https://www.youtube.com/watch?v=p9OcztRyDl0&t=9026s) by [Nicolas Gallagher](https://nicolasgallagher.com/) talked about Meta's approach to using web code on native

### React framework & build tool talks {/*react-framework-and-build-tool-talks*/}

The second half of day 2 had a series of talks from a variety of React frameworks and build tools capped off with [a Q&A panel](https://www.youtube.com/watch?v=p9OcztRyDl0&t=26812s) hosted by [Jack Herrington](https://x.com/jherr) with representatives from [Parcel](https://parceljs.org/) ([Devon Govett](https://x.com/devonovett)), [Next.js](https://nextjs.org/) ([Josh Story](https://x.com/joshcstory)), [Expo](https://expo.dev/) ([Evan Bacon](https://x.com/baconbrix)), [React Router](https://reactrouter.com/) ([Kent C. Dodds](https://x.com/kentcdodds)), [RedwoodSDK](https://rwsdk.com/) ([Peter Pistorius](https://x.com/appfactory)), [Rock](https://www.rockjs.dev/) ([Michał Pierzchała](https://x.com/thymikee)) and [TanStack](https://tanstack.com/) ([Tanner Linsley](https://x.com/tannerlinsley)).

* [How Parcel Bundles React Server Components](https://www.youtube.com/watch?v=p9OcztRyDl0&t=19538s) by [Devon Govett](https://x.com/devonovett)
* [Designing Page Transitions](https://www.youtube.com/watch?v=p9OcztRyDl0&t=20640s) by [Delba de Oliveira](https://x.com/delba_oliveira)
* [Build Fast, Deploy Faster — Expo in 2025](https://www.youtube.com/watch?v=p9OcztRyDl0&t=21350s) by [Evan Bacon](https://x.com/baconbrix)
* [The React Router take on RSC](https://www.youtube.com/watch?v=p9OcztRyDl0&t=22367s) by [Kent C. Dodds](https://x.com/kentcdodds)
* [RedwoodSDK: Web Standards Meet Full-Stack React](https://www.youtube.com/watch?v=p9OcztRyDl0&t=24992s) by [Peter Pistorius](https://x.com/appfactory) and [Aurora Scharff](https://x.com/aurorascharff)
* [TanStack Start](https://www.youtube.com/watch?v=p9OcztRyDl0&t=26065s) by [Tanner Linsley](https://x.com/tannerlinsley)

Watch day 2 here:

<YouTubeIframe src="https://www.youtube.com/embed/p9OcztRyDl0?si=qPTHftsUE07cjZpS&t=2299s" />
