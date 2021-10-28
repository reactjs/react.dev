---
title: Reacting to Input with State
---

<Intro>

React uses a declarative model for manipulating UI. This means you describe the different states your component can be in according to different inputs rather than manipulating individual pieces of the UI in response to inputs. This is similar to how designers think about UI.

</Intro>

<YouWillLearn>

* How declarative UI programming differs from imperative UI programming
* How to enumerate the different visual states your component can be in
* How to trigger the changes between the different visual states from code

</YouWillLearn>

## How declarative UI compares to imperative

When you design UI interactions, you probably think about how the UI *changes* in response to user actions. Consider a form that lets the user submit some feedback:

* When you type something into a form, the "Submit" button **becomes enabled**.
* When you press "Submit", both form and the button **become disabled**, and a spinner **appears**.
* If the network request succeeds, the form **gets hidden**, and the "Thank you" message **appears**.
* If the network request fails, an error message **appears**, and the form **becomes enabled** again.

In **imperative programming**, the above corresponds directly to how you implement interaction. You have to write the exact instructions to manipulate the UI depending on what just happened. Another way to think of this: imagine riding next to someone in a car and telling them turn by turn where to go. They don't know where you want to go, they just follow your commands. (And if you get the directions wrong, you end up in the wrong place!) It's called *imperative* because you have to "command" each element, from the spinner to the button, telling the computer *how* to update the UI. 

<Illustration src="/images/docs/illustrations/i_imperative-ui-programming.png"  alt="In a car driven by an anxious-looking person representing JavaScript, a passenger orders the driver to execute a sequence of complicated turn by turn navigations." />

In this example of imperative UI programming, the form is built *without* React. It's made with the built-in browser [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model):

<Sandpack>

```js index.js active
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm();
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {  
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm() {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = Math.random() > 0.5;
      if (shouldError) {
        reject(new Error('Something went wrong'));
      } else {
        resolve();
      }
    }, 1500);
  });
}

let form = document.getElementById('form');
let textarea = document.getElementById('textarea');
let button = document.getElementById('button');
let loadingMessage = document.getElementById('loading');
let errorMessage = document.getElementById('error');
let successMessage = document.getElementById('success');
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <textarea id="textarea"></textarea>
  <br>
  <button id="button" disabled>Submit</button>
  <p id="loading" style="display: none">Loading...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">Thank you!</h1>
```

</Sandpack>

Manipulating the UI works well enough for isolated examples, but it gets exponentially more difficult to manage in more complex systems. Imagine updating a page full of different forms like this one. Adding a new UI element or a new interaction would require carefully checking all existing code to make sure you haven't introduced a bug (for example, forgetting to show or hide something).

React was built to solve this problem.

In React, you don't directly manipulate the UI--meaning you don't enable, disable, show, or hide components directly. Instead, you **declare what you want to show**, and React figures out how to update the UI. Think of getting into a taxi and telling the driver where you want to go instead of telling them exactly where to turn. It's the driver's job to get you there, and they might even know some shortcuts you hadn't considered!

<Illustration src="/images/docs/illustrations/i_declarative-ui-programming.png" alt="In a car driven by React, a passenger asks to be taken to a specific place on the map. React figures out how to do that." />

## Thinking about UI declaratively

You've seen how to implement a form imperatively above. To better understand how to think in React, you'll walk through reimplementing this UI in React below:

1. **Identify** your component's different visual states
2. **Determine** what triggers those state changes
3. **Represent** the state in memory using `useState`
4. **Remove** any non-essential state variables
5. **Connect** the event handlers to set the state

### Step 1: Identify your component's different visual states

In computer science, you may hear about a ["state machine"](https://en.wikipedia.org/wiki/Finite-state_machine) being in one of several “states”. If you work with a designer, you may have seen visual mockups for different states. Designers work with visual states all the time. React stands at the intersection of design and computer science, so both of these ideas are sources of inspiration.

First, you need to visualize all the different "states" of the UI the user might see:

* **Empty**: Form has a disabled "Submit" button.
* **Typing**: Form has an enabled "Submit" button.
* **Submitting**: Form is completely disabled. Spinner is shown.
* **Success**: "Thank you" message is shown instead of a form.
* **Error**: Same as Typing state, but with an extra error message.

Just like a designer, you'll want to "mock up" or create "mocks" for the different states before you add logic. For example, here is a mock for just the visual part of the form. This mock is controlled by a prop called `status` with a default value of `'empty'`:

<Sandpack>

```js
export default function FeedbackForm({
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>Thank you!</h1>
  }
  return (
    <form>
      <textarea />
      <br />
      <button>
        Submit
      </button>
    </form>
  )
}
```

</Sandpack>

You could call that prop anything you like, the naming is not important. Try editing `status = 'empty'` to `status = 'success'` to see the success message appear. Mocking lets you quickly iterate on the UI before you wire up any logic.

Here is a more fleshed out prototype of the same component, still "controlled" by the `status` prop:

<Sandpack>

```js
export default function FeedbackForm({
  // Try 'submitting', 'error', 'success':
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>Thank you!</h1>
  }
  return (
    <form>
      <textarea disabled={
        status === 'submitting'
      } />
      <br />
      <button disabled={
        status === 'empty' ||
        status === 'submitting'
      }>
        Submit
      </button>
      {status === 'error' &&
        <p className="Error">
          Something went wrong
        </p>
      }
    </form>
  );
}
```

```css
.Error { color: red; }
```

</Sandpack>

<DeepDive title="Displaying many visual states at once">

If a component has a lot of visual states, it can be convenient to show them all on one page:

<Sandpack>

```js App.js active
import FeedbackForm from './FeedbackForm.js';

let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>FeedbackForm ({status}):</h4>
          <FeedbackForm status={status} />
        </section>
      ))}
    </>
  );
}
```

```js FeedbackForm.js
export default function FeedbackForm({ status }) {
  if (status === 'success') {
    return <h1>Thank you!</h1>
  }
  return (
    <form>
      <textarea disabled={
        status === 'submitting'
      } />
      <br />
      <button disabled={
        status === 'empty' ||
        status === 'submitting'
      }>
        Submit
      </button>
      {status === 'error' &&
        <p className="Error">
          Something went wrong
        </p>
      }
    </form>
  );
}
```

```css
section { border-bottom: 1px solid #aaa; padding: 20px; }
h4 { color: #222; }
body { margin: 0; }
.Error { color: red; }
```

</Sandpack>

Pages like this are often known as "living styleguides" or "storybooks."

</DeepDive>

### Step 2: Determine what triggers those state changes

<IllustrationBlock title="Types of inputs">
  <Illustration caption="Human inputs" alt="A finger." src="/images/docs/illustrations/i_inputs1.png" />
  <Illustration caption="Computer inputs" alt="Ones and zeroes." src="/images/docs/illustrations/i_inputs2.png" />
</IllustrationBlock>

State changes can generally be triggered from two different sources:

* **Human** triggers like clicking a button, typing in a field, navigating a link.
* **Computer** triggers like a network response arriving, a timeout completing, an image loading.

**All triggers must set [state variables](/learn/state-a-components-memory#anatomy-of-usestate) to update the UI.** For the form you're developing, the following triggers will need to change state:

* **Changing the text input** (human) should switch it from the Empty state to the Typing state or back, depending on whether the text box is empty or not.
* **Clicking the Submit button** (human) should switch it to the Submitting state.
* **Successful network response** (computer) should switch it to the Success state.
* **Failed network response** (computer) should switch it to the Error state with the corresponding error message.

> Notice that human inputs often require [event handlers](/learn/responding-to-events)!

To help visualize this flow, try drawing each state on paper as a labeled circle, and each change between two states as an arrow. You can sketch out many flows this way and sort out bugs long before implementation.

<img alt="A flow chart showing states and transitions between them" src="/images/docs/sketches/s_flow-chart.jpg" />

### Step 3: Represent the state in memory using `useState`

Next you'll need to represent the visual states of your component in memory using `useState`. Simplicity is key: each piece of state is a "moving piece", and **you want as few "moving pieces" as possible**. More complexity leads to more bugs!

Start with the state that *absolutely must* be there. For example, you'll need to store the `message` for the input, and the `error` (if it exists) to store the last error:

```js
const [message, setMessage] = useState('');
const [error, setError] = useState(null);
```

Then, you need to store which of the visual states described earlier you want to display. There's usually more than a single way to represent that in memory, so you'll need to experiment with it.

If you struggle to think of the best way immediately, start by adding enough state that you're *definitely* sure that all the possible visual states are covered:

```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```

Your first idea likely won't be the best, but that's ok—refactoring state is a part of the process! 

### Step 4: Remove any non-essential state variables

You want to avoid duplication in the state content so you're only tracking what is essential. Spending a little time on refactoring your state structure will make your components easier to understand, reduce duplication, and avoid unintended meanings. Your goal is to **prevent the cases where the state in memory doesn't represent any valid UI that you'd want a user to see.** (Like an error message with a disabled input preventing the user from correcting the error!)

Here are some questions you can ask your state variables:

* **Does this state cause a paradox?** For example, `isTyping` and `isSubmitting` can't both be `true`. A paradox usually means that the state is not constrained enough. There are four possible combinations of two booleans, but only three correspond to valid states. To remove the "impossible" state, you can combine these into a `status` that must be one of three values: `'typing'`, `'submitting'`, or `'success'`. 
* **Is the same information available in another state variable already?** Another paradox: `isEmpty` and `isTyping` can't be `true` at the same time. By making them separate state variables, you're risking that you'll have a bug where they go out of sync. Fortunately, you can remove `isEmpty` and instead check `message.length === 0`.
* **Can you get the same information from the inverse of another state variable?** `isError` is not needed because you can check `error !== null` instead.

After this clean-up, you're left with 3 (down from 7!) *essential* state variables:

```js
const [message, setMessage] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', or 'success'
```

You know they're essential, because you can't remove any of them without breaking the functionality.

<DeepDive title="Eliminating “impossible” states with a reducer">

These three variables are a good enough representation of this form's state. However, if we're being pedantic, there are still some intermediate states that don't fully make sense (for example, an `error` only makes sense when `status` is `'typing'`). If you want to model the state even more strictly, consider [extracting it into a reducer](/learn/extracting-state-logic-into-a-reducer) which lets you unify multiple state variables and consolidate the related logic. More on that in the following pages!

</DeepDive>

### Step 5: Connect the event handlers to set the state

Lastly, create event handlers to set the state variables. Below is the final form in React, with all event handlers wired up:

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>Thank you!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm();
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setMessage(e.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={handleTextareaChange}
        disabled={status === 'submitting'}
      />
      <br />
      <button disabled={
        message.length === 0 ||
        status === 'submitting'
      }>
        Submit
      </button>
      {error !== null &&
        <p className="Error">
          {error.message}
        </p>
      }
    </form>
  );
}

function submitForm() {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = Math.random() > 0.5;
      if (shouldError) {
        reject(new Error('Something went wrong'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

Although this code is longer than the original imperative example, it is much less fragile. Expressing all interactions as state changes lets you later introduce new visual states without breaking existing ones. It also lets you change what should be displayed in each state without changing the logic of the interaction itself.

<Recap>

* Declarative programming means describing the UI for each visual state rather than micromanaging the UI (imperative).
* When developing a component:
  1. Identify all its visual states.
  2. Determine the human and computer triggers for state changes.
  3. Model the state with `useState`.
  4. Remove non-essential state to avoid bugs and paradoxes.
  5. Connect the event handlers to set the state.

</Recap>



<Challenges>

### Add and remove a CSS class

Make it so that clicking on the kitten *removes* the `background--active` class from the outer div, but *adds* the `kitten--active` class to the image. Clicking the background again should restore the original CSS classes.

Visually, you should expect that clicking on the image removes the yellow background and highlights the image border. Clicking outside the image highlights the background, but removes the image border highlight.

<Sandpack>

```js
export default function Kitten() {
  return (
    <div className="background background--active">
      <img
        className="kitten"
        alt="Kitten"
        src="https://placekitten.com/100"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #ffa;
}

.kitten {
  width: 100px;
  height: 100px;
  border-radius: 10px;
}

.kitten--active {
  border: 5px solid gold;
}
```

</Sandpack>

<Solution>

This component has two visual states: when the image is active, and when the image is inactive:

* When the image is active, the CSS classes are `background` and `kitten kitten--active`.
* When the image is inactive, the CSS classes are `background background--active` and `kitten`.

A single boolean state variable is enough to remember whether the image is active. The original task was to remove or add CSS classes. However, in React you need to *describe* what you want to see rather than *manipulate* the UI elements. So you need to calculate both CSS classes based on the current state. You also need to [stop the propagation](/learn/responding-to-events#stopping-propagation) so that clicking the image doesn't register as a click on the background.

Verify that this version works by clicking the image and then outside of it:

<Sandpack>

```js
import { useState } from 'react';

export default function Kitten() {
  const [isActive, setIsActive] = useState(false);

  let backgroundClassName = 'background';
  let kittenClassName = 'kitten';
  if (isActive) {
    kittenClassName += ' kitten--active';
  } else {
    backgroundClassName += ' background--active';
  }
  
  return (
    <div
      className={backgroundClassName}
      onClick={() => setIsActive(false)}
    >
      <img
        onClick={e => {
          e.stopPropagation();
          setIsActive(true);
        }}
        className={kittenClassName}
        alt="Kitten"
        src="https://placekitten.com/100"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #ffa;
}

.kitten {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.kitten--active {
  border: 5px solid gold;
}
```

</Sandpack>

Alternatively, you could return two separate chunks of JSX:

<Sandpack>

```js
import { useState } from 'react';

export default function Kitten() {
  const [isActive, setIsActive] = useState(false);
  if (isActive) {
    return (
      <div
        className="background"
        onClick={() => setIsActive(false)}
      >
        <img
          className="kitten kitten--active"
          alt="Kitten"
          src="https://placekitten.com/100"
        />
      </div>
    );
  }
  return (
    <div className="background background--active">
      <img
        className="kitten"
        alt="Kitten"
        src="https://placekitten.com/100"
        onClick={() => setIsActive(true)}
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #ffa;
}

.kitten {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.kitten--active {
  border: 5px solid gold;
}
```

</Sandpack>

Keep in mind that if two different JSX chunks describe the same tree, their nesting (first `<div>` → first `<img>`) has to line up. Otherwise, toggling `isActive` would recreate the whole tree below and [reset its state](/learn/preserving-and-resetting-state). This is why, if a similar JSX tree gets returned in both cases, it is better to write them as a single piece of JSX.

</Solution>

### Profile editor

Here is a small form implemented with plain JavaScript and DOM. Play with it to understand its behavior:

<Sandpack>

```js index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (button.textContent === 'Edit Profile') {
    button.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    button.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let profile = document.getElementById('profile');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name: 
    <b id="firstNameText">Bugs</b>
    <input
      id="firstNameInput"
      value="Bugs"
      style="display: none">
  </label>
  <label>
    Last name: 
    <b id="lastNameText">Bunny</b>
    <input
      id="lastNameInput"
      value="Bunny"
      style="display: none">
  </label>
  <button type="submit" id="button">Edit Profile</button>
  <p><i id="helloText">Hello, Bugs Bunny!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

This form switches between two modes: in the editing mode, you see the inputs, and in the viewing mode, you only see the result. The button label changes between "Edit" and "Save" depending on the mode you're in. When you change the inputs, the welcome message at the bottom updates in real time.

Your task is to reimplement it in React in the sandbox below. For your convenience, the markup was already converted to JSX, but you'll need to make it show and hide the inputs like the original does.

Make sure that it updates the text at the bottom, too!

<Sandpack>

```js
export default function EditProfile() {
  return (
    <form>
      <label>
        First name:{' '}
        <b>Bugs</b>
        <input />
      </label>
      <label>
        Last name:{' '}
        <b>Bunny</b>
        <input />
      </label>
      <button type="submit">
        Edit Profile
      </button>
      <p><i>Hello, Bugs Bunny!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution>

You will need two state variables to hold the input values: `firstName` and `lastName`. You're also going to need an `isEditing` state variable that holds whether to display the inputs or not. You should _not_ need a `fullName` variable because the full name can always be calculated from the `firstName` and the `lastName`.

Finally, you should use [conditional rendering](/learn/conditional-rendering) to show or hide the inputs depending on `isEditing`.

<Sandpack>

```js
import { useState } from 'react';

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Bugs');
  const [lastName, setLastName] = useState('Bunny');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsEditing(!isEditing);
    }}>
      <label>
        First name:{' '}
        {isEditing ? (
          <input
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value)
            }}
          />
        ) : (
          <b>{firstName}</b>
        )}
      </label>
      <label>
        Last name:{' '}
        {isEditing ? (
          <input
            value={lastName}
            onChange={e => {
              setLastName(e.target.value)
            }}
          />
        ) : (
          <b>{lastName}</b>
        )}
      </label>
      <button type="submit">
        {isEditing ? 'Save' : 'Edit'} Profile
      </button>
      <p><i>Hello, {firstName} {lastName}!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

Compare this solution to the original imperative code. How are they different?

</Solution>

### Refactor the imperative solution without React

Here is the original sandbox from the previous challenge, written imperatively without React:

<Sandpack>

```js index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (button.textContent === 'Edit Profile') {
    button.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    button.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let profile = document.getElementById('profile');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name: 
    <b id="firstNameText">Bugs</b>
    <input
      id="firstNameInput"
      value="Bugs"
      style="display: none">
  </label>
  <label>
    Last name: 
    <b id="lastNameText">Bunny</b>
    <input
      id="lastNameInput"
      value="Bunny"
      style="display: none">
  </label>
  <button type="submit" id="button">Edit Profile</button>
  <p><i id="helloText">Hello, Bugs Bunny!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Imagine React didn't exist. Can you refactor this code in a way that makes the logic less fragile and more similar to the React version? What would it look like if the state was explicit, like in React?

If you're struggling to think where to start, the stub below already has most of the structure in place. If you start here, fill in the missing logic in the `updateDOM` function. (Refer to the original code where needed.)

<Sandpack>

```js index.js active
let firstName = 'Bugs';
let lastName = 'Bunny';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    button.textContent = 'Save Profile';
    // TODO: show inputs, hide content
  } else {
    button.textContent = 'Edit Profile';
    // TODO: hide inputs, show content
  }
  // TODO: update text labels
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let profile = document.getElementById('profile');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name: 
    <b id="firstNameText">Bugs</b>
    <input
      id="firstNameInput"
      value="Bugs"
      style="display: none">
  </label>
  <label>
    Last name: 
    <b id="lastNameText">Bunny</b>
    <input
      id="lastNameInput"
      value="Bunny"
      style="display: none">
  </label>
  <button type="submit" id="button">Edit Profile</button>
  <p><i id="helloText">Hello, Bugs Bunny!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

<Solution>

The missing logic included toggling the display of inputs and content, and updating the labels:

<Sandpack>

```js index.js active
let firstName = 'Bugs';
let lastName = 'Bunny';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    button.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    button.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    'Hello ' +
    firstName + ' ' +
    lastName + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let profile = document.getElementById('profile');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name: 
    <b id="firstNameText">Bugs</b>
    <input
      id="firstNameInput"
      value="Bugs"
      style="display: none">
  </label>
  <label>
    Last name: 
    <b id="lastNameText">Bunny</b>
    <input
      id="lastNameInput"
      value="Bunny"
      style="display: none">
  </label>
  <button type="submit" id="button">Edit Profile</button>
  <p><i id="helloText">Hello, Bugs Bunny!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

The `updateDOM` function you wrote shows what React does under the hood when you set the state. (However, React also avoids touching the DOM for properties that have not changed since the last time they were set.)

</Solution>

</Challenges>