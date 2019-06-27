---
title: "Sneak Peek: Beyond React 16"
author: [sophiebits]
---

[Dan Abramov](https://twitter.com/dan_abramov) from our team just spoke at [JSConf Iceland 2018](https://2018.jsconf.is/) with a preview of some new features we've been working on in React. The talk opens with a question: "With vast differences in computing power and network speed, how do we deliver the best user experience for everyone?"

Here's the video courtesy of JSConf Iceland:

<br>

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/nLF0n9SACd4?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

I think you'll enjoy the talk more if you stop reading here and just watch the video. If you don't have time to watch, a (very) brief summary follows.

## About the Two Demos {#about-the-two-demos}

On the first demo, Dan says: "We've built a generic way to ensure that high-priority updates don't get blocked by a low-priority update, called **time slicing**. If my device is fast enough, it feels almost like it's synchronous; if my device is slow, the app still feels responsive. It adapts to the device thanks to the [requestIdleCallback](https://developers.google.com/web/updates/2015/08/using-requestidlecallback) API. Notice that only the final state was displayed; the rendered screen is always consistent and we don't see visual artifacts of slow rendering causing a janky user experience."

On the second demo, Dan explains: "We've built a generic way for components to suspend rendering while they load async data, which we call **suspense**. You can pause any state update until the data is ready, and you can add async loading to any component deep in the tree without plumbing all the props and state through your app and hoisting the logic. On a fast network, updates appear very fluid and instantaneous without a jarring cascade of spinners that appear and disappear. On a slow network, you can intentionally design which loading states the user should see and how granular or coarse they should be, instead of showing spinners based on how the code is written. The app stays responsive throughout."

"Importantly, this is still the React you know. This is still the declarative component paradigm that you probably like about React."

We can't wait to release these new async rendering features later this year. Follow this blog and [@reactjs on Twitter](https://twitter.com/reactjs) for updates.
