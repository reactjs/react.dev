---
title: Installation
---

<Intro>

React has been designed from the start for gradual adoption, and you can use as little or as much React as you need. Whether you want to get a taste of React, add some interactivity to an HTML page, or start a complex React-powered app, this section will help you get started.

</Intro>

<YouWillLearn>

* [How to add React to an HTML page](/learn/add-react-to-a-website)
* [How to start a standalone React project](/learn/start-a-new-react-project)
* [How to set up your editor](/learn/editor-setup)
* [How to install React Developer Tools](/learn/react-developer-tools)

</YouWillLearn>

## Try React {/*try-react*/}

You don't need to install anything to play with React. Try editing this sandbox!

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
```

</Sandpack>

We use sandboxes throughout these docs as teaching aids. Sandboxes can help familiarize you with how React works and help you decide if React is right for you. Outside of the React documentation, there are many online sandboxes that support React: for example, [CodeSandbox](https://codesandbox.io/s/new), [Stackblitz](https://stackblitz.com/fork/react), or [CodePen](
https://codepen.io/pen/?template=wvdqJJm).

### Try React locally {/*try-react-locally*/}

To try React locally on your computer, [download this HTML page](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html). Open it in your editor and in your browser!

## Add React to a page {/*add-react-to-a-page*/}

If you're working with an existing site and just need to add a little bit of React, you can [add React with a script tag.](/learn/add-react-to-a-website)

## Start a React project {/*start-a-react-project*/}

If you're ready to [start a standalone project](/learn/start-a-new-react-project) with React, you can set up a minimal toolchain for a pleasant developer experience. You can also start with a framework that makes a lot of decisions for you out of the box.

## Next steps {/*next-steps*/}

Where you start depends on how you like to learn, what you need to accomplish, and where you want to go next! Why not read [Thinking in React](/learn/thinking-in-react)--our introductory tutorial? Or you can jump to [Describing the UI](/learn/describing-the-ui) to play with more examples and learn each topic step by step. There is no wrong way to learn React!
