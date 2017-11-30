---
id: faq-browser-events
title: Dispatching Browser Events
permalink: docs/faq-browser-events.html
layout: docs
category: FAQ
---

### How do I programatically dispatch browser events?

Using React does not change the way you can dispatch browser events. You need to use [browser APIs](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent) in order to dispatch built-in events like `click` or `submit`.

```js{8}
function dispatchMouseEvent(eventType, target) {
  const event = new MouseEvent(eventType, {
    bubbles: true,
    cancelable: true,
    view: window
  });

  target.dispatchEvent(event);
}

dispatchMouseEvent('click', document.querySelector('#form .submit'))
```

>**Note:**
>
>Dispatching native browser events is possible, but will not trigger the default browser actions. As an example, when dispatching a `keydown` event on an input, all the event listeners will be called, but the value in the input will not change, since the dispatched event is not `trusted`.
>
>There is one exception though, with the `click` events, which will always trigger the default actions, even if the event is not `trusted`

See [the definition of trusted events](https://w3c.github.io/uievents/#trusted-events).

### Do I have to dispatch events that bubble?

Since React attaches event listeners only on the `documentElement`, you need to make sure you dispatch events configured with `bubbles: true` so they can bubble-up and reach the document root where React has its event listeners.

### Example: Dispatching a `click` event to submit a form

```jsx{3,8,23}
function dispatchMouseEvent(eventType, target) {
  const event = new MouseEvent(eventType, {
    bubbles: true,
    cancelable: true,
    view: window
  });

  target.dispatchEvent(event);
}

class ContactForm extends Component {
  constructor(props) {
    super(props);

    this.buttonRef = button => {
      this.buttonNode = button;
    };
  }

  componentDidMount() {
    setTimeout(() => {
      // click the "Send" button so the form gets submitted
      dispatchMouseEvent("click", this.buttonNode);
    }, 1000);
  }

  onSubmit(event) {
    console.log("Submitting contact form");
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <h1>Contact form</h1>
        <label>
          Your name: <input type="text" name="name" />
        </label>
        <label>
          Your email: <input type="email" name="email" />
        </label>
        <button ref={this.buttonRef} type="submit">
          Send
        </button>
      </form>
    );
  }
}
```