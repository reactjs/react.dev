---
id: add-react-to-a-website
title: Add React to a Website
permalink: docs/add-react-to-a-website.html
redirect_from: "docs/add-react-to-an-existing-app.html"
prev: getting-started.html
next: create-a-new-react-app.html
---

Use as little or as much React as you need.

React is designed for gradual adoption, and **you can use as little or as much React as you need**. Perhaps you only want to add some "sprinkles of interactivity" to an existing page. React components are a great way to do that.

The majority of websites aren't, and don't need to be, single-page apps. With **a few lines of code and no build tooling**, try React in a small part of your website. You can then either gradually expand its presence, or keep it contained to a few dynamic widgets.

---

- [Add React in One Minute](#add-react-in-one-minute)
- [Optional: Try React with JSX](#optional-try-react-with-jsx)

## Add React in One Minute

In this section, we will show how to add a React component to an existing HTML page. You can follow along with your own website, or create an empty HTML file to practice.

There will be no complicated tools or install requirements -- **to complete this section, you only need an internet connection, and a minute of your time.**

Optional: [Download the full example (2KB zipped)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)

### Step 1: Add a DOM Container to the HTML

First, open the HTML page you want to edit. Add an empty `<div>` tag to mark the spot where you want to display something with React. For example:

```html{3}
<!-- ... existing HTML ... -->

<div id="like_button_container"></div>

<!-- ... existing HTML ... -->
```

We gave this `<div>` a unique `id` HTML attribute. This will allow us to find it from the JavaScript code later and display a React component inside of it.

>Tip
>
>You can place a "container" `<div>` like this **anywhere** inside the `<body>` tag. You may have as many independent DOM containers on one page as you need. They are usually empty -- React will replace any existing content inside DOM containers.

### Step 2: Add the Script Tags

Next, add three `<script>` tags to the HTML page right before the closing `</body>` tag:

```html{5,6,9}
  <!-- ... other HTML ... -->

  <!-- Load React. -->
  <!-- Note: when deploying, replace "development.js" with "production.min.js". -->
  <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>

  <!-- Load our React component. -->
  <script src="like_button.js"></script>

</body>
```

The first two tags load React. The third one will load your component code.

### Step 3: Create a React Component

Create a file called `like_button.js` next to your HTML page.

Open this [this starter code](https://cdn.rawgit.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js) and paste it into the file you created.

>Tip
>
>This code defines a React component called `LikeButton`. Don't worry if you don't understand it yet -- we'll cover the building blocks of React later in our [hands-on tutorial](/tutorial/tutorial.html) and [main concepts guide](/docs/hello-world.html). For now, let's just get it showing on the screen!

After the starter code, add two lines to the bottom of `like_button.js`:

```js{3,4}
// ... the starter code you pasted ...

const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(e(LikeButton), domContainer);
```

These two lines of code find the `<div>` we added to our HTML in the first step, and then display our "Like" button React component inside of it. 

### That's It!

There is no step four. **You have just added the first React component to your website.**

Check out the next sections for more tips on integrating React.

**[View the full example source code](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605)**

**[Download the full example (2KB zipped)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)**

### Tip: Reuse a Component

Commonly, you might want to display React components in multiple places on the HTML page. Here is an example that displays the "Like" button three times and passes some data to it:

[View the full example source code](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda)

[Download the full example (2KB zipped)](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda/archive/9d0dd0ee941fea05fd1357502e5aa348abb84c12.zip)

>Note
>
>This strategy is mostly useful while React-powered parts of the page are isolated from each other. Inside React code, it's easier to use [component composition](/docs/components-and-props.html#composing-components) instead.

### Tip: Minify JavaScript for Production

Before deploying your website to production, be mindful that unminifed JavaScript can significantly slow down the page for your users.

If you already minify the application scripts, **your site will be production-ready if you ensure that the deployed HTML loads the versions of React ending in `production.min.js`:**

```js
<script src="https://unpkg.com/react@16/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js" crossorigin></script>
```

If you don't have a minification step for your scripts, [here's one way to set it up](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3).

## Optional: Try React with JSX

In the examples above, we only relied on features that are natively supported by the browsers. This is why we used a JavaScript function call to tell React what to display:

```js
const e = React.createElement;

// Display a "Like" <button>
return e(
  'button',
  { onClick: () => this.setState({ liked: true }) },
  'Like'
);
```

However, React also offers an option to use [JSX](/docs/introducing-jsx.html) instead:

```js
// Display a "Like" <button>
return (
  <button onClick={() => this.setState({ liked: true })}>
    Like
  </button>
);
```

These two code snippets are equivalent. While **JSX is [completely optional](/docs/react-without-jsx.html)**, many people find it helpful for writing UI code -- both with React and with other libraries.

You can play with JSX using [this online converter](http://babeljs.io/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=Q&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2%2Cstage-3&prettier=true&targets=Node-6.12&version=6.26.0&envVersion=).

### Add JSX to a Project

If you want to add JSX to your project, follow these three steps:

1. [Install Node.js](https://nodejs.org/)
2. **Don't miss this step:** Run `npm init -y` in your project folder
    - Tip: If you get an **error message** starting with "Invalid name", rename the project folder to only contain lowercase ASCII letters or hyphens (e.g. `my-project`), and try again.
3. Run `npm install babel-cli@6 babel-preset-react-app@3`

You can now use JSX!

### Compile JSX with One Command

Create a folder called `src` and run this terminal command:

```
npx babel --watch src --out-dir . --presets react-app/prod 
```

>Note
>
>`npx` is not a typo -- it's a [package runner tool that comes with npm 5.2+](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).
>
>If you see an error message saying "You have mistakenly installed the `babel` package", you might have missed [the previous step](#add-jsx-to-a-project). Perform it in the same folder, and then try again.

Don't wait for it to finish -- this command starts an automated watcher for JSX.

If you now create a file called `src/like_button.js` with this [JSX starter code](https://cdn.rawgit.com/gaearon/c8e112dc74ac44aac4f673f2c39d19d1/raw/09b951c86c1bf1116af741fa4664511f2f179f0a/like_button.js), the watcher will create a compiled `like_button.js` with the plain JavaScript code suitable for the browser. When you edit the source file with JSX, the transform will re-run automatically.

As a bonus, this also lets you use modern JavaScript syntax features like classes without worrying about breaking older browsers. The tool we just used is called Babel, and you can learn more about it from [its documentation](http://babeljs.io/docs/en/babel-cli/).

If you notice that you're getting comfortable with build tools and want them to do more for you, [the next section](/docs/create-a-new-react-app.html) describes some of the most popular and approachable toolchains. If not -- those script tags will do just fine!
