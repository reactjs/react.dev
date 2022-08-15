---
title: dangerouslySetInnerHTML
---

<Intro>

`dangerouslySetInnerHTML` is used in React as replacement for using `innerHTML` property for DOM elements.

</Intro>

<Note>

In general, setting HTML from code is risky because it’s easy to inadvertently expose your users to a [cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) attack. As a safe alternative you can use `dangerouslySetInnerHTML` and pass an object with a `__html` key.

</Note>

- [Usage](#usage)
  - [Using `dangerouslySetInnerHTML` property](#using-dangerouslysetinnerhtml-property)

## Usage {/*usage*/}

### Using `dangerouslySetInnerHTML` property {/*using-dangerouslysetinnerhtml-property*/}

In the example below, `MyComponent` is being rendered that returns a`h1` whose innterHTML text is being set using the `dangerouslySetInnerHTML` property. It is important not to forget to **pass an object with a `__html` key** as demonstrated.


<Sandpack>

``` js App.js
export default function MyComponent() {
  const text = {__html: 'Hello World!'};

return (
    <h1
      dangerouslySetInnerHTML={text}
    />
  );

}
```
</Sandpack>
