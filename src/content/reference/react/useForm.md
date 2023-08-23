---
title: useForm
---

<Intro>

`useForm` is a React Custom Hook for managing forms with ease.

```js
const { onInputChange, onResetForm, email, password } = useForm({
  email: '',
  password: '',
});
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

```js
import { useState } from "react";
export const useForm = (initialForm = {}) => {
  const [formState, setFormState] = useState(initialForm);
  const onInputChange = ({ target }) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [name]: value,
    });
    const onResetForm = () => {
      setFormState(initialForm);
    };
    return {
      ...formState,
      formState,
      onInputChange,
      onResetForm,
    };
  };
};
```
## Usage Example {/*usage-example*/}
```js
import { useEffect } from "react";
import { useForm } from "../hooks/useForm";

export const FormWithCustomHook = () => {
  const { onInputChange, onResetForm, email, password } = useForm({
    email: '',
    password: '',
  });
  return (
    <>
      <h1>Form with Custom Hook</h1>
      <hr />
      <input type="email" name="email" value={email} onChange={onInputChange} />
      <input
        type="password"
        name="password"
        value={password}
        onChange={onInputChange}
      />
      <button onClick={onResetForm}>Clean</button>
    </>
  );
};
```