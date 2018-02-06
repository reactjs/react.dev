---
title: Strict mode
author: [bvaughn]
---

`StrictMode` is a tool for highlighting potential problems in an application. Like `Fragment`, `StrictMode` does not render any visible UI. It simply activates additional checks and warnings for its descendants.

> Note:
>
> Strict mode checks are run in development mode only; _they do not impact the production build_.

You can enable strict mode for any part of your application. For example:
`embed:update-on-async-rendering/enabling-strict-mode.js`

In the above example, strict mode checks will *not* be run against the `Header` and `Footer` components. However, `RouteOne` and `RouteTwo`, as well as all of their descendants, will have the checks.

In version 16.3, `StrictMode` helps with:
* Identifying components with unsafe lifecycles
* Warning about legacy string ref API usage
* Detecting unexpected side effects

Additional functionality will be added with future releases of React.

### Identifying unsafe lifecycles

As previously mentioned, certain legacy lifecycle methods are unsafe for use in async React applications. However, if your application uses third party libraries, it can be difficult to ensure that these lifecycles aren't being used. Fortunately, strict mode can help with this!

When strict mode is enabled, React compiles a list of all class components using the unsafe lifecycles, and logs a warning message with information about these components, like so:

![](../images/blog/strict-mode-unsafe-lifecycles-warning.png)

Addressing the issues identified by strict mode _now_ will make it easier for you to take advantage of async rendering in future releases of React.

### Detecting unexpected side effects

As a general rule, side-effects should be avoided in certain class component methods (e.g. the `constructor`, `render`, etc). This is because React may invoke these methods more than once before committing, or it may invoke them without committing at all (because of an error or a higher priority interruption). Ignoring this rule can lead to a variety of problems, including memory leaks and invalid state. Unfortunately, it can be difficult to detect these problems as they are often non-deterministic.

Strict mode can't automatically detect side effects for you, but it can help you spot them by making them a little more deterministic. This is done by intentionally double-invoking the following methods:

* Class component `constructor` method
* The `render` method
* `setState` updater functions
* The static `getDerivedStateFromProps` lifecycle

> Note:
>
> This only applies to development mode. _Lifecycles will not be double-invoked in production mode._

For example, consider the following code:
`embed:update-on-async-rendering/side-effects-in-constructor.js`

At first glance, this code might not seem problematic. But if `SharedApplicationState.recordEvent` is not idempotent, then instantiating this component multiple times could lead to invalid application state. This sort of subtle bug might not manifest during development, or it might do so inconsistently and so be overlooked.

By intentionally double-invoking methods like the component constructor, strict mode makes patterns like this easier to spot.
