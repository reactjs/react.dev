---
script: "<script>"
canary: true
---

<Canary>

React's extensions to `<script>` are currently only available in React's canary and experimental channels. In stable releases of React `<script>` works only as a [built-in browser HTML component](https://react.dev/reference/react-dom/components#all-html-components). Learn more about [React's release channels here](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

The [built-in browser `<script>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) lets you add a script to your document.

```js
<script> alert("hi!") </script>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<script>` {/*script*/}

To add inline or external scripts to your document, render the [built-in browser `<script>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script). You can render `<script>` from any component and React will [in certain cases](#special-rendering-behavior) place the corresponding DOM element in the document head and de-duplicate identical scripts.

```js
<script> alert("hi!") </script>
<script src="script.js" />
```

[See more examples below.](#usage)

#### Props {/*props*/}

`<script>` supports all [common element props.](/reference/react-dom/components/common#props)

It should have *either* `children` or a `src` prop.

* `children`: a string. The source code of an inline script.
* `src`: a string. The URL of an external script.

Other supported props:

* `async`: a boolean. Allows the browser to defer execution of the script until the rest of the document has been processed — the preferred behavior for performance.
*  `crossOrigin`: a string. The [CORS policy](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) to use. Its possible values are `anonymous` and `use-credentials`.
* `fetchPriority`: a string. Lets the browser rank scripts in priority when fetching multiple scripts at the same time. Can be `"high"`, `"low"`, or `"auto"` (the default).
* `integrity`: a string. A cryptographic hash of the script, to [verify its authenticity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
* `noModule`: a boolean. Disables the script in browsers that support ES modules — allowing for a fallback script for browsers that do not.
* `nonce`: a string. A cryptographic [nonce to allow the resource](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) when using a strict Content Security Policy.
* `referrer`: a string. Says [what Referer header to send](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#referrerpolicy) when fetching the script and any resources that the script fetches in turn. 
* `type`: a string. Says whether the script is a [classic script, ES module, or import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type).

Props that disable React's [special treatment of scripts](#special-rendering-behavior):

* `onError`: a function. Called when the script fails to load.
* `onLoad`: a function. Called when the script finishes being loaded.

Props that are **not recommended** for use with React:

* `blocking`: a string. If set to `"render"`, instructs the browser not to render the page until the scriptsheet is loaded. React provides more fine-grained control using Suspense.
* `defer`: a string. Prevents the browser from executing the script until the document is done loading. Not compatible with streaming server-rendered components. Use the `async` prop instead.

#### Special rendering behavior {/*special-rendering-behavior*/}

React can move `<script>` components to the document's `<head>`, de-duplicate identical scripts, and [suspend](http://localhost:3000/reference/react/Suspense) while the script is loading.

To opt into this behavior, provide the `src` and `async={true}` props. React will de-duplicate scripts if they have the same `src`. The `async` prop must be true to allow scripts to be safely moved.

If you supply any of the `onLoad` or `onError` props, there is no special behavior, because these props indicate that you are managing the loading of the script manually within your component.

This special treatment comes with two caveats:

* React will ignore changes to props after the script has been rendered. (React will issue a warning in development if this happens.)
* React may leave the script in the DOM even after the component that rendered it has been unmounted. (This has no effect as scripts just execute once when they are inserted into the DOM.)

---

## Usage {/*usage*/}

### Rendering an external script {/*rendering-an-external-script*/}

If a component depends on certain scripts in order to be displayed correctly, you can render a `<script>` within the component.

If you supply an `src` and `async` prop, your component will suspend while the script is loading. React will de-duplicate scripts that have the same `src`, inserting only one of them into the DOM even if multiple components render it.

<SandpackWithHTMLOutput>

```js App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Map({lat, long}) {
  return (
    <>
      <script async src="map-api.js" />
      <div id="map" data-lat={lat} data-long={long} />
    </>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <Map />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

<Note>
When you want to use a script, it can be beneficial to call the [preinit](/reference/react-dom/preinit) function. Calling this function may allow the browser to start fetching the script earlier than if you just render a `<script>` component, for example by sending an [HTTP Early Hints response](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103).
</Note>

### Rendering an inline script {/*rendering-an-inline-script*/}

To include an inline script, render the `<script>` component with the script source code as its children. Inline scripts are not de-duplicated or moved to the document `<head>`, and since they don't load any external resources, they will not cause your component to suspend.

<SandpackWithHTMLOutput>

```js App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Tracking() {
  return (
    <script>
      ga('send', 'pageview');
    </script>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <h1>My Website</h1>
      <Tracking />
      <p>Welcome</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>