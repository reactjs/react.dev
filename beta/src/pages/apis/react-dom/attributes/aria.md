---
title: aria-*
---

<Intro>

Accessible Rich Internet Applications ([ARIA attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)) make web content and web applications more accessible for differently abled individuals.

In React, the `aria-*` attributes are an exception to the rule that attributes must be camelCased. These attributes should be lower cased with a hyphen.
</Intro>

- [Usage](#usage)
  - [Using the `aria-*` attributes](#using-the-aria-attributes)

## Usage {/*usage*/}

### Using the `aria-*` attributes {/*using-the-aria-attributes*/}

In this example, a `button` with the label **Send** is rendered. [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) is set to **send message**, which becomes the alt text for the button.

Also, [`aria-pressed`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-pressed) is set to `false`, which means that the button is not pressed. `aria-pressed` indicates the current "pressed" state of a `button`.

<Sandpack>

``` js

export default function Button() {

  return (
      <button aria-label="send message" aria-pressed="false" >
        Send
      </button>
  );
}

```
</Sandpack>
