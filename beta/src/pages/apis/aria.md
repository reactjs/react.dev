---
title: aria-*
---

<Intro>

Accessible Rich Internet Applications in short-- [ARIA attributes](#https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) facilitate the access of web content to diffrently abled individuals.

In React the `aria-*` attributes are an exception to the rule that attributes must be camelCased. These attributes should be lower cased.
</Intro>

- [Usage](#usage)
  - [Using `aria-*` attributes](#using-aria-attributes)

## Usage {/*usage*/}

### Using `aria-*` attributes {/*using-aria-attributes*/}

Lets see an examples of using `aria-*` attributes while rendering a component in React.

In the following example, a button with the label **Send** is being rendered. For this button the accesiblity lable [`aria-lable`](#https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) is being set to **send message**, a text that becomes the alternate text in an accessblity scenario.

Also, [`aria-pressed`](#https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-pressed) is being set to `false`, which means the button is not pressed. If the button is presssed then the value is set to `true`.

<Sandpack>

``` js

export default function Button() {

  return (
    <>
      <button aria-lable="send message" aria-pressesd="false" >
        Send
      </button>
    </>
  );
}

```
</Sandpack>
