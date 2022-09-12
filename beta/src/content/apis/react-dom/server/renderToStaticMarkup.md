---
title: renderToStaticMarkup
---

<Wip>

This section is incomplete, please see the old docs for [renderToStaticMarkup](https://reactjs.org/docs/react-dom-server.html#rendertostaticmarkup).

</Wip>


<Intro>

Similar to renderToString, except this doesn’t create extra DOM attributes that React uses internally, such as data-reactroot. This is useful if you want to use React as a simple static page generator, as stripping away the extra attributes can save some bytes.


```js
renderToStaticMarkup(element)
```

If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use renderToString on the server and ReactDOM.hydrateRoot() on the client.

</Intro>

<InlineToc />
