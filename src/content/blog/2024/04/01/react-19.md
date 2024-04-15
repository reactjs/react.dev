---
title: "React 19 Beta"
---

April 1, 2024 by [The React Team](/community/team)

---

<Intro>

React 19 Beta is now available on npm! 

In our [React 19 Upgrade Guide](/blog/04/01/react-19-upgrade-guide), we shared step-by-step instructions for upgrading your app to the React 19 Beta. In this post, we'll give an overview of the new features in React 19 Beta, and how you can adopt them.

_Note for React Native users: React 19 will ship a future version of React Native with the New React Native Architecture._

</Intro>

<Note>

React Conf 2024 is scheduled for May 15–16 in Henderson, Nevada!

For more see [the React Conf website](https://conf.react.dev).

</Note>

---

## What's new in React 19 {/*whats-new-in-react-19*/}

### New Feature: Actions {/*new-feature-actions*/}

A common use case in React apps is to perform a data mutation and then update state in response. For example, when a user submits a form to change their name, you will make an API request, and then handle the response. Since this is an async request, you need to handle the pending state in a separate useState call:

```js {5,8,10}
const [name, setName] = useState('');
const [error, setError] = useState(null);

// Manually handle the pending state
const [isPending, setIsPending] = useState(false);

const handleSubmit = async () => {
  setIsPending(true);
  const {error} = await updateName(name);
  setIsPending(false);
  if (error) {
    setError(error);
  } else {
    setName('');
  }
}
```

In React 19, we added support for using async functions in transitions:

```js {5,8,15}
const [name, setName] = useState('');
const [error, setError] = useState(null);

// Pending state is handled for you
const [isPending, startTransition] = useTransition();

const submitAction = async () => {
  startTransition(async () => {
    const {error} = await updateName(name);
    if (!error) {
      setError(error);
    } else {
      setName('');  
    }
  })
}
```

By convention, functions that use async transitions are called "Actions". Actions will immediately set the `isPending` state to true, make the async request(s), and render any state updates as transitions. This allows you to keep the current UI responsive and interactive while the data is changing.

You can always create an Action by dropping down to `useTransition`, but to make the common cases easier we've added a new hook called `useActionState`:

```js {2,6}
const [name, setName] = useState('');
const [submitAction, data, isPending] = useActionState(async () => {
  return  await updateName(name);
  setName('');
  return result;
});
```

Actions are enabled by default with the new `<form>` action prop.


### New Feature: Forms {/*new-feature-forms*/}

We've added an `action` prop to React DOM `<form>` elements to automatically submit forms with Actions:

```js {11,14}
const [error, setError] = useState(null);

const submitAction = async (formData) => {
  const {error} = await updateName(formData.get('name'));
  if (error) {
    setError(error);
  }
}

return (
  <form action={submitAction}>
    <input type="text" name="name" />
    {error && <span>Failed: {error}</span>}
  </form>
)
```

Actions compose, so to access the pending state of `<form>` actions, you can wrap the action in `startTransition`, or use the `useActionState` hook:

```js {1,3,7-8}
const [submitAction, state, isPending] = useActionState(async (formData) => {
  return updateName(formData.get('name'));
})

return (
  <form action={submitAction}>
    <input type="text" name="name" disabled={isPending}/>
    {!state.success && <span>Failed: {state.error}</span>}
  </form>
)
```

When a `<form>` Action succeeds, React will automatically reset the form for uncontrolled components. If you need to reset the `<form>` manually, you can call the new `requestFormReset` react-dom API.

Finally, to access the status of the form Action, we've added a new hook `useFormStatus`. This hook works like context for the nearest `<form>` element, returning it's `pending` state and last submitted `formData` and `result`:

```js {2,5-6}
function NameInput() {
  const {data, pending} = useFormStatus();
  return (
    <>
      <input type="text" name="name" disabled={pending} />
      {!data.sucess && <span>Failed: {data.error}</span>}
    </>
  )
}
```

### New Feature: Optimistic Updates {/*new-feature-optimistic-updates*/}

### New Feature: Head Elements {/*new-feature-head-elements*/}

### New Feature: Resource Loading APIs {/*new-feature-resource-loading-apis*/}

### React Server Components {/*react-server-components*/}

<Note>
TODO: Requires a bundler and framework that supports RSC.
</Note>

## Improvements in React 19 {/*improvements-in-react-19*/}

### Ref as a prop {/*ref-as-a-prop*/}

### Full Support for Web Components {/*support-for-web-components*/}

### Error Handling {/*error-handling*/}

### Strict Mode {/*strict-mode*/}


## How to Upgrade {/*how-to-upgrade*/}
See How to Upgrade to React 18 for step-by-step instructions and a full list of breaking and notable changes.



