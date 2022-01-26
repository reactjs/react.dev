---
title: Add React to a Website
---

<Intro>

React has been designed from the start for gradual adoption, and you can use as little or as much React as you need. Whether you're working with micro-frontends, an existing system, or just giving React a try, you can start adding interactive React components to an HTML page with just a few lines of code—and no build tooling!

</Intro>

## Add React in one minute {/*add-react-in-one-minute*/}

You can add a React component to an existing HTML page in under a minute. Try this out with your own website or [an empty HTML file](https://gist.github.com/rachelnabors/7b33305bf33776354797a2e3c1445186/archive/859eac2f7079c9e1f0a6eb818a9684a464064d80.zip)—all you need is an internet connection and a text editor like Notepad (or VSCode—check out our guide on [how to set yours up](/learn/editor-setup/))!

### Step 1: Add an element to the HTML {/*step-1-add-an-element-to-the-html*/}

In the HTML page you want to edit, add an HTML element like an empty `<div>` tag with a unique `id` to mark the spot where you want to display something with React.

You can place a "container" element like this `<div>` anywhere inside the `<body>` tag. React will replace any existing content inside HTML elements, so they are usually empty. You can have as many of these HTML elements on one page as you need.

```html {3}
<!-- ... existing HTML ... -->

<div id="component-goes-here"></div>

<!-- ... existing HTML ... -->
```

### Step 2: Add the Script Tags {/*step-2-add-the-script-tags*/}

In the HTML page, right before the closing `</body>` tag, add three `<script>` tags for the following files:

- [**react.development.js**](https://unpkg.com/react@17/umd/react.development.js) loads the core of React
- [**react-dom.development.js**](https://unpkg.com/react-dom@17/umd/react-dom.development.js) lets React render HTML elements to the [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model).
- **like_button.js** is where you'll write your component in step 3!

<Gotcha>

When deploying, replace "development.js" with "production.min.js".

</Gotcha>

```html
  <!-- end of the page -->
  <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>
  <script src="like_button.js"></script>
</body>
```

### Step 3: Create a React component {/*step-3-create-a-react-component*/}

Create a file called **like_button.js** next to your HTML page, add this code snippet, and save the file. This code defines a React component called `LikeButton`. [You can learn more about making components in our guides.](/learn/your-first-component)

```js
'use strict';

function LikeButton() {
  const [liked, setLiked] = React.useState(false);

  if (liked) {
    return 'You liked this!';
  }

  return React.createElement(
    'button',
    {
      onClick: () => setLiked(true),
    },
    'Like'
  );
}
```

### Step 4: Add your React Component to the page {/*step-4-add-your-react-component-to-the-page*/}

Lastly, add two lines to the bottom of **like_button.js**. These two lines of code find the `<div>` you added to your HTML in the first step and then display the "Like" button React component inside of it.

```js
const domContainer = document.getElementById('component-goes-here');
ReactDOM.render(React.createElement(LikeButton), domContainer);
```

**Congratulations! You have just rendered your first React component to your website!**

- [View the full example source code](https://gist.github.com/rachelnabors/c64b3aeace8a191cf5ea6fb5202e66c9)
- [Download the full example (2KB zipped)](https://gist.github.com/rachelnabors/c64b3aeace8a191cf5ea6fb5202e66c9/archive/7b41a88cb1027c9b5d8c6aff5212ecd3d0493504.zip)

#### You can reuse components! {/*you-can-reuse-components*/}

You might want to display a React component in multiple places on the same HTML page. This is most useful while React-powered parts of the page are isolated from each other. You can do this by calling `ReactDOM.render()` multiple times with multiple container elements.

1. In **index.html**, add an additional container element `<div id="component-goes-here-too"></div>`.
2. In **like_button.js**, add an additional `ReactDOM.render()` for the new container element:

```js {6,7,8,9}
ReactDOM.render(
  React.createElement(LikeButton),
  document.getElementById('component-goes-here')
);

ReactDOM.render(
  React.createElement(LikeButton),
  document.getElementById('component-goes-here-too')
);
```

Check out [an example that displays the "Like" button three times and passes some data to it](https://gist.github.com/rachelnabors/c0ea05cc33fbe75ad9bbf78e9044d7f8)!

### Step 5: Minify JavaScript for production {/*step-5-minify-javascript-for-production*/}

Unminified JavaScript can significantly slow down page load times for your users. Before deploying your website to production, it's a good idea to minify its scripts.

- **If you don't have a minification step** for your scripts, [here's one way to set it up](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3).
- **If you already minify** your application scripts, your site will be production-ready if you ensure that the deployed HTML loads the versions of React ending in `production.min.js` like so:

```html
<script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin></script>
```

## Try React with JSX {/*try-react-with-jsx*/}

The examples above rely on features that are natively supported by browsers. This is why **like_button.js** uses a JavaScript function call to tell React what to display:

```js
return React.createElement('button', {onClick: () => setLiked(true)}, 'Like');
```

However, React also offers an option to use [JSX](/learn/writing-markup-with-jsx), an HTML-like JavaScript syntax, instead:

```jsx
return <button onClick={() => setLiked(true)}>Like</button>;
```

These two code snippets are equivalent. JSX is popular syntax for describing markup in JavaScript. Many people find it familiar and helpful for writing UI code--both with React and with other libraries. You might see "markup sprinkled throughout your JavaScript" in other projects!

> You can play with transforming HTML markup into JSX using [this online converter](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.4.3).

### Try JSX {/*try-jsx*/}

The quickest way to try JSX in your project is to add the Babel compiler to your page's `<head>` along with React and ReactDOM like so:

```html {6}
<!-- ... rest of <head> ... -->

<script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin></script>

<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>

</head>
<!-- ... rest of <body> ... -->
```

Now you can use JSX in any `<script>` tag by adding `type="text/babel"` attribute to it. For instance:

```jsx {1}
<script type="text/babel">
  ReactDOM.render(
  <h1>Hello, world!</h1>, document.getElementById('root') );
</script>
```

To convert **like_button.js** to use JSX:

1. In **like_button.js**, replace

```js
return React.createElement(
  'button',
  {
    onClick: () => setLiked(true),
  },
  'Like'
);
```

with:

```jsx
return <button onClick={() => setLiked(true)}>Like</button>;
```

2. In **index.html**, add `type="text/babel"` to the like button's script tag:

```html
<script src="like_button.js" type="text/babel"></script>
```

Here is [an example HTML file with JSX](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html) that you can download and play with.

This approach is fine for learning and creating simple demos. However, it makes your website slow and **isn't suitable for production**. When you're ready to move forward, remove this new `<script>` tag and the `type="text/babel"` attributes you've added. Instead, in the next section you will set up a JSX preprocessor to convert all your `<script>` tags automatically.

### Add JSX to a project {/*add-jsx-to-a-project*/}

Adding JSX to a project doesn't require complicated tools like a [bundler](/learn/start-a-new-react-project#custom-toolchains) or a development server. Adding a JSX preprocessor is a lot like adding a CSS preprocessor.

Go to your project folder in the terminal, and paste these two commands (**Be sure you have [Node.js](https://nodejs.org/) installed!**):

1. `npm init -y` (if it fails, [here's a fix](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. `npm install babel-cli@6 babel-preset-react-app@3`

You only need npm to install the JSX preprocessor. You won't need it for anything else. Both React and the application code can stay as `<script>` tags with no changes.

Congratulations! You just added a **production-ready JSX setup** to your project.

### Run the JSX Preprocessor {/*run-the-jsx-preprocessor*/}

You can preprocess JSX so that every time you save a file with JSX in it, the transform will be re-run, converting the JSX file into a new, plain JavaScript file.

1. Create a folder called **src**
2. In your terminal, run this command: `npx babel --watch src --out-dir . --presets react-app/prod ` (Don't wait for it to finish! This command starts an automated watcher for JSX.)
3. Move your JSX-ified **like_button.js** to the new **src** folder (or create a **like_button.js** containing this [JSX starter code](https://gist.githubusercontent.com/rachelnabors/ffbc9a0e33665a58d4cfdd1676f05453/raw/652003ff54d2dab8a1a1e5cb3bb1e28ff207c1a6/like_button.js))

The watcher will create a preprocessed **like_button.js** with the plain JavaScript code suitable for the browser.

<Gotcha>

If you see an error message saying "You have mistakenly installed the `babel` package", you might have missed [the previous step](#add-jsx-to-a-project). Perform it in the same folder, and then try again.

</Gotcha>

As a bonus, this also lets you use modern JavaScript syntax features like classes without worrying about breaking older browsers. The tool we just used is called Babel, and you can learn more about it from [its documentation](https://babeljs.io/docs/en/babel-cli/).

If you're getting comfortable with build tools and want them to do more for you, [we cover some of the most popular and approachable toolchains here](/learn/start-a-new-react-project).

<DeepDive title="React without JSX">

Originally JSX was introduced to make writing components with React feel as familiar as writing HTML. Since then, the syntax has become widespread. However, there may be instances where you do not want to use or cannot use JSX. You have two options:

- Use a JSX alternative like [htm](https://github.com/developit/htm) which doesn't use a compiler—it uses JavaScript's native Tagged Templates.
- Use [`React.createElement()`](/reference/createelement), which has a special structure explained below.

With JSX, you would write a component like so:

```jsx
function Hello(props) {
  return <div>Hello {props.toWhat}</div>;
}

ReactDOM.render(<Hello toWhat="World" />, document.getElementById('root'));
```

With `React.createElement()`, you would write it like this:

```js
function Hello(props) {
  return React.createElement('div', null, `Hello ${props.toWhat}`);
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

It accepts three arguments: `React.createElement(component, props, children)`. Here's how they work:

1. A **component**, which can be a string representing an HTML element or a function component
2. An object of any [**props** you want to pass](/learn/passing-props-to-a-component)
3. An object of any **children** the component might have, such as text strings

If you get tired of typing `React.createElement()`, one common pattern is to assign a shorthand:

```js
const e = React.createElement;

ReactDOM.render(e('div', null, 'Hello World'), document.getElementById('root'));
```

If you use this shorthand form for `React.createElement()`, it can be almost as convenient to use React without JSX.

</DeepDive>
