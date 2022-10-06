---
title: "React Conf 2021 Recap"
author: [jtannady, rickhanlonii]
---

Last week we hosted our 6th React Conf.  In previous years, we've used the React Conf stage to deliver industry changing announcements such as [_React Native_](https://engineering.fb.com/2015/03/26/android/react-native-bringing-modern-web-techniques-to-mobile/) and [_React Hooks_](https://reactjs.org/docs/hooks-intro.html). This year, we shared our multi-platform vision for React, starting with the release of React 18 and gradual adoption of concurrent features.

This was the first time React Conf was hosted online, and it was streamed for free, translated to 8 different languages. Participants from all over the world joined our conference Discord and the replay event for accessibility in all timezones. Over 50,000 people registered, with over 60,000 views of 19 talks, and 5,000 participants in Discord across both events.

All the talks are [available to stream online](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa).

Here’s a summary of what was shared on stage:

## React 18 and concurrent features {#react-18-and-concurrent-features}

In the keynote, we shared our vision for the future of React starting with React 18.

React 18 adds the long-awaited concurrent renderer and updates to Suspense without any major breaking changes. Apps can upgrade to React 18 and begin gradually adopting concurrent features with the amount of effort on par with any other major release.

**This means there is no concurrent mode, only concurrent features.**

In the keynote, we also shared our vision for Suspense, Server Components, new React working groups, and our long-term many-platform vision for React Native.

Watch the full keynote from [Andrew Clark](https://twitter.com/acdlite), [Juan Tejada](https://twitter.com/_jstejada), [Lauren Tan](https://twitter.com/potetotes), and [Rick Hanlon](https://twitter.com/rickhanlonii) here:

<iframe style="margin-top:10px" width="560" height="315" src="https://www.youtube.com/embed/FZ0cG47msEk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## React 18 for Application Developers {#react-18-for-application-developers}

In the keynote, we also announced that the React 18 RC is available to try now. Pending further feedback, this is the exact version of React that we will publish to stable early next year.

To try the React 18 RC, upgrade your dependencies:

```bash
npm install react@rc react-dom@rc
```

and switch to the new `createRoot` API:

```js
// before
const container = document.getElementById('root');
ReactDOM.render(<App />, container);

// after
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App/>);
```

For a demo of upgrading to React 18, see [Shruti Kapoor](https://twitter.com/shrutikapoor08)’s talk here:

<iframe style="margin-top:10px" width="560" height="315" src="https://www.youtube.com/embed/ytudH8je5ko" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Streaming Server Rendering with Suspense {#streaming-server-rendering-with-suspense}

React 18 also includes improvements to server-side rendering performance using Suspense.

Streaming server rendering lets you generate HTML from React components on the server, and stream that HTML to your users. In React 18, you can use `Suspense` to break down your app into smaller independent units which can be streamed independently of each other without blocking the rest of the app. This means users will see your content sooner and be able to start interacting with it much faster.

For a deep dive, see [Shaundai Person](https://twitter.com/shaundai)’s talk here:

<iframe style="margin-top:10px" width="560" height="315" src="https://www.youtube.com/embed/pj5N-Khihgc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## The first React working group {#the-first-react-working-group}

For React 18, we created our first Working Group to collaborate with a panel of experts, developers, library maintainers, and educators. Together we worked to create our gradual adoption strategy and refine new APIs such as `useId`, `useSyncExternalStore`, and `useInsertionEffect`.

For an overview of this work, see [Aakansha' Doshi](https://twitter.com/aakansha1216)'s talk:

<iframe style="margin-top:10px" width="560" height="315" src="https://www.youtube.com/embed/qn7gRClrC9U" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## React Developer Tooling {#react-developer-tooling}

To support the new features in this release, we also announced the newly formed React DevTools team and a new Timeline Profiler to help developers debug their React apps.

For more information and a demo of new DevTools features, see [Brian Vaughn](https://twitter.com/brian_d_vaughn)’s talk:

<iframe style="margin-top:10px" width="560" height="315" src="https://www.youtube.com/embed/oxDfrke8rZg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## React without memo {#react-without-memo}

Looking further into the future, [Xuan Huang (黄玄)](https://twitter.com/Huxpro) shared an update from our React Labs research into an auto-memoizing compiler. Check out this talk for more information and a demo of the compiler prototype:

<iframe style="margin-top:10px" width="560" height="315" src="https://www.youtube.com/embed/lGEMwh32soc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## React docs keynote {#react-docs-keynote}

[Rachel Nabors](https://twitter.com/rachelnabors) kicked off a section of talks about learning and designing with React with a keynote about our investment in React's [new docs](https://beta.reactjs.org/):

<iframe style="margin-top:10px" width="560" height="315" src="https://www.youtube.com/embed/mneDaMYOKP8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# And more... {#and-more}

**We also heard talks on learning and designing with React:**

* Debbie O'Brien: [Things I learnt from the new React docs](https://youtu.be/-7odLW_hG7s).
* Sarah Rainsberger: [Learning in the Browser](https://youtu.be/5X-WEQflCL0).
* Linton Ye: [The ROI of Designing with React](https://youtu.be/7cPWmID5XAk).
* Delba de Oliveira: [Interactive playgrounds with React](https://youtu.be/zL8cz2W0z34).

**Talks from the Relay, React Native, and PyTorch teams:**

* Robert Balicki: [Re-introducing Relay](https://youtu.be/lhVGdErZuN4).
* Eric Rozell and Steven Moyes: [React Native Desktop](https://youtu.be/9L4FFrvwJwY).
* Roman Rädle: [On-device Machine Learning for React Native](https://youtu.be/NLj73vrc2I8)

**And talks from the community on accessibility, tooling, and Server Components:**

* Daishi Kato: [React 18 for External Store Libraries](https://youtu.be/oPfSC5bQPR8).
* Diego Haz: [Building Accessible Components in React 18](https://youtu.be/dcm8fjBfro8).
* Tafu Nakazaki: [Accessible Japanese Form Components with React](https://youtu.be/S4a0QlsH0pU).
* Lyle Troxell: [UI tools for artists](https://youtu.be/b3l4WxipFsE).
* Helen Lin: [Hydrogen + React 18](https://youtu.be/HS6vIYkSNks).

# Thank you {#thank-you}

This was our first year planning a conference ourselves, and we have a lot of people to thank.

First, thanks to all of our speakers [Aakansha Doshi](https://twitter.com/aakansha1216), [Andrew Clark](https://twitter.com/acdlite), [Brian Vaughn](https://twitter.com/brian_d_vaughn), [Daishi Kato](https://twitter.com/dai_shi), [Debbie O'Brien](https://twitter.com/debs_obrien), [Delba de Oliveira](https://twitter.com/delba_oliveira), [Diego Haz](https://twitter.com/diegohaz), [Eric Rozell](https://twitter.com/EricRozell), [Helen Lin](https://twitter.com/wizardlyhel), [Juan Tejada](https://twitter.com/_jstejada), [Lauren Tan](https://twitter.com/potetotes), [Linton Ye](https://twitter.com/lintonye), [Lyle Troxell](https://twitter.com/lyle), [Rachel Nabors](https://twitter.com/rachelnabors), [Rick Hanlon](https://twitter.com/rickhanlonii), [Robert Balicki](https://twitter.com/StatisticsFTW), [Roman Rädle](https://twitter.com/raedle), [Sarah Rainsberger](https://twitter.com/sarah11918), [Shaundai Person](https://twitter.com/shaundai), [Shruti Kapoor](https://twitter.com/shrutikapoor08), [Steven Moyes](https://twitter.com/moyessa), [Tafu Nakazaki](https://twitter.com/hawaiiman0), and  [Xuan Huang (黄玄)](https://twitter.com/Huxpro).

Thanks to everyone who helped provide feedback on talks including [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://twitter.com/dan_abramov), [Dave McCabe](https://twitter.com/mcc_abe), [Eli White](https://twitter.com/Eli_White), [Joe Savona](https://twitter.com/en_JS),  [Lauren Tan](https://twitter.com/potetotes), [Rachel Nabors](https://twitter.com/rachelnabors), and [Tim Yung](https://twitter.com/yungsters).

Thanks to [Lauren Tan](https://twitter.com/potetotes) for setting up the conference Discord and serving as our Discord admin.

Thanks to [Seth Webster](https://twitter.com/sethwebster) for feedback on overall direction and making sure we were focused on diversity and inclusion.

Thanks to [Rachel Nabors](https://twitter.com/rachelnabors) for spearheading our moderation effort, and [Aisha Blake](https://twitter.com/AishaBlake) for creating our moderation guide, leading our moderation team, training the translators and moderators, and helping to moderate both events.

Thanks to our moderators [Jesslyn Tannady](https://twitter.com/jtannady), [Suzie Grange](https://twitter.com/missuze), [Becca Bailey](https://twitter.com/beccaliz), [Luna Wei](https://twitter.com/lunaleaps), [Joe Previte](https://twitter.com/jsjoeio), [Nicola Corti](https://twitter.com/Cortinico), [Gijs Weterings](https://twitter.com/gweterings), [Claudio Procida](https://twitter.com/claudiopro), Julia Neumann, Mengdi Chen, Jean Zhang, Ricky Li, and [Xuan Huang (黄玄)](https://twitter.com/Huxpro).

Thanks to [Manjula Dube](https://twitter.com/manjula_dube), [Sahil Mhapsekar](https://twitter.com/apheri0), and Vihang Patel from [React India](https://www.reactindia.io/), and [Jasmine Xie](https://twitter.com/jasmine_xby), [QiChang Li](https://twitter.com/QCL15), and [YanLun Li](https://twitter.com/anneincoding) from [React China](https://twitter.com/ReactChina) for helping moderate our replay event and keep it engaging for the community.

Thanks to Vercel for publishing their [Virtual Event Starter Kit](https://vercel.com/virtual-event-starter-kit), which the conference website was built on, and to [Lee Robinson](https://twitter.com/leeerob) and [Delba de Oliveira](https://twitter.com/delba_oliveira) for sharing their experience running Next.js Conf.

Thanks to [Leah Silber](https://twitter.com/wifelette) for sharing her experience running conferences, learnings from running [RustConf](https://rustconf.com/), and for her book [Event Driven](https://leanpub.com/eventdriven/) and the advice it contains for running conferences.

Thanks to [Kevin Lewis](https://twitter.com/_phzn) and [Rachel Nabors](https://twitter.com/rachelnabors) for sharing their experience running Women of React Conf.

Thanks to [Aakansha Doshi](https://twitter.com/aakansha1216), [Laurie Barth](https://twitter.com/laurieontech), [Michael Chan](https://twitter.com/chantastic), and [Shaundai Person](https://twitter.com/shaundai) for their advice and ideas throughout planning.

Thanks to [Dan Lebowitz](https://twitter.com/lebo) for help designing and building the conference website and tickets.

Thanks to Laura Podolak Waddell, Desmond Osei-Acheampong, Mark Rossi, Josh Toberman and others on the Facebook Video Productions team for recording the videos for the Keynote and Meta employee talks.

Thanks to our partner HitPlay for helping to organize the conference, editing all the videos in the stream, translating all the talks, and moderating the Discord in multiple languages.

Finally, thanks to all of our participants for making this a great React Conf!
