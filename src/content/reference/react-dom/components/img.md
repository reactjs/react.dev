---
title: "<img>"
---

<Intro>

The [built-in browser `<img>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) lets you embed an image.

```js
<img src="photo.jpg" alt="A person walking through a park" />
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<img>` {/*img*/}

To display an image, render the [built-in browser `<img>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img).

```js
<img src="photo.jpg" alt="A person walking through a park" />
```

[See more examples below.](#usage)

#### Props {/*props*/}

`<img>` supports all [common element props.](/reference/react-dom/components/common#common-props)

* `alt`: a string. Specifies alternative text for the image. Use an empty string for a purely decorative image.
* `crossOrigin`: a string. Specifies the [CORS policy](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) to use when fetching the image. The possible values are `anonymous` and `use-credentials`.
* `decoding`: a string. Suggests whether the browser should wait to decode the image before presenting other content. The possible values are `async`, `sync`, and `auto` (the default).
* `fetchPriority`: a string. Suggests a relative priority for fetching the image. The possible values are `high`, `low`, and `auto` (the default). During server rendering, `fetchPriority="low"` also prevents React from [automatically preloading the image.](#controlling-image-preloading-during-server-rendering)
* `height`: a number or string. Specifies the rendered height of the image.
* `loading`: a string. Specifies whether the browser should defer loading the image until it is near the viewport. The possible values are `eager` (the default) and `lazy`. Setting `loading="lazy"` prevents React from [automatically preloading the image.](#controlling-image-preloading-during-server-rendering)
* `onError`: an [event handler](/reference/react-dom/components/common#event-handler) function. Fires when the image fails to load.
* `onLoad`: an [event handler](/reference/react-dom/components/common#event-handler) function. Fires when the image finishes loading. Passing `onLoad` prevents React from [waiting for the image during a client-rendered View Transition update.](#waiting-for-an-image-during-a-view-transition)
* `referrerPolicy`: a string. Specifies the [referrer information](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#referrerpolicy) to send when fetching the image.
* `sizes`: a string. Specifies the image sizes for different page layouts. Used with `srcSet`.
* `src`: a string. Specifies the URL of the image.
* `srcSet`: a string. Specifies one or more candidate image sources for the browser to choose from.
* `useMap`: a string. Associates the image with a [client-side image map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map).
* `width`: a number or string. Specifies the rendered width of the image.

#### Caveats {/*caveats*/}

* Do not pass an empty string to `src`. It may cause the browser to request the current page again. React warns in development and omits the attribute. To render no image, omit the `<img>` or pass `null` to `src`.
* `<img>` cannot have children or use `dangerouslySetInnerHTML`. React throws an error if you pass either.
* `fetchPriority="low"` does not stop React from waiting for the image to load and decode during a client-rendered View Transition update. Use `loading="lazy"` or an `onLoad` handler to opt out of that behavior.

---

## Usage {/*usage*/}

### Displaying an image {/*displaying-an-image*/}

Pass the image URL to `src` and a text description to `alt`:

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      width={100}
      height={100}
    />
  );
}
```

```css
img {
  border-radius: 50%;
  object-fit: cover;
}
```

</Sandpack>

Specify `width` and `height` when you know the image dimensions so the browser can reserve space before the image loads. For a decorative image, pass `alt=""` so that screen readers ignore it.

---

### Controlling image preloading during server rendering {/*controlling-image-preloading-during-server-rendering*/}

During server rendering, React automatically generates a preload hint for an `<img>` by default. This can let the browser start fetching the image before it encounters the `<img>` in the rendered HTML.

Add `loading="lazy"` or `fetchPriority="low"` to an image that should not receive this hint:

```js
function ProductPage() {
  return (
    <>
      <img src="hero.jpg" alt="Featured product" />
      <img src="thumbnail.jpg" alt="Related product" loading="lazy" />
      <img src="secondary.jpg" alt="Another product" fetchPriority="low" />
    </>
  );
}
```

In this example, React generates a preload hint only for `hero.jpg`. Depending on the server API or framework, React may render the equivalent of this element:

```html
<link rel="preload" as="image" href="hero.jpg" />
```

React may instead provide the same hint in a `Link` response header. The other two images keep their `loading` and `fetchPriority` props in the rendered HTML, but React does not generate preload hints for them. The `loading="lazy"` prop asks the browser to defer loading an image until it approaches the viewport. The `fetchPriority="low"` prop allows the image to load immediately, but tells the browser to fetch it at a lower priority.

React also does not automatically preload an image when it is inside a `<picture>` or `<noscript>` element, or when its `src` or `srcSet` is a data URL.

If you render an image through a framework or a component library, consult its documentation for the default behavior. React decides whether to generate an automatic preload from the props of the underlying `<img>`. For example, an image component may add `loading="lazy"` by default and provide a separate option for explicitly preloading selected images.

To create an explicit preload hint, call [`preload`](/reference/react-dom/preload).

---

### Waiting for an image during a View Transition {/*waiting-for-an-image-during-a-view-transition*/}

During a client-rendered [`<ViewTransition>`](/reference/react/ViewTransition) update, React may wait for an image to load and decode before starting the animation. This applies when a new `<img>` with a non-empty `src` is rendered, or when an existing image's `src` or `srcSet` changes. The image must be inside the `<ViewTransition>` subtree and must not have `loading="lazy"` or an `onLoad` handler. React does not wait for images during synchronous updates.

When a Suspense boundary reveals streamed content inside a `<ViewTransition>`, React may also wait for visible images with a non-empty `src` that do not have `loading="lazy"`. React stops waiting after a timeout so that a slow image does not block the update indefinitely.

In this example, the Suspense boundary is wrapped in a `<ViewTransition>` and shows a profile skeleton until the portrait has loaded.

For comparison, the second button inserts the same card directly into the DOM. The card appears immediately, and the browser displays the image after it loads:

<Sandpack>

```js
import { ViewTransition, Suspense, useState, startTransition } from 'react';
import { freshImageUrl } from './image.js';
import VanillaProfile from './VanillaProfile.js';

function Profile({ src }) {
  return (
    <div className="card">
      <img src={src} alt="Jack Pope" width={80} height={80} />
      <p>Jack Pope</p>
    </div>
  );
}

function ProfilePlaceholder() {
  return (
    <div className="card">
      <div className="avatar-placeholder" />
      <p className="name-placeholder">&nbsp;</p>
    </div>
  );
}

export default function App() {
  const [src, setSrc] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setSrc(freshImageUrl());
          });
        }}>
        Show profile
      </button>
      {src && (
        <ViewTransition>
          <Suspense fallback={<ProfilePlaceholder />}>
            <Profile src={src} />
          </Suspense>
        </ViewTransition>
      )}
      <hr />
      <VanillaProfile />
    </>
  );
}
```

```js src/VanillaProfile.js
import { useRef } from 'react';
import { freshImageUrl } from './image.js';

export default function VanillaProfile() {
  const ref = useRef(null);
  function show() {
    ref.current.innerHTML = `<div class="card">
      <img src="${freshImageUrl()}" alt="Jack Pope" width="80" height="80" />
      <p>Jack Pope</p>
    </div>`;
  }
  return (
    <>
      <button onClick={show}>Show profile (direct DOM update)</button>
      <div ref={ref} />
    </>
  );
}
```

```js src/image.js hidden
// Add a unique parameter so the image isn't cached,
// and every run shows the loading state.
export function freshImageUrl() {
  return 'https://react.dev/images/team/jack-pope.jpg?t=' + Date.now();
}
```

```css
#root {
  min-height: 390px;
}
.card {
  margin-top: 1em;
}
.card img {
  display: block;
  border-radius: 50%;
  background: #dfe3e9;
}
.card p {
  font-weight: bold;
}
.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #dfe3e9;
}
.name-placeholder {
  width: 90px;
  border-radius: 4px;
  background: #dfe3e9;
}
hr {
  margin: 16px 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "react-scripts": "latest"
  }
}
```

</Sandpack>
