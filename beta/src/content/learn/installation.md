---
title: Installation
---

<Intro>

React has been designed from the start for gradual adoption. You can use as little or as much React as you need. Whether you want to get a taste of React, add some interactivity to an HTML page, or start a complex React-powered app, this section will help you get started.

</Intro>

<YouWillLearn isChapter={true}>

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

You can edit it directly or open it in a new tab by pressing the "Fork" button in the upper right corner.

Most pages in the React documentation contain sandboxes like this. Outside of the React documentation, there are many online sandboxes that support React: for example, [CodeSandbox](https://codesandbox.io/s/new), [StackBlitz](https://stackblitz.com/fork/react), or [CodePen.](https://codepen.io/pen?&editors=0010&layout=left&prefill_data_id=3f4569d1-1b11-4bce-bd46-89090eed5ddb)

### Try React locally {/*try-react-locally*/}

To try React locally on your computer, [download this HTML page.](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html) Open it in your editor and in your browser!

## Add React to a page {/*add-react-to-a-page*/}

If you're working with an existing site and need to add a little bit of React, you can [add React with a script tag.](/learn/add-react-to-a-website)

## Start a React project {/*start-a-react-project*/}

If you're ready to [start a standalone project](/learn/start-a-new-react-project) with React, you can set up a minimal toolchain for a pleasant developer experience. You can also start with a framework that makes a lot of decisions for you out of the box.

## Next steps {/*next-steps*/}

Head to the [Quick Start](/learn) guide for a tour of the most important React concepts you will encounter every day.

