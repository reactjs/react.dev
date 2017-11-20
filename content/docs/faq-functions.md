---
id: faq-functions
title: Passing Functions to Components
permalink: docs/faq-functions.html
layout: docs
category: FAQ
---

### How do I pass an event handler (like onClick) to a component?

Pass event handlers and other functions as props to child components:

```jsx
<button onClick={this.handleClick}>
```

If you need to have access to the parent component in the handler, you also need to bind the function to the component instance (see below).

### How do I bind a function to a component instance?

There are several ways to make sure functions have access to component attributes like `this.props` and `this.state`, depending on which syntax and build steps you are using.

#### Bind in Constructor (ES2015)

```jsx
class Foo extends Component {
  constructor () {
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    console.log('Click happened')
  }
  render() {
    return <button onClick={this.handleClick}>Click Me</button>
  }
}
```

#### Class Properties (Stage 3 Proposal)

```jsx
class Foo extends Component {
  handleClick = () => {
    console.log('Click happened')
  }
  render() {
    return <button onClick={this.handleClick}>Click Me</button>
  }
}
```

#### Bind in Render

```jsx
class Foo extends Component {
  handleClick () {
    console.log('Click happened')
  }
  render() {
    return <button onClick={this.handleClick.bind(this)}>Click Me</button>
  }
}
```

>**Note:**
>
>Using `Function.prototype.bind` in render creates a new function each time the component renders, which may have performance implications; (see below).

#### Arrow Function in Render

```jsx
class Foo extends Component {
  handleClick () {
    console.log('Click happened')
  }
  render() {
    return <button onClick={() => this.handleClick()}>Click Me</button>
  }
}
```

>**Note:**
>
>Using an arrow function in render creates a new function each time the component renders, which may have performance implications; (see below).

### Is it OK to use arrow functions in render methods?

Generally speaking, yes, it is OK, and it is often the easiest way to pass parameters to callback functions.

If you do have performance issues, by all means, optimize!

### Why is my function being called every time the component renders?

Make sure you aren't _calling the function_ when you pass it to the component:

```jsx
render() {
  {/* handleClick is called instead of passed as a reference! */}
  return <button onClick={this.handleClick()}>Click Me</button> 
}
```

### How do I pass a parameter to an event handler or callback?

You can use an arrow function to wrap around an event handler and pass parameters: 

```jsx
<Element onClick={() => this.handleClick(id)} />
```

This is equivalent to calling `.bind`:

```jsx
<Element onClick={this.handleClick.bind(this, id)} />
```

#### Example: Passing params using arrow functions

```jsx
const A = 65 // ASCII character code
class Alphabet extends React.Component {
  state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
  }
  
  handleClick = letter => this.setState({ justClicked: letter })
  
  render () {
    return (
      <div>
        Just clicked: {this.state.justClicked}
        <ul>
          { this.state.letters.map(letter => 
            <li key={letter} onClick={() => this.handleClick(letter)}>
              {letter}
            </li>
          ) }
        </ul>
      </div>
   )
  }
}
```

#### Example: Passing params using data-attributes

Alternately, you can use DOM APIs to store data needed for event handlers. Consider this approach if you need to optimize a large number of elements or have a render tree that relies on React.PureComponent equality checks.

```jsx
const A = 65 // ASCII character code
class Alphabet extends React.Component {
  state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
  }
  
  handleClick = event => {
    this.setState({
      justClicked: event.target.dataset.letter
    })
  }
  
  render () {
    return (
      <div>
        Just clicked: {this.state.justClicked}
        <ul>
          { this.state.letters.map(letter => 
            <li key={letter} data-letter={letter} onClick={this.handleClick}>
              {letter}
            </li>
          ) }
        </ul>
      </div>
   )
  }
}
```

### How can I prevent a function from being called too quickly or too many times in a row?

If you have an event handler such as `onClick` or `onScroll` and want to prevent the callback from being fired too quickly, you can wrap the handler with a utility such as [`_.debounce`](https://lodash.com/docs#debounce) or [`_.throttle`](https://lodash.com/docs#throttle). For a given `delay`, say `100ms`, debouncing calls the handler after activity stops for that amount of time; throttling prevents the handler from being called more than once per `delay`. See a visualization [here](http://demo.nimius.net/debounce_throttle/).

Note: Call `event.persist()` when accessing events asynchronously to prevent the synthetic event from being recycled by [event pooling](/docs/events.html#event-pooling). See the debounce [example](#debounce) below.

#### Throttle

```jsx
import throttle from 'lodash.throttle'

class LoadMoreButton extends React.Component {
  handleClick = throttle(() => {
    this.props.loadMore()
  }, 100)

  render() {
    return <button onClick={this.handleClick}>Load More</button>
  }
}
```

#### Debounce

```jsx
import debounce from 'lodash.debounce'

class Searchbox extends React.Component {
  handleChange = event => {
    event.persist() // https://reactjs.org/docs/events.html#event-pooling
    this._handleChangeDebounced(event.target.value)
  };

  _handleChangeDebounced = debounce(value => {
    this.props.onChange(value)
  }, 250)

  render() {
    return (
      <input
        type="text"
        onChange={this.handleChange}
        placeholder="Search..."
        defaultValue={this.props.value}
      />
    )
  }
}
```
