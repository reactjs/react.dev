---
title: Using TypeScript
re: https://github.com/reactjs/react.dev/issues/5960
---

<Intro>

TypeScript is a popular way to add type definitions to JavaScript codebases. Out of the box, TypeScript [supports JSX](/learn/writing-markup-with-jsx) and you can get full React support by adding [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) to your project.

</Intro>

<YouWillLearn>
* [TypeScript with React Components](/learn/typescript#typescript-with-react-components)
* [Typing common hooks](/learn/add-react-to-an-existing-project)
* [How to set up your editor](/learn/editor-setup)
* [How to install React Developer Tools](/learn/react-developer-tools)

</YouWillLearn>


All of the production-grade frameworks mentioned in [Start a New React Project](/learn/start-a-new-react-project) offer support for using TypeScript with React, we recommend consulting their documentation for more information on setup. This guide assumes you have your project configured to support writing `*.tsx` TypeScript React files, and have finished the Quick Start guide.

## TypeScript with React Components {/*typescript-with-react-components*/}

Writing TypeScript with React is very similar to writing JavaScript with React. The key difference when working with a component is that you can provide types for your component's props. These types can be used for correctness checking and providing inline documentation in editors.

Taking the [`MyButton` functional component](/learn#components) from the [Quick Start](/learn) guide, we can add a type describing the `title` for the button:

<Sandpack>

```tsx App.tsx active
function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a button" />
    </div>
  );
}
```

</Sandpack>

 <Note>

These sandboxes can handle TypeScript code, but they do not run the type-checker. This means you can amend the TypeScript sandboxes to learn, but you won't get any type errors or warnings. To get type-checking, you can use the [TypeScript Playground](https://www.typescriptlang.org/play) or use a more fully-featured online sandbox.

</Note>

This inline syntax is the simplest way to provide types for a functional component, though once you start to have a few fields to describe it can become unwieldy. Instead, you can use an `interface` or `type` to describe the component's props:

<Sandpack>

```tsx App.tsx active
interface MyButtonProps {
  /** The text to display inside the button */
  title: string;
  /** Whether the button can be interacted with */
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  return (
    <button disabled={disabled}>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a button" disabled={false}/>
    </div>
  );
}
```

</Sandpack>

The type describing your component's props can be as simple or as complex as you need, though they should probably be an object type. You can learn about how TypeScript describes objects in [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html) but you may also be interested in using [Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) to describe a prop that can be one of a few different types and the [Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) guide for more advanced use cases.


## Hooks {/*typing-hooks*/}

The type definitions from `@types/react-dom` include types for the built-in hooks, so you can use them in your components without any additional setup. They are built to take into account the code you write in your component, so you will get inferred types a lot of the time and ideally do not need to handle the minutiae of providing the types. However, we can look at a few examples of how to provide types for hooks.

### `useState` {/*typing-usestate*/}

The `useState` hook will re-use the value passed in as the initial state to determine what the type of the value should be. For example:

```ts
const [enabled, setEnabled] = useState(false);
```

Will assign the type of `boolean` to `enabled`, and `setEnabled` will be a function accepting either a `boolean` argument, or a function that returns a `boolean`. If you want to explicitly provide a type for the state, you can do so by providing a type argument to the `useState` call:

```ts 
const [enabled, setEnabled] = useState<boolean>(false);
```

This isn't very useful in this case, but a common case where you may want to provide a type is when you have a union type. For example, `status` here can be one of a few different strings:

```ts
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```

Or, as recommended in [Principles for structuring state](/learn/choosing-the-state-structure#principles-for-structuring-state), you can group related state as an object and describe the different possibilities via object types:

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
```


## Add React to an existing project {/*add-react-to-an-existing-project*/}

If want to try using React in your existing app or a website, [add React to an existing project.](/learn/add-react-to-an-existing-project)

## Next steps {/*next-steps*/}

Head to the [Quick Start](/learn) guide for a tour of the most important React concepts you will encounter every day.

