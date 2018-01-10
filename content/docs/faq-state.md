---
id: faq-state
title: Component State
permalink: docs/faq-state.html
layout: docs
category: FAQ
---

### What does setState do?

`setState()` schedules an update to a component's `state` object. When state changes, the component responds by re-rendering.

### What is the difference between state and props?

[`props`](/docs/components-and-props.html) (short for "properties") and [`state`](/docs/state-and-lifecycle.html) are both just JavaScript objects that trigger a re-render when changed. While both hold information that influences the output of render, they are different in one important way: `props` get passed to the component (similar to function parameters) whereas `state` is managed within the component (similar to variables declared within a function).

Here are some good resources for further reading on when to use `props` vs `state`:
* [Props vs State](https://github.com/uberVU/react-guide/blob/master/props-vs-state.md)
* [ReactJS: Props vs. State](http://lucybain.com/blog/2016/react-state-vs-pros/)

### Is synching state and props a bad idea?

Consider the below example showing a `bad practice` to sync props and state :

```js{8,13}
const App = () => (
  <Button isOn />
);

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOn: props.isOn };
  }

  handleClick() {
    this.setState(prevState => ({
      isOn: !prevState.isOn
    }));
  }

  render() {
    return (
      <button onClick={() => this.handleClick()} >
        The switch is {this.state.isOn ? 'on' : 'off'}
      </button>
    );
  }
}
```

Beware of this pattern, as state won't be up-to-date with any props update. Instead of syncing props to state, you often want to [lift the state up](/docs/lifting-state-up.html#lifting-state-up) instead.

If you "fork" props by using them for state, you might also want to implement [`componentWillReceiveProps(nextProps)`](/docs/react-component.html#componentwillreceiveprops) to keep the state up-to-date with them. But lifting state up is often easier and less bug-prone. 

Here's the code which shows a `good practice` by lifting the state to parent :

```js{5,18}
class App extends React.Component{
  constructor(props){
    super(props);
    this.state={
      isOn: true
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isOn: !prevState.isOn
    }));
  }

  render(){
    return(
      <Button handleClick={this.handleClick} isOn={this.state.isOn} />
    );
  }
}

const Button = (props) => (
  <button onClick={props.handleClick} >
    The switch is {props.isOn ? 'on' : 'off'}
  </button>
);
```

### Why is `setState` is giving me the wrong value?

Calls to `setState` are asynchronous - don't rely on `this.state` to reflect the new value immediately after calling `setState`. Pass an updater function instead of an object if you need compute values based on the current state (see below for details).

Example of code that will not behave as expected:

```jsx
incrementCount() {
  // Note: this will *not* work as intended.
  this.setState({count: this.state.count + 1});
}

handleSomething() {
  // this.state.count is 1, then we do this:
  this.incrementCount();
  this.incrementCount(); // state wasn't updated yet, so this sets 2 not 3
}
```

See below for how to fix this problem.

### How do I update state with values that depend on the current state? 

Pass a function instead of an object to setState to ensure the call always uses the most updated version of state (see below). 

### What is the difference between passing an object or a function in setState?

Passing an update function allows you to access the current state value inside the updater. Since `setState` calls are batched, this lets you chain updates and ensure they build on top of each other instead of conflicting:

```jsx
incrementCount() {
  this.setState((prevState) => {
    return {count: prevState.count + 1}
  });
}

handleSomething() {
  // this.state.count is 1, then we do this:
  this.incrementCount();
  this.incrementCount(); // count is now 3
}
```

[Learn more about setState](/docs/react-component.html#setstate)

### Should I use a state management library like Redux or MobX?

[Maybe.](http://redux.js.org/docs/faq/General.html#general-when-to-use)

It's a good idea to get to know React first, before adding in additional libraries. You can build quite complex applications using only React.
