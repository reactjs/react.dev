---
id: immutable-updates
title: Immutable Updates
permalink: docs/immutable-updates.html
layout: docs
---

## Overview

Avoiding mutation of existing data structures is an especially useful technique, and especially in React it has significant benefits.

A great source of trouble in application development comes from the need to track how the data changes over time, and when. Mutation of the app data (that is, its state) can lead to inconsistencies across different parts of your app that shares the same data. This in turn can lead to unpredictable behavior and bugs that are difficult to track.

Additionally, immutable data structures make it easy and cheap to detect when data has changed. If you can use immutable data in performance-critical parts of your application it's easy to implement a fast [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate) method to significantly speed up your app.

## Techniques

To ensure immutability without performing expensive deep cloning, it is good practice to replace only the values which need updating and to reuse the rest of the original data structure. Below we document several techniques that you can use to this end.

### Updating Object Properties

To update an object property, you can make use of [Object.assign{}](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign):

```javascript
const newData = Object.assign({}, oldData, {
  propertyToUpdate: newValue
});
```

or by using the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator), a *proposed* syntax that's enabled in Create React App, Node.js and Chrome but not currently supported by all browsers.

```javascript
const newData = {
  ...oldData,
  propertyToUpdate: newValue
};
```

To update a nested property such as `oldData.first.second.propertyToUpdate` you should remember to copy all of the original object's levels:

```javascript
const newData = {
  ...oldData,
  first: {
    ...oldData.first,
    second: {
      ...oldData.first.second,
      propertyToUpdate: newValue
    }
  }
};
```

### Updating Arrays

When updating arrays, you should avoid using mutative functions such as `push`, `unshift`, and `splice` directly on the data. You can still use these functions if you copy the array first - an easy way to do so is with [Array.slice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice).

Adding to an array using the spread syntax or [Array.concat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat):

```javascript
const newArray = [...oldArray, newItem ];

// or with concat

const newArray = oldArray.concat(newItemArray, newItem);
```

Inserting or removing an item by mutating a copy:

```javascript

let newArray = oldArray.slice(); // create a shallow clone of oldArray

newArray.splice(insertIndex, 0, newItem); // inserting

newArray.splice(removeIndex, 1); // removing

```

or without mutating a copy:

```javascript
// inserting
const newArray = [
  ...oldArray.slice(0, insertIndex),
  newItem,
  ...oldArray.slice(insertIndex)
  ];

// removing
const newArray = [
  ...oldArray.slice(0, removeIndex),
  ...oldArray.slice(removeIndex + 1)
];
```

## Utility Libraries

There are many libraries such as [Immutable.js](https://facebook.github.io/immutable-js/) and [immutability-helper](https://github.com/kolodny/immutability-helper) that make dealing with immutable data a lot easier. They provide a more concise and readable syntax to performing immutable updates and some are optimised to perform immutable updates more efficiently than the approaches above.
