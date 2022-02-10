---
title: 'Tutorial: Tic-Tac-Toe'
---

We'll explain things as we go, but we suggest you first read through the [Quick Start](/learn) page to get an overview of the main concepts in React.

## Before We Start the Tutorial {/*before-we-start-the-tutorial*/}

We will build a small game during this tutorial. **You might be tempted to skip it because you're not building games -- but give it a chance.** The techniques you'll learn in the tutorial are fundamental to building any React app, and fully understanding it will give you a deep understanding of React.

<Note>

This tutorial is designed for people who prefer to **learn by doing**. If you prefer learning concepts from the ground up, check out our [step-by-step guide](/learn/describing-the-ui). You might find this tutorial and the guide complementary to each other.

</Note>

The tutorial is divided into several sections:

- [Setup for the Tutorial](#setup-for-the-tutorial) will give you **a starting point** to follow the tutorial.
- [Overview](#overview) will teach you **the fundamentals** of React: components, props, and state.
- [Completing the Game](#completing-the-game) will teach you **the most common techniques** in React development.
- [Adding Time Travel](#adding-time-travel) will give you **a deeper insight** into the unique strengths of React.

You don't have to complete all of the sections at once to get the value out of this tutorial. Try to get as far as you can -- even if it's one or two sections.

### What Are We Building? {/*what-are-we-building*/}

In this tutorial, we'll show how to build an interactive tic-tac-toe game with React.

You can see what we'll be building here: FIXME. If the code doesn't make sense to you, or if you are unfamiliar with the code's syntax, don't worry! The goal of this tutorial is to help you understand React and its syntax.

We recommend that you check out the tic-tac-toe game before continuing with the tutorial. One of the features that you'll notice is that there is a numbered list to the right of the game's board. This list gives you a history of all of the moves that have occurred in the game, and it is updated as the game progresses.

Once you've played around with the finished tic-tac-toe game, keep scrolling. We'll be starting from a simpler template in this tutorial. Our next step is to set you up so that you can start building the game.

### Prerequisites {/*prerequisites*/}

We'll assume that you have some familiarity with HTML and JavaScript, but you should be able to follow along even if you're coming from a different programming language. We'll also assume that you're familiar with programming concepts like functions, objects, arrays, and to a lesser extent, classes.

If you need to review JavaScript, we recommend reading [this guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript). Note that we're also using some features from ES6 -- a recent version of JavaScript. In this tutorial, we're using [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), [classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), and [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) statements. You can use the [Babel REPL](babel://es5-syntax-example) to check what ES6 code compiles to.

We'll also assume that you've at least skimmed through the [Quick Start](/learn) to get a feel for the main concepts in React.

## Setup for the Tutorial {/*setup-for-the-tutorial*/}

In the live code editor below, click **Fork** in the top-right corner to open the editor in a new tab using the website CodeSandbox. The new tab should display an empty tic-tac-toe game board and starter code for this tutorial.

<Sandpack>

```jsx App.js
function Square() {
  return <button className="square">{/* TODO */}</button>;
}

function Board() {
  function renderSquare(i) {
    return <Square />;
  }

  const status = 'Next player: X';

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

export default function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info">
        <ol>{/* TODO */}</ol>
      </div>
    </div>
  );
}
```

```jsx utils.js
// Don't worry too much about this code; it's not specific to React

export function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css
body {
  font: 14px 'Century Gothic', Futura, sans-serif;
  margin: 20px;
}

ol,
ul {
  padding-left: 30px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.square:focus {
  outline: none;
}

.kbd-navigation .square:focus {
  background: #ddd;
}

.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

There are two ways to complete this tutorial: you can either write the code in your browser, or you can set up a local development environment on your computer.

### Setup Option 1: Write Code in the Browser {/*setup-option-1-write-code-in-the-browser*/}

This is the quickest way to get started!

You can use the new browser tab you opened and edit the code there, without installing anything. (You could also edit the code inline on this page, but it'll be easier to have it open in a separate tab so you can switch back and forth easily.)

To continue with this approach, skip the second setup option, and go to the [Overview](#overview) section to get an overview of React.

### Setup Option 2: Local Development Environment {/*setup-option-2-local-development-environment*/}

If you'd prefer to use your own code editor (eg: [Visual Studio Code](https://code.visualstudio.com/)), you can download the files for this tutorial to your computer.

Here are the steps to follow:

1. Make sure you have a recent version of [Node.js](https://nodejs.org/en/) installed.
2. In the CodeSandbox tab you opened by clicking Fork, press the menu button in the top left corner of the page, then choose **File > Export to ZIP**.
3. Unzip the archive, then open a terminal and `cd` to the directory you downloaded (called `sandpack-project` FIXME).
4. The files you downloaded use a tool called [Create React App](https://create-react-app.dev/). To install the dependencies needed to run it, run `npm install`.

FIXME default browsers in package.json

Now if you run `npm start` in that folder, it should run a local server, open `http://localhost:3000/` in the browser, and show you the empty tic-tac-toe board.

### Help, I'm Stuck! {/*help-im-stuck*/}

If you get stuck, check out the [community support resources](/community/support.html). In particular, [Reactiflux Chat](https://discord.gg/reactiflux) is a great way to get help quickly.

## Overview {/*overview*/}

Now that you're set up, let's get an overview of React!

### Inspecting the Starter Code {/*inspecting-the-starter-code*/}

Open the `App.js` file to see the starter code. (If you downloaded the files, you'll find it in the `src` directory.)

This starter code is the base of what we're building. We've provided the CSS styling so that you only need to focus on learning React and programming the tic-tac-toe game.

By inspecting the code, you'll notice that we have three React components:

- Square
- Board
- Game

The Square component renders a single `<button>` and the Board renders 9 squares. The Game component renders a board with placeholder values which we'll modify later. There are currently no interactive components.

### Passing Data Through Props {/*passing-data-through-props*/}

To get our feet wet, let's try passing some data from our Board component to our Square component.

We strongly recommend typing code by hand as you're working through the tutorial and not using copy/paste. This will help you develop muscle memory and a stronger understanding.

In Board, change the code for the `renderSquare` function to pass a prop called `value` to the Square:

```jsx {3}
function Board() {
  function renderSquare(i) {
    return <Square value={i} />;
  }
  // ...
```

Change Square to show that value by updating it to take `{value}` as an argument and replacing `{/* TODO */}` with `{value}`:

```jsx {1,2}
function Square({value}) {
  return <button className="square">{value}</button>;
}
```

Parameters passed to a component are called **props**; when React calls your component, it passes the props as a single object.

Before:

![React Devtools](../images/tutorial/tictac-empty.png)

After: You should see a number in each square in the rendered output.

![React Devtools](../images/tutorial/tictac-numbers.png)

**[View the full code at this point](https://codepen.io/gaearon/pen/aWWQOG?editors=0010)** FIXME

Congratulations! You've just "passed a prop" from a parent Board component to a child Square component. Passing props is how information flows in React apps, from parents to children.

### Making an Interactive Component {/*making-an-interactive-component*/}

Let's fill the Square component with an "X" when we click it. First, change the button tag that is returned from the Square component to add `onClick` to its props:

```jsx {3}
function Square({value}) {
  return (
    <button
      className="square"
      onClick={() => {
        console.log('click');
      }}>
      {value}
    </button>
  );
}
```

React will call this function when the HTML element is clicked. If you click on a Square now, you should see `click` in your browser's devtools console.

As a next step, we want the Square component to "remember" that it got clicked, and fill it with an "X" mark. To "remember" things, components use **state**.

React provides a special function called `useState` that you can call from your component to let it "remember" things. Let's store the current value of the Square in state, and change it when the Square is clicked.

Import `useState` at the top of the file, then remove the `{value}` props and replace it with a call to `useState` that defines a state variable called `value`:

```jsx {1,3,4}
import {useState} from 'react';

function Square() {
  const [value, setValue] = useState(null);
  return (
    // ...
```

The variables `value` and `setValue` can be named anything you want, but it's conventional to use [array destructuring](/learn/a-javascript-refresher#array-destructuring) to name them like `[something, setSomething]`. The `null` value we pass to `useState` is used as the initial value for this state variable, so `value` here starts off equal to `null`.

Now we'll change Square to display an "X" when clicked. Replace the `onClick={...}` event handler with `onClick={() => setValue('X')}`. Now our Square component looks like this:

```jsx {4}
function Square() {
  const [value, setValue] = useState(null);
  return (
    <button className="square" onClick={() => setValue('X')}>
      {value}
    </button>
  );
}
```

By calling this `set` function from an `onClick` handler, we tell React to re-render that Square whenever its `<button>` is clicked. After the update, the Square's `value` will be `'X'`, so we'll see the "X" on the game board.

If you click on any Square, an "X" should show up. Note that each Square has its own state: the `value` stored in each Square is completely independent of the others.

When you call a `set` function in a component, React automatically updates the child components inside of it too.

**[View the full code at this point](https://codepen.io/gaearon/pen/VbbVLg?editors=0010)** FIXME

### Developer Tools {/*developer-tools*/}

The React Devtools extension for [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) lets you inspect a React component tree with your browser's developer tools.

<img
  src="../images/tutorial/devtools.png"
  alt="React Devtools"
  style={{maxWidth: '100%'}}
/>
FIXME new screenshot (and explain how to show host components?)

The React DevTools let you check the props and the state of your React components.

After installing React DevTools, you can right-click on any element on the page, click "Inspect" to open the developer tools, and the React tabs ("⚛️ Components" and "⚛️ Profiler") will appear as the last tabs to the right. Use "⚛️ Components" to inspect the component tree.

**However, note there is one extra step to get it working with CodeSandbox:** Just above the rendered components, click the **Open In New Window** button in the top right corner. In the new tab that opens, the devtools should now have the React tabs.

## Completing the Game {/*completing-the-game*/}

We now have the basic building blocks for our tic-tac-toe game. To have a complete game, we now need to alternate placing "X"s and "O"s on the board, and we need a way to determine a winner.

### Lifting State Up {/*lifting-state-up*/}

Currently, each Square component maintains the game's state. To check for a winner, we'll maintain the value of each of the 9 squares in one location.

You might guess that Board should just ask each Square for the Square's state. Although this approach is technically possible in React, we discourage it because the code becomes difficult to understand, susceptible to bugs, and hard to refactor. Instead, the best approach is to store the game's state in the parent Board component instead of in each Square. The Board component can tell each Square what to display by passing a prop, [just like we did when we passed a number to each Square](#passing-data-through-props).

**To collect data from multiple children, or to have two child components communicate with each other, you need to declare the shared state in their parent component instead. The parent component can pass the state back down to the children by using props; this keeps the child components in sync with each other and with the parent component.**

Lifting state into a parent component is common when React components are refactored -- let's take this opportunity to try it out.

Edit the Board component so that it declares a state variable named `squares` that defaults to an array of 9 nulls corresponding to the 9 squares:

```jsx {2}
function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function renderSquare(i) {
    // ...
```

When we fill the board in later, the `squares` array will look something like this:

<!-- prettier-ignore-start -->
<!-- because we don't want a semicolon here -->
```jsx
['O', null, 'X', 'X', 'X', 'O', 'O', null, null]
```
<!-- prettier-ignore-end -->

The Board's inner `renderSquare` function currently looks like this:

```jsx
function renderSquare(i) {
  return <Square value={i} />;
}
```

Earlier, we [passed the `value` prop down](#passing-data-through-props) from the Board to show numbers from 0 to 8 in every Square. In a different previous step, we replaced the numbers with an "X" mark [determined by Square's own state](#making-an-interactive-component) and removed the `value` argument. This is why Square currently ignores the `value` prop passed to it by the Board. (If we were using TypeScript, we would have received a type error for the extraneous `value={i}` in props and would have needed to remove it.)

We will now use the prop passing mechanism again. We will modify the Board to instruct each individual Square about its current value (`'X'`, `'O'`, or `null`). We have already defined the `squares` array in the Board's constructor; now, modify the Board's `renderSquare` function to read from it:

```jsx {2}
function renderSquare(i) {
  return <Square value={squares[i]} />;
}
```

**[View the full code at this point](https://codepen.io/gaearon/pen/gWWQPY?editors=0010)** FIXME

Each Square will now receive a `value` prop that will either be `'X'`, `'O'`, or `null` for empty squares.

Next, we need to change what happens when a Square is clicked. The Board component now maintains which squares are filled. We need to create a way for the Square to update the Board's state. Since state is private to a component that defines it, we cannot update the Board's state directly from Square.

Instead, we'll pass down a function from the Board to the Square, and we'll have Square call that function when a square is clicked. We'll change the `renderSquare` method in Board to:

```jsx {5}
function renderSquare(i) {
  return <Square value={squares[i]} onClick={() => handleClick(i)} />;
}
```

Now we're passing down two props from Board to Square: `value` and `onClick`. The `onClick` prop is a function that Square can call when clicked. Now make the following changes to Square:

- Add back the first argument to Square so it can receive the props from Board as `{value, onClick}`, this time including our second prop
- Remove the `useState` declaration from Square because we no longer want Square to keep track of its own state
- Replace `setValue('X')` with `onClick()` in Square

After these changes, the Square component looks like this:

```jsx {1,3}
function Square({value, onClick}) {
  return (
    <button className="square" onClick={() => onClick()}>
      {value}
    </button>
  );
}
```

FIXME give onClick a different name for clarity?

When a Square is clicked, the `onClick` function provided by the Board is called. Here's a review of how this is achieved:

1. The `onClick` prop on the built-in DOM `<button>` component tells React to set up a click event listener.
2. When the button is clicked, React will call the `onClick` event handler that is defined in the Square function.
3. This event handler calls `onClick()`, which refers to the Square's `onClick` prop that was specified by the Board.
4. Since the Board passed `onClick={() => handleClick(i)}` to Square, the Square calls the Board's `handleClick(i)` when clicked.
5. We have not defined the `handleClick()` function yet, so our code crashes. If you click a square now, you should see a red error screen saying something like "handleClick is not defined".

<Note>

The DOM `<button>` element's `onClick` attribute has a special meaning to React because it is a built-in component. For custom components like Square, the naming is up to you. We could give any name to the Square's `onClick` prop or Board's `handleClick` function, and the code would work the same. In React, it's conventional to use `on[Event]` names for props which represent events and `handle[Event]` for the methods which handle the events.

</Note>

When we try to click a Square, we should get an error because we haven't defined `handleClick` yet. We'll now add `handleClick` to the Board class:

```jsx {4-8}
function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const newSquares = squares.slice();
    newSquares[i] = 'X';
    setSquares(newSquares);
  }

  function renderSquare(i) {
    // ...
```

**[View the full code at this point](https://codepen.io/gaearon/pen/ybbQJX?editors=0010)** FIXME

After these changes, we're again able to click on the Squares to fill them, the same as we had before. However, now the state is stored in the Board component instead of the individual Square components. When the Board's state changes, the Square components re-render automatically. Keeping the state of all squares in the Board component will allow it to determine the winner in the future.

Since the Square components no longer maintain state, the Square components receive values from the Board component and inform the Board component when they're clicked. In React terms, the Square components are now **controlled components**. The Board has full control over them.

### Why Immutability Is Important {/*why-immutability-is-important*/}

Note how in `handleClick`, we call `.slice()` to create a copy of the `squares` array instead of modifying the existing array. To explain why, we'll now discuss immutability and why immutability is important to learn.

There are generally two approaches to changing data. The first approach is to _mutate_ the data by directly changing the data's values. The second approach is to replace the data with a new copy which has the desired changes.

#### Data Change with Mutation {/*data-change-with-mutation*/}

```jsx
const player = {score: 1, name: 'Jeff'};
player.score = 2;
// Now player is {score: 2, name: 'Jeff'}
```

#### Data Change without Mutation {/*data-change-without-mutation*/}

```jsx
const player = {score: 1, name: 'Jeff'};

const newPlayer = {...player, score: 2);
// Now player is unchanged, but newPlayer is {score: 2, name: 'Jeff'}
```

The end result is the same but by not mutating (or changing the underlying data) directly, we gain several benefits described below.

#### Complex Features Become Simple {/*complex-features-become-simple*/}

Immutability makes complex features much easier to implement. Later in this tutorial, we will implement a "time travel" feature that allows us to review the tic-tac-toe game's history and "jump back" to previous moves. This functionality isn't specific to games -- an ability to undo and redo certain actions is a common requirement in applications. Avoiding direct data mutation lets us keep previous versions of the game's history intact, and reuse them later.

#### Detecting Changes {/*detecting-changes*/}

Detecting changes in mutable objects is difficult because they are modified directly. This detection requires the mutable object to be compared to previous copies of itself and the entire object tree to be traversed.

Detecting changes in immutable objects is significantly easier. If the immutable object that is being referenced is different than the previous one, then the object has changed.

#### Determining When to Re-Render in React {/*determining-when-to-re-render-in-react*/}

The main benefit of immutability is that it helps you build _pure components_ in React. Immutable data can let you easily determine if changes have been made, which helps to determine when a component requires re-rendering.

You can learn more about `shouldComponentUpdate()` and how you can build _pure components_ by reading [Optimizing Performance](/docs/optimizing-performance.html#examples). FIXME

### Taking Turns {/*taking-turns*/}

It's now time to fix a major defect in our tic-tac-toe game: the "O"s cannot be marked on the board.

We'll set the first move to be "X" by default. Let's keep track of this by adding a second piece of state to the Board component:

```jsx {2}
function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  // ...
```

Each time a player moves, `xIsNext` (a boolean) will be flipped to determine which player goes next and the game's state will be saved. We'll update the Board's `handleClick` function to flip the value of `xIsNext`:

```jsx {3,5}
function handleClick(i) {
  const newSquares = squares.slice();
  newSquares[i] = xIsNext ? 'X' : 'O';
  setSquares(newSquares);
  setXIsNext(!xIsNext);
}
```

With this change, "X"s and "O"s can take turns. Try it!

Let's also change the "status" text in Board so that it displays which player has the next turn:

```jsx {1}
const status = 'Next player: ' + (xIsNext ? 'X' : 'O');

return (
  // ...
```

After applying these changes, you should have this Board component:

```jsx {2,7,9,16}
function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  }

  function renderSquare(i) {
    return <Square value={squares[i]} onClick={() => handleClick(i)} />;
  }

  const status = 'Next player: ' + (xIsNext ? 'X' : 'O');

  return (
    // ...
  );
}
```

**[View the full code at this point](https://codepen.io/gaearon/pen/KmmrBy?editors=0010)** FIXME

### Declaring a Winner {/*declaring-a-winner*/}

Now that we show which player's turn is next, we should also show when the game is won and there are no more turns to make. In the starter code, we included a `utils.js` file containing a helper function `calculateWinner` that takes an array of 9 squares, checks for a winner and returns `'X'`, `'O'`, or `null` as appropriate. Import it in `App.js`:

```jsx
import {calculateWinner} from './utils.js';
```

We will call `calculateWinner(squares)` in the Board component to check if a player has won. If a player has won, we can display text such as "Winner: X" or "Winner: O". We'll replace the `status` declaration in the Board function with this code:

```jsx
const winner = calculateWinner(squares);
let status;
if (winner) {
  status = 'Winner: ' + winner;
} else {
  status = 'Next player: ' + (xIsNext ? 'X' : 'O');
}
```

We can now change the Board's `handleClick` function to return early by ignoring a click if someone has won the game or if a Square is already filled:

```jsx {2-4}
function handleClick(i) {
  if (calculateWinner(squares) || squares[i]) {
    return;
  }
  const newSquares = squares.slice();
  newSquares[i] = xIsNext ? 'X' : 'O';
  setSquares(newSquares);
  setXIsNext(!xIsNext);
}
```

**[View the full code at this point](https://codepen.io/gaearon/pen/LyyXgK?editors=0010)** FIXME

Congratulations! You now have a working tic-tac-toe game. And you've just learned the basics of React too. So _you're_ probably the real winner here.

## Adding Time Travel {/*adding-time-travel*/}

As a final exercise, let's make it possible to "go back in time" to the previous moves in the game.

### Storing a History of Moves {/*storing-a-history-of-moves*/}

If we mutated the `squares` array, implementing time travel would be very difficult.

However, we used `slice()` to create a new copy of the `squares` array after every move, and [treated it as immutable](#why-immutability-is-important). This will allow us to store every past version of the `squares` array, and navigate between the turns that have already happened.

We'll store the past `squares` arrays in another array called `history`, which we'll store as a new state variable. The `history` array represents all board states, from the first to the last move, and has a shape like this:

```jsx
history = [
  // Before first move
  [null, null, null, null, null, null, null, null, null],
  // After first move
  [null, null, null, null, 'X', null, null, null, null],
  // After second move
  [null, null, null, null, 'X', null, null, null, 'O'],
  // ...
];
```

### Lifting State Up, Again {/*lifting-state-up-again*/}

Let's make the top-level Game component to display a list of past moves. To make this possible, we'll place the `history` state in the top-level Game component.

Placing the `history` state into the Game component lets us remove the `squares` state from its child Board component. Just like we ["lifted state up"](#lifting-state-up) from the Square component into the Board component, we are now lifting it up from the Board into the top-level Game component. This gives the Game component full control over the Board's data, and lets it instruct the Board to render previous turns from the `history`.

First, let's make the Board component stateless, by making it fully controlled by the props it receives. Remove the two state variables from Board, and change it to instead take three props: `xIsNext`, `squares`, and a new `onPlay` function that Board can call with the updated squares array whenever a player makes a move:

```jsx {1-2,9}
function Board({xIsNext, squares, onPlay}) {

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? "X" : "O";
    onPlay(newSquares);
  }

  function renderSquare(i) {
    // ...
```

Now, we'll set up the state variables for the Game component – note the square brackets around `Array(9).fill(null)` to make the nested array:

```jsx {2-3}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);

  return (
    // ...
```

To connect these components together, let's do three things:

- Define a new variable `currentSquares` that always points to the last entry in `history`.
- Add a new empty function `handlePlay`, which Board will call when the player does a move (we'll fill in its definition shortly).
- Pass `xIsNext`, `currentSquares`, and `handlePlay` from Game to Board, using the prop names that Board is expecting.

Now, Game's definition looks like this:

```jsx {4,6-8,13}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(newSquares) {
    // TODO
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{/* TODO */}</ol>
      </div>
    </div>
  );
}
```

What should `handlePlay` do when called? Remember that Board used to call `setSquares` with an updated array; now it passes the updated `squares` array to `onPlay`.

The `handlePlay` function needs to update Game's state to trigger a re-render, but we don't have a `setSquares` function that we can call any more – we're now using the `history` state variable to store this information. We want to update `history` by appending the updated `squares` array as a new history entry. We also want to toggle `xIsNext`, just as Board used to do:

```jsx {2-3}
function handlePlay(newSquares) {
  setHistory(history.concat([newSquares]));
  setXIsNext(!xIsNext);
}
```

<Note>

Instead of the array `push()` method you might be more familiar with, we prefer the `concat()` method here because it returns a new array rather than mutating the original array.

</Note>

At this point, we've moved the state to live in the Game component, but the UI should be fully working, just as it was before the refactor.

**[View the full code at this point](https://codepen.io/gaearon/pen/EmmOqJ?editors=0010)**

### Showing the Past Moves {/*showing-the-past-moves*/}

Since we are recording the tic-tac-toe game's history, we can now display it to the player as a list of past moves.

We learned earlier that React elements are first-class JavaScript objects; we can pass them around in our applications. To render multiple items in React, we can use an array of React elements.

You may be used to the [`map()` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) that is commonly used for transforming an array of data:

<!-- prettier-ignore-start -->
<!-- because we don't want a semicolon here -->
```jsx
[1, 2, 3].map(x => x * 2) // [2, 4, 6]
```
<!-- prettier-ignore-end -->

Here, we'll use the `map` method to transform our history of moves into React elements representing buttons on the screen, and we'll display a list of buttons to "jump" to past moves.

Let's `map` over the `history` in the Game component:

```jsx {11-18,26}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(newSquares) {
    setHistory(history.concat([newSquares]));
    setXIsNext(!xIsNext);
  }

  const moves = history.map((step, index) => {
    const description = index > 0 ? `Go to move #${index}` : 'Go to game start';
    return (
      <li>
        <button onClick={() => jumpTo(index)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
```

**[View the full code at this point](https://codepen.io/gaearon/pen/EmmGEa?editors=0010)**

As we iterate through `history` array, the `step` variable goes through each element of `history`, and `index` goes through each array index: 0, 1, 2, …. (In most cases, you'd need the actual array elements, but in this case we don't use `step`.)

For each move in the tic-tac-toe game's history, we create a list item `<li>` which contains a button `<button>`. The button has a `onClick` handler which calls a function called `this.jumpTo()` (that we haven't defined yet).

For now, we should see a list of the moves that have occurred in the game and a warning in the developer tools console that says: `Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of "Game".`

Let's discuss what this warning means.

### Picking a Key {/*picking-a-key*/}

When we render a list, React stores some information about each rendered list item. When we update a list, React needs to determine what has changed. We could have added, removed, re-arranged, or updated the list's items.

Imagine transitioning from

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

to

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

In addition to the updated counts, a human reading this would probably say that we swapped Alexa and Ben's ordering and inserted Claudia between Alexa and Ben. However, React is a computer program and can't know what we intended, so we need to specify a _key_ property for each list item to differentiate each list item from its siblings. If we were displaying data from a database, Alexa, Ben, and Claudia's database IDs could be used as keys.

```jsx {1}
<li key={user.id}>
  {user.name}: {user.taskCount} tasks left
</li>
```

When a list is re-rendered, React takes each list item's key and searches the previous list's items for a matching key. If the current list has a key that didn't exist before, React creates a component. If the current list is missing a key that existed in the previous list, React destroys the previous component. If two keys match, the corresponding component is moved.

Keys tell React about the identity of each component, which allows React to maintain state between re-renders. If a component's key changes, the component will be destroyed and re-created with a new state.

`key` is a special and reserved property in React (along with `ref`, a more advanced feature). When an element is created, React extracts the `key` property and stores the key directly on the returned element. Even though `key` may look like it is passed as props, React automatically uses `key` to decide which components to update. There's no way for a component to ask what `key` its parent specified.

**It's strongly recommended that you assign proper keys whenever you build dynamic lists.** If you don't have an appropriate key, you may want to consider restructuring your data so that you do.

If no key is specified, React will present a warning and use the array index as a key by default. Using the array index as a key is problematic when trying to re-order a list's items or inserting/removing list items. Explicitly passing `key={i}` silences the warning but has the same problems as array indices and is not recommended in most cases.

Keys do not need to be globally unique; they only need to be unique between components and their siblings.

### Implementing Time Travel {/*implementing-time-travel*/}

In the tic-tac-toe game's history, each past move has a unique ID associated with it: it's the sequential number of the move. Moves will never be re-ordered, deleted, or inserted in the middle, so it's safe to use the move index as a key.

In the Game function, we can add the key as `<li key={move}>`, and if you reload the rendered game, React's warning about keys should disappear:

```jsx {4}
const moves = history.map((step, move) => {
  const description = move > 0 ? `Go to move #${move}` : 'Go to game start';
  return (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>
  );
});
```

**[View the full code at this point](https://codepen.io/gaearon/pen/PmmXRE?editors=0010)** FIXME

Clicking any of the list item's buttons throws an error because the `jumpTo` method is undefined. Before we implement `jumpTo`, we'll add `stepNumber` to the Game component's state to indicate which step we're currently viewing.

First, define it as a new state variable, defaulting to `0`:

```jsx {3}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);
  const currentSquares = history[history.length - 1];
```

Next, add a `jumpTo` function inside Game to update that `stepNumber`. We'll also set `xIsNext` to true if the number that we're changing `stepNumber` to is even:

```jsx {5-10}
export default function Game() {
  // ...

  function jumpTo(step) {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  }
```

We will now make two changes to the Game's `handlePlay` method which fires when you click on a square.

- If we "go back in time" and then make a new move from that point, we only want to keep the history up to that point, so we'll call `history.slice(0, stepNumber + 1)` before `.concat()` to make sure we're only keeping that portion of the old history.
- Each time a move is made, we need to update `stepNumber` to point to the latest history entry.

```jsx {2-4}
function handlePlay(newSquares) {
  let newHistory = history.slice(0, stepNumber + 1).concat([newSquares]);
  setHistory(newHistory);
  setStepNumber(newHistory.length - 1);
  setXIsNext(!xIsNext);
}
```

Finally, we will modify the Game component to render the currently selected move, instead of always rendering the final move:

```jsx {5}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);
  const currentSquares = history[stepNumber];

  // ...
```

If we click on any step in the game's history, the tic-tac-toe board should immediately update to show what the board looked like after that step occurred.

**[View the full code at this point](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)** FIXME

### Final Cleanup {/*final-cleanup*/}

If you're eagle-eyed, you may notice that `xIsNext === true` when `stepNumber` is even and `xIsNext === false` when `stepNumber` is odd. In other words, if we know the value of `stepNumber`, then we can always figure out what `xIsNext` should be.

There's no reason for us to store both of these in state. It's a best practice to avoid redundant pieces of state, because simplifying what you store in state helps reduce bugs and make your code easier to understand. Let's change Game so that it no longer stores `xIsNext` as a separate state variable and instead figures it out based on the current value of `stepNumber`:

```jsx {4,10,14}
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);
  const xIsNext = stepNumber % 2 === 0;
  const currentSquares = history[stepNumber];

  function handlePlay(newSquares) {
    let newHistory = history.slice(0, stepNumber + 1).concat([newSquares]);
    setHistory(newHistory);
    setStepNumber(newHistory.length - 1);
  }

  function jumpTo(step) {
    setStepNumber(step);
  }

  // ...
```

We no longer need the `xIsNext` state declaration or the calls to `setXIsNext`. Now, there's no chance for `xIsNext` to get out of sync with `stepNumber`, even if we make an error while coding the components.

### Wrapping Up {/*wrapping-up*/}

Congratulations! You've created a tic-tac-toe game that:

- Lets you play tic-tac-toe,
- Indicates when a player has won the game,
- Stores a game's history as a game progresses,
- Allows players to review a game's history and see previous versions of a game's board.

Nice work! We hope you now feel like you have a decent grasp of how React works.

Check out the final result here:

<Sandpack>

```jsx App.js
import {useState} from 'react';
import {calculateWinner} from './utils.js';

function Square({value, onClick}) {
  return (
    <button className="square" onClick={() => onClick()}>
      {value}
    </button>
  );
}

function Board({xIsNext, squares, onPlay}) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(newSquares);
  }

  function renderSquare(i) {
    return <Square value={squares[i]} onClick={() => handleClick(i)} />;
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);
  const xIsNext = stepNumber % 2 === 0;
  const currentSquares = history[stepNumber];

  function handlePlay(newSquares) {
    let newHistory = history.slice(0, stepNumber + 1).concat([newSquares]);
    setHistory(newHistory);
    setStepNumber(newHistory.length - 1);
  }

  function jumpTo(step) {
    setStepNumber(step);
  }

  const moves = history.map((step, move) => {
    const description = move > 0 ? `Go to move #${move}` : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
```

```jsx utils.js
// Don't worry too much about this code; it's not specific to React

export function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css
body {
  font: 14px 'Century Gothic', Futura, sans-serif;
  margin: 20px;
}

ol,
ul {
  padding-left: 30px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.square:focus {
  outline: none;
}

.kbd-navigation .square:focus {
  background: #ddd;
}

.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

If you have extra time or want to practice your new React skills, here are some ideas for improvements that you could make to the tic-tac-toe game, listed in order of increasing difficulty:

1. Rewrite Board to use two loops to make the squares instead of hardcoding them.
1. Add a toggle button that lets you sort the moves in either ascending or descending order.
1. When someone wins, highlight the three squares that caused the win (and when no one wins, display a message about the result being a draw).
1. Display the location for each move in the format (col, row) in the move history list.

Throughout this tutorial, we touched on React concepts including elements, components, props, and state. For a more detailed explanation of each of these topics, check out the rest of the documentation.
