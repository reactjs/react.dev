---
title: useMemo
---

<Intro>

`useMemo` is a React Hook that returns a [memoized](https://en.wikipedia.org/wiki/Memoization) value.

```js
const memoizedvalue= useMemo(() => expensiveFunction(count), [count]);
```

</Intro>

- [Usage](#usage)
  - [Skip expensive recalculation on every render](#skip-expensive-recalculation-on-every-render)
  - [Preserving referential identity](#preserving-referential-identity)
- [Reference](#reference)
  - [`useMemo(() => computeExpensiveValue(a, b), [a, b])`](#usememo)
- [Troubleshooting](#troubleshooting)

---

## Usage {/*usage*/}

### Skip expensive recalculation on every render {/*skip-expensive-recalculation-on-every-render*/}

Call `useMemo` at the top level of your component to declare one or more memoized variables.

```js
import {useMemo} from 'react';

export default function App(){

const changedCount = useMemo( () => { return someExpensiveFunction(count)}, [count])

//...
```

* `useMemo` conventionally takes two arguments -- an “expensiveCalculations” function and an array of dependencies.

* `useMemo` recomputes and returns the memoized value when one of the dependency values changes on re-render

* Wrap the function that has expensive calculations using useMemo so that when the dependency is unchanged, the expensive calculations are not performed on the re-render of the component.

``` js
const changedCount = useMemo( () => { return someExpensiveFunction(count) } , [count] )
```

<Recipes titleText="Examples of skipping expensive recalculation on every render" titleId="examples-skiprecal">

### A count incrementer {/*a-count-incrementer*/}

This example uses a combination of state and memo. Both `count` and `fontcolor` are state variables because they are used for rendering.

Here, we have an input with the type `number`. Every time there is an increment in the number, an expensive function is calculated, and there is a delay in displaying the calculted result in the `div`.

But even when we try to change just the font color of the calculated number the expensive function is recalculated even though there is no change in the value, which is not desired.

Hence, the expensive function is wrapped using the `useMemo` hook. It compares the dependent value, and only if the value is changed then the expensive function is to be recalculated.

<Sandpack>

```js
import React, {useState, UseMemo, useMemo, useEffect} from 'react'

export default function App(){
const[count, setCount] = useState(0)
const[fontcolor, setFontColor] = useState(true)
const changedCount =
  useMemo(()=> { return someExpensiveFunction(count)}, [count])
const newColor=
   {color: fontcolor ? 'blue' : 'red'}

return(
  <>
  <input type= "number"  value={count} onChange =
    {(e => setCount(e.target.value))}/>
  <button onClick= {()=>
    setFontColor(fontcolor => !fontcolor)}> Change font color</button>
  <div style={newColor}>{changedCount}</div>
  </>
)
}

function someExpensiveFunction(number){
  for(let i=0 ; i<200000; i++){}
  return number * 2
}
```

</Sandpack>

<Solution />

</Recipes>

### Preserving referential identity {/*preserving-referential-identity*/}

`useMemo` plays a vital role in preserving referential identity.

To demonstrate the above point, let us consider the following code that uses the useEffect hook with a dependency that is an object.

```js
export default function App(){

  const newColor = {

  color: fontcolor ? 'blue' : 'red'

}

useEffect( () => {

  console.log(" Font color changed");

},[newColor])

```
In the above code snippet, the `useEffect` hook has a dependency that is an object, and on every render, the memory allocation for the object varies. So, on every render, when `useEffect` compares the dependencies, they are different as the hook is comparing the object's reference as opposed to the value, which makes the `useEffect` log the ("Font color changed") statement every time.

The solution to come out of the situation is to wrap the object inside memoization with `useMemo` as follows:

```js
const newColor= useMemo(() => {

return {

  color: fontcolor ? 'blue' : 'red'}

},[fontcolor])

```

<DeepDive title="Pros and Cons of using `useMemo`">
Pros

`useMemo` will only recompute the memoized value when one of the dependencies has changed. So, the re-computation of an expensive function on every render is not necessary.

Cons

Every time a component is rendered:
* an extra call is made to `useMemo`, thus creating performance overhead
* memory is being allocated to hold the memoized variable value, thus creating memory overhead

</DeepDive>

<Recipes titleText="Examples of preserving referential identity" titleId="examples-referentialid">

### An incrementer with {/*an-incrementer*/}

This example derives from the *A count incrementer* example and extends it to use the `useEffect` hook.

<Sandpack>

```js
import React, {useState, UseMemo, useMemo, useEffect} from 'react'

export default function App(){
const[count, setCount] = useState(0)
const[fontcolor, setFontColor] = useState(true)
const newColor= useMemo(() => {
  return {color: fontcolor ? 'blue' : 'red'}
},[fontcolor])

useEffect( () => {
  console.log("Font color changed");
},[newColor])

return(
  <>
  <input type= "number"  value={count} onChange =
    {(e => setCount(e.target.value))}/>
  <button onClick= {()=>
    setFontColor(fontcolor => !fontcolor)}> Change font color</button>
  <div style={newColor}>{changedCount}</div>
  </>
)
}

function someExpensiveFunction(number){
  for(let i=0 ; i<2000000; i++){}
  return number * 2
}
```

</Sandpack>

<Solution />

</Recipes>

## Reference {/*reference*/}

### `useMemo(() => computeExpensiveValue(a, b), [a, b])` {/*usememo*/}

Call `useMemo` at the top level of your component to declare one or more memoized variables.

```js
import {useMemo} from 'react';
  // ...
```

#### Parameters {/*parameters*/}

* `computeExpensiveValue`: The parameter is the expensive computational function that requires memoization.

* `[a,b]`: This value represents the dependency on which the recompute of the `computeExpensiveValue` rests. There can be an array of dependencies or a single value.

#### Returns {/*returns*/}

`useMemo` returns a value or object depending on the computed value:


## Troubleshooting {/*troubleshooting*/}
