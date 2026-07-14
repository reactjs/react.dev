---
title: TypeScript Usage
---
<Intro>
[Typescript](https://www.typescriptlang.org/) is a strongly type programming language that is built on top of JavaScript. It adds static and when used with React it allows you to define and enfore types for props, states and variables. 
</Intro>

## Installation {/*ts-installation*/}

### New Project {/*ts-new-project*/}
If you choose to use one of the recommended React frameworks you will often get prompted if you want to use TypeScript or JavaScript for your project. If you choose to use TypeScript the framework will automatically install all the required packages for you.
If you want to start using typescript with your new project you can use the following command:
<TerminalBlock>
npx create-react-app my-app --template typescript
</TerminalBlock>

### Existing Project {/*ts-existing-project*/}
To add TypeScript to your existing React project you need to install the following packages:
<TerminalBlock>
npm install --save-dev typescript @types/node @types/react @types/react-dom @types/jest
</TerminalBlock>

## Usage {/*ts-usage*/}
To start using TypeScript in your project change the fileending from `.js` to `.tsx`. This will allow you to use TypeScript in your project.

## Functional Components {/*ts-function-components*/}

Here is a simple example of a functional component using TypeScript. The component takes in a name as a prop and returns a h1 element with the name. Inside the paranthesis after the function name you define the types of the props. In this case the prop is a string.

```ts
const Greeting = (name: string) => {
    return <h1>Hello {name}</h1>
}
export default Greeting;
```

If want to have multiple variable as props you can define an interface for the props. This will allow you to define the types of the props and also if they are required or not. In this case the name is required but the age is not.

```ts
interface GreetingProps {
    name: string;
    age: number;
}

const Greeting = (props: GreetingProps) => {
    return <h1>Hello {props.name} your age is {props.age}</h1>
}
export default Greeting;
```

Or destruct the props in the paranthesis after the function name.

```ts
const Greeting = ({name, age}: {name: string, age: number}) => {
    return <h1>Hello {name} your age is {age}</h1>
}
export default Greeting;
```

## Hooks {/*ts-hooks*/}
Here i a few examples of how to use hooks with TypeScript.

### useState {/*ts-usestate*/}
Here is an example of how to use useState with TypeScript. The useState hook takes in a generic type that defines the type of the state. In this case the state is a string.

```ts
const [name, setName] = useState<string>('');
```

### useReducer {/*ts-usereducer*/}
Here is an example of how to use useReducer with TypeScript. The useReducer hook takes in a generic type that defines the type of the state. In this case the state is a string.

```ts
const [state, dispatch] = useReducer<React.Reducer<string, string>>(reducer, '');
```

## Event Handlers {/*ts-event-handlers*/}
Here is an example of how to use event handlers with TypeScript. The event handler takes in a generic type that defines the type of the event. In this case the event is a `React.MouseEvent<HTMLButtonElement>`.

```ts
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(event);
}
```

Here is an simple example on how to use typescript with an text input
```ts
const TextInput = () => {
    const [text, setText] = useState<string>('');
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    }
    return (
        <>
            <input type="text" value={text} onChange={handleChange}>
            <p>You just wrote {text}</p>
        </>
    )
}
```



