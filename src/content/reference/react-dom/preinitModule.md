---
title: preinitModule
canary: true
---

<Canary>

The `preinitModule` function is currently only available in React's Canary and experimental channels. Learn more about [React's release channels here](/community/versioning-policy#all-release-channels).

</Canary>

<Note>

[React-based frameworks](/learn/start-a-new-react-project) frequently handle resource loading for you, so you might not have to call this API yourself. Consult your framework's documentation for details.

</Note>

<Intro>

`preinitModule` lets you eagerly fetch and evaluate an ESM module.

```js
preinitModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `preinitModule(href, options)` {/*preinitmodule*/}

To preinit an ESM module, call the `preinitModule` function from `react-dom`.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[See more examples below.](#usage)

The `preinitModule` function provides the browser with a hint that it should start downloading and executing the given module, which can save time. Modules that you `preinit` are executed when they finish downloading.

#### Parameters {/*parameters*/}

* `href`: a string. The URL of the module you want to download and exeucute.
* `options`: an object. It contains the following properties:
  *  `as`: a required string. It must be `'script'`.
  *  `crossOrigin`: a string. The [CORS policy](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) to use. Its possible values are `anonymous` and `use-credentials`.
  *  `integrity`: a string. A cryptographic hash of the module, to [verify its authenticity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `nonce`: a string. A cryptographic [nonce to allow the module](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) when using a strict Content Security Policy. 

#### Returns {/*returns*/}

`preinitModule` returns nothing.

#### Caveats {/*caveats*/}

* Multiple calls to `preinitModule` with the same `href` have the same effect as a single call.
* In the browser, you can call `preinitModule` in any situation: while rendering a component, in an effect, in an event handler, and so on.
* In server-side rendering or when rendering Server Components, `preinitModule` only has an effect if you call it while rendering a component or in an async context originating from rendering a component. Any other calls will be ignored.

---

## Usage {/*usage*/}

### Preloading when rendering {/*preloading-when-rendering*/}

Call `preinitModule` when rendering a component if you know that it or its children will use a specific module and you're OK with the module being evaluated and thereby taking effect immediately upon being downloaded.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

If you want the browser to download the module but not to execute it right away, use [`preloadModule`](/reference/react-dom/preloadModule) instead. If you want to preinit a script that isn't an ESM module, use [`preinit`](/reference/react-dom/preinit).

### Preloading in an event handler {/*preloading-in-an-event-handler*/}

Call `preinitModule` in an event handler before transitioning to a page or state where the module will be needed. This gets the process started earlier than if you call it during the rendering of the new page or state.

```js
import { preinitModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinitModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
