---
title: "<input>"
---

<Intro>

The [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) component lets you render different kinds of form inputs.

</Intro>

<InlineToc />

---

## Usage {/*usage*/}

### Displaying inputs of different types {/*displaying-inputs-of-different-types*/}

To display an input, render an `<input>` component. By default, it will be a text input. You can pass `type="checkbox"` for a checkbox, `type="radio"` for a radio button, [or one of the other input types.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Providing an initial value for an input {/*providing-an-initial-value-for-an-input*/}

You can optionally specify the initial value for any input. Pass it as the `defaultValue` string for text inputs. Checkboxes and radio buttons should specify the initial value with the `defaultChecked` boolean instead.

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input
            type="radio"
            name="myRadio"
            value="option2"
            defaultChecked={true} 
          />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Reading the input values when submitting a form {/*reading-the-input-values-when-submitting-a-form*/}

Add a [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) around your inputs with a [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) inside. It will call your `<form onSubmit>` event handler. By default, the browser will send the form data to the current URL and refresh the page. You can override that behavior by calling `e.preventDefault()`. To read the form data, use [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
<Sandpack>

```js
export default function MyForm() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // You can pass formData as a fetch body directly:
    fetch('/some-api', { method: form.method, body: formData });

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label><input type="radio" name="myRadio" value="option1" /> Option 1</label>
        <label><input type="radio" name="myRadio" value="option2" defaultChecked={true} /> Option 2</label>
        <label><input type="radio" name="myRadio" value="option3" /> Option 3</label>
      </p>
      <hr />
      <button type="reset">Reset form</button>
      <button type="submit">Submit form</button>
    </form>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

<Note>

Give a `name` to every `<input>`, for example `<input name="firstName" defaultValue="Taylor" />`. The `name` you specified will be used as a key in the form data, for example `{ firstName: "Taylor" }`.

</Note>

<Pitfall>

By default, *any* `<button>` inside a `<form>` will submit it. This can be surprising! If you have your own custom `Button` React component, consider returning [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) instead of `<button>`. Then, to be explicit, use `<button type="submit">` for buttons that *are* supposed to submit the form.

</Pitfall>

---

### Controlling an input with a state variable {/*controlling-an-input-with-a-state-variable*/}

An input like `<input />` is *uncontrolled.* Even if you [pass an initial value](#providing-an-initial-value-for-an-input) like `<input defaultValue="Initial text" />`, your JSX only specifies the initial value. It does not control what the value should be right now.

**To render a _controlled_ input, pass the `value` prop to it (or `checked` for checkboxes and radios).** React will force the input to always have the `value` you passed. Typically, you will control an input by declaring a [state variable:](/apis/react/useState)

```js {2,6,7}
function Form() {
  const [firstName, setFirstName] = useState(''); // Declare a state variable...
  // ...
  return (
    <input
      value={firstName} // ...force the input's value to match the state variable...
      onChange={e => setFirstName(e.target.value)} // ... and update the state variable on any edits!
    />
  );
}
```

A controlled input makes sense if you needed state anyway--for example, to re-render your UI on every edit:

```js {2,9}
function Form() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </label>
      {firstName !== '' && <p>Your name is {firstName}.</p>}
      ...
```

It's also useful if you want to offer multiple ways to adjust the input state (for example, by clicking a button):

```js {3-4,10-11,14}
function Form() {
  // ...
  const [age, setAge] = useState('');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        Age:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Add 10 years
        </button>
```

The `value` you pass to controlled components should not be `undefined` or `null`. If you need the initial value to be empty (such as with the `firstName` field below), initialize your state variable to an empty string (`''`).

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('20');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        First name:
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Age:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Add 10 years
        </button>
      </label>
      {firstName !== '' &&
        <p>Your name is {firstName}.</p>
      }
      {ageAsNumber > 0 &&
        <p>Your age is {ageAsNumber}.</p>
      }
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
p { font-weight: bold; }
```

</Sandpack>

<Pitfall>

**If you pass `value` without `onChange`, it will be impossible to type into the input.** When you control an input by passing some `value` to it, you *force* it to always have the value you passed. So if you pass a state variable as a `value` but forget to update that state variable synchronously during the `onChange` event handler, React will revert the input after every keystroke back to the `value` that you specified.

</Pitfall>

---

## Reference {/*reference*/}

### `<input>` {/*input*/}

To display an input, render an `<input>` component. [You can group inputs into a `<form>`.](#reading-the-input-values-when-submitting-a-form)

```js
<form method="post" onSubmit={handleSubmit}>
  <label>
    Text input: <input name="myInput" />
  </label>
  <label>
    Checkbox: <input type="checkbox" name="myCheckbox" />
  </label>
  <button type="submit">Submit</button>
</form>
```

If you need to re-render a part of the UI in response to every edit, you can [make your input *controlled* by passing a `value` to it.](#controlling-an-input-with-a-state-variable) If you pass a `value`, you must also provide an `onChange` that synchronously updates that value:

```js
function MyForm() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      <p>Your name is {firstName}.</p>
    />
  );
}
```

[See more examples above.](#usage)

#### Props {/*props*/}

`<input>` supports all [generic element props.](/apis/react-dom/components/generic#props)

Additionally, it also supports these optional props:

* [`accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#accept): A string. Specifies which filetypes are accepted by a `type="file"` input.
* [`alt`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#alt): A string. Specifies the alternative image text for a `type="image"` input.
* [`capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#capture): A string. Specifies the media (microphone, video, or camera) captured by a `type="file"` input.
* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#alt): A string. Specifies one of the possible [autocomplete behaviors.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autofocus): A boolean. If `true`, React will focus the element on mount.
* [`checked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#checked): A boolean. For a checkbox (`type="checkbox"`), specifies whether it is currently checked. For a radio button (`type="radio"`), specifies whether it's the currently selected one in its group. **If you pass a value for `checked`, [the input will become *controlled*](#controlling-an-input-with-a-state-variable) and will need an `onChange` handler updating that value.**
* [`defaultChecked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultChecked): A boolean. Specifies [the initial value](#providing-an-initial-value-for-an-input) for `type="checkbox"` and `type="radio"` inputs.
* [`defaultValue`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultValue): A boolean.  Specifies [the initial value](#providing-an-initial-value-for-an-input) for all the text inputs.
* [`dirname`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#dirname): A string. Specifies the form field name for the element's directionality.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#disabled): A boolean. If `true`, the input will not be interactive and will appear dimmed.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form): A string. Specifies the `id` of the `<form>` this input belongs to. If omitted, it's the closest parent form.
* [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): A string. Overrides the parent `<form action>` for `type="submit"` and `type="image"`.
* [`formEnctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formenctype): A string. Overrides the parent `<form enctype>` for `type="submit"` and `type="image"`.
* [`formMethod`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formmethod): A string. Overrides the parent `<form method>` for `type="submit"` and `type="image"`.
* [`formNoValidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formnovalidate): A string. Overrides the parent `<form noValidate>` for `type="submit"` and `type="image"`.
* [`formTarget`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formtarget): A string. Overrides the parent `<form target>` for `type="submit"` and `type="image"`.
* [`height`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#height): A string. Specifies the image height for `type="image"`.
* [`list`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#list): A string. Specifies the `id` of the `<datalist>` with the autocomplete options.
* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max): A number. Specifies the maximum value of numerical and datetime inputs.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength): A number. Specifies the maximum length of text and other inputs.
* [`min`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min): A number. Specifies the minimum value of numerical and datetime inputs.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength): A number. Specifies the minimum length of text and other inputs.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#multiple): A boolean. Specifies whether multiple values are allowed for `<type="file"` and `type="email"`.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): A string. Specifies the name for this input that's submitted with the form.
* `onChange`: **Required for [controlled inputs.](#controlling-an-input-with-a-state-variable)** An event handler function. Fires immediately when the input's value is changed by the user (for example, it fires on every keystroke). Behaves like the browser [`input` event.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): An event handler function. Fires immediately when the value is changed by the user. For historical reasons, in React it is idiomatic to use `onChange` instead which works similarly.
* `onSelect`: An event handler function. Fires after the selection inside the `<input>` changes. Similar to the non-standard browser [`selectionchange` event,](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/selectionchange_event) but works across different browsers.
* [`pattern`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern): A string. Specifies the pattern that the `value` must match.
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder): A string. Displayed in a dimmed color when the input value is empty.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly): A boolean. If `true`, the input is not editable by the user.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#required): A boolean. If `true`, the value must be provided for the form to submit.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#size): A number. Similar to setting width, but the unit depends on the control.
* [`src`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#src): A string. Specifies the image source for a `type="image"` input.
* [`step`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step): A positive number or an `'any'` string. Specifies the distance between valid values.
* [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type): A string. One of the [input types.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)
* [`value`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#value): A string. Specifies the current value of the input. **If you pass something other than `undefined`, [the input will be *controlled*](#controlling-an-input-with-a-state-variable) and will require an `onChange` handler updating that value.**
* [`width`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#width):  A string. Specifies the image width for a `type="image"` input.

#### Caveats {/*caveats*/}

- Checkboxes need `checked` (or `defaultChecked`), not `value` (or `defaultValue`).
- If a text input receives a string `value` prop, it will be [treated as controlled.](#controlling-an-input-with-a-state-variable)
- If a checkbox or a radio button receives a boolean `checked` prop, it will be [treated as controlled.](#controlling-an-input-with-a-state-variable)
- An input can't be both controlled and uncontrolled at the same time.
- An input cannot switch between being controlled or uncontrolled over its lifetime.
- Every controlled input needs an `onChange` event handler that synchronously updates its backing value.

---

## Troubleshooting {/*troubleshooting*/}

### My text input doesn't update when I type into it {/*my-text-input-doesnt-update-when-i-type-into-it*/}

If you render an input with `value` but no `onChange`, you will see an error in the console:

```js
// 🔴 Bug: controlled text input with no onChange handler
<input value={something} />
```

<ConsoleBlock level="error">

You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

As the error message suggests, if you only wanted to [specify the *initial* value,](#providing-an-initial-value-for-an-input) pass `defaultValue` instead:

```js
// ✅ Good: uncontrolled input with an initial value
<input defaultValue={something} />
```

If you want [to control this input with a state variable,](#controlling-an-input-with-a-state-variable) specify an `onChange` handler:

```js
// ✅ Good: controlled input with onChange
<input value={something} onChange={e => setSomething(e.target.value)} />
```

If the value is intentionally read-only, add a `readOnly` prop to suppress the error:

```js
// ✅ Good: readonly controlled input without on change
<input value={something} readOnly={true} />
```

---

### My checkbox doesn't update when I click on it {/*my-checkbox-doesnt-update-when-i-click-on-it*/}

If you render a checkbox with `checked` but no `onChange`, you will see an error in the console:

```js
// 🔴 Bug: controlled checkbox with no onChange handler
<input type="checkbox" checked={something} />
```

<ConsoleBlock level="error">

You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

As the error message suggests, if you only wanted to [specify the *initial* value,](#providing-an-initial-value-for-an-input) pass `defaultChecked` instead:

```js
// ✅ Good: uncontrolled checkbox with an initial value
<input type="checkbox" defaultChecked={something} />
```

If you want [to control this checkbox with a state variable,](#controlling-an-input-with-a-state-variable) specify an `onChange` handler:

```js
// ✅ Good: controlled checkbox with onChange
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />
```

<Pitfall>

You need to read `e.target.checked` rather than `e.target.value` for checkboxes.

</Pitfall>

If the checkbox is intentionally read-only, add a `readOnly` prop to suppress the error:

```js
// ✅ Good: readonly controlled input without on change
<input type="checkbox" checked={something} readOnly={true} />
```

---

### My input caret jumps to the beginning on every keystroke {/*my-input-caret-jumps-to-the-beginning-on-every-keystroke*/}

If you [control an input,](#controlling-an-input-with-a-state-variable) you must update its state variable to the input's value from the DOM during `onChange`.

You can't update it to something other than `e.target.value` (or `e.target.checked` for checkboxes):

```js
function handleChange(e) {
  // 🔴 Bug: updating an input to something other than e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

You also can't update it asynchronously:

```js
function handleChange(e) {
  // 🔴 Bug: updating an input asynchronously
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

To fix your code, update it synchronously to `e.target.value`:

```js
function handleChange(e) {
  // ✅ Updating a controlled input to e.target.value synchronously
  setFirstName(e.target.value);
}
```

If this doesn't fix the problem, it's possible that the input gets removed and re-added from the DOM on every keystroke. This can happen if you're accidentally [resetting state](/learn/preserving-and-resetting-state) on every re-render. For example, this can happen if the input or one of its parents always receives a different `key` attribute, or if you nest component definitions (which is not allowed in React and causes the "inner" component to always be considered a different tree).

---

### I'm getting an error: "A component is changing an uncontrolled input to be controlled" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


If you provide a `value` to the component, it must remain a string throughout its lifetime.

You cannot pass `value={undefined}` first and later pass `value="some string"` because React won't know whether you want the component to be uncontrolled or controlled. A controlled component should always receive a string `value`, not `null` or `undefined`.

If your `value` is coming from an API or a state variable, it might be initialized to `null` or `undefined`. In that case, either set it to an empty string (`''`) initially, or pass `value={someValue ?? ''}` to ensure `value` is a string.

Similarly, if you pass `checked` to a checkbox, ensure it's always a boolean.
