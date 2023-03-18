---
title: renderToStaticMarkup
---

<Intro>

`renderToStaticMarkup` renders a non-interactive React tree to an HTML string.

```js
const html = renderToStaticMarkup(reactNode)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `renderToStaticMarkup(reactNode)` {/*rendertostaticmarkup*/}

On the server, call `renderToStaticMarkup` to render your app to HTML.

```js
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<Page />);
```

It will produce non-interactive HTML output of your React components.

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `reactNode`: A React node you want to render to HTML. For example, a JSX node like `<Page />`.

#### Returns {/*returns*/}

An HTML string.

#### Caveats {/*caveats*/}

* `renderToStaticMarkup` output cannot be hydrated.

* `renderToStaticMarkup` has limited Suspense support. If a component suspends, `renderToStaticMarkup` immediately sends its fallback as HTML.

* `renderToStaticMarkup` works in the browser, but using it in the client code is not recommended. If you need to render a component to HTML in the browser, [get the HTML by rendering it into a DOM node.](/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code)

---

## Usage {/*usage*/}

### Rendering a non-interactive React tree as HTML to a string {/*rendering-a-non-interactive-react-tree-as-html-to-a-string*/}

Call `renderToStaticMarkup` to render your app to an HTML string which you can send with your server response:

```js {5-6}
import { renderToStaticMarkup } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
  const html = renderToStaticMarkup(<Page />);
  response.send(html);
});
```

This will produce the initial non-interactive HTML output of your React components.

<Pitfall>

This method renders **non-interactive HTML that cannot be hydrated.**  This is useful if you want to use React as a simple static page generator, or if you're rendering completely static content like emails.

Interactive apps should use [`renderToString`](/reference/react-dom/server/renderToString) on the server and [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) on the client.

</Pitfall>
