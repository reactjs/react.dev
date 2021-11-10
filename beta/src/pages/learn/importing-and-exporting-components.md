---
title: Importing and Exporting Components
---

<Intro>

The magic of components lies in their reusability: you can create components that are composed of other components. But as you nest more and more components, it often makes sense to start splitting them into different files. This lets you keep your files easy to scan and reuse components in more places.

</Intro>

<YouWillLearn>

* What a root component file is
* How to import and export a component
* When to use default and named imports and exports
* How to import and export multiple components from one file
* How to split components into multiple files

</YouWillLearn>

## The root component file {/*the-root-component-file*/}

In [Your First Component](/learn/your-first-component), you made a `Profile` component and a `Gallery` component that renders it:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

These currently live in a **root component file,** named `App.js` in this example. In [Create React App](https://create-react-app.dev/), your app lives in `src/App.js`. Depending on your setup, your root component could be in another file, though. If you use a framework with file-based routing, such as Next.js, your root component will be different for every page.

## Exporting and importing a component {/*exporting-and-importing-a-component*/}

What if you want to change the landing screen in the future and put a list of science books there? Or place all the profiles somewhere else? It makes sense to move `Gallery` and `Profile` out of the root component file. This will make them more modular and reusable in other files. You can move a component in three steps:

1. **Make** a new JS file to put the components in.
2. **Export** your function component from that file (using either [default](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) or [named](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports) exports).
3. **Import** it in the file where you’ll use the component (using the corresponding technique for importing [default](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#importing_defaults) or [named](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module) exports).

Here both `Profile` and `Gallery` have been moved out of `App.js` into a new file called `Gallery.js`. Now you can change `App.js` to import `Gallery` from `Gallery.js`:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js Gallery.js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Notice how this example is broken down into two component files now:

1. `Gallery.js`:
     - Defines the `Profile` component which is only used within the same file and is not exported.
     - Exports the `Gallery` component as a **default export**.
2. `App.js`:
     - Imports `Gallery` as a **default import** from `Gallery.js`.
     - Exports the root `App` component as a **default export**.


<Note>

You may encounter files that leave off the `.js` file extension like so:

```js 
import Gallery from './Gallery';
```

Either `'./Gallery.js'` or `'./Gallery'` will work with React, though the former is closer to how [native ES Modules](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules) work.

</Note>

<DeepDive title="Default vs Named Exports">

There are two primary ways to export values with JavaScript: default exports and named exports. So far, our examples have only used default exports. But you can use one or both of them in the same file. **A file can have no more than one _default_ export, but it can have as many _named_ exports as you like.**

![Default and named exports](/images/docs/illustrations/i_import-export.svg)

How you export your component dictates how you must import it. You will get an error if you try to import a default export the same way you would a named export! This chart can help you keep track:

| Syntax           | Export statement                           | Import statement                          |
| -----------      | -----------                                | -----------                               |
| Default  | `export default function Button() {}` | `import Button from './button.js';`     |
| Named    | `export function Button() {}`         | `import { Button } from './button.js';` |

When you write a _default_ import, you can put any name you want after `import`. For example, you could write `import Banana from './button.js'` instead and it would still provide you with the same default export. In contrast, with named imports, the name has to match on both sides. That's why they are called _named_ imports!

**People often use default exports if the file exports only one component, and use named exports if it exports multiple components and values.** Regardless of which coding style you prefer, always give meaningful names to your component functions and the files that contain them. Components without names, like `export default () => {}`, are discouraged because they make debugging harder.

</DeepDive>

## Exporting and importing multiple components from the same file {/*exporting-and-importing-multiple-components-from-the-same-file*/}

What if you want to show just one `Profile` instead of a gallery? You can export the `Profile` component, too. But `Gallery.js` already has a *default* export, and you can't have _two_ default exports. You could create a new file with a default export, or you could add a *named* export for `Profile`. **A file can only have one default export, but it can have numerous named exports!**

> To reduce the potential confusion between default and named exports, some teams choose to only stick to one style (default or named), or avoid mixing them in a single file. It's a matter of preference. Do what works best for you!

First, **export** `Profile` from `Gallery.js` using a named export (no `default` keyword):

```js
export function Profile() {
  // ...
}
```

Then, **import** `Profile` from `Gallery.js` to `App.js` using a named import (with the curly braces):

```js
import { Profile } from './Gallery.js';
```

Finally, **render** `<Profile />` from the `App` component:

```js
export default function App() {
  return <Profile />;
}
```

Now `Gallery.js` contains two exports: a default `Gallery` export, and a named `Profile` export. `App.js` imports both of them. Try editing `<Profile />` to `<Gallery />` and back in this example:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

```js Gallery.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Now you're using a mix of default and named exports:

* `Gallery.js`:
  - Exports the `Profile` component as a **named export called `Profile`**.
  - Exports the `Gallery` component as a **default export**.
* `App.js`:
  - Imports `Profile` as a **named import called `Profile`** from `Gallery.js`.
  - Imports `Gallery` as a **default import** from `Gallery.js`.
  - Exports the root `App` component as a **default export**.

<Recap>

On this page you learned:

* What a root component file is
* How to import and export a component
* When and how to use default and named imports and exports
* How to export multiple components from the same file

</Recap>



<Challenges>

### Split the components further {/*split-the-components-further*/}

Currently, `Gallery.js` exports both `Profile` and `Gallery`, which is a bit confusing.

Move the `Profile` component to its own `Profile.js`, and then change the `App` component to render both `<Profile />` and `<Gallery />` one after another.

You may use either a default or a named export for `Profile`, but make sure that you use the corresponding import syntax in both `App.js` and `Gallery.js`! You can refer to the table from the deep dive above:

| Syntax           | Export statement                           | Import statement                          |
| -----------      | -----------                                | -----------                               |
| Default  | `export default function Button() {}` | `import Button from './button.js';`     |
| Named    | `export function Button() {}`         | `import { Button } from './button.js';` |

<Hint>

Don't forget to import your components where they are called. Doesn't `Gallery` use `Profile`, too?

</Hint>

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <div>
      <Profile />
    </div>
  );
}
```

```js Gallery.js active
// Move me to Profile.js!
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

After you get it working with one kind of exports, make it work with the other kind.

<Solution>

This is the solution with named exports:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
import { Profile } from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

This is the solution with default exports:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import Profile from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

</Solution>

</Challenges>