---
title: Quick Start
---

<Intro>

Welcome to the React documentation! This page will give you an introduction to the 80% of React concepts that you will use on a daily basis.

</Intro>

<YouWillLearn>

TODO

</YouWillLearn>

## Creating and nesting components {/*components*/}

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

Notice that `<MyButton />` starts with a capital letter. That's how you know it's a React component. React component names must always start with a capital letter, while HTML tags must be lowercase.

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

## Writing markup with JSX {/*writing-markup-with-jsx*/}

The markup syntax you've seen above is called JSX. It is optional, but most React projects use JSX for its convenience. Browsers don't understand JSX natively, but you can [set up a tranform locally](/learn/installation) when you're ready.

JSX is stricter than HTML. You have to close tags like `<br />`. Your component also can't return multiple JSX tags. You have to wrap them into a shared parent, like a `<div>...</div>` or an empty `<>...</>` wrapper:

```js {3,6}
function AboutPage() {
  return (
    <>
      <h1>About</h1>
      <p>Hello there.<br />How do you do?</p>
    </>
  );
}
```

If you have a lot of HTML to port to JSX, you can use an [online converter](https://transform.tools/html-to-jsx).

## Styling a component {/*styling-a-component*/}

In React, you specify a CSS class with `className`. It works the same way as HTML [`class`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) attribute:

```js
<img className="avatar" />
```

Then you write the CSS rules for it in a separate CSS file:

```css
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```

React does not prescribe how you add CSS files. In the simplest case, you'll add a [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) tag to your HTML. If you use a build tool or a framework, consult its documentation to learn how to add a CSS file to your project.

If you don't know the values ahead of time, use the inline `style` attribute. It's like the HTML [`style`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/style) attribute, but you pass an object of camelCase CSS properties rather than a string:

```js {4-6}
<img
  className="avatar"
  style={
    {
      borderColor: user.themeColor
    }
  }
/>
```

Notice that you had to write `style={ }` with curly braces rather than with quotes in order to pass an object. This syntax is not specific to styles. You will always use it when you want to access JavaScript from your JSX.

## Curly braces in JSX {/*curly-braces-in-jsx*/}

JSX lets you put markup into JavaScript. Curly braces let you "escape back" into JavaScript so that you can embed some variable from your code and display it to the user. For example, this will display `user.name`:

```js {3}
return (
  <h1>
    {user.name}
  </h1>
);
```

You can also use curly braces for attributes, but you have to put them *instead of* quotes. For example, `className="avatar"` passes the `"avatar"` string as the CSS class, but `src={user.imageUrl}` reads the JavaScript `user.imageUrl` variable value, and then passes that value as the `src` attribute:

```js {3,4}
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

You can put any dynamic expressions inside JSX curlies, including function calls and object literals:

```js {8-13}
let classes = ['avatar'];
if (user.imageSize > 100) {
  classes.push('large');
}
return (
  <img
    src={user.imageUrl}
    className={classes.join(' ')}
    alt={'Photo of ' + user.name}
    style={{
      width: user.imageSize,
      height: user.imageSize
    }}
  />
);
```

Here, `style={{ }}` is not a special syntax, but a regular object inside the JSX curlies.

JSX curly braces let you take static markup and then put dynamic data into it:

<Sandpack>

```js
let user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  let classes = ['avatar'];
  if (user.imageSize > 100) {
    classes.push('large');
  }
  return (
    <>
      <h1>{user.name}</h1>
      <img
        src={user.imageUrl}
        className={classes.join(' ')}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

```css
.avatar {
  border-radius: 50%;
}

.large {
  border: 4px solid gold;
}
```

</Sandpack>

