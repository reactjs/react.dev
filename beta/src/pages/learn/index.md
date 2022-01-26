---
title: Quick Start
---

<Intro>

Welcome to the React documentation! This page will give you an introduction to the 80% of React concepts that you will use on a daily basis.

</Intro>

<YouWillLearn>

TODO

</YouWillLearn>

## Components {/*components*/}

React apps are made out of components. A component is a piece of the UI (user interface) that has its own logic and appearance. A component can be as small as a button, or as large as an entire page.

React components are JavaScript functions that return markup:

```js
function MyButton() {
  return (
    <button>Click me</button>
  );
}
```

Now that you've declared `MyButton`, you can nest it into another component:

```js {5}
export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

Notice how `div` and `h1` are built-in HTML tags, so they are lowercase. `MyButton` starts with a capital letter, so React knows it's your own component. **React component names must always start with a capital letter.**

Have a look at the result:

<Sandpack>

```js
function MyButton() {
  return (
    <button>
      Click me
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

</Sandpack>


The `export default` keywords specify the main component in the file. If you're not familiar with some piece of JavaScript syntax, [MDN](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) and [javascript.info](https://javascript.info/import-export) have great references.


## Adding markup with JSX {/*adding-markup-with-jsx*/}





