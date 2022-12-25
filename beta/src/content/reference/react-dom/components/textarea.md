---
title: "<textarea>"
---

<Intro>

The [built-in browser `<textarea>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) lets you render a multiline text input.

```js
<textarea />
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<textarea>` {/*textarea*/}

To display a text area, render the [built-in browser `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) component.

```js
<textarea name="postContent" />
```

[See more examples below.](#usage)

#### Props {/*props*/}

`<textarea>` supports all [common element props.](/reference/react-dom/components/common#props)

You can [make a text area controlled](#controlling-a-text-area-with-a-state-variable) by passing a `value` prop:

* `value`: A string. Controls the text inside the text area.

When you pass `value`, you must also pass an `onChange` handler that updates the passed value.

If your `<textarea>` is uncontrolled, you may pass the `defaultValue` prop instead:

* `defaultValue`: A string. Specifies [the initial value](#providing-an-initial-value-for-a-text-area) for a text area.

These `<textarea>` props are relevant both for uncontrolled and controlled text areas:

* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-autocomplete): Either `'on'` or `'off'`. Specifies the autocomplete behavior.
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-autofocus): A boolean. If `true`, React will focus the element on mount.
* `children`: `<textarea>` does not accept children. To set the initial value, use `defaultValue`.
* [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-cols): A number. Specifies the default width in average character widths. Defaults to `20`.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-disabled): A boolean. If `true`, the input will not be interactive and will appear dimmed.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-form): A string. Specifies the `id` of the `<form>` this input belongs to. If omitted, it's the closest parent form.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-maxlength): A number. Specifies the maximum length of text.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-minlength): A number. Specifies the minimum length of text.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): A string. Specifies the name for this input that's [submitted with the form.](#reading-the-textarea-value-when-submitting-a-form)
* `onChange`: An [`Event` handler](/reference/react-dom/components/common#event-handler) function. Required for [controlled text areas.](#controlling-a-text-area-with-a-state-variable) Fires immediately when the input's value is changed by the user (for example, it fires on every keystroke). Behaves like the browser [`input` event.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture`: A version of `onChange` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): An [`Event` handler](/reference/react-dom/components/common#event-handler) function. function. Fires immediately when the value is changed by the user. For historical reasons, in React it is idiomatic to use `onChange` instead which works similarly.
* `onInputCapture`: A version of `onInput` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): An [`Event` handler](/reference/react-dom/components/common#event-handler) function. Fires if an input fails validation on form submit. Unlike the built-in `invalid` event, the React `onInvalid` event bubbles.
* `onInvalidCapture`: A version of `onInvalid` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/select_event): An [`Event` handler](/reference/react-dom/components/common#event-handler) function. Fires after the selection inside the `<textarea>` changes. React extends the `onSelect` event to also fire for empty selection and on edits (which may affect the selection).
* `onSelectCapture`: A version of `onSelect` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-placeholder): A string. Displayed in a dimmed color when the text area value is empty.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-readonly): A boolean. If `true`, the text area is not editable by the user.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-required): A boolean. If `true`, the value must be provided for the form to submit.
* [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-rows): A number. Specifies the default height in average character heights. Defaults to `2`.
* [`wrap`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-wrap): Either `'hard'`, `'soft'`, or `'off'`. Specifies how the text should be wrapped when submitting a form.

#### Caveats {/*caveats*/}

- Passing children like `<textarea>something</textarea>` is not allowed. [Use `defaultValue` for initial content.](#providing-an-initial-value-for-a-text-area)
- If a text area receives a string `value` prop, it will be [treated as controlled.](#controlling-a-text-area-with-a-state-variable)
- A text area can't be both controlled and uncontrolled at the same time.
- A text area cannot switch between being controlled or uncontrolled over its lifetime.
- Every controlled text area needs an `onChange` event handler that synchronously updates its backing value.

---

## Usage {/*usage*/}

### Displaying a text area {/*displaying-a-text-area*/}

Render `<textarea>` to display a text area. You can specify its default size with the [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows) and [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols) attributes, but by default the user will be able to resize it. To disable resizing, you can specify `resize: none` in the CSS.

<Sandpack>

```js
export default function NewPost() {
  return (
    <label>
      Write your post:
      <textarea name="postContent" rows={4} cols={40} />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

---

### Providing a label for a text area {/*providing-a-label-for-a-text-area*/}

Typically, you will place every `<textarea>` inside a [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) tag. This tells the browser that this label is associated with that text area. When the user clicks the label, the browser will focus the text area. It's also essential for accessibility: a screen reader will announce the label caption when the user focuses the text area.

If you can't nest `<textarea>` into a `<label>`, associate them by passing the same ID to `<textarea id>` and [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) To avoid conflicts between instances of one component, generate such an ID with [`useId`.](/reference/react/useId)

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const postTextAreaId = useId();
  return (
    <>
      <label htmlFor={postTextAreaId}>
        Write your post:
      </label>
      <textarea
        id={postTextAreaId}
        name="postContent"
        rows={4}
        cols={40}
      />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### Providing an initial value for a text area {/*providing-an-initial-value-for-a-text-area*/}

You can optionally specify the initial value for the text area. Pass it as the `defaultValue` string.

<Sandpack>

```js
export default function EditPost() {
  return (
    <label>
      Edit your post:
      <textarea
        name="postContent"
        defaultValue="I really enjoyed biking yesterday!"
        rows={4}
        cols={40}
      />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

<Pitfall>

Unlike in HTML, passing initial text like `<textarea>Some content</textarea>` is not supported.

</Pitfall>

---

### Reading the text area value when submitting a form {/*reading-the-text-area-value-when-submitting-a-form*/}

Add a [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) around your textarea with a [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) inside. It will call your `<form onSubmit>` event handler. By default, the browser will send the form data to the current URL and refresh the page. You can override that behavior by calling `e.preventDefault()`. To read the form data, use [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
<Sandpack>

```js
export default function EditPost() {
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
        Post title: <input name="postTitle" defaultValue="Biking" />
      </label>
      <label>
        Edit your post:
        <textarea
          name="postContent"
          defaultValue="I really enjoyed biking yesterday!"
          rows={4}
          cols={40}
        />
      </label>
      <hr />
      <button type="reset">Reset edits</button>
      <button type="submit">Save post</button>
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

Give a `name` to your `<textarea>`, for example `<textarea name="postContent" />`. The `name` you specified will be used as a key in the form data, for example `{ postContent: "Your post" }`.

</Note>

<Pitfall>

By default, *any* `<button>` inside a `<form>` will submit it. This can be surprising! If you have your own custom `Button` React component, consider returning [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) instead of `<button>`. Then, to be explicit, use `<button type="submit">` for buttons that *are* supposed to submit the form.

</Pitfall>

---

### Controlling a text area with a state variable {/*controlling-a-text-area-with-a-state-variable*/}

A text area like `<textarea />` is *uncontrolled.* Even if you [pass an initial value](#providing-an-initial-value-for-a-text-area) like `<textarea defaultValue="Initial text" />`, your JSX only specifies the initial value, not the value right now.

**To render a _controlled_ text area, pass the `value` prop to it.** React will force the text area to always have the `value` you passed. Typically, you will control a text area by declaring a [state variable:](/reference/react/useState)

```js {2,6,7}
function NewPost() {
  const [postContent, setPostContent] = useState(''); // Declare a state variable...
  // ...
  return (
    <textarea
      value={postContent} // ...force the input's value to match the state variable...
      onChange={e => setPostContent(e.target.value)} // ... and update the state variable on any edits!
    />
  );
}
```

This is useful if you want to re-render some part of the UI in response to every keystroke.

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Enter some markdown:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  const renderedHTML = md.render(markdown);
  return <div dangerouslySetInnerHTML={{__html: renderedHTML}} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

<Pitfall>

**If you pass `value` without `onChange`, it will be impossible to type into the text area.** When you control an text area by passing some `value` to it, you *force* it to always have the value you passed. So if you pass a state variable as a `value` but forget to update that state variable synchronously during the `onChange` event handler, React will revert the text area after every keystroke back to the `value` that you specified.

</Pitfall>

---

## Troubleshooting {/*troubleshooting*/}

### My text area doesn't update when I type into it {/*my-text-area-doesnt-update-when-i-type-into-it*/}

If you render a text area with `value` but no `onChange`, you will see an error in the console:

```js
// 🔴 Bug: controlled text area with no onChange handler
<textarea value={something} />
```

<ConsoleBlock level="error">

You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

As the error message suggests, if you only wanted to [specify the *initial* value,](#providing-an-initial-value-for-a-text-area) pass `defaultValue` instead:

```js
// ✅ Good: uncontrolled text area with an initial value
<textarea defaultValue={something} />
```

If you want [to control this text area with a state variable,](#controlling-a-text-area-with-a-state-variable) specify an `onChange` handler:

```js
// ✅ Good: controlled text area with onChange
<textarea value={something} onChange={e => setSomething(e.target.value)} />
```

If the value is intentionally read-only, add a `readOnly` prop to suppress the error:

```js
// ✅ Good: readonly controlled text area without on change
<textarea value={something} readOnly={true} />
```

---

### My text area caret jumps to the beginning on every keystroke {/*my-text-area-caret-jumps-to-the-beginning-on-every-keystroke*/}

If you [control a text area,](#controlling-a-text-area-with-a-state-variable) you must update its state variable to the text area's value from the DOM during `onChange`.

You can't update it to something other than `e.target.value`:

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

If this doesn't fix the problem, it's possible that the text area gets removed and re-added from the DOM on every keystroke. This can happen if you're accidentally [resetting state](/learn/preserving-and-resetting-state) on every re-render. For example, this can happen if the text area or one of its parents always receives a different `key` attribute, or if you nest component definitions (which is not allowed in React and causes the "inner" component to remount on every render).

---

### I'm getting an error: "A component is changing an uncontrolled input to be controlled" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


If you provide a `value` to the component, it must remain a string throughout its lifetime.

You cannot pass `value={undefined}` first and later pass `value="some string"` because React won't know whether you want the component to be uncontrolled or controlled. A controlled component should always receive a string `value`, not `null` or `undefined`.

If your `value` is coming from an API or a state variable, it might be initialized to `null` or `undefined`. In that case, either set it to an empty string (`''`) initially, or pass `value={someValue ?? ''}` to ensure `value` is a string.
