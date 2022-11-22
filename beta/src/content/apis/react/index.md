---
title: "react: Hooks"
---

React provides several built-in *Hooks* for features you can use from your components.

<InlineToc />

---

## Common features {/*common-features*/}

### State {/*state*/}

State lets your component "remember" information like user input.

<APIGrid>

<APICard title="useState" path="/apis/react/useState">

Declares a state variable.

</APICard>

<APICard title="useReducer" path="/apis/react/useReducer">

Declares a state variable managed by a reducer.

</APICard>

</APIGrid>

### Context {/*context*/}

Context lets your component receive information from above in the tree without threading it through every level.

<APIGrid>

<APICard title="useContext" path="/apis/react/useContext">

Reads and subscribes to a context.

</APICard>

</APIGrid>

---

## Escape hatches {/*escape-hatches*/}

### Refs {/*refs*/}

Refs let you hold values that aren't needed for rendering, such as browser DOM nodes or timeout IDs.

<APIGrid>

<APICard title="useRef" path="/apis/react/useRef">

Declares a ref to hold any value, like a DOM node.

</APICard>

</APIGrid>


### Effects {/*effects*/}

Effects let you "escape" the React paradigm and connect React to external systems like browser APIs.

<APIGrid>

<APICard title="useEffect" path="/apis/react/useEffect">

Lets you connect to an external system.

</APICard>

<APICard title="useLayoutEffect" path="/apis/react/useLayoutEffect">

Like `useEffect`, but fires early to read layout.

</APICard>

<APICard title="useInsertionEffect" path="/apis/react/useInsertionEffect">

Like `useEffect`, but fires early to insert CSS styles.

</APICard>

</APIGrid>




