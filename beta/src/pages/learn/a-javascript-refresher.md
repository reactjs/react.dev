---
title: A JavaScript Refresher
---

<Intro>
To understand React code you need some familiarity with JavaScript. This page describes the most common JavaScript features used throughout the documentation and, typically, in React codebases.
</Intro>

## Arrow functions {/*arrow-functions*/}

Arrow functions are a succinct alternative to the traditional JavaScript function syntax. The name 'arrow function' refers to the arrow (`=>`) that separates the function's name and parameters from its body. Compare the arrow syntax with the traditional function syntax:

```js
// arrow syntax:
const sum = (number1, number2) => number1 + number2;
const worldPandaPopulation = () => 1864;

// traditional syntax:
function sum(number1, number2) {
  return number1 + number2;
}

function worldPandaPopulation() {
  return 1864;
};
```

When written in one line, arrow functions return implicitly, which means that you don't have to use the `return` keyword. However, the `return` keyword as well as the brackets (`{}`) need to be included in multi-line functions:

```js
// arrow syntax:
const checkPalindrome = (str) => {
  const reversed = str.split('').reverse().join('');
  return str === reversed;
};

// traditional syntax:
function checkPalindrome(str) {
  const reversed = str.split('').reverse().join('');
  return str === reversed;
}
```

Read more about [arrow functions on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions).

## Array Methods {/*array-methods*/}

Array iteration is one of the key building blocks of developing applications with React. Let's see some of the things you can do with an array:

```js
const people = [{
  name: 'Creola Katherine Johnson',
  profession: 'mathematician'
}, {
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist'
}, {
  name: 'Percy Lavon Julian',
  profession: 'chemist' 
}];

// get the first element that fullfils the condition
people.find(person => person.profession === 'chemist');
// {name: 'Mario José Molina-Pasquel Henríquez', profession: 'chemist'}

// get all elements that fullfil the condition
people.filter(person => person.profession === 'chemist');
// {name: 'Mario José Molina-Pasquel Henríquez', profession: 'chemist'}, {name: 'Percy Lavon Julian', profession: 'chemist'}

// check if all elements pass the condition by the provided function
people.every(person => person.name.includes('é'));
// false

// check if any of the elements passes the condition by the provided function
people.some(person => person.name.includes('é'));
// true

// return a new array
people.map(person => person.name);
// ['Creola Katherine Johnson', 'Mario José Molina-Pasquel Henríquez', 'Percy Lavon Julian']

// execute the provided function once for each array element
people.forEach(person => console.log(person));
```

Explore [array methods on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).

## Destructuring {/*destructuring*/}

Sometimes there is too much unnecessary information included in an object. Sometimes it is helpful to save the elements of an array to a variable. Destructuring makes both possible. It allows you to "unpack" properties of an object (or elements of an array) into their own variables. Check examples below to see it in action.

### Destructuring objects {/*destructuring-objects*/}

Below is a `person` object with a lot of keys. However, in your code you only need `name` and `profession`. You can use destructuring to only work with these two keys by saving them to their own variables.

```js
const person =  {
  fullName: 'Percy Lavon Julian',
  profession: 'chemist',
  birth: '1899',
  death: '1975',
  patents: ['Spingarn Medal, NAACP', 'National Academy of Sciences', 'National Inventors Hall of Fame']
};

// destructure
const {fullName, profession} = person;

// now you can call the variables
console.log(fullName); // Percy Lavon Julian
console.log(profession); // chemist
```

While destructuring you can also rename the variable:

```js
const person =  {
  fullName: 'Percy Lavon Julian',
  profession: 'chemist',
  birth: '1899',
  death: '1975',
  patents: ['Spingarn Medal, NAACP', 'National Academy of Sciences', 'National Inventors Hall of Fame']
};

// destructure and rename the variable
const {name: fullName, profession} = person;

console.log(name); // Percy Lavon Julian
console.log(fullName); // undefined
console.log(profession); // chemist
```

### Destructuring arrays {/*destructuring-arrays*/}

Below is a `colors` array of hex color codes. You can save them to variables, for example to make your codebase more descriptive.

```js
const colors = ['#0000FF','#008080', '#F4BB29'];

const [blue, teal, eggYolk] = colors;

console.log(blue); // '#0000FF'
// more descriptive than: console.log(colors[0])

console.log(teal); // '#008080'
console.log(eggYolk); // '#F4BB29'
```

Read more about [destructuring on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

## Parameter defaults (default values) {/*parameter-defaults-default-values*/}

In JavaScript it is possible to declare default values for function parameters. This comes as handy in case no value is provided.

```js
// no default parameter
const favoriteWord = (word) => console.log(`My favorite flower is '${word}'`);

favoriteWord(); // My favorite flower is 'undefined'
favoriteWord('razzle-dazzle'); // My favorite word is 'razzle-dazzle'

// with default parameter
const favoriteWord = (word='bubbles') => console.log(`My favorite word is '${word}'`);

favoriteWord(); // My favorite word is 'bubbles'
favoriteWord('razzle-dazzle'); // My favorite word is 'razzle-dazzle'
```

Read more about [destructuring on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

## Rest Parameters {/*rest-parameters*/}

Sometimes when passing many arguments to a function you may not immediately need all of them. Rest parameters collect all the remaining arguments into an array.

```js
const favoriteFlowers = (first, second, ...rest) => {
    console.log(`My favorite flowers are ${first} and ${second}.`);
    return rest
};

favoriteFlowers('rose', 'lotus', 'peony', 'forget-me-not', 'manacá-da-serra');
// My favorite flowers are rose and lotus.
// ['peony', 'forget-me-not', 'manacá-da-serra']
```

Read more about [rest parameters on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).

## Spread Operator {/*spread-operator*/}

In short, spread operator allows for copying elements of an array or properties of an object.

### Spreading arrays {/*spreading-arrays*/}

You can join two arrays together:

```js
const painters = ['Frida Kahlo', 'Lili Elbe']
const sculptors = ['Niki de Saint Phalle', 'John Woodrow Wilson']

const artists = [...painters, ...sculptors]

console.log(artists)
// ['Frida Kahlo', 'Lili Elbe', 'Niki de Saint Phalle', 'John Woodrow Wilson']
```

You can create a copy of an array:

```js
const painters = ['Lili Elbe', 'Frida Kahlo'];

let paintersCopy = [...painters];

paintersCopy = paintersCopy.sort();

paintersCopy;
// [ 'Frida Kahlo', 'Lili Elbe' ]
painters;
// [ 'Lili Elbe', 'Frida Kahlo' ]
```

You can add an element to a copy of an array:

```js
// to the beginning
const addPainter = (newPainter) => {
  return [newPainter, ...painters]
};

addPainter('Jean-Michel Basquiat');
// ['Jean-Michel Basquiat', 'Frida Kahlo', 'Lili Elbe']

// to the end
const addPainter = (newPainter) => {
  return [...painters, newPainter]
}

addPainterToEnd('Jean-Michel Basquiat') 
// ['Frida Kahlo', 'Lili Elbe', 'Jean-Michel Basquiat']

// to the beginning and the end
const addPainters = (newPainter1, newPainter2) => {
  return [newPainter1, ...painters, newPainter2]
}

addPaintersBothWays('Jean-Michel Basquiat', 'Katsushika Hokusai') 
// ['Jean-Michel Basquiat', 'Frida Kahlo', 'Lili Elbe', 'Katsushika Hokusai']

```

### Spreading objects {/*spreading-objects*/}

You can update an object by spreading it and (only then) providing the key-value pair to be updated:

```js
const niki = {
  name: 'Niki de Saint Phalle',
  artwork: 'Blue Nana',
  birth: 1930,
  death: 2002
};

const updateArtwork = (artist, newArtwork) => {
  return {...artist, artwork: newArtwork};
};

updateArtwork(niki, 'the Tarot Garden');
// {name: 'Niki de Saint Phalle', artwork: 'the Tarot Garden', birth: 1930, death: 2002}
```

You can join two objects together:

```js
const disgustingFoodMuseum = {
  name: 'Disgusting Food Museum',
  description: 'Do you dare smell the world’s stinkiest cheese? Or taste sweets made with metal cleansing chemicals?',
  location: 'Malmö, Sweden',
  rating: '4.6/5'
};

const quote = {
  sampleReview: 'The coolest place I've been to so far. The multitude of taste experiences was exceptional. If you have a strong stomach, I recommend the tasting area.'
};

const addReviewToProfile = (museum, review) => {
    return {...museum, ...review}
};

addReviewToProfile(disgustingFoodMuseum, quote);
// {name: 'Disgusting Food Museum', description: 'Do you dare smell the world’s stinkiest cheese? Or taste sweets made with metal cleansing chemicals?', location: 'Malmö, Sweden', rating: '4.6/5', sampleReview: 'The coolest place I've been to so far. The multitude of taste experiences was exceptional. If you have a strong stomach, I recommend the tasting area.'}
```

Read more about [spread operator on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax).

## Ternary (conditional) operator {/*ternary-conditional-operator*/}

Ternary operator is an alternative to 'if/else' syntax for handling conditionals. It consists of three parts:

* a condition followed by:
  * question mark (`?`) and an expression to execute if condition is truthy,
  * a colon (`:`) and an expression to execute otherwise ("else" equivalent).

Compare the ternary operator syntax with the traditional if/else syntax:

```js
// ternary operator
const isEven = (number) => {
  return number % 2 == 0
  ? 'The number is even'
  : 'The number is odd';
};

// traditional if/else
const isEven = (number) => {
  if (number % 2 == 0) {
    return 'The number is even';
  } else {
    return 'The number is odd';
  }
};

isEven(11);
// 'The number is odd'
isEven(42);
// 'The number is even'
```

Read more about [ternary operator on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator).
