---
id: web-components
title: Web Components
permalink: docs/web-components.html
redirect_from:
  - "docs/webcomponents.html"
---

React and [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) are built to solve different problems.  Web Components (also known as Custom Elements) empower the developer to [extend the HTML vocabulary](https://www.w3.org/community/nextweb/2013/06/11/the-extensible-web-manifesto/), by creating strong encapsulation for reusable, customizable HTML DOM elements, while React provides a declarative library that keeps the DOM elements in sync with your data. The two goals are complementary. As a developer, you are free to use React in your Web Components, or to use Web Components in React, or both.

Most people who use React don't need to use Web Components, but you may want to, especially if you are using third-party UI components that are written using Web Components.

## Using Web Components in React {#using-web-components-in-react}

Custom Elements, just like DOM elements built into the browser, support five main ways of being manipulated.

1.  By setting attribute values.  For example "aria-label" is an attribute that can help make a DOM element more accessible.  Custom Elements can define their own attributes, in addition to supporting the global attributes all built-in elements support.
2.  By adding child DOM elements inside the tag. 
3.  By calling an imperative method API.  Just as the `input` element provides a `focus()` function, a `video` Web Component might expose `play()` and `pause()` functions.
4.  By styling them via CSS.
5.  By setting property values.  All DOM elements, including Custom Elements, are part of a class hierarchy, and JavaScript classes support property getters and setters.  These properties provide a simple and fast way of passing in data, objects or functions into the class instance that is managing the component.

With regards to the first four ways of manipulating a Custom Element, React allows you to treat Custom Elements just like they are built-in elements.  For example: 

```javascript
class HelloMessage extends React.Component {
  render() {
    return <div>Hello <x-search>{this.props.name}</x-search>!</div>;
  }
}
```

demonstrates adding child DOM elements ot text nodes inside the tag.

> However:
>
> React's ability to set property values of a Web Component or native HTML element requires use of a ref, just as a ref is required for all method API's. Since React's binding support is mostly centered around setting property values of React components, but cannot do so with Web Components, most third-party Web Components that are marketed to be used within React provide a React component that behaves as a wrapper for the Web Component.  If you are working with a web component library which provides no such wrapper, you might want to create such a wrapper yourself.

Without such a wrapper, you can set property values in React as shown below:

```javascript
<x-foo ref={el => el.bar = baz}>
```

>
> Events emitted by a Web Component may not properly propagate through a React render tree.
> You will need to manually attach event handlers to handle these events within your React components.

One common confusion is that Web Components use "class" instead of "className".

```javascript
function BrickFlipbox() {
  return (
    <brick-flipbox class="demo">
      <div>front</div>
      <div>back</div>
    </brick-flipbox>
  );
}
```

## Using React in your Web Components {#using-react-in-your-web-components}

```javascript
class XSearch extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('span');
    this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

    const name = this.getAttribute('name');
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);
    const root = ReactDOM.createRoot(mountPoint);
    root.render(<a href={url}>{name}</a>);
  }
}
customElements.define('x-search', XSearch);
```

>Note:
>
>This code **will not** work if you transform classes with Babel. See [this issue](https://github.com/w3c/webcomponents/issues/587) for the discussion.
>Include the [custom-elements-es5-adapter](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs#custom-elements-es5-adapterjs) before you load your web components to fix this issue.
>
>Because the api's that drive Web Components are so low-level, creating a web component that can be leveraged across all frameworks and different environments requires a certain amount of [tender-loving-care](https://developers.google.com/web/fundamentals/web-components/best-practices).  There are a [number of helper libraries](https://webcomponents.dev/new/), some of them JSX or React-based, that help by simplifying the "ergonomics" of web component development. 
