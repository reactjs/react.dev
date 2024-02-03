---
link: "<link>"
canary: true
---

<Canary>

React's extensions to `<link>` are currently only available in React's canary and experimental channels. In stable releases of React `<link>` works only as a [built-in browser HTML component](https://react.dev/reference/react-dom/components#all-html-components). Learn more about [React's release channels here](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

The [built-in browser `<link>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) lets you use external resources such as stylesheets or annotate the document with link metadata.

```js
<link rel="icon" href="favicon.ico" />
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<link>` {/*link*/}

To link to external resources such as stylesheets, fonts, and icons, or to annotate the document with link metadata, render the [built-in browser `<link>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link). You can render `<link>` from any component and React will [in most cases](#special-rendering-behavior) place the corresponding DOM element in the document head.

```js
<link rel="icon" href="favicon.ico" />
```

[See more examples below.](#usage)

#### Props {/*props*/}

`<link>` supports all [common element props.](/reference/react-dom/components/common#props)

* `rel`: a string, required. Specifies the [relationship to the resource](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel). React [treats links with `rel="stylesheet"` differently](#special-rendering-behavior) from other links.

These props apply when `rel="stylesheet"`:

* `precedence`: a string. Tells React where to rank the `<link>` DOM node relative to others in the document `<head>`, which determines which stylesheet can override the other. Its value can be (in order of precedence) `"reset"`, `"low"`, `"medium"`, `"high"`. Stylesheets with the same precedence go together whether they are `<link>` or inline `<style>` tags or loaded using the [`preload`](/reference/react-dom/preload) or [`preinit`](/reference/react-dom/preinit) functions.
* `media`: a string. Restricts the spreadsheet to a certain [media query](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries).
* `title`: a string. Specifies the name of an [alternative stylesheet](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets).

These props apply when `rel="stylesheet"` but disable React's [special treatment of stylesheets](#special-rendering-behavior):

* `disabled`: a boolean. Disables the spreadsheet.
* `onError`: a function. Called when the stylesheet fails to load.
* `onLoad`: a function. Called when the stylesheet finishes being loaded.

These props apply when `rel="preload"` or `rel="modulepreload"`:

* `as`: a string. The type of resource. Its possible values are `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, `track`, `video`, `worker`.
* `imageSrcSet`: a string. Applicable only when `as="image"`. Specifies the [source set of the image](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).
* `imageSizes`: a string. Applicable only when `as="image"`. Specifies the [sizes of the image](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

These props apply when `rel="icon"` or `rel="apple-touch-icon"`:

* `sizes`: a string. The [sizes of the icon](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

These props apply in all cases:

* `href`: a string. The URL of the linked resource.
*  `crossOrigin`: a string. The [CORS policy](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) to use. Its possible values are `anonymous` and `use-credentials`. It is required when `as` is set to `"fetch"`.
*  `referrerPolicy`: a string. The [Referrer header](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy) to send when fetching. Its possible values are `no-referrer-when-downgrade` (the default), `no-referrer`, `origin`, `origin-when-cross-origin`, and `unsafe-url`.
* `fetchPriority`: a string. Suggests a relative priority for fetching the resource. The possible values are `auto` (the default), `high`, and `low`.
* `hrefLang`: a string. The language of the linked resource.
* `integrity`: a string. A cryptographic hash of the resource, to [verify its authenticity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
* `type`: a string. The MIME type of the linked resource.

Props that are **not recommended** for use with React:

* `blocking`: a string. If set to `"render"`, instructs the browser not to render the page until the stylesheet is loaded. React provides more fine-grained control using Suspense.

#### Special rendering behavior {/*special-rendering-behavior*/}

React will always place the DOM element corresponding to the `<link>` component within the document’s `<head>`, regardless of where in the React tree it is rendered. The `<head>` is the only valid place for `<link>` to exist within the DOM, yet it’s convenient and keeps things composable if a component representing a specific page can render `<link>` components itself. 

There are a few exceptions to this:

* If the `<link>` has a `rel="stylesheet"` prop, then it has to also have a `precedence` prop to get this special behavior. This is because the order of stylesheets within the document is significant, so React needs to know how to order this stylesheet relative to others, which you specify using the `precedence` prop. If the `precedence` prop is omitted, there is no special behavior.
* If the `<link>` has an [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop) prop, there is no special behavior, because in this case it doesn’t apply to the document but instead represents metadata about a specific part of the page.
* If the `<link>` has an `onLoad` or `onError` prop, because in that case you are managing the loading of the linked resource manually within your React component.

#### Special behavior for stylesheets {/*special-behavior-for-stylesheets*/}

In addition, if the `<link>` is to a stylesheet (namely, it has `rel="stylesheet"` in its props), React treats it specially in the following ways:

* The component that renders `<link>` will [suspend](http://localhost:3000/reference/react/Suspense) while the stylesheet is loading.
* If multiple components render links to the same stylesheet, React will de-duplicate them and only put a single link into the DOM. Two links are considered the same if they have the same `href` prop.

There are two exception to this special behavior:

* If the link doesn't have a `precedence` prop, there is no special behavior, because the order of stylesheets within the document is significant, so React needs to know how to order this stylesheet relative to others, which you specify using the `precedence` prop.  
* If you supply any of the `onLoad`, `onError`, or `disabled` props, there is no special behavior, because these props indicate that you are managing the loading of the stylesheet manually within your component.

This special treatment comes with two caveats:

* React will ignore changes to props after the link has been rendered. (React will issue a warning in development if this happens.)
* React may leave the link in the DOM even after the component that rendered it has been unmounted.

---

## Usage {/*usage*/}

### Linking to related resources {/*linking-to-related-resources*/}

You can annotate the document with links to related resources such as an icon, canonical URL, or pingback. React will place this metadata within the document `<head>` regardless of where in the React tree it is rendered.

<SandpackWithHTMLOutput>

```js App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function BlogPage() {
  return (
    <ShowRenderedHTML>
      <link rel="icon" href="favicon.ico" />
      <link rel="pingback" href="http://www.example.com/xmlrpc.php" />
      <h1>My Blog</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Linking to a stylesheet {/*linking-to-a-stylesheet*/}

If a component depends on a certain stylesheet in order to be displayed correctly, you can render a link to that stylesheet within the component. Your component will [suspend](http://localhost:3000/reference/react/Suspense) while the stylesheet is loading. You must supply the `precedence` prop, which tells React where to place this stylesheet relative to others — stylesheets with higher precedence can override those with lower precedence.

<Note>
When you want to use a stylesheet, it can be beneficial to call the [preinit](/reference/react-dom/preinit) function. Calling this function may allow the browser to start fetching the stylesheet earlier than if you just render a `<link>` component, for example by sending an [HTTP Early Hints response](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103).
</Note>

<SandpackWithHTMLOutput>

```js App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <link rel="stylesheet" href="sitemap.css" precedence="medium" />
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Controlling stylesheet precedence {/*controlling-stylesheet-precedence*/}

Stylesheets can conflict with each other, and when they do, the browser goes with the one that comes later in the document. React lets you control the order of stylesheets with the `precedence` prop. In this example, two components render stylesheets, and the one with the higher precedence goes later in the document even though the component that renders it comes earlier.

{/*FIXME: this doesn't appear to actually work -- I guess precedence isn't implemented yet?*/}

<SandpackWithHTMLOutput>

```js App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <FirstComponent />
      <SecondComponent />
      ...
    </ShowRenderedHTML>
  );
}

function FirstComponent() {
  return <link rel="stylesheet" href="first.css" precedence="high" />;
}

function SecondComponent() {
  return <link rel="stylesheet" href="second.css" precedence="low" />;
}

```

</SandpackWithHTMLOutput>

### Deduplicated stylesheet rendering {/*deduplicated-stylesheet-rendering*/}

If you render the same stylesheet from multiple components, React will place only a single `<link>` in the document head.

<SandpackWithHTMLOutput>

```js App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <Component />
      <Component />
      ...
    </ShowRenderedHTML>
  );
}

function Component() {
  return <link rel="stylesheet" href="styles.css" precedence="medium" />;
}
```

</SandpackWithHTMLOutput>

### Annotating specific items within the document with links {/*annotating-specific-items-within-the-document-with-links*/}

You can use the `<link>` component with the `itemProp` prop to annotate specific items within the document with links to related resources. In this case, React will *not* place these annotations within the document `<head>` but will place them like any other React component. 

```js
<section itemScope>
  <h3>Annotating specific items</h3>
  <link itemProp="author" href="http://example.com/" />
  <p>...</p>
</section>
```
