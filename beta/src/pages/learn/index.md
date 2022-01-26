---
title: Quick Start
---

<Intro>

Welcome to the React documentation! This page will give you an introduction to the 80% of React concepts that you will use on a daily basis.

</Intro>

<YouWillLearn>

TODO

</YouWillLearn>

## Components let you divide the user interface into parts {/*components-let-you-divide-the-user-interface-into-parts*/}

React apps are made out of components. A component is a piece of the UI (user interface) that has its own logic and appearance. A component can be as small as a button, or as large as an entire page. In fact, the page you're reading is a component, and it's made out of many other components like sidebar, search field, links, and so on.

The simplest React component looks like this:

<Sandpack>

```js
export default function MyButton() {
  return <button>Click me</button>;
}
```

</Sandpack>

It displays ("renders") a button that doesn't do anything. (We'll add some logic to it later!)

**React components are JavaScript functions that return markup.** In the above example, [`export default`](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export), [`function`](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/function), and [`return`](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/return) are JavaScript syntax, and aren't specific to React. If you're new to programming, React's reliance on JavaScript can be confusing--don't get discouraged! With practice, you *will* get the hang of it.

Have another look at the above example. There are three things you should pay attention to:

1. React component names **must start with a capital letter.** `MyButton` is a valid name, but `myButton` is not.
2. You need to **export** your component so that it's available in other files of your app.
3. React components are **JavaScript functions "sprinkled" with markup.** This markup syntax is called JSX.

You'll write a lot of JSX, so let's take a closer look at it.

## JSX lets you put markup into JavaScript {/*jsx-lets-you-put-markup-into-javascript*/}

This line of code is peculiar:

```js
return <button>Click me</button>;
```

It looks like JavaScript (there's a `return` statement). But it also looks like HTML! This syntax is called JSX.

JSX is a syntax extension for JavaScript that lets you write HTML-like markup directly in your JavaScript functions. Although you don't _have to_ use JSX, it is incredibly popular and very convenient with React. The sandboxes on this site already support JSX out of the box. The [Installation](/learn/installation) section provides you with different options to try it locally. On this page, we assume that you will use React together with JSX, as most people do.

Here is a component using more JSX:

<Sandpack>

```js
export default function MyPage() {
  return (
    <div>
      <div className="intro">
        <h1>Welcome to my website!</h1>
      </div>
      <p className="summary">
        You can find my thoughts here.
        <br />
        <b>And <i>pictures</i></b> of scientists!
      </p>
    </div>
  );
}
```

```css styles.css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

If you know HTML, you're very close to knowing JSX. JSX is a bit stricter than HTML, though:

1. **Wrap multi-line JSX in parentheses.** The opening `(` should be on the same line as the `return`.
2. **Return a single root JSX tag.** You can't return two tags from a function, just like you can't return two objects. Always wrap them in a parent `<div>...</div>` or `<>...</>` (this empty tag is also called a "fragment").
3. **Close all tags.** In HTML, unclosed `<br>` is valid, but in JSX you have to write "self-closing" `<br />`.

For historical reasons, React uses the same naming convention as the [DOM standard](https://developer.mozilla.org/en-US/docs/Web/API/Element/className), so you will write `className` to specify the CSS class. It works exactly the same way as the `class` HTML attribute. React is not prescriptive about the styling solution you use. By default, the `className` attribute uses regular global CSS.

If you have existing HTML, you can use an [online converter](https://transform.tools/html-to-jsx) to turn it into JSX.

## Curly braces let you access JavaScript from JSX {/*curly-braces-let-you-access-javascript-from-jsx*/}

JSX lets you put markup into JavaScript. However, often you'll want to "escape back" into JavaScript so that you can embed some variable from your code and display it to the user. In JSX, you do it with curly braces:

```js {3}
return (
  <h1>
    {user.name}
  </h1>
);
```

You can also use curly braces for attributes, but you have to put them *instead of* quotes:

```js {4,5}
let description = 'Photo of ' + user.name;
return (
  <img
    src={user.avatarUrl}
    alt={description}
  />
)
```

Curly braces let you take some static markup, and then put your own data into it. Let's give this a try!

<Sandpack>

```js
let user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg'
};

export default function Profile() {
  let description = 'Photo of ' + user.name;
  return (
    <div>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={description}
      />
    </div>
  );
}
```

```css
.avatar { border-radius: 50%; }
```

</Sandpack>