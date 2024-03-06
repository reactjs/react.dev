---
title: Never pass around hooks as regular values
---

<Intro>
Hooks should only be called inside of components. Never pass it around as a regular value.
</Intro>

---

Hooks allow you to augment a component with React features. They should always be called as a function, and never passed around as a regular value. This enables _local reasoning_, or the ability for developers to understand everything a component can do by looking at that component in isolation.

```js {2}
function ChatInput() {
  const useDataWithLogging = withLogging(useData); // ❌
  const data = useDataWithLogging();
}
```

```js {2}
function ChatInput() {
  const data = useDataWithLogging(); // ✅
}
```

Hooks should be immutable and not be mutated. Instead of mutating a hook dynamically, create a static version of the hook with the desired functionality.

```js
function useDataWithLogging() {
  // ... Logic should go in here
}
```

Hooks should also not be dynamically used: for example, instead of doing dependency injection in a component:

```js {2}
function ChatInput() {
  return <Button useData={useDataWithLogging} /> // ❌
}
```

You should always inline the call of the hook into that component and handle any logic in there.

```js {6}
function ChatInput() {
  return <Button />
}

function Button() {
  const data = useDataWithLogging();
}

function useDataWithLogging() {
  // conditional logic can live here
}
```

This way, `<Button />` is much easier to understand and debug. When Hooks are used in dynamic ways, it increases the complexity of your app greatly and inhibits local reasoning, making your team less productive in the long term. If you find yourself needing to mock components for tests, it's better to mock the server instead to respond with canned data. If possible, it's also usually more effective to test your app with end-to-end tests.