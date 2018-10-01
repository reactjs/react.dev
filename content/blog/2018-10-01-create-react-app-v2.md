---
title: "Create React App v2"
author: [timer]
---

We are excited to announce there are numerous new use cases supported by Create React App out of the box, making it more versatile than ever.

As usual with Create React App, **you can enjoy these improvements in your existing non-ejected apps by updating a single dependency** and following our [migration instructions](https://github.com/facebook/create-react-app/releases/tag/v2.0.2).

Newly created apps will get these improvements automatically.

### Compiling `node_modules`

>*This change was contributed by [@gaearon](https://github.com/gaearon) in [#3776](https://github.com/facebook/create-react-app/pull/3776).*

JavaScript has been maturing rapidly for the past few years, introducing new syntax and runtime features.
Unfortunately, it takes time for these features to reach end-users. To accommodate this, we compile all application source code down to a level understood by all browsers.

There was a missing piece of the puzzle, though: the packages you consume from `node_modules`.
Compiling third party code is difficult because there's no way to know you're doing it correctly. However, we're finding more and more developers are wanting to forget the past and publish packages using new language features (we don't blame them).

Starting in Create React App v2, we now compile **all** [ES.Next<sup>[1]</sup>](#footnotes) features found in `node_modules`. This means you can consume packages and not worry about them being syntax-incompatible with any browser.

### CSS Modules

>*This change was contributed by [@ro-savage](https://github.com/ro-savage) and the community in [#2285](https://github.com/facebook/create-react-app/pull/2285).*

### Sass Support

>*This change was contributed by [@Fabianopb](https://github.com/Fabianopb) in [#4195](https://github.com/facebook/create-react-app/pull/4195).*

### Import SVGs as React Components

>*This change was contributed by [@iansu](https://github.com/iansu) in [#3718](https://github.com/facebook/create-react-app/pull/3718).*

### webpack 4

>*This change was contributed by [@andriijas](https://github.com/andriijas) in [#4077](https://github.com/facebook/create-react-app/pull/4077), [@bugzpodder](https://github.com/bugzpodder) in [#4504](https://github.com/facebook/create-react-app/pull/4504), and [@Timer](https://github.com/Timer) in [#5030](https://github.com/facebook/create-react-app/pull/5030)/[#5058](https://github.com/facebook/create-react-app/pull/5058).*

We have upgraded to [webpack 4](https://medium.com/webpack/webpack-4-released-today-6cdb994702d4) to take advantage of its much faster internals and reduced bundle sizes.
While the webpack configuration format has changed, Create React App users who didn't eject will gain these benefits with no action required. [<sup>[2]</sup>](#footnotes)

The most notable new feature is the ability to reliably split your bundle into chunks, improving long-term caching and consequently page load times.

### Babel Macros

>*This change was contributed by [@kentcdodds](https://github.com/kentcdodds) and [@threepointone](https://github.com/threepointone) in [#3675](https://github.com/facebook/create-react-app/pull/3675).*

### Jest 23

> *This change was contributed by [@aisensiy](https://github.com/aisensiy) in [#3124](https://github.com/facebook/create-react-app/pull/3124) and [@skoging](https://github.com/skoging) in [#4846](https://github.com/facebook/create-react-app/pull/4846).*

We are now using the latest version of Jest that includes numerous bug fixes and improvements. You can read more about the changes in [Jest 22](https://jestjs.io/blog/2017/12/18/jest-22) and [Jest 23](https://jestjs.io/blog/2018/05/29/jest-23-blazing-fast-delightful-testing) blog posts.

Highlights include a new [interactive snapshot mode](https://jestjs.io/blog/2018/05/29/jest-23-blazing-fast-delightful-testing#interactive-snapshot-mode), [Jest Each](https://jestjs.io/blog/2018/05/29/jest-23-blazing-fast-delightful-testing#jest-each), [hints for what's causing a test to hang](https://jestjs.io/blog/2018/05/29/jest-23-blazing-fast-delightful-testing#debug-hanging-tests), and [code frames in test failures](https://jestjs.io/blog/2017/12/18/jest-22#codeframe-in-test-failures).

![Interactive Snapshot Mode](https://jestjs.io/img/blog/23-interactive.gif)

### And More!

There's many other goodies, such as [code splitting for dependencies](https://github.com/facebook/create-react-app/pull/5047), [a preflight check to prevent obscure errors](https://github.com/facebook/create-react-app/pull/3771), [customizable browser](https://github.com/facebook/create-react-app/pull/3644) [support for CSS](https://github.com/facebook/create-react-app/pull/4716), [removal of PropTypes in production](https://github.com/facebook/create-react-app/pull/3818), [smaller builds with Babel tricks](https://github.com/facebook/create-react-app/pull/4248), [a new JavaScript minifier](https://github.com/facebook/create-react-app/pull/5026), [compiling code in parallel](https://github.com/facebook/create-react-app/pull/3778), [a user definable proxy](https://github.com/facebook/create-react-app/pull/5073), and other enhancements!

---

#### Footnotes

<small>[1]: ES.Next does [not include language *proposals*](https://github.com/tc39/proposals). ES.Next refers to [finished proposals (stage 4)](https://github.com/tc39/proposals/blob/master/finished-proposals.md) not yet published as formal specification.</small>

<small>[2]: If you had to eject your app for one reason or another, webpack provides a [configuration migration guide](https://webpack.js.org/migrate/) that you can follow to update your apps. Note that with each release of Create React App, we are working to support more use cases out of the box so that you don't have to eject in the future.</small>
