---
title: "Built-in React DOM Hooks"
---

<Intro>

The `react-dom` package contains Hooks that are only supported for web applications (which run in the browser DOM environment). These Hooks are not supported in non-browser environments like iOS, Android, or Windows applications. If you are looking for Hooks that are supported in web browsers *and other environments* see [the React Hooks page](/reference/react). This page lists all the Hooks in the `react-dom` package.

</Intro>

---

## Form Hooks {/*form-hooks*/}

*Forms* let you create interactive controls for submitting information.  To manage forms in your components, use one of these Hooks:

* [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) allows you to make updates to the UI based on the status of a form.

```js
function Form({ action }) {
  async function increment(n) {
    return n + 1;
  }
  const [count, incrementFormAction] = useActionState(increment, 0);
  return (
    <form action={action}>
      <button formAction={incrementFormAction}>Count: {count}</button>
      <Button />
    </form>
  );
}

function Button() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} type="submit">
      Submit
    </button>
  );
}
```
