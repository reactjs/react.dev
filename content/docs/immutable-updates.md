---
id: immutable-updates
title: Immutable Updates
permalink: docs/immutable-updates.html
layout: docs
---

To ensure immutability without performing expensive deep cloning, it is good practice to replace only the values which need updating and to reuse the rest of the original object.

### Updating Object Properties

To update an object property, you can make use of the [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign): 

```javascript
const newData = {
  ...oldData,
  propertyToUpdate: newValue
};
```

or by using [Object.assign{}](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign):

```javascript
const newData = Object.assign({}, oldData, {
  propertyToUpdate: newValue
});
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


