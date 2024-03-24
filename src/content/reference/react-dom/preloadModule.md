---
title: preloadModule
canary: true
---

<Canary>

The `preloadModule` function is currently only available in React's Canary and experimental channels. Learn more about [React's release channels here](/community/versioning-policy#all-release-channels).

</Canary>

<Note>

[React-based frameworks](/learn/start-a-new-react-project) frequently handle resource loading for you, so you might not have to call this API yourself. Consult your framework's documentation for details.

</Note>

<Intro>

`preloadModule` lets you eagerly fetch an ESM module that you expect to use.

```js
preloadModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `preloadModule(href, options)` {/*preloadmodule*/}

To preload an ESM module, call the `preloadModule` function from `react-dom`.

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[See more examples below.](#usage)

The `preloadModule` function provides the browser with a hint that it should start downloading the given module, which can save time.

#### Parameters {/*parameters*/}

* `href`: a string. The URL of the module you want to download.
* `options`: an object. It contains the following properties:
  *  `as`: a required string. It must be `'script'`.
  *  `crossOrigin`: a string. The [CORS policy](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) to use. Its possible values are `anonymous` and `use-credentials`.
  *  `integrity`: a string. A cryptographic hash of the module, to [verify its authenticity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `nonce`: a string. A cryptographic [nonce to allow the module](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) when using a strict Content Security Policy. 


#### Returns {/*returns*/}

`preloadModule` returns nothing.

#### Caveats {/*caveats*/}

* Multiple calls to `preloadModule` with the same `href` have the same effect as a single call.
* In the browser, you can call `preloadModule` in any situation: while rendering a component, in an effect, in an event handler, and so on.
* In server-side rendering or when rendering Server Components, `preloadModule` only has an effect if you call it while rendering a component or in an async context originating from rendering a component. Any other calls will be ignored.

---

## Usage {/*usage*/}

### Preloading when rendering {/*preloading-when-rendering*/}

Call `preloadModule` when rendering a component if you know that it or its children will use a specific module.

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

If you want the browser to start executing the module immediately (rather than just downloading it), use [`preinitModule`](/reference/react-dom/preinitModule) instead. If you want to load a script that isn't an ESM module, use [`preload`](/reference/react-dom/preload).

### Preloading in an event handler {/*preloading-in-an-event-handler*/}

Call `preloadModule` in an event handler before transitioning to a page or state where the module will be needed. This gets the process started earlier than if you call it during the rendering of the new page or state.

```js
import { preloadModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preloadModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
