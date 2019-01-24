---
title: useLayoutEffect does nothing on the server Warning
layout: single
permalink: warnings/uselayouteffect-server-warning.html
---

You're probably here because you saw this warning in your server logs when rendering a react component.

> Warning:
>
> useLayoutEffect does nothing on the server, because its effect cannot be encoded into the server renderer's output format. This will lead to a mismatch between the initial, non-hydrated UI and the intended UI. To avoid this, useLayoutEffect should only be used in components that render exclusively on the client.

`useLayoutEffect` is a hook used to read layout from the dom rerender. They're scheduled to run right after updating the dom, but just before the browser has painted. An example of such a component -

```jsx
function Foo() {
  let ref = useRef();
  useLayoutEffect(() => {
    if (ref.clientWidth > 100) {
      ref.style.width = 100;
    }
  });
  return <div ref={ref}>hello world</div>;
}
```

When you try to server render this component, the code inside `useLayoutEffect` will not run, and will also warn as mentioned above, to let you know that the component will not be fully rendered initially before it's hydrated, resulting in a possibly broken ui. Instead, you should refactor your code to account for this, like so -

```jsx
function Bar() {
  let ref = useRef();
  useLayoutEffect(() => {
    if (ref.clientWidth > 100) {
      ref.style.width = 100;
    }
  });
  return <div ref={ref}>hello world</div>;
}

function Foo() {
  let [isLoading, setIsLoading] = useState(true);
  useEffect(() => setIsLoading(false), []);
  return isLoading ? "loading..." : <Bar />;
}
```

Alternately, if your code _doesn't_ need to read layout values, and can bear to run the effect after initial render, you could use `useEffect` instead.
