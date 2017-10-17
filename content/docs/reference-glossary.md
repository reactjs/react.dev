---
id: glossary
title: Glossary of React Terms
layout: docs
category: Reference
permalink: docs/glossary.html

---

## Single Page Application
A single page application is an application that loads a single HTML page and all the necessary assets (CSS, Images & JavaScript) required for the application to run. Any interactions with the page or subsequent pages do not require a round trip to the server which means the page is not reloaded.


## ES6/ES2015/ES7/ES2016/ES8/ES2017
 These acronyms all refer to the most recent versions of the ECMAScript Language Specification standard, which the JavaScript language is an implementation of. It includes many additions to the previous versions such as: arrow functions, classes, template literals, `let` and `const` statements. ES8/ES2017 was finalized in June 2017 and includes async/await functionality. 

## Compilers
A JavaScript compiler takes JavaScript code, transforms it and returns JavaScript code in a different format. The most common use case is to take ES2015/ES6 syntax and transform it into syntax that older browsers are capable of interpreting. Babel is the compiler used with React. 

## Bundlers
Bundlers put all of your JavaScript code & dependency into one "bundle", usually into one file. Some bundlers commonly used in React applications include: Webpack and Browserify.

## Package Manager 
Package managers are tools that allow you to manage dependencies in your project. npm & Yarn are two package managers commonly used in React applications.

## CDN
CDN stands for Content Delivery Network. CDNs deliver cached, static content from a network of servers across the globe. 

## JSX
JSX is a syntax extension to JavaScript. It is similar to a template language. JSX gets compiled to `React.createElement()` calls which return plain JavaScript objects called 'React elements'. To get a basic introduction to JSX [see the docs here](/docs/introducing-jsx.html) and find a more in-depth tutorial on JSX [here](/docs/jsx-in-depth.html)

React DOM uses camelCase property naming convention instead of HTML attribute names. For example, tabindex becomes tabIndex in JSX. The attribute class is also written as className since `class` is a reserved word in JavaScript.

## [Elements](/docs/rendering-elements.html)
React elements are the building blocks of React applications. One might confuse elements with a more widely known concept of "components". Elements are what components are "made of". An element describes what you want to see on the screen. React elements are immutable.

```js
const element = <h1>Hello, world</h1>;
```

## [Components](/docs/components-and-props.html)
React components are small, resuable pieces of code that return a React element to be rendered to the page. The simplest version of React component is a plain JavaScript function that returns a React element:

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

Components can also be ES6 classes:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Components can be broken down into distinct pieces of functionality and used within other components. Components can return other components, arrays, strings and numbers. A good rule of thumb is that if a part of your UI is used several times (Button, Panel, Avatar), or is complex enough on its own (App, FeedStory, Comment), it is a good candidate to be a reusable component. Component names should also always start with a capital letter (`<Wrapper/>` **not** `<wrapper/>`). See [this documentation](/docs/components-and-props.html#rendering-a-component) for more information on rendering components. 


### [`props`](/docs/components-and-props.html)
`props` are inputs to a React component. They are data passed down from a parent component to a child component. `props` are readonly -- they should not be modified in any way. All React components must act like pure functions with respect to their `props`.

### `this.props.children`
`this.props.children` is available on every component. It contains the content between the opening and closing tags of a component. For example:

```js
<Welcome>Hello world!</Welcome>
```
The string `Hello world!` is available in `this.props.children` in the `Welcome` component.

### [`state`](/docs/state-and-lifecycle.html#adding-local-state-to-a-class)
A component's `state` is a snapshot of the data contained in a component. `props` and `state` are different: `props` are passed in from a parent component; `state` is managed within a component.

## [Lifecycle Methods](/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class)
Lifecycle methods are custom functionality that gets executed during the different phases of a component. There are methods available when the component gets created and inserted into the DOM ([mounting](/docs/react-component.html#mounting)), when the component updates, and when the component gets unmounted or removed from the DOM. 

 ## [Controlled](/docs/forms.html#controlled-components) vs. [Uncontrolled Components](/docs/uncontrolled-components.html)
React has two different approaches to dealing with form inputs. 

An input form element whose value is controlled by React is called a *controlled component*. When a user enters data into a controlled component a change event handler is triggered and your code decides whether the input is valid (by re-rendering with the updated value). If you do not re-render then the form element will remain unchanged.

An *uncontrolled component* works like form elements do outside of React. When a user inputs data into a form field (an input box, dropdown, etc) the updated information is reflected without React needing to do anything.

## [Keys](/docs/lists-and-keys.html) 
 A "key" is a special string attribute you need to include when creating arrays of elements. Keys help React identify which items have changed, are added, or are removed. Keys should be given to the elements inside an array to give the elements a stable identity.

## [Refs](/docs/refs-and-the-dom.html)
React supports a special attribute that you can attach to any component. The `ref` attribute can be a string or a callback function. When the `ref` attribute is a callback function, the function receives the underlying DOM element as its argument. This allows you to have direct access to the DOM element or component instance.

## [Events](/docs/handling-events.html) 
Handling events with React elements has some syntactic differences:

* React event handlers are named using camelCase, rather than lowercase.
* With JSX you pass a function as the event handler, rather than a string.


## [Reconciliation](/reconciliation.html)
When a component's props or state change, React decides whether an actual DOM update is necessary by comparing the newly returned element with the previously rendered one. When they are not equal, React will update the DOM. This process is called `reconciliation`