---
title: createFactory
---

<Intro>

`createFactory` lets you create a function that creates a React element of a given `type`. The `type` argument can be either a tag name string (such as `div` or `span`), a React component type (a class or a function), or a React fragment type.

`createFactory` is typically invoked if you are using [React without JSX.](https://beta.reactjs.org/learn/add-react-to-a-website#run-the-jsx-preprocessor)

```js
React.createFactory(type)
```
</Intro>

<Note>

`createFactory` is considered legacy, and we encourage you to either use **JSX** or use `React.createElement()` directly instead.
</Note>

<InlineToc />

## Usage {/*usage*/}

### Creating React elements {/*creating-react-elements*/}

In this example, we can render a React element of the `type` `button`.

<Sandpack>

``` js App.js
import React from 'react';

const MyButton = () =>
  (React.createFactory("button"))({
    onClick: (evt) => {
      evt.preventDefault();
      alert("I was created by createFactory()");
    }
  }, 'Click');

export default function App(){
    return (
        <div>
            {MyButton()}
        </div>
    )
};
```
``` js index.js

import {createRoot} from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);

```
</Sandpack>

### `createFactory(type)` {/*createfactory*/}

Call `createFactory(type)` to create a function that creates a React element of a given `type`.

```js
const myElement= React.createFactory(type)

```

#### Parameters {/*parameters*/}

* `type`: The `type` argument can be either a tag name string (such as `div` or `span`), a React component type (a class or a function), or a React fragment type.

#### Returns {/*returns*/}

 Returns a function that can be used to create a React element of the given `type`.
