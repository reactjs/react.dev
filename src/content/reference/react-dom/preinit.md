---
title: preinit
canary: true
---

<Canary>

The `preinit` function is currently only available in React's Canary and experimental channels. Learn more about [React's release channels here](/community/versioning-policy#all-release-channels).

</Canary>

<Note>

[React-based frameworks](/learn/start-a-new-react-project) frequently handle resource loading for you, so you might not have to call this API yourself. Consult your framework's documentation for details.

</Note>

<Intro>

`preinit` lets you eagerly fetch and evaluate a stylesheet or external script.

```js
preinit("https://example.com/script.js", {as: "style"});
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `preinit(href, options)` {/*preinit*/}

To preinit a script or stylesheet, call the `preinit` function from `react-dom`.

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  // ...
}

```

[See more examples below.](#usage)

The `preinit` function provides the browser with a hint that it should start downloading and executing the given resource, which can save time. Scripts that you `preinit` are executed when they finish downloading. Stylesheets that you preinit are inserted into the document, which causes them to go into effect right away.

#### Parameters {/*parameters*/}

* `href`: a string. The URL of the resource you want to download and execute.
* `options`: an object. It contains the following properties:
  *  `as`: a required string. The type of resource. Its possible values are `script` and `style`.
  * `precedence`: a string. Required with stylesheets. Says where to insert the stylesheet relative to others. Stylesheets with higher precedence can override those with lower precedence. The possible values are `reset`, `low`, `medium`, `high`. 
  *  `crossOrigin`: a string. The [CORS policy](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) to use. Its possible values are `anonymous` and `use-credentials`. It is required when `as` is set to `"fetch"`.
  *  `integrity`: a string. A cryptographic hash of the resource, to [verify its authenticity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `nonce`: a string. A cryptographic [nonce to allow the resource](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) when using a strict Content Security Policy. 
  *  `fetchPriority`: a string. Suggests a relative priority for fetching the resource. The possible values are `auto` (the default), `high`, and `low`.

#### Returns {/*returns*/}

`preinit` returns nothing.

#### Caveats {/*caveats*/}

* Multiple calls to `preinit` with the same `href` have the same effect as a single call.
* In the browser, you can call `preinit` in any situation: while rendering a component, in an effect, in an event handler, and so on.
* In server-side rendering or when rendering Server Components, `preinit` only has an effect if you call it while rendering a component or in an async context originating from rendering a component. Any other calls will be ignored.

---

## Usage {/*usage*/}

### Preiniting when rendering {/*preiniting-when-rendering*/}

Call `preinit` when rendering a component if you know that it or its children will use a specific resource, and you're OK with the resource being evaluated and thereby taking effect immediately upon being downloaded.

<Recipes titleText="Examples of preiniting">

#### Preiniting an external script {/*preiniting-an-external-script*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  return ...;
}
```

If you want the browser to download the script but not to execute it right away, use [`preload`](/reference/react-dom/preload) instead. If you want to load an ESM module, use [`preinitModule`](/reference/react-dom/preinitModule).

<Solution />

#### Preiniting a stylesheet {/*preiniting-a-stylesheet*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/style.css", {as: "style", precedence: "medium"});
  return ...;
}
```

The `precedence` option, which is required, lets you control the order of stylesheets within the document. Stylesheets with higher precedence can overrule those with lower precedence.

If you want to download the stylesheet but not to insert it into the document right away, use [`preload`](/reference/react-dom/preload) instead.

<Solution />

</Recipes>

### Preiniting in an event handler {/*preiniting-in-an-event-handler*/}

Call `preinit` in an event handler before transitioning to a page or state where external resources will be needed. This gets the process started earlier than if you call it during the rendering of the new page or state.

```js
import { preinit } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinit("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
