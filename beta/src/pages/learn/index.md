---
title: Quick Start
---

<Intro>

Welcome to the React documentation! Here is an overview of what you can find on this site.

</Intro>

<YouWillLearn>

* [How to set up React](/learn/installation)
* [How to think about building user interfaces with React](/learn/thinking-in-react)
* [How to get something rendering on the screen](/learn/describing-the-ui)
* [How to make your user interface respond to interactions](/learn/adding-interactivity)
* [How to keep your logic maintainable as your app grows](/learn/managing-state)
* [How to step outside React when necessary](/learn/escape-hatches)

</YouWillLearn>

## Introduction {/*introduction*/}

This is a tiny React app. To get your first taste of React, **edit the code below** and make it display your name:

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default function App() {
  return (
    <div>
      <Greeting name="Divyesh" />
      <Greeting name="Sarah" />
      <Greeting name="Taylor" />
    </div>
  );
}
```

</Sandpack>

### What is React? {/*what-is-react*/}

React is a JavaScript library for building user interfaces.

React stands at the intersection of design and programming. **It lets you take a complex user interface, and break it down into nestable and reusable pieces called ["components"](/learn/your-first-component) that fit well together.** If you have a programming background, this might remind you of making a program out of functions. If you're a designer, this might remind you of composing a design out of layers. If you're new to both disciplines, that's okay! Many people get into them with React. Using React might also remind you of building a castle out of toy bricks. Sometimes, it's even fun.

React does not prescribe how you build your entire application. It helps you define and compose components, but stays out of your way in other questions. This means that you will either pick one of the ecosystem solutions for problems like routing, styling, and data fetching, or [use a framework](/learn/start-a-new-react-project#building-with-react-and-a-framework) that provides great defaults.

### What can you do with React? {/*what-can-you-do-with-react*/}

Quite a lot, really! People use React to create all kinds of user interfaces--from small controls like buttons and dropdowns to entire apps. **These docs will teach you to use React on the web.** However, most of what you'll learn here applies equally for [React Native](https://reactnative.dev/) which lets you build apps for Android, iOS, and even [Windows and macOS](https://microsoft.github.io/react-native-windows/).

If you're curious which products you use everyday are built with React, you can install the [React Developer Tools](/learn/react-developer-tools). Whenever you visit an app or a website built with React (like this one!), its icon will light up in the toolbar.

### React uses JavaScript {/*react-uses-javascript*/}

With React, you will describe your visual logic in JavaScript. This takes some practice. If you're learning JavaScript and React at the same time, you're not alone--but at times, it will be a little bit more challenging! On the upside, **much of learning React is really learning JavaScript,** which means you will take your learnings far beyond React.

Check your knowledge level with [this JavaScript overview](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript). It will take you between 30 minutes and an hour but you will feel more confident learning React. [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript) and [javascript.info](https://javascript.info/) are two great resources to use as a reference.

<DeepDive title="Installation (optional)">

If you're just starting to learn React, you don't need to install anything. Instead, we recommend to follow along using the interactive sandboxes that appear throughout this site. They look like this:

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
```

</Sandpack>

When you're ready to start a project, there are several options. You can write React code online and save your work in an environment like [CodeSandbox](https://react.new/). You can add React as a `<script>` tag to any HTML file to try it for a small part of your existing webpage. Or you can create a whole new React app, with or without a framework. **Use the [Installation](/learn/installation) page to pick what works best for you--but you can skip it for now.**

</DeepDive>

## Learn React {/*learn-react*/}

There are a few ways to get started:

- If you're **feeling impatient and learn by example,** head straight to **[Thinking in React](/learn/thinking-in-react)**. This tutorial doesn't explain the syntax in detail, but it will give you an idea of what it feels like to build user interfaces with React.
- If you're **familiar with the concepts and want to browse the available APIs**, check out **[the API reference](/reference)**.
- The rest of this documentation is organized in chapters that **introduce each concept step by step**--with many interactive examples, detailed explanations, and challenges to check your understanding. You don't have to read them sequentially, but each next page assumes you're familiar with concepts from the previous pages.

To save you time, we provide **a brief overview of each chapter** below.

### Chapter 1 overview: Describing the UI {/*chapter-1-overview-describing-the-ui*/}

React applications are built from isolated pieces of UI called ["components"](/learn/your-first-component). A React component is a JavaScript function that you can sprinkle with markup. Components can be as small as a button, or as large as an entire page. Here, a *parent* `Gallery` component renders three *child* `Profile` components:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
      className="avatar"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

The markup in the example above looks a lot like HTML. This syntax is called [JSX](/learn/writing-markup-with-jsx), and it is a bit stricter (for example, you have to close all the tags). Note that the CSS class is specified as `className` in JSX.

Just like you can pass some information to the browser `<img>` tag, you can also pass information to your own components like `<Profile>`. Such information is called [_props_](/learn/passing-props-to-a-component). Here, three `<Profile>`s receive different props:

<Sandpack>

```js
function Profile({ name, imageUrl }) {
  return (
    <img
      className="avatar"
      src={imageUrl}
      alt={name}
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile
        name="Lin Lanying"
        imageUrl="https://i.imgur.com/1bX5QH6.jpg"
      />
      <Profile
        name="Gregorio Y. Zara"
        imageUrl="https://i.imgur.com/7vQD0fPs.jpg"
      />
      <Profile
        name="Hedy Lamarr"
        imageUrl="https://i.imgur.com/yXOvdOSs.jpg"
      />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

You might wonder why `className="avatar"` uses quotes but `src={imageUrl}` uses curly braces. In JSX, curly braces are like a ["window into JavaScript"](/learn/javascript-in-jsx-with-curly-braces). They let you run a bit of JavaScript right in your markup! So `src={imageUrl}` reads the `imageUrl` prop declared on the first line and passed from the parent `Gallery` component.

In the above example, all the data was written directly in markup. However, you'll often want to keep it separately. Here, the data is kept in an array. In React, you use JavaScript functions like [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) to [render lists](/learn/rendering-lists) of things.

<Sandpack>

```js App.js
import { people } from './data.js';
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      {people.map(person => (
        <Profile
          key={person.id}
          name={person.name}
          imageId={person.imageId}
        />
      ))}
    </section>
  );
}
```

```js Profile.js
export default function Profile({ name, imageId }) {
  const imageUrl = (
    'https://i.imgur.com/' +
    imageId +
    's.jpg'
  );
  return (
    <img
      className="avatar"
      src={imageUrl}
      alt={name}
    />
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  imageId: 'lrWQx8l'
}];
```

```css
img { margin: 0 10px 10px 0; }
.avatar { border-radius: 50%; }
```

</Sandpack>

<LearnMore path="/learn/describing-the-ui">

Read **[Describing the UI](/learn/describing-the-ui)** to learn how to make things appear on the screen, including declaring components, importing them, writing JSX with the curly braces, and writing conditions and lists.

</LearnMore>

### Chapter 2 overview: Adding interactivity {/*chapter-2-overview-adding-interactivity*/}

Components often need to change what’s on the screen as a result of an interaction. Typing into the form should update the input field, clicking “next” on an image carousel should change which image is displayed, clicking “buy” puts a product in the shopping cart. Components need to “remember” things: the current input value, the current image, the shopping cart. In React, this kind of component-specific memory is called [*state*](/learn/state-a-components-memory).

You can add state to a component with a [`useState`](/reference/usestate) Hook. Hooks are special functions that let your components use React features (state is one of those features). The `useState` Hook lets you declare a state variable. It takes the initial state and returns a pair of values: the current state, and a state setter function that lets you update it.

This `Gallery` component needs to remember two things: the current image index (initially, `0`), and whether the user has toggled "Show details" (initially, `false`):

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

Notice how clicking the buttons updates the screen:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```

```js data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
 margin-top: 5px;
 font-weight: normal;
 font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

State can hold complex values, too. For example, if you're implementing a form, you can keep an object in state with different fields. The `...` syntax in the below example lets you [create new objects based on existing ones](/learn/updating-objects-in-state).

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

You can also hold arrays in state. This lets you add, remove, or change things in a list in response to user interactions. Depending on what you want to do, there are [different ways to make new arrays from existing ones](/learn/updating-arrays-in-state).

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setName('');
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/adding-interactivity">

Read **[Adding Interactivity](/learn/adding-interactivity)** to learn how to update the screen on interaction, including adding event handlers, declaring and updating state, and the different ways to update objects and arrays in state.

</LearnMore>

### Chapter 3 overview: Managing state {/*chapter-3-overview-managing-state*/}

You'll often face a choice of _what exactly_ to put into state. Should you use one state variable or many? An object or an array? How should you [structure your state](/learn/choosing-the-state-structure)? The most important principle is to **avoid redundant state**. If some information never changes, it shouldn't be in state. If some information is received from parent by props, it shouldn't be in state. And if you can compute something from other props or state, it shouldn't be in state either!

For example, this form has a **redundant** `fullName` state variable:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

You can remove it and simplify the code by calculating `fullName` while the component is rendering:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

This might seem like a small change, but many bugs in React apps are fixed this way!

Sometimes, you want the state of two components to always change together. To do it, remove state from both of them, move it to their closest common parent, and then pass it down to them via props. This is known as ["lifting state up"](/learn/sharing-state-between-components), and it's one of the most common things you will do writing React code. For example, in an accordion like below, only one panel should be active at a time. Instead of keeping the active state inside each individual panel, the parent component holds the state and specifies the props for its children.

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<LearnMore path="/learn/managing-state">

Read **[Managing State](/learn/managing-state)** to learn how to keep your components maintainable, including how to structure state well, how to share it between components, and how to pass it deep into the tree.

</LearnMore>

## Next steps {/*next-steps*/}

This page was fast-paced! If you've read this far, you have already seen 80% of React you will use on a daily basis.

Your next steps depend on what you'd like to do:

* Go to [Installation](/learn/installation) if you'd like to set up a React project locally.
* Read [Thinking in React](/learn/thinking-in-react) if you'd like to see what building a UI in React feels like in practice.
* Or, start with [Describing the UI](/learn/describing-the-ui) to get a closer look at the first chapter.

And don't forget to check the [API Reference](/reference) when you need the API without the fluff!
