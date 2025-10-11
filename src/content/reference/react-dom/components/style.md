---
style: "<style>"
---

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

`<style>` supports all [common element props.](/reference/react-dom/components/common#common-props)

* `children`: a string, required. The contents of the stylesheet.
* `precedence`: a string. Tells React where to rank the `<style>` DOM node relative to others in the document `<head>`, which determines which stylesheet can override the other. React will infer that precedence values it discovers first are "lower" and precedence values it discovers later are "higher". Many style systems can work fine using a single precedence value because style rules are atomic. Stylesheets with the same precedence go together whether they are `<link>` or inline `<style>` tags or loaded using [`preinit`](/reference/react-dom/preinit) functions.
* `href`: a string. Allows React to [de-duplicate styles](#special-rendering-behavior) that have the same `href`.
* `media`: a string. Restricts the stylesheet to a certain [media query](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries).
* `nonce`: a string. A cryptographic [nonce to allow the resource](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) when using a strict Content Security Policy.
* `title`: a string. Specifies the name of an [alternative stylesheet](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets).

Props that are **not recommended** for use with React:

* `blocking`: a string. If set to `"render"`, instructs the browser not to render the page until the stylesheet is loaded. React provides more fine-grained control using Suspense.

#### Special rendering behavior {/*special-rendering-behavior*/}

React can move `<style>` components to the document's `<head>`, de-duplicate identical stylesheets, and [suspend](/reference/react/Suspense) while the stylesheet is loading.

To opt into this behavior, provide the `href` and `precedence` props. React will de-duplicate styles if they have the same `href`. The precedence prop tells React where to rank the `<style>` DOM node relative to others in the document `<head>`, which determines which stylesheet can override the other.

This special treatment comes with three caveats:

* React will ignore changes to props after the style has been rendered. (React will issue a warning in development if this happens.)
* React will drop all extraneous props when using the `precedence` prop (beyond `href` and `precedence`).
* React may leave the style in the DOM even after the component that rendered it has been unmounted.

---

## Usage {/*usage*/}

### Rendering an inline CSS stylesheet {/*rendering-an-inline-css-stylesheet*/}

If a component depends on certain CSS styles in order to be displayed correctly, you can render an inline stylesheet within the component.

The `href` prop should uniquely identify the stylesheet, because React will de-duplicate stylesheets that have the same `href`.
If you supply a `precedence` prop, React will reorder inline stylesheets based on the order these values appear in the component tree.

Inline stylesheets will not trigger Suspense boundaries while they're loading.
Even if they load async resources like fonts or images.

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
