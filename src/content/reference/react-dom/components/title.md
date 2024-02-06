---
title: "<title>"
canary: true
---

<Canary>

React's extensions to `<title>` are currently only available in React's canary and experimental channels. In stable releases of React `<title>` works only as a [built-in browser HTML component](https://react.dev/reference/react-dom/components#all-html-components). Learn more about [React's release channels here](/community/versioning-policy#all-release-channels).

</Canary>


<Intro>

The [built-in browser `<title>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title) lets you specify the title of the document.

```js
<title>My Blog</title>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<title>` {/*title*/}

To specify the title of the document, render the [built-in browser `<title>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title). You can render `<title>` from any component and React will always place the corresponding DOM element in the document head.

```js
<title>My Blog</title>
```

[See more examples below.](#usage)

#### Props {/*props*/}

`<title>` supports all [common element props.](/reference/react-dom/components/common#props)

* `children`: `<title>` accepts only text as a child. This text will become the title of the document. You can also pass your own components as long as they only render text.

#### Special rendering behavior {/*special-rendering-behavior*/}

React will always place the DOM element corresponding to the `<title>` component within the document’s `<head>`, regardless of where in the React tree it is rendered. The `<head>` is the only valid place for `<title>` to exist within the DOM, yet it’s convenient and keeps things composable if a component representing a specific page can render its `<title>` itself. 

There are two exception to this:
* If `<title>` is within an `<svg>` component, then there is no special behavior, because in this context it doesn’t represent the document’s title but rather is an [accessibility annotation for that SVG graphic](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title).
* If the `<title>` has an [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop) prop, there is no special behavior, because in this case it doesn’t represent the document’s title but rather metadata about a specific part of the page. 

<Pitfall>

Only render a single `<title>` at a time. If more than one component renders a `<title>` tag at the same time, React will place all of those titles in the document head. When this happens, the behavior of browsers and search engines is undefined.

</Pitfall>

---

## Usage {/*usage*/}

### Set the document title {/*set-the-document-title*/}

Render the `<title>` component from any component with text as its children. React will put a `<title>` DOM node in the document `<head>`.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function ContactUsPage() {
  return (
    <ShowRenderedHTML>
      <title>My Site: Contact Us</title>
      <h1>Contact Us</h1>
      <p>Email us at support@example.com</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Use variables in the title {/*use-variables-in-the-title*/}

The children of the `<title>` component must be a single string of text. (Or a single number or a single object with a `toString` method.) It might not be obvious, but using JSX curly braces like this:

```js
<title>Results page {pageNumber}</title> // 🔴 Problem: This is not a single string
```

... actually causes the `<title>` component to get a two-element array as its children (the string `"Results page"` and the value of `pageNumber`). This will cause an error. Instead, use string interpolation to pass `<title>` a single string:

```js
<title>{`Results page ${pageNumber}`}</title>
```

