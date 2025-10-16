---
title: "React Conf 2025 Recap"
author: Matt Carroll and Ricky Hanlon
date: 2025/10/16
description: Last week we hosted React Conf 2025, in this post, we summarize the talks and announcements from the event...
---

Oct 16, 2025 by [Matt Carroll](https://x.com/mattcarrollcode) and [Ricky Hanlon](https://bsky.app/profile/ricky.fm)

---

<Intro>

Last week we hosted React Conf 2025 where we announced the [React Foundation](/blog/2025/10/07/introducing-the-react-foundation) and showcased new features coming to React and React Native.

</Intro>

---

React Conf 2025 was held on October 7-8, 2025, in Henderson, Nevada.

The entire [day 1](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=1067s) and [day 2](https://www.youtube.com/watch?v=p9OcztRyDl0&t=2299s) streams are available online, and you can view photos from the event [here](https://conf.react.dev/photos).

In this post, we'll summarize the talks and announcements from the event.


## Day 1 Keynote {/*day-1-keynote*/}

_Watch the full day 1 stream [here.](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=1067s)_

In the day 1 keynote, Joe Savona shared the updates from the team and community since the last React Conf and highlights from React 19.0 and 19.1.

Mofei Zhang highlighted the new features in React 19.2 including:
* [`<Activity />`](https://react.dev/reference/react/Activity)  — a new component to manage visibility.
* [`useEffectEvent`](https://react.dev/reference/react/useEffectEvent) to fire events from Effects.
* [Performance Tracks](https://react.dev/reference/dev-tools/react-performance-tracks) — a new profiling tool in DevTools.
* [Partial Pre-Rendering](https://react.dev/blog/2025/10/01/react-19-2#partial-pre-rendering) to pre-render part of an app ahead of time, and resume rendering it later.

Jack Pope announced new features in Canary including:

* [`<ViewTransition />`](https://react.dev/reference/react/ViewTransition) — a new component to animate page transitions.
* [Fragment Refs](https://react.dev/reference/react/Fragment#fragmentinstance) — a new way to interact with the DOM nodes wrapped by a Fragment.

Lauren Tan announced [React Compiler v1.0](https://react.dev/blog/2025/10/07/react-compiler-1) and recommended all apps use React Compiler for benefits like:
* [Automatic memoization](/learn/react-compiler/introduction#what-does-react-compiler-do) that understands React code.
* [New lint rules](/learn/react-compiler/installation#eslint-integration) powered by React Compiler to teach best practices.
* [Default support](/learn/react-compiler/installation#basic-setup) for new apps in Vite, Next.js, and Expo.
* [Migration guides](/learn/react-compiler/incremental-adoption) for existing apps migrating to React Compiler.

Finally, Seth Webster announced the [React Foundation](/blog/2025/10/07/introducing-the-react-foundation) to steward React's open source development and community.

Watch day 1 here:

<YouTubeIframe src="https://www.youtube.com/embed/zyVRg2QR6LA?si=z-8t_xCc12HwGJH_&t=1067s" />

## Day 2 Keynote {/*day-2-keynote*/}

_Watch the full day 2 stream [here.](https://www.youtube.com/watch?v=p9OcztRyDl0&t=2299s)_

Jorge Cohen and Nicola Corti kicked off day 2 highlighting React Native’s incredible growth with 4M weekly downloads (100% growth YoY), and some notable app migrations from Shopify, Zalando, and HelloFresh, award-winning apps like RISE, RUNNA, and Partyful, and AI apps from Mistral, Replit, and v0.

Riccardo Cipolleschi shared two major announcements for React Native:
- [React Native 0.82 will be New Architecture only](https://reactnative.dev/blog/2025/10/08/react-native-0.82#new-architecture-only)
- [Experimental Hermes V1 support](https://reactnative.dev/blog/2025/10/08/react-native-0.82#experimental-hermes-v1)

Ruben Norte and Alex Hunt finished out the keynote by announcing:
- [New web-aligned DOM APIs](https://reactnative.dev/blog/2025/10/08/react-native-0.82#dom-node-apis) for improved compatibility with React on the web.
- [New Performance APIs](https://reactnative.dev/blog/2025/10/08/react-native-0.82#web-performance-apis-canary) with a new network panel and desktop app.

Watch day 2 here:

<YouTubeIframe src="https://www.youtube.com/embed/p9OcztRyDl0?si=qPTHftsUE07cjZpS&t=2299s" />


## React team talks {/*react-team-talks*/}

Throughout the conference, there were talks from the React team including:
* [Async React Part I](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=10907s) and [Part II](https://www.youtube.com/watch?v=p9OcztRyDl0&t=29073s) [(Ricky Hanlon)](https://x.com/rickhanlonii) showed what's possible using the last 10 years of innovation.
* [Exploring React Performance](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=20274s) [(Joe Savona)](https://x.com/en_js) showed the results of our React performance research.
* [Reimagining Lists in React Native](https://www.youtube.com/watch?v=p9OcztRyDl0&t=10382s) [(Luna Wei)](https://x.com/lunaleaps) introduced Virtual View, a new primitive for lists that manages visibility with mode-based rendering (hidden/pre-render/visible).
* [Profiling with React Performance tracks](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=8276s) [(Ruslan Lesiutin)](https://x.com/ruslanlesiutin) showed how to use the new React Performance Tracks to debug performance issues and build great apps.
* [React Strict DOM](https://www.youtube.com/watch?v=p9OcztRyDl0&t=9026s) [(Nicolas Gallagher)](https://nicolasgallagher.com/) talked about Meta's approach to using web code on native.
* [View Transitions and Activity](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=4870s) [(Chance Strickland)](https://x.com/chancethedev) — Chance worked with the React team to showcase how to use `<Activity />` and `<ViewTransition />` to build fast, native-feeling animations.
* [In case you missed the memo](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=9525s) [(Cody Olsen)](https://bsky.app/profile/codey.bsky.social) - Cody worked with the React team to adopt the Compiler at Sanity Studio, and shared how it went.
## React framework talks {/*react-framework-talks*/}

The second half of day 2 had a series of talks from React Framework teams including:

* [React Native, Amplified](https://www.youtube.com/watch?v=p9OcztRyDl0&t=5737s) by [Giovanni Laquidara](https://x.com/giolaq) and [Eric Fahsl](https://x.com/efahsl).
* [React Everywhere: Bringing React Into Native Apps](https://www.youtube.com/watch?v=p9OcztRyDl0&t=18213s) by [Mike Grabowski](https://x.com/grabbou).
* [How Parcel Bundles React Server Components](https://www.youtube.com/watch?v=p9OcztRyDl0&t=19538s) by [Devon Govett](https://x.com/devonovett).
* [Designing Page Transitions](https://www.youtube.com/watch?v=p9OcztRyDl0&t=20640s) by [Delba de Oliveira](https://x.com/delba_oliveira).
* [Build Fast, Deploy Faster — Expo in 2025](https://www.youtube.com/watch?v=p9OcztRyDl0&t=21350s) by [Evan Bacon](https://x.com/baconbrix).
* [The React Router's take on RSC](https://www.youtube.com/watch?v=p9OcztRyDl0&t=22367s) by [Kent C. Dodds](https://x.com/kentcdodds).
* [RedwoodSDK: Web Standards Meet Full-Stack React](https://www.youtube.com/watch?v=p9OcztRyDl0&t=24992s) by [Peter Pistorius](https://x.com/appfactory) and [Aurora Scharff](https://x.com/aurorascharff).
* [TanStack Start](https://www.youtube.com/watch?v=p9OcztRyDl0&t=26065s) by [Tanner Linsley](https://x.com/tannerlinsley).

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

Thank you to all the staff, speakers, and participants, who made React Conf 2025 possible. There are too many to list, but we want to thank a few in particular.

Thank you to [Matt Carroll](https://x.com/mattcarrollcode) for planning the entire event and building the conference website.

Thank you to [Michael Chan](https://x.com/chantastic) for MCing React Conf with incredible dedication and energy, delivering thoughtful speaker intros, fun jokes, and genuine enthusiasm throughout the event. Thank you to [Jorge Cohen](https://x.com/JorgeWritesCode) for hosting the livestream, interviewing each speaker, and bringing the in-person React Conf experience online.

Thank you to [Mateusz Kornacki](https://x.com/mat_kornacki), [Mike Grabowski](https://x.com/grabbou), [Kris Lis](https://www.linkedin.com/in/krzysztoflisakakris/) and the team at [Callstack](https://www.callstack.com/) for co-organizing React Conf and providing design, engineering, and marketing support. Thank you to the [ZeroSlope team](https://zeroslopeevents.com/contact-us/): Sunny Leggett, Tracey Harrison, Tara Larish, Whitney Pogue, and Brianne Smythia for helping to organize the event.

Thank you to [Jorge Cabiedes Acosta](https://github.com/jorge-cab), [Gijs Weterings](https://x.com/gweterings), [Tim Yung](https://x.com/yungsters), and [Jason Bonta](https://x.com/someextent) for bringing questions from the Discord to the livestream. Thank you to [Lynn Yu](https://github.com/lynnshaoyu) for leading the moderation of the Discord. Thank you to [Seth Webster](https://x.com/sethwebster) for welcoming us each day; and to [Christopher Chedeau](https://x.com/vjeux), [Kevin Gozali](https://x.com/fkgozali), and [Pieter De Baets](https://x.com/Javache) for joining us with a special message during the after-party.

Thank you to [Kadi Kraman](https://x.com/kadikraman), [Beto](https://x.com/betomoedano) and [Nicolas Solerieu](https://www.linkedin.com/in/nicolas-solerieu/) for building the conference mobile app. Thank you [Wojtek Szafraniec](https://x.com/wojteg1337) for help with the conference website. Thank you to [Mustache](https://www.mustachepower.com/) & [Cornerstone](https://cornerstoneav.com/) for the visuals, stage, and sound; and to the Westin Hotel for hosting us.

Thank you to all the sponsors who made the event possible: [Amazon](https://www.developer.amazon.com), [MUI](https://mui.com/), [Vercel](https://vercel.com/), [Expo](https://expo.dev/), [RedwoodSDK](https://rwsdk.com), [Ag Grid](https://www.ag-grid.com), [RevenueCat](https://www.revenuecat.com/), [Resend](https://resend.com), [Mux](https://www.mux.com/), [Old Mission](https://www.oldmissioncapital.com/), [Arcjet](https://arcjet.com), [Infinite Red](https://infinite.red/), and [RenderATL](https://renderatl.com).

Thank you to all the speakers who shared their knowledge and experience with the community.

Finally, thank you to everyone who attended in person and online to show what makes React, React. React is more than a library, it is a community, and it was inspiring to see everyone come together to share and learn together.

See you next time!
