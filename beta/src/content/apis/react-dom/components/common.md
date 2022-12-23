---
title: "Common components (e.g. <div>)"
---

<Intro>

All built-in browser components, such as [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div), support some common props and events.

</Intro>

<InlineToc />

---

## Usage {/*usage*/}

### Applying CSS styles {/*applying-css-styles*/}

In React, you specify a CSS class with [`className`.](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) It works like the `class` attribute in HTML:

```js
<img className="avatar" />
```

Then you write the CSS rules for it in a separate CSS file:

```css
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```

React does not prescribe how you add CSS files. In the simplest case, you'll add a [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) tag to your HTML. If you use a build tool or a framework, consult its documentation to learn how to add a CSS file to your project.

Sometimes, the style values depend on data. Use the `style` attribute to pass some styles dynamically:

```js {3-6}
<img
  className="avatar"
  style={{
    width: user.imageSize,
    height: user.imageSize
  }}
/>
```


In the above example, `style={{}}` is not a special syntax, but a regular `{}` object inside the `style={ }` [JSX curly braces.](/learn/javascript-in-jsx-with-curly-braces) We recommend to only use the `style` attribute when your styles depend on JavaScript variables.

<Sandpack>

```js App.js
import Avatar from './Avatar.js';

const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function App() {
  return <Avatar user={user} />;
}
```

```js Avatar.js active
export default function Avatar({ user }) {
  return (
    <img
      src={user.imageUrl}
      alt={'Photo of ' + user.name}
      className="avatar"
      style={{
        width: user.imageSize,
        height: user.imageSize
      }}
    />
  );
}
```

```css styles.css
.avatar {
  border-radius: 50%;
}
```

</Sandpack>

<DeepDive>

#### How to apply multiple CSS classes conditionally? {/*how-to-apply-multiple-css-classes-conditionally*/}

To apply CSS classes conditionally, you need to produce the `className` string yourself using JavaScript.

For example, `className={'row ' + (isSelected ? 'selected': '')}` will produce either `className="row"` or `className="row selected"` depending on whether `isSelected` is `true`.

To make this more readable, you can use a tiny helper library like [`classnames`:](https://github.com/JedWatson/classnames)

```js
import cn from 'classnames';

function Row({ isSelected }) {
  return (
    <div className={cn('row', isSelected && 'selected')}>
      ...
    </div>
  );
}
```

It is especially convenient if you have multiple conditional classes:

```js
import cn from 'classnames';

function Row({ isSelected, size }) {
  return (
    <div className={cn('row', {
      selected: isSelected,
      large: size === 'large',
      small: size === 'small',
    })}>
      ...
    </div>
  );
}
```

</DeepDive>

---

### Manipulating a DOM node with a ref {/*manipulating-a-dom-node-with-a-ref*/}

Sometimes, you'll need to get the browser DOM node associated with a tag in JSX. For example, if you want to focus an `<input>` when a button is clicked, you need to call [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) on the browser `<input>` DOM node.

To obtain the browser DOM node for a tag, [declare a ref](/apis/react/useRef) and pass it as the `ref` attribute to that tag:

```js {7}
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);
  // ...
  return (
    <input ref={inputRef} />
    // ...
```

React will put the DOM node into `inputRef.current` after it's been rendered to the screen.

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

Read more about [manipulating DOM with refs](/learn/manipulating-the-dom-with-refs) and [check out more examples.](/apis/react/useRef#examples-dom)

For more advanced use cases, the `ref` attribute also accepts a [callback function.](#ref-callback)

---

### Dangerously setting the inner HTML {/*dangerously-setting-the-inner-html*/}

You can pass a raw HTML string to an element like so:

```js
const markup = { __html: '<p>some raw html</p>' };
return <div dangerouslySetInnerHTML={markup} />;
```

**This is dangerous. As with the underlying DOM [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) property, you must exercise extreme caution! Unless the markup is coming from a completely trusted source, it is trivial to introduce an [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) vulnerability this way.**

For example, if you use a Markdown library that converts Markdown to HTML, you trust that its parser doesn't contain bugs, and the user only sees their own input, you can display the resulting HTML like this:

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

```js MarkdownPreview.js active
import { Remarkable } from 'remarkable';

const md = new Remarkable();

function renderMarkdownToHTML(markdown) {
  // This is ONLY safe because the output HTML
  // is shown to the same user, and because you
  // trust this Markdown parser to not have bugs.
  const renderedHTML = md.render(markdown);
  return {__html: renderedHTML};
}

export default function MarkdownPreview({ markdown }) {
  const markup = renderMarkdownToHTML(markdown);
  return <div dangerouslySetInnerHTML={markup} />;
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

To see why rendering arbitrary HTML is dangerous, replace the code above with this:

```js {1-4,7,8}
const post = {
  // Imagine this content is stored in the database.
  content: `<img src="" onerror='alert("you were hacked")'>`
};

export default function MarkdownPreview() {
  // 🔴 SECURITY HOLE: passing untrusted input to dangerouslySetInnerHTML
  const markup = { __html: post.content };
  return <div dangerouslySetInnerHTML={markup} />;
}
```

The code embedded in the HTML will run. A hacker could use this security hole to steal user information or to perform actions on their behalf. **Only use `dangerouslySetInnerHTML` with trusted and sanitized data.**

---

### Handling mouse events {/*handling-mouse-events*/}

This example shows some common [mouse events](#mouseevent-handler) and when they fire.

<Sandpack>

```js
export default function MouseExample() {
  return (
    <div
      onMouseEnter={e => console.log('onMouseEnter (parent)')}
      onMouseLeave={e => console.log('onMouseLeave (parent)')}
    >
      <button
        onClick={e => console.log('onClick (first button)')}
        onMouseDown={e => console.log('onMouseDown (first button)')}
        onMouseEnter={e => console.log('onMouseEnter (first button)')}
        onMouseLeave={e => console.log('onMouseLeave (first button)')}
        onMouseOver={e => console.log('onMouseOver (first button)')}
        onMouseUp={e => console.log('onMouseUp (first button)')}
      >
        First button
      </button>
      <button
        onClick={e => console.log('onClick (second button)')}
        onMouseDown={e => console.log('onMouseDown (second button)')}
        onMouseEnter={e => console.log('onMouseEnter (second button)')}
        onMouseLeave={e => console.log('onMouseLeave (second button)')}
        onMouseOver={e => console.log('onMouseOver (second button)')}
        onMouseUp={e => console.log('onMouseUp (second button)')}
      >
        Second button
      </button>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Handling pointer events {/*handling-pointer-events*/}

This example shows some common [pointer events](#pointerevent-handler) and when they fire.

<Sandpack>

```js
export default function PointerExample() {
  return (
    <div
      onPointerEnter={e => console.log('onPointerEnter (parent)')}
      onPointerLeave={e => console.log('onPointerLeave (parent)')}
      style={{ padding: 20, backgroundColor: '#ddd' }}
    >
      <div
        onPointerDown={e => console.log('onPointerDown (first child)')}
        onPointerEnter={e => console.log('onPointerEnter (first child)')}
        onPointerLeave={e => console.log('onPointerLeave (first child)')}
        onPointerMove={e => console.log('onPointerMove (first child)')}
        onPointerUp={e => console.log('onPointerUp (first child)')}
        style={{ padding: 20, backgroundColor: 'lightyellow' }}
      >
        First child
      </div>
      <div
        onPointerDown={e => console.log('onPointerDown (second child)')}
        onPointerEnter={e => console.log('onPointerEnter (second child)')}
        onPointerLeave={e => console.log('onPointerLeave (second child)')}
        onPointerMove={e => console.log('onPointerMove (second child)')}
        onPointerUp={e => console.log('onPointerUp (second child)')}
        style={{ padding: 20, backgroundColor: 'lightblue' }}
      >
        Second child
      </div>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Handling focus events {/*handling-focus-events*/}

In React, [focus events](#focusevent-handler) bubble. You can use the `currentTarget` and `relatedTarget` to differentiate if the focusing or blurring events originated from outside of the parent element. The example shows how to detect focusing a child, focusing the parent element, and how to detect focus entering or leaving the whole subtree.

<Sandpack>

```js
export default function FocusExample() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused parent');
        } else {
          console.log('focused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus entered parent');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused parent');
        } else {
          console.log('unfocused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus left parent');
        }
      }}
    >
      <label>
        First name:
        <input name="firstName" />
      </label>
      <label>
        Last name:
        <input name="lastName" />
      </label>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Handling keyboard events {/*handling-keyboard-events*/}

This example shows some common [keyboard events](#keyboardevent-handler) and when they fire.

<Sandpack>

```js
export default function KeyboardExample() {
  return (
    <label
      onKeyDown={e => console.log('onKeyDown:', e.key, e.code)}
      onKeyUp={e => console.log('onKeyUp:', e.key, e.code)}
    >
      First name:
      <input name="firstName" />
    </label>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

## Reference {/*reference*/}

### Common components (e.g. `<div>`) {/*common*/}

#### Props {/*common-props*/}

These special React props are supported for all built-in components:

* `children`: A React node (an element, a string, a number, [a portal,](/apis/react-dom/createPortal) an empty node like `null`, `undefined` and booleans, or an array of other React nodes). Specifies the content inside the component. When you use JSX, you will usually specify the `children` prop implicitly by nesting tags like `<div><span /></div>`.

* `dangerouslySetInnerHTML`: An object of the form `{ __html: '<p>some html</p>' }` with a raw HTML string inside. Overrides the [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) property of the DOM node and displays the passed HTML inside. This should be used with extreme caution! If the HTML inside isn't trusted (for example, if it's based on user data), you risk introducing an [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) vulnerability. [Read more about using `dangerouslySetInnerHTML`.](#dangerously-setting-the-inner-html)

* `ref`: A ref object from [`useRef`](/apis/react/useRef) or [`createRef`](/apis/react/createRef), or a [`ref` callback function,](#ref-callback) or a string for [legacy refs.](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs) Your ref will be filled with the DOM element for this node. [Read more about manipulating the DOM with refs.](#manipulating-a-dom-node-with-a-ref)

* `suppressContentEditableWarning`: A boolean. If `true`, suppresses the warning that React shows for elements that both have `children` and `contentEditable={true}` (which normally do not work together). Use this if you're building a text input library that manages the `contentEditable` content manually.

* `suppressHydrationWarning`: A boolean. If you use [server rendering,](/apis/react-dom/server) normally there is a warning when the server and the client render different content. In some rare cases (like timestamps), it is very hard or impossible to guarantee an exact match. If you set `suppressHydrationWarning` to `true`, React will not warn you about mismatches in the attributes and the content of that element. It only works one level deep, and is intended to be used as an escape hatch. Don't overuse it. [Read more about suppressing hydration errors.](/apis/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)

* `style`: An object with CSS styles, for example `{ fontWeight: 'bold', margin: 20 }`. Similarly to the DOM [`style`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) property, the CSS property names need to be written as `camelCase`, for example `fontWeight` instead of `font-weight`. You can pass strings or numbers as values. If you pass a number, like `width: 100`, React will automatically append `px` ("pixels") to the value unless it's a [unitless property.](https://github.com/facebook/react/blob/81d4ee9ca5c405dce62f64e61506b8e155f38d8d/packages/react-dom-bindings/src/shared/CSSProperty.js#L8-L57) We recommend using `style` only for dynamic styles where you don't know the style values ahead of time. In other cases, applying plain CSS classes with `className` is more efficient. [Read more about applying CSS with `className` and `styles`.](#applying-css-styles)

These standard DOM props are also supported for all built-in components:

* [`accessKey`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey): A string. Specifies a keyboard shortcut for the element. [Not generally recommended.](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey#accessibility_concerns)
* [`aria-*`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes): ARIA attributes let you specify the accessibility tree information for this element. See [ARIA attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes) for a complete reference. In React, all ARIA attribute names are exactly the same as in HTML.
* [`autoCapitalize`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize): A string. Specifies whether and how the user input should be capitalized.
* [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className): A string. Specifies the element's CSS class name. [Read more about applying CSS styles.](#applying-css-styles)
* [`contentEditable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable): A boolean. If `true`, the browser lets the user edit the rendered element directly. This is used to implement rich text input libraries like [Lexical.](https://lexical.dev/) React warns if you try to pass React children to an element with `contentEditable={true}` because React will not be able to update its content after user edits.
* [`data-*`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*): Data attributes let you attach some string data to the element, for example `data-fruit="banana"`. In React, they are not commonly used because you would usually read data from props or state instead.
* [`dir`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir): Either `'ltr'` or `'rtl'`. Specifies the text direction of the element.
* [`draggable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable): A boolean. Specifies whether the element is draggable. Part of [HTML Drag and Drop API.](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
* [`enterKeyHint`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/enterKeyHint): A string. Specifies which action to present for the enter key on virtual keyboards.
* [`htmlFor`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor): A string. For [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) and [`<output>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output), lets you [associate the label with some control.](/apis/react-dom/components/input#providing-a-label-for-an-input) Same as [`for` HTML attribute.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/for) React uses the standard DOM property names (`htmlFor`) instead of HTML attribute names.
* [`hidden`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden): A boolean or a string. Specifies whether the element should be hidden.
* [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id): A string. Specifies a unique identifier for this element, which can be used to find it later or connect it with other elements. Generate it with [`useId`](/apis/react/useId) to avoid clashes between multiple instances of the same component.
* [`is`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is): A string. If specified, the component will behave like a [custom element.](/apis/react-dom/components#custom-html-elements)
* [`inputMode`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode): A string. Specifies what kind of keyboard to display (for example, text, number or telephone).
* [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop): A string. Specifies which property the element represents for structured data crawlers.
* [`lang`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang): A string. Specifies the language of the element.
* [`onAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event): An [`AnimationEvent` handler](/apis/react-dom/components/common#animationevent-handler) function. Fires when a CSS animation completes.
* `onAnimationEndCapture`: A version of `onAnimationEnd` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event): An [`AnimationEvent` handler](/apis/react-dom/components/common#animationevent-handler) function. Fires when an iteration of a CSS animation ends, and another one begins.
* `onAnimationIterationCapture`: A version of `onAnimationIteration` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event): An [`AnimationEvent` handler](/apis/react-dom/components/common#animationevent-handler) function. Fires when a CSS animation starts.
* `onAnimationStartCapture`: `onAnimationStart`, but fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onAuxClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/auxclick_event): A [`MouseEvent` handler](/apis/react-dom/components/common#mouseevent-handler) function. Fires when a non-primary pointer button was clicked.
* `onAuxClickCapture`: A version of `onAuxClick` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* `onBeforeInput`: An [`InputEvent` handler](/apis/react-dom/components/common#inputevent-handler) function. Fires before the value of an editable element is modified. React does *not* yet use the native [`beforeinput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforeinput_event) event, and instead attempts to polyfill it using other events.
* `onBeforeInputCapture`: A version of `onBeforeInput` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* `onBlur`: A [`FocusEvent` handler](/apis/react-dom/components/common#focusevent-handler) function. Fires when an element lost focus. Unlike the built-in browser [`blur`](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event) event, in React the `onBlur` event bubbles.
* `onBlurCapture`: A version of `onBlur` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event): A [`MouseEvent` handler](/apis/react-dom/components/common#mouseevent-handler) function. Fires when the primary button was clicked on the pointing device.
* `onClickCapture`: A version of `onClick` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event): An [`InputEvent` handler](/apis/react-dom/components/common#inputevent-handler) function. Fires when an [input method editor](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) starts a new composition session.
* `onCompositionStartCapture`: A version of `onCompositionStart` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event): An [`InputEvent` handler](/apis/react-dom/components/common#inputevent-handler) function. Fires when an [input method editor](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) completes or cancels a composition session.
* `onCompositionEndCapture`: A version of `onCompositionEnd` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onCompositionUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event): An [`InputEvent` handler](/apis/react-dom/components/common#inputevent-handler) function. Fires when an [input method editor](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) receives a new character.
* `onCompositionUpdateCapture`: A version of `onCompositionUpdate` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onContextMenu`](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event): A [`MouseEvent` handler](/apis/react-dom/components/common#mouseevent-handler) function. Fires when the user tries to open a context menu.
* `onContextMenuCapture`: A version of `onContextMenu` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onCopy`](https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event): A [`ClipboardEvent` handler](/apis/react-dom/components/common#clipboardevent-handler) function. Fires when the user tries to copy something into the clipboard.
* `onCopyCapture`: A version of `onCopy` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onCut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/cut_event): A [`ClipboardEvent` handler](/apis/react-dom/components/common#clipboardevent-handler) function. Fires when the user tries to cut something into the clipboard.
* `onCutCapture`: A version of `onCut` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* `onDoubleClick`: A [`MouseEvent` handler](/apis/react-dom/components/common#mouseevent-handler) function. Fires when the user clicks twice. Corresponds to the browser [`dblclick` event.](https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event)
* `onDoubleClickCapture`: A version of `onDoubleClick` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onDrag`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drag_event): A [`DragEvent` handler](/apis/react-dom/components/common#dragevent-handler) function. Fires while the user is dragging something. 
* `onDragCapture`: A version of `onDrag` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onDragEnd`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragend_event): A [`DragEvent` handler](/apis/react-dom/components/common#dragevent-handler) function. Fires when the user stops dragging something. 
* `onDragEndCapture`: A version of `onDragEnd` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onDragEnter`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragenter_event): A [`DragEvent` handler](/apis/react-dom/components/common#dragevent-handler) function. Fires when the dragged content enters a valid drop target. 
* `onDragEnterCapture`: A version of `onDragEnter` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onDragOver`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragover_event): A [`DragEvent` handler](/apis/react-dom/components/common#dragevent-handler) function. Fires on a valid drop target while the dragged content is dragged over it. You must call `e.preventDefault()` here to allow dropping.
* `onDragOverCapture`: A version of `onDragOver` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onDragStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragstart_event): A [`DragEvent` handler](/apis/react-dom/components/common#dragevent-handler) function. Fires when the user starts dragging an element.
* `onDragStartCapture`: A version of `onDragStart` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onDrop`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event): A [`DragEvent` handler](/apis/react-dom/components/common#dragevent-handler) function. Fires when something is dropped on a valid drop target.
* `onDropCapture`: A version of `onDrop` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* `onFocus`: A [`FocusEvent` handler](/apis/react-dom/components/common#focusevent-handler) function. Fires when an element lost focus. Unlike the built-in browser [`focus`](https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event) event, in React the `onFocus` event bubbles.
* `onFocusCapture`: A version of `onFocus` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onGotPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/gotpointercapture_event): A [`PointerEvent` handler](/apis/react-dom/components/common#pointerevent-handler) function. Fires when an element programmatically captures a pointer.
* `onGotPointerCaptureCapture`: A version of `onGotPointerCapture` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onKeyDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event): A [`KeyboardEvent` handler](/apis/react-dom/components/common#pointerevent-handler) function. Fires when a key is pressed.
* `onKeyDownCapture`: A version of `onKeyDown` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onKeyPress`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event): A [`KeyboardEvent` handler](/apis/react-dom/components/common#pointerevent-handler) function. Deprecated. Use `onKeyDown` or `onBeforeInput` instead.
* `onKeyPressCapture`: A version of `onKeyPress` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onKeyUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event): A [`KeyboardEvent` handler](/apis/react-dom/components/common#pointerevent-handler) function. Fires when a key is released.
* `onKeyUpCapture`: A version of `onKeyUp` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onLostPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/lostpointercapture_event): A [`PointerEvent` handler](/apis/react-dom/components/common#pointerevent-handler) function. Fires when an element stops capturing a pointer.
* `onLostPointerCaptureCapture`: A version of `onLostPointerCapture` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onMouseDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event): A [`MouseEvent` handler](/apis/react-dom/components/common#mouseevent-handler) function. Fires when the pointer is pressed down.
* `onMouseDownCapture`: A version of `onMouseDown` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onMouseEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event): A [`MouseEvent` handler](/apis/react-dom/components/common#mouseevent-handler) function. Fires when the pointer moves inside an element. Does not have a capture phase. Instead, `onMouseLeave` and `onMouseEnter` propagate from the element being left to the one being entered.
* [`onMouseLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event): A [`MouseEvent` handler](/apis/react-dom/components/common#mouseevent-handler) function. Fires when the pointer moves outside an element. Does not have a capture phase. Instead, `onMouseLeave` and `onMouseEnter` propagate from the element being left to the one being entered.
* [`onMouseMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event): A [`MouseEvent` handler](/apis/react-dom/components/common#mouseevent-handler) function. Fires when the pointer changes coordinates.
* `onMouseMoveCapture`: A version of `onMouseMove` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onMouseOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseout_event): A [`MouseEvent` handler](/apis/react-dom/components/common#mouseevent-handler) function. Fires when the pointer moves outside an element, or if it moves into a child element.
* `onMouseOutCapture`: A version of `onMouseOut` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onMouseUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event): A [`MouseEvent` handler](/apis/react-dom/components/common#mouseevent-handler) function. Fires when the pointer is released.
* `onMouseUpCapture`: A version of `onMouseUp` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onPointerCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointercancel_event): A [`PointerEvent` handler](/apis/react-dom/components/common#pointerevent-handler) function. Fires when the browser cancels a pointer interaction.
* `onPointerCancelCapture`: A version of `onPointerCancel` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onPointerDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerdown_event): A [`PointerEvent` handler](/apis/react-dom/components/common#pointerevent-handler) function. Fires when a pointer becomes active.
* `onPointerDownCapture`: A version of `onPointerDown` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onPointerEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerenter_event): A [`PointerEvent` handler](/apis/react-dom/components/common#pointerevent-handler) function. Fires when a pointer moves inside an element. Does not have a capture phase. Instead, `onPointerLeave` and `onPointerEnter` propagate from the element being left to the one being entered.
* [`onPointerLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerleave_event): A [`PointerEvent` handler](/apis/react-dom/components/common#pointerevent-handler) function. Fires when a pointer moves outside an element. Does not have a capture phase. Instead, `onPointerLeave` and `onPointerEnter` propagate from the element being left to the one being entered.
* [`onPointerMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event): A [`PointerEvent` handler](/apis/react-dom/components/common#pointerevent-handler) function. Fires when a pointer changes coordinates.
* `onPointerMoveCapture`: A version of `onPointerMove` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onPointerOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event): A [`PointerEvent` handler](/apis/react-dom/components/common#pointerevent-handler) function. Fires when a pointer moves outside an element, if the pointer interaction is cancelled, and [a few other reasons.](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event)
* `onPointerOutCapture`: A version of `onPointerOut` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onPointerUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerup_event): A [`PointerEvent` handler](/apis/react-dom/components/common#pointerevent-handler) function. Fires when a pointer is no longer active.
* `onPointerUpCapture`: A version of `onPointerUp` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onPaste`](https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event): A [`ClipboardEvent` handler](/apis/react-dom/components/common#clipboardevent-handler) function. Fires when the user tries to paste something from the clipboard.
* `onPasteCapture`: A version of `onPaste` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onScroll`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event): An [`Event` handler](/apis/react-dom/components/common#wheelevent-handler) function. Fires when an element has been scrolled. This event does not bubble.
* `onScrollCapture`: A version of `onScroll` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): An [`Event` handler](/apis/react-dom/components/common#event-handler) function. Fires after the selection inside an editable element like an input changes. React extends the `onSelect` event to work for `contentEditable={true}` elements as well. In addition, React extends it to fire for empty selection and on edits (which may affect the selection).
* `onSelectCapture`: A version of `onSelect` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onTouchCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchcancel_event): A [`TouchEvent` handler](/apis/react-dom/components/common#touchevent-handler) function. Fires when the browser cancels a touch interaction.
* `onTouchCancelCapture`: A version of `onTouchCancel` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onTouchEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event): A [`TouchEvent` handler](/apis/react-dom/components/common#touchevent-handler) function. Fires when one or more touch points are removed.
* `onTouchEndCapture`: A version of `onTouchEnd` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onTouchMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event): A [`TouchEvent` handler](/apis/react-dom/components/common#touchevent-handler) function. Fires one or more touch points are moved.
* `onTouchMoveCapture`: A version of `onTouchMove` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onTouchStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event): A [`TouchEvent` handler](/apis/react-dom/components/common#touchevent-handler) function. Fires when one or more touch points are placed.
* `onTouchStartCapture`: A version of `onTouchStart` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event): A [`TransitionEvent` handler](/apis/react-dom/components/common#transitionevent-handler) function. Fires when a CSS transition completes.
* `onTransitionEndCapture`: A version of `onTransitionEnd` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onWheel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event): A [`WheelEvent` handler](/apis/react-dom/components/common#wheelevent-handler) function. Fires when the user rotates a wheel button.
* `onWheelCapture`: A version of `onWheel` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): A string. Specifies the element role explicitly for assistive technologies.
nt.
* [`slot`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): A string. Specifies the slot name when using shadow DOM. In React, an equivalent pattern is typically achieved by passing JSX as props, for example `<Layout left={<Sidebar />} right={<Content />} />`.
* [`spellCheck`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck): A boolean or null. If explicitly set to `true` or `false`, enables or disables spellchecking.
* [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex): A number. Overrides the default Tab button behavior. [Avoid using values other than `-1` and `0`.](https://www.tpgi.com/using-the-tabindex-attribute/)
* [`title`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title): A string. Specifies the tooltip text for the element.
* [`translate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/translate): Either `'yes'` or `'no'`. Passing `'no'` excludes the element content from being translated.

You can also pass custom attributes as props, for example `mycustomprop="someValue".` This can be useful when integrating with third-party libraries. The custom attribute name must be lowercase and must not start with `on`. The value will be converted to a string. If you pass `null` or `undefined`, the custom attribute will be removed.

#### Caveats {/*common-caveats*/}

- You cannot pass both `children` and `dangerouslySetInnerHTML` at the same time.

---

### `ref` callback function {/*ref-callback*/}

Instead of a ref object (like the one returned by [`useRef`](/apis/react/useRef#manipulating-the-dom-with-a-ref)), you may pass a function to the `ref` attribute.

```js
<div ref={(node) => console.log(node)} />
```

[See an example of using the `ref` callback.](/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback)

When the `<div>` DOM node is added to the screen, React will call your `ref` callback with the DOM `node` as the argument. When that `<div>` DOM node is removed, React will call your `ref` callback with `null`.

**React will also call your `ref` callback whenever you pass a *different* `ref` callback.** In the above example, `(node) => { ... }` is a different function on every render. This is why, when your component re-renders, the *previous* function will be called with `null` as the argument, and the *next* function will be called with the DOM node.

#### Parameters {/*ref-callback-parameters*/}

* `node`: A DOM node or `null`. React will pass you the DOM node when the ref gets attached, and `null` when the ref gets detached. Unless you pass the same function reference for the `ref` callback on every render, the callback will get temporarily detached and re-attached during ever re-render of the component.

#### Returns {/*returns*/}

Do not return anything from the `ref` callback.

---

### `AnimationEvent` handler function {/*animationevent-handler*/}

---

### `ClipboardEvent` handler function {/*clipboadevent-handler*/}

---

### `CompositionEvent` handler function {/*compositionevent-handler*/}

---

### `DragEvent` handler function {/*dragevent-handler*/}

---

### `FocusEvent` handler function {/*focusevent-handler*/}

[See an example.](#handling-focus-events)

---

### `Event` handler function {/*event-handler*/}

---

### `InputEvent` handler function {/*inputevent-handler*/}

---

### `KeyboardEvent` handler function {/*keyboardevent-handler*/}

[See an example.](#handling-keyboard-events)

---

### `MouseEvent` handler function {/*mouseevent-handler*/}

[See an example.](#handling-mouse-events)

---

### `PointerEvent` handler function {/*pointerevent-handler*/}

---

### `TouchEvent` handler function {/*touchevent-handler*/}

---

### `TransitionEvent` handler function {/*transitionevent-handler*/}

---

### `UIEvent` handler function {/*uievent-handler*/}

---

### `WheelEvent` handler function {/*wheel-handler*/}

