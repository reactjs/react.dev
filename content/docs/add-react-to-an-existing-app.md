---
id: add-react-to-an-existing-app
title: Add React to a Website
permalink: docs/add-react-to-an-existing-app.html
prev: add-react-to-a-new-app.html
next: cdn-links.html
---

Use as little or as much React as you need.

React is designed for gradual adoption, and **you can use as little or as much React as you need**. Perhaps you only want to add some "sprinkles of interactivity" to an existing page. React components are a great way to do that.

The majority of websites aren't, and don't need to be, [single-page apps](/docs/add-react-to-a-new-app.html). With **a few lines of code and no build tooling**, try React in a small part of your website. You can then either gradually expand its presence, or keep it contained to a few dynamic widgets.

## Add React in One Minute

In this section, we will show how to add a React component to an existing HTML page. You can follow along with your own website, or create an empty HTML file to practice.

There will be no complicated tools or install requirements -- **to complete this section, you only need an internet connection, and a minute of your time.**

Optional: [Download the full example (2KB zipped)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/110ba374459fbf15109acbc957c16432e6601eef.zip)

### Step 1: Add a DOM Container to the HTML

First, open the HTML page you want to edit. Add an empty `<div>` tag to mark the spot where you want to display something with React. For example:

```html{3}
<!-- ... existing HTML ... -->

<div class="like_button_container"></div>

<!-- ... existing HTML ... -->
```

We gave this `<div>` a unique `class` HTML attribute. This will allow us to find it from the JavaScript code later and display a React component inside of it.

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
>This code defines a React component called `LikeButton`. Don't worry if you don't understand it yet -- we'll cover the building blocks of React later in our [main concepts guide](/docs/hello-world.html) and a [hands-on tutorial](/tutorial/tutorial.html). For now, let's just get it showing on the screen!

After the starter code, add two lines to the bottom of `like_button.js`:

```js{3,4}
// ... the starter code you pasted ...

const domContainer = document.querySelector('.like_button_container');
ReactDOM.render(e(LikeButton), domContainer);
```

These two lines of code find the `<div>` we added to our HTML in the first step, and then display our "Like" button React component inside of it. 

### You're Done!

There is no step four. **You have just added the first React component to your website.**

Check out the next sections for more tips on integrating React.

**[View the full example source code](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605)**

**[Download the full example (2KB zipped)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/110ba374459fbf15109acbc957c16432e6601eef.zip)**

## Tip: Minify JavaScript for Production

Before deploying your website to production, be mindful that unminifed JavaScript can significantly slow down the page for your users.

If you already minify the application scripts, all you need to do is to ensure that the deployed HTML loads the versions of React ending in `production.min.js`:

```js
<script src="https://unpkg.com/react@16/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js" crossorigin></script>
```

If you don't have a minification step for your scripts, [here's one way to set it up](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3).

## Optional: Try React with JSX

In the examples above, we only relied on features that are natively supported by the browsers. This is why we used a JavaScript function call to tell React what to display:

```js
const e = React.createElement;

// Display a "Like" button
return e(
  'button',
  { onClick: () => this.setState({ liked: true }) },
  'Like'
);
```

However, React also offers an option to use [JSX](/docs/introducing-jsx.html) instead:

```js
// Display a "Like" button
return (
  <button onClick={() => this.setState({ liked: true })}>
    Like
  </button>
);
```

These two code snippets are equivalent. While **JSX is [completely optional](/docs/react-without-jsx.html)**, many people find it helpful for writing UI code.

### Try JSX Online

The quickest way to try JSX is to use the [online JSX converter](http://babeljs.io/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=Q&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2%2Cstage-3&prettier=true&targets=Node-6.12&version=6.26.0&envVersion=). You can type some code using JSX in the left pane, and copy the output from the right pane.

### Add JSX to a Project

If you want to add JSX to your project, follow these three steps:

1. [Install Node.js](https://nodejs.org/)
2. Run `npm init -y` in your project folder (**don't skip this step!**)
3. Run `npm install babel-cli@6 babel-preset-react-app@3`

You can now use JSX!

### How to Compile JSX

**Make sure you've followed the previous steps.** Then create a folder called `src` and run this terminal command:

```
npx babel --watch src --out-dir . --presets react-app/prod 
```

It will start an automated watcher for JSX. For example, if you create `src/like_button.js` with this [JSX starter code](https://cdn.rawgit.com/gaearon/c8e112dc74ac44aac4f673f2c39d19d1/raw/6132aa19e73ec872dd0fb927667e0d74dea93697/like_button.js), Babel will create a compiled `like_button.js` with the plain JavaScript code suitable for the browser. When you edit the JSX file, the transform will re-run automatically.

As a bonus, this will also let you use modern JavaScript syntax features like classes without worrying about breaking older browsers. The tool we just used is called Babel, and you can learn more about it from [its documentation](http://babeljs.io/docs/en/babel-cli/).
