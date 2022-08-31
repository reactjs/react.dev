---
title: useCallback
---

<Intro>

The `useCallback` hook returns a memoized version of the [callback function](https://en.wikipedia.org/wiki/Callback_(computer_programming)) that is passed inline along with an array of dependencies. When a function is wrapped in `useCallback`, that function is executed only when the dependencies change. This is useful when passing a [callback](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function) to optimized child components that rely on **referential equality to** [**prevent unnecessary renders**](/apis/react/useContext#optimizing-re-renders-when-passing-objects-and-functions).

```js
const memoizedCallback = useCallback(callback, [...dependencies])
```

</Intro>

<Note>

The difference between [`useMemo`](apis/react/useMemo) and `useCallback` is that `useMemo` returns a memoized value, and `useCallback` returns a memoized callback.

Also, the array of dependencies is not passed as arguments to the callback. Conceptually, though, that’s what they represent: every value referenced inside the callback should also appear in the dependencies array.

</Note>

- [Usage](#usage)
  - [Skip re-rendering of the components](#skip-re-rendering-of-the-components)
- [Reference](#reference)
  - [`useCallback(callback, [...dependencies])'](#usecallback-reference)

---

## Usage {/*usage*/}

### Skip re-rendering of the components {/*skip-re-rendering-of-the-components*/}

Often you come across scenarios where certain components render needlessly every time a button is clicked or an input changes. This unnecessary re-render on every change can be an impediment to an optimized application. `useCallback` hook provided by React can help in optimization and skipping unnecessary re-renders.

Consider the following example:

Call `useCallback` at the top level of your component to use it.

```js
import { useCallback } from 'react';
  // ...
```
In this example, the `Next` button renders every time the `Show details` button is clicked, even though the conditions for it are unchanged. The event handling function `handleNext`  is created every time the components render.

``` js [[6-7],20]

export default function App() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNext() {
    setIndex(index + 1);
  }

  //.....
  return (
    <>
      <h2 className="h2">
        <p>{sculpture.name} </p>
        by {sculpture.artist}
      </h2>
      <h3 className="h3">
        ({index + 1} of {sculptureList.length})
      </h3>
      <Button handleClick={handleNext}>Next</Button>
      {showMore && <p>{sculpture.description}</p>}
      <img className="img" src={sculpture.url} alt={sculpture.alt} />
      <Button handleClick={handleMoreClick}>
        {showMore ? "Hide" : "Show"} details
      </Button>
    </>
  );

  ```

  To solve this re-render, wrap the callback with `useCallback` and specify the dependency.

```js []

export default function App() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  const handleNext = useCallback(() => {
    setIndex(index + 1);
  }, [index]);

//.....

return (
    <>
      <h2 className="h2">
        <p>{sculpture.name} </p>
        by {sculpture.artist}
      </h2>
      <h3 className="h3">
        ({index + 1} of {sculptureList.length})
      </h3>
      <Button handleClick={handleNext}>Next</Button>
      {showMore && <p>{sculpture.description}</p>}
      <img className="img" src={sculpture.url} alt={sculpture.alt} />
      <Button handleClick={handleMoreClick}>
        {showMore ? "Hide" : "Show"} details
      </Button>
    </>
  );

```
Now, the `handleClick` function executes only if its dependency i.e., `index`, changes.

<Recipes titleText="useCallback example to skip re-render" titleId="examples-basic">

<Sandpack>

```js App.js
import "./styles.css";
import React, { useState, useCallback } from "react";
import Button from "./Button";
import { sculptureList } from "./data.js";

export default function App() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  const handleNext = useCallback(() => {
    setIndex(index + 1);
  }, [index]);

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];

  return (
    <>
      <h2 className="h2">
        <p>{sculpture.name} </p>
        by {sculpture.artist}
      </h2>
      <h3 className="h3">
        ({index + 1} of {sculptureList.length})
      </h3>
      <Button handleClick={handleNext}>Next</Button>
      {showMore && <p>{sculpture.description}</p>}
      <img className="img" src={sculpture.url} alt={sculpture.alt} />
      <Button handleClick={handleMoreClick}>
        {showMore ? "Hide" : "Show"} details
      </Button>
    </>
  );
}

```

```js Button.js

import React , { memo } from 'react'

function Button({ handleClick, children }) {
  console.log('Rendering button - ', children)
  return (
    <button onClick={handleClick}>
      {children}
    </button>
  )
}

export default memo(Button)

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
<Solution />
</Recipes>

## Reference {/*reference*/}

### `useCallback(callback, [...dependencies])` {/*usecontext*/}

Call `useCallback` at the top level of your component to obtain a memoized version of a function when one of the dependencies changes.

```js
import { useCallback } from 'react';

const memoizedCallback =
    useCallback(callback, [...dependencies])
  // ...
```
#### Parameters {/*parameters*/}

* `callback`: The `callback` is an inline function that needs to be passed to obtain a memoized version of the callback that only changes if one of the dependencies has changed.


* `dependencies`: An array of dependencies on which the `callback` function depends.

#### Returns {/*returns*/}

`useCallback` returns the memoized version of the [callback](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function) function that is passed as an argument.
