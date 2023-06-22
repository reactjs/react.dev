---
title: Using TypeScript
---

<Intro>

TypeScript is a popular way to add type definitions to React projects. Out of the box, TypeScript [supports JSX](/learn/writing-markup-with-jsx) and you can get full React support by adding [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) to your project.

</Intro>

<YouWillLearn isChapter={true}>
* [How does ](/learn/start-a-new-react-project)
* [How to add React to an existing project](/learn/add-react-to-an-existing-project)
* [How to set up your editor](/learn/editor-setup)
* [How to install React Developer Tools](/learn/react-developer-tools)

</YouWillLearn>

## Try React {/*try-react*/}

You don't need to install anything to play with React. Try editing this sandbox!

<Sandpack>

```tsx App.tsx active
function Greeting({ name } : { name: string }) {
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

To try React locally on your computer, [download this HTML page.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) Open it in your editor and in your browser!

## Start a new React project {/*start-a-new-react-project*/}

If you want to build an app or a website fully with React, [start a new React project.](/learn/start-a-new-react-project)

## Add React to an existing project {/*add-react-to-an-existing-project*/}

If want to try using React in your existing app or a website, [add React to an existing project.](/learn/add-react-to-an-existing-project)

## Next steps {/*next-steps*/}

Head to the [Quick Start](/learn) guide for a tour of the most important React concepts you will encounter every day.

