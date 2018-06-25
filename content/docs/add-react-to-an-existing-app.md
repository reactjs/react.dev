---
id: add-react-to-an-existing-app
title: Add React to a Website
permalink: docs/add-react-to-an-existing-app.html
prev: add-react-to-a-new-app.html
next: cdn-links.html
---

Use as little or as much React as you need.

React is designed for gradual adoption, and **you can use as little or as much React as you need**. Perhaps you only want to add some "sprinkles of interactivity" to an existing page. React components are a great way to do that.

The majority of websites aren't, and don't need to be, [single-page apps](/docs/add-react-to-a-new-app.html). With **a few lines of code and no build tooling**, try React in a small part of your website. You can then either [gradually expand its presence](https://www.youtube.com/watch?v=BF58ZJ1ZQxY), or keep it contained to a few dynamic widgets.

## Add React in One Minute

In this section, we will show how to add a React component to an existing HTML page. You can follow along with your own website, or create an empty HTML file to practice.

There will be no complicated tools or install requirements -- **to complete this section, you only need an internet connection, and a minute of your time.**

Optional: [Download the full example (2KB zipped)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/e719c1eff0f004449c3e3c1c816f9937a184ba83.zip)

### Step 1: Add a DOM Container to the HTML

First, open the HTML markup of the page where you'd like to use React. Add an empty `<div>` tag to mark the spot where you want to display something with it. For example:

```html{3}
<!-- ... existing HTML ... -->

  <div class="like_button_container"></div>

<!-- ... existing HTML ... -->
```

We gave this `<div>` a unique `class` HTML attribute. This will allow us to find it from the JavaScript code later.

>Tip
>
>This `<div>` is called a "DOM container" because it will *contain* a React component. It can be placed **anywhere** inside the `<body>` tag. You can have as many independent DOM containers on one page as you need. They are usually empty -- React will replace any existing content inside DOM containers.

### Step 2: Add the Script Tags

Next, add three `<script>` tags to the HTML page right before the closing `</body>` tag:

```html{5,6,9}
    <!-- ... other HTML ... -->

    <!-- Load React. -->
    <!-- Change .development.js to .production.min.js in both tags before deployment! -->
    <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>

    <!-- Load our React component. -->
    <script src="like_button.js"></script>

  </body>
</html>
```

The first two tags load React. The third one will load your component code.


### Step 3: Create a React Component

Create a file called `like_button.js` next to your HTML page, and paste [this starter code](https://cdn.rawgit.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/a29c36bd29084ac2c3267176db9cd7afd55d399d/LikeButton.js).

>Tip
>
>This code defines a React component called `LikeButton`. Don't worry if you don't understand it yet -- we'll cover the building blocks of React later in our [main concepts guide](/docs/hello-world.html) and a [hands-on tutorial](/tutorial/tutorial.html). For now, let's just get it showing on the screen!

After the starter code, add two lines to the bottom of `like_button.js`:

```js{3,4}
// ... the starter code you pasted ...

let domContainer = document.querySelector('.like_button_container');
ReactDOM.render(React.createElement(LikeButton), domContainer);
```

These two lines of code find the DOM container element, and then display our "Like" button React component inside of it. And that's the end of this section! There is no step four. **You have just added the first React component to your website.**

**[View the full example source code](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605)**

**[Download the full example (2KB zipped)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/e719c1eff0f004449c3e3c1c816f9937a184ba83.zip)**


## Development and Production Versions


In both `<script>` tags, we used a version of React intended for development:


```html
<script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>
```

It has many helpful warnings and better error messages, but it's not suitable for production.

During deployment, replace `development.js` with `production.min.js` in both tags:

```html
<script src="https://unpkg.com/react@16/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js" crossorigin></script>
```

Now you can ship React to your users!


## Optional: Add JSX

In the example above, we only relied on features that are natively supported by the browsers.

This is why we used `React.createElement()` to specify what to display on the screen:

```js
// Display a "Like" button
return React.createElement(
  'button',
  { onClick: () => this.setState({ liked: true }) },
  'Like'
);
```

However, React also offers an option to use [JSX](/docs/introducing-jsx.html) instead:

```js
return (
  <button onClick={() => this.setState({ liked: true })}>
    Like
  </button>
);
```

While **JSX is optional**, most people prefer it after spending some time with React.


