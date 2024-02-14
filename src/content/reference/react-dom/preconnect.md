---
title: preconnect
canary: true
---

<Canary>

The `preconnect` function is currently only available in React's Canary and experimental channels. Learn more about [React's release channels here](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

`preconnect` lets you eagerly connect to a server that you expect to load resources from.

```js
preconnect("https://example.com");
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `preconnect(href)` {/*preconnect*/}

To preconnect to a host, call the `preconnect` function from `react-dom`.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  // ...
}

```

[See more examples below.](#usage)

The `preconnect` function provides the browser with a hint that it should open a connection to the given server. If the browser chooses to do so, this can speed up the loading of resources from that server. 

#### Parameters {/*parameters*/}

* `href`: a string. The URL of the server you want to connect to.


#### Returns {/*returns*/}

`preconnect` returns nothing.

#### Caveats {/*caveats*/}

* Multiple calls to `preconnect` with the same server have the same effect as a single call.
* In the browser, you can call `preconnect` in any situation: while rendering a component, in an effect, in an event handler, and so on.
* In server-side rendering or when rendering Server Components, `preconnect` only has an effect if you call it while rendering a component or in an async context originating from rendering a component. Any other calls will be ignored.
* If you know the specific resources you'll need, you can call [other functions](/reference/react-dom/#resource-preloading-apis) instead that will start loading the resources right away.
* There is no benefit to preconnecting to the same server the webpage itself is hosted from because it's already been connected to by the time the hint would be given.

---

## Usage {/*usage*/}

### Preconnecting when rendering {/*preconnecting-when-rendering*/}

Call `preconnect` when rendering a component if you know that its children will load external resources from that host.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  return ...;
}
```

### Preconnecting in an event handler {/*preconnecting-in-an-event-handler*/}

Call `preconnect` in an event handler before transitioning to a page or state where external resources will be needed. This gets the process started earlier than if you call it during the rendering of the new page or state.

```js
import { preconnect } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preconnect('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
