---
style: "<style>"
canary: true
---

<Canary>

React's extensions to `<style>` are currently only available in React's canary and experimental channels. In stable releases of React `<style>` works only as a [built-in browser HTML component](https://react.dev/reference/react-dom/components#all-html-components). Learn more about [React's release channels here](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

The [built-in browser `<style>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style) lets you add inline CSS stylesheets to your document.

```js
<style>{` p { color: red; } `}</style>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<style>` {/*style*/}

To add inline styles to your document, render the [built-in browser `<style>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style). You can render `<style>` from any component and React will [in certain cases](#special-rendering-behavior) place the corresponding DOM element in the document head and de-duplicate identical styles.

```js
<style>{` p { color: red; } `}</style>
```

[See more examples below.](#usage)

#### Props {/*props*/}

`<style>` supports all [common element props.](/reference/react-dom/components/common#props)

* `children`: a string, required. The contents of the stylesheet.
* `precedence`: a string. Tells React where to rank the `<style>` DOM node relative to others in the document `<head>`, which determines which stylesheet can override the other. Its value can be (in order of precedence) `"reset"`, `"low"`, `"medium"`, `"high"`. Stylesheets with the same precedence go together whether they are `<link>` or inline `<style>` tags or loaded using the [`preload`](/reference/react-dom/preload) or [`preinit`](/reference/react-dom/preinit) functions.
* `href`: a string. Allows React to [de-duplicate styles](#special-rendering-behavior) that have the same `href`.
* `media`: a string. Restricts the spreadsheet to a certain [media query](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries).
* `nonce`: a string. A cryptographic [nonce to allow the resource](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) when using a strict Content Security Policy.
* `title`: a string. Specifies the name of an [alternative stylesheet](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets).

Props that are **not recommended** for use with React:

* `blocking`: a string. If set to `"render"`, instructs the browser not to render the page until the stylesheet is loaded. React provides more fine-grained control using Suspense.

#### Special rendering behavior {/*special-rendering-behavior*/}

React can move `<style>` components to the document's `<head>`, de-duplicate identical stylesheets, and [suspend](http://localhost:3000/reference/react/Suspense) while the stylesheet is loading.

To opt into this behavior, provide the `href` and `precedence` props. React will de-duplicate styles if they have the same `href`. The precedence prop tells React where to rank the `<style>` DOM node relative to others in the document `<head>`, which determines which stylesheet can override the other.

This special treatment comes with two caveats:

* React will ignore changes to props after the style has been rendered. (React will issue a warning in development if this happens.)
* React may leave the style in the DOM even after the component that rendered it has been unmounted.

---

## Usage {/*usage*/}

### Rendering an inline CSS stylesheet {/*rendering-an-inline-css-stylesheet*/}

If a component depends on certain CSS styles in order to be displayed correctly, you can render an inline stylesheet within the component.

If you supply an `href` and `precedence` prop, your component will suspend while the stylesheet is loading. (Even with inline stylesheets, there may be a loading time due to fonts and images that the stylesheet refers to.) The `href` prop should uniquely identify the stylesheet, because React will de-duplicate stylesheets that have the same `href`.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';
import { useId } from 'react';

function PieChart({data, colors}) {
  const id = useId();
  const stylesheet = colors.map((color, index) =>
    `#${id} .color-${index}: \{ color: "${color}"; \}`
  ).join();
  return (
    <>
      <style href={"PieChart-" + JSON.stringify(colors)} precedence="medium">
        {stylesheet}
      </style>
      <svg id={id}>
        …
      </svg>
    </>
  );
}

export default function App() {
  return (
    <ShowRenderedHTML>
      <PieChart data="..." colors={['red', 'green', 'blue']} />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>
