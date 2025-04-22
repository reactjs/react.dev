---
title: unstable_addTransitionType
version: experimental
---

<Experimental>

**This API is experimental and is not available in a stable version of React yet.**

You can try it by upgrading React packages to the most recent experimental version:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Experimental versions of React may contain bugs. Don't use them in production.

</Experimental>

<Intro>

`unstable_addTransitionType` lets you specify the cause of a transition.


```js
startTransition(() => {
  unstable_addTransitionType('my-transition-type');
  setState(newState);
});
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `addTransitionType` {/*addtransitiontype*/}

#### Parameters {/*parameters*/}

- `type`: The type of transition to add. This can be any string.

#### Returns {/*returns*/}

`startTransition` does not return anything.

#### Caveats {/*caveats*/}

- If multiple transitions are combined, all Transition Types are collected. You can also add more than one type to a Transition.
- Transition Types are reset after each commit. This means a `<Suspense>` fallback will associate the types after a `startTransition`, but revealing the content does not.

---

## Usage {/*usage*/}

### Adding the cause of a transition {/*adding-the-cause-of-a-transition*/}

Call `addTransitionType` inside of `startTransition` to indicate the cause of a transition:

``` [[1, 6, "unstable_addTransitionType"], [2, 5, "startTransition", [3, 6, "'submit-click'"]]
import { startTransition, unstable_addTransitionType } from 'react';

function Submit({action) {
  function handleClick() {
    startTransition(() => {
      unstable_addTransitionType('submit-click');
      action();
    });
  }

  return <button onClick={handleClick}>Click me</button>;
}

```

When you call <CodeStep step={1}>addTransitionType</CodeStep> inside the scope of <CodeStep step={2}>startTransition</CodeStep>, React will associate <CodeStep step={3}>submit-click</CodeStep> as one of the causes for the Transition.

Currently, Transition Types can be used to customize different animations based on what caused the Transition. You have three different ways to choose from for how to use them:

- [Customize animations using browser view transition types](#customize-animations-using-browser-view-transition-types)
- [Customize animations using `View Transition` Class](#customize-animations-using-view-transition-class)
- [Customize animations using `ViewTransition` events](#customize-animations-using-viewtransition-events) 

In the future, we plan to support more use cases for using the cause of a transition.

---
### Customize animations using browser view transition types {/*customize-animations-using-browser-view-transition-types*/}

When a [`ViewTransition`](/reference/react/ViewTransition) activates from a transition, React adds all the Transition Types as browser [view transition types](https://www.w3.org/TR/css-view-transitions-2/#active-view-transition-pseudo-examples) to the element.

This allows you to customize different animations based on CSS scopes:

```js [11]
function Component() {
  return (
    <ViewTransition>
      <div>Hello</div>
    </ViewTransition>
  );
}

startTransition(() => {
  unstable_addTransitionType('my-transition-type');
  setShow(true);
});
```

```css
:root:active-view-transition-type(my-transition-type) {
  &::view-transition-...(...) {
    ...
  }
}
```

---

### Customize animations using `View Transition` Class {/*customize-animations-using-view-transition-class*/}

You can customize animations for an activated `ViewTransition` based on type by passing an object to the View Transition Class:

```js
function Component() {
  return (
    <ViewTransition enter={{
      'my-transition-type': 'my-transition-class',
    }}>
      <div>Hello</div>
    </ViewTransition>
  );
}

// ...
startTransition(() => {
  unstable_addTransitionType('my-transition-type');
  setState(newState);
});
```

If multiple types match, then they're joined together. If no types match then the special "default" entry is used instead. If any type has the value "none" then that wins and the ViewTransition is disabled (not assigned a name).

These can be combined with enter/exit/update/layout/share props to match based on kind of trigger and Transition Type.

```js
<ViewTransition enter={{
  'navigation-back': 'enter-right',
  'navigation-forward': 'enter-left',
}}
exit={{
  'navigation-back': 'exit-right',
  'navigation-forward': 'exit-left',
}}>
```

---

### Customize animations using `ViewTransition` events {/*customize-animations-using-viewtransition-events*/}

You can imperatively customize animations for an activated `ViewTransition` based on type using View Transition events:

```
<ViewTransition onUpdate={(inst, types) => {
  if (types.includes('navigation-back')) {
    ...
  } else if (types.includes('navigation-forward')) {
    ...
  } else {
    ...
  }
}}>
```

This allows you to pick different imperative Animations based on the cause.

---

## Troubleshooting {/*troubleshooting*/}

### TODO {/*todo2*/}
