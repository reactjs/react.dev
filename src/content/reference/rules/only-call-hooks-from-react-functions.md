---
title: Only call Hooks from React functions
---

<Intro>
Don’t call Hooks from regular JavaScript functions.
</Intro>

---

Don’t call Hooks from regular JavaScript functions. Instead, you can:

✅ Call Hooks from React function components.
✅ Call Hooks from custom Hooks (we’ll learn about them on the next page).

By following this rule, you ensure that all stateful logic in a component is clearly visible from its source code.

```js {2,5}
function FriendList() {
  const [onlineStatus, setOnlineStatus] = useOnlineStatus(); // ✅
}

function setOnlineStatus() { // ❌ Not a component or custom hook!
  const [onlineStatus, setOnlineStatus] = useOnlineStatus();
}
```