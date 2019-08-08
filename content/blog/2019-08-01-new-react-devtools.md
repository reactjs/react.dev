---
title: "Introducing the New React DevTools"
author: [bvaughn]
---
We are excited to announce a new release of the React Developer Tools, available today in Chrome, Firefox, and (Chromium) Edge!

## What's changed?

A lot has changed in version 4!
At a high level, this new version should offer significant performance gains and an improved navigation experience.

[See the changelog](https://github.com/bvaughn/react-devtools-experimental/blob/master/CHANGELOG.md) for demo videos and more details on new features.

## Which versions of React are supported?

**`react-dom`**

* `0`-`14.x`: Not supported
* `15.x`: Supported (except for the new component filters feature)
* `16.x`: Supported

**`react-native`**
* `0`-`0.60`: Not supported
* `0.61`: Supported

## How do I get the new DevTools?

React DevTools is available as an extension for [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/).
If you have already installed the extension, it should update automatically within the next couple of hours.

Standalone users (e.g. React Native or Safari) can install the new version [from NPM](https://www.npmjs.com/package/react-devtools):

```shell
npm install -g react-devtools@^4
```

## Where did all of the DOM elements go?

The new DevTools provides a way to filter components from the tree to make it easier to navigate large applications.
Host nodes (e.g. HTML `<div>`, React Native `<View>`) are *hidden by default*, but this filter can be disabled:

![DevTools component filters](../images/blog/devtools-component-filters.gif)

## How do I get the old version back?

If you are working with React Native version 60 (or older) you can install the previous release of DevTools from NPM:

```shell
npm install --dev react-devtools@^3
```

For older versions of React DOM (v0.14 or earlier) you will need to build the extension from source:

```shell
# Checkout the extension source
git clone https://github.com/facebook/react-devtools

cd react-devtools

# Install dependencies and build the unpacked extension
yarn install
yarn build:extension

# Follow the on-screen instructions to complete installation
```

## Thank you!

We'd like to thank everyone who tested the early release of DevTools version 4.
Your feedback helped improve this initial release significantly.

We still have many exciting features planned and feedback is always welcome!
Please feel free to open a [GitHub issue](https://github.com/bvaughn/react-devtools-experimental/issues/new) or tag [@brian\_d\_vaughn on Twitter](https://twitter.com/brian_d_vaughn).