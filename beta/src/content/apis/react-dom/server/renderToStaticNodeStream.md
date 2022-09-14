---
title: renderToStaticNodeStream
---

<Wip>

This section is incomplete, please see the old docs for [renderToStaticNodeStream.](https://reactjs.org/docs/react-dom-server.html#rendertostaticnodestream)

</Wip>


<Intro>

Similar to renderToNodeStream, except this doesn’t create extra DOM attributes that React uses internally, such as `data-reactroot`. This is useful if you want to use React as a simple static page generator, as stripping away the extra attributes can save some bytes.


```js
renderToStaticNodeStream(element)
```

</Intro>

<InlineToc />
