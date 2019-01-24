---
title: useLayoutEffect does nothing on the server 
layout: single
permalink: warnings/uselayouteffect-server-warning.html
---


You are probably here because you saw this warning in your server logs when rendering a react component. 

useLayoutEffect does nothing on the server, because its effect cannot
be encoded into the server renderer's output format. This will lead
to a mismatch between the initial, non-hydrated UI and the intended
UI. To avoid this, useLayoutEffect should only be used in
components that render exclusively on the client.

An example of a component that could do this - 
```
function Foo(){
  useLayoutEffect(() => {
    
  })
  return <div></div>
}
```

