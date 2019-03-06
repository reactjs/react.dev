---
id: jsx-in-depth
title: JSX In Depth
permalink: docs/jsx-in-depth.html
redirect_from:
  - "docs/jsx-spread.html"
  - "docs/jsx-gotchas.html"
  - "tips/if-else-in-JSX.html"
  - "tips/self-closing-tag.html"
  - "tips/maximum-number-of-jsx-root-nodes.html"
  - "tips/children-props-type.html"
  - "docs/jsx-in-depth-zh-CN.html"
  - "docs/jsx-in-depth-ko-KR.html"
---

Fondamentalement, JSX fournit du sucre syntaxique pour la fonction `React.createElement(component, props, ...children)`. Le code JSX:

```js
<MyButton color="blue" shadowSize={2}>
  Cliquez!
</MyButton>
```

est compilé en:

```js
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Cliquez!'
)
```

Il est aussi possible d'utiliser la balise à fermeture automatique si il n'y a pas d'enfants. Donc:

```js
<div className="sidebar" />
```

est compilé en:

```js
React.createElement(
  'div',
  {className: 'sidebar'},
  null
)
```
Si vous souhaitez voir comment certains éléments JSX spécifiques sont compilés en Javascript, vous pouvez utiliser [le compileur en ligne Babel](babel://jsx-simple-example).

## Spécifier le type d'un élément React {#specifying-the-react-element-type}

La première partie d'une balise JSX détermine le type de l'élément react en question.

Les types écrits en majuscule indiquent que la balise JSX fait référence à un composant React. Ces balises compilées sont des références directes du nom de la variable, donc si vous utilisez l'expression JSX  `<Foo />`, `Foo` doit être dans le scope.

### React doit être dans le scope {#react-must-be-in-scope}

Étant donné que JSX se compile en appel à `React.createElement`, la librairie `React` doit aussi être dans le scope de votre code JSX.

Par exemple, les deux imports sont nécessaires dans le code ci-dessous même si `React` et `CustomButton` ne sont pas directement référencés depuis Javascript:

```js{1,2,5}
import React from 'react';
import CustomButton from './CustomButton';

function WarningButton() {
  // return React.createElement(CustomButton, {color: 'red'}, null);
  return <CustomButton color="red" />;
}
```

Si vous n'utilisez pas un bundler Javascript et que vous ne chargez pas React à partir d'une balise `<script>`, il est déjà dans le scope comme le `React` global.

### Utilisation de la notation en point pour les types JSX {#using-dot-notation-for-jsx-type}

Vous pouvez également vous référez à un composant React en utilisant la notation en point de JSX. Ceci est pratique si vous avez un seul module qui exporte plusieurs composants React. Par exemple si `MyComponents.DatePicker` est un composant, vous pouvez directement l'utiliser dans JSX avec:

```js{10}
import React from 'react';

const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Imaginez une {props.color} datepicker ici.</div>;
  }
}

function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />;
}
```

### Les composants qui définissent les utilisateurs doivent être en majuscule {#user-defined-components-must-be-capitalized}

Quand un élément commence avec une lettre minuscule il fait référence à un composant intégré tel que `<div>` ou `<span>` et donne une chaîne de caractères `'div'` ou `'span'` passée à `React.createElement`. Les types qui commencent avec une lettre majuscule comme `<Foo />` sont compilés en `React.createElement(Foo)` et correspondent à un composant défini ou importé dans votre fichié Javascript.

Nous recommandons de nommer les composants avec une lettre majuscule. Si vous avez un composant qui démarre avec une lettre minuscule, affectez-le à une variable avec une lettre majuscule avant de l'utiliser dans votre JSX.

Par exemple, ce code ne s'executera pas comme prévu:

```js{3,4,10,11}
import React from 'react';

// Faux! Ceci est un composant est devrait être en lettre majuscule:
function hello(props) {
  // Correct! Cette utilisation de <div> fonctionne car div est une balise HTML valide:
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // Faux! React pense que <hello /> est une balise HTML car il n'est pas en majuscule:
  return <hello toWhat="World" />;
}
```

Pour corriger cela, nous allons renommer `hello` en `Hello` et utiliser `<Hello />` lorsqu'on le mentionne:

```js{3,4,10,11}
import React from 'react';

// Correct! Ceci est un composant et doit être en majuscule:
function Hello(props) {
  // Correct! Cette utilisation de <div> fonctionne car div est une balise HTML valide:
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // Correct! React sait que <Hello /> est un composant car il est en majuscule.
  return <Hello toWhat="World" />;
}
```

### Choix du type au moment de l'exécution {#choosing-the-type-at-runtime}

Vous ne pouvez pas utiliser une expression générale pour le type d'élément React. Si vous voulez utiliser une expression pour définir le type d'un élément, initialisez-la d'abord à une variable en minuscule. Cela arrive en général lorsque vous voulez afficher un composant différent basé sur une props:

```js{10,11}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Faux! Un type JSX ne peut pas être une expression.
  return <components[props.storyType] story={props.story} />;
}
```

Pour corriger cela, nous allons d'abord initialiser le type à une variable commençant par une majuscule:

```js{10-12}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Correct! Un type JSX peut être une variable commeçant par une majuscule.
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

## Les props en JSX {#props-in-jsx}

Il y a différents moyens de définir les props en JSX.

### Les expressions Javascript comme props {#javascript-expressions-as-props}

Vous pouvez passer n'importe quelle expression Javascript comme props, en l'entourant de `{}`. Par exemple, dans ce code JSX:

```js
<MyComponent foo={1 + 2 + 3 + 4} />
```

Pour `MyComponent`, la valeur de `props.foo` sera `10` parce que l'expression `1 + 2 + 3 + 4` est évaluée.

Les déclarations `if` et les boucles `for` ne sont pas des expressions en Javascript, donc elle ne peuvent pas être directement utilisées en JSX. À la place,  vous pouvez les mettre dans le code environnant. Par exemple:

```js{3-7}
function NumberDescriber(props) {
  let description;
  if (props.number % 2 == 0) {
    description = <strong>pair</strong>;
  } else {
    description = <i>impair</i>;
  }
  return <div>{props.number} est un nombre {description}</div>;
}
```
Vous pouvez en savoir plus sur les [conditions](/docs/conditional-rendering.html) et les [boucles](/docs/lists-and-keys.html) au sein des sections correspondantes.

### String Literals {#string-literals}

You can pass a string literal as a prop. These two JSX expressions are equivalent:

```js
<MyComponent message="hello world" />

<MyComponent message={'hello world'} />
```

When you pass a string literal, its value is HTML-unescaped. So these two JSX expressions are equivalent:

```js
<MyComponent message="&lt;3" />

<MyComponent message={'<3'} />
```

This behavior is usually not relevant. It's only mentioned here for completeness.

### Props Default to "True" {#props-default-to-true}

If you pass no value for a prop, it defaults to `true`. These two JSX expressions are equivalent:

```js
<MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```

In general, we don't recommend using this because it can be confused with the [ES6 object shorthand](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_2015) `{foo}` which is short for `{foo: foo}` rather than `{foo: true}`. This behavior is just there so that it matches the behavior of HTML.

### Spread Attributes {#spread-attributes}

If you already have `props` as an object, and you want to pass it in JSX, you can use `...` as a "spread" operator to pass the whole props object. These two components are equivalent:

```js{7}
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;
}
```

You can also pick specific props that your component will consume while passing all other props using the spread operator.

```js{2}
const Button = props => {
  const { kind, ...other } = props;
  const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
  return <button className={className} {...other} />;
};

const App = () => {
  return (
    <div>
      <Button kind="primary" onClick={() => console.log("clicked!")}>
        Hello World!
      </Button>
    </div>
  );
};
```

In the example above, the `kind` prop is safely consumed and *is not* passed on to the `<button>` element in the DOM.
All other props are passed via the `...other` object making this component really flexible. You can see that it passes an `onClick` and `children` props.

Spread attributes can be useful but they also make it easy to pass unnecessary props to components that don't care about them or to pass invalid HTML attributes to the DOM. We recommend using this syntax sparingly.  

## Children in JSX {#children-in-jsx}

In JSX expressions that contain both an opening tag and a closing tag, the content between those tags is passed as a special prop: `props.children`. There are several different ways to pass children:

### String Literals {#string-literals-1}

You can put a string between the opening and closing tags and `props.children` will just be that string. This is useful for many of the built-in HTML elements. For example:

```js
<MyComponent>Hello world!</MyComponent>
```

This is valid JSX, and `props.children` in `MyComponent` will simply be the string `"Hello world!"`. HTML is unescaped, so you can generally write JSX just like you would write HTML in this way:

```html
<div>This is valid HTML &amp; JSX at the same time.</div>
```

JSX removes whitespace at the beginning and ending of a line. It also removes blank lines. New lines adjacent to tags are removed; new lines that occur in the middle of string literals are condensed into a single space. So these all render to the same thing:

```js
<div>Hello World</div>

<div>
  Hello World
</div>

<div>
  Hello
  World
</div>

<div>

  Hello World
</div>
```

### JSX Children {#jsx-children}

You can provide more JSX elements as the children. This is useful for displaying nested components:

```js
<MyContainer>
  <MyFirstComponent />
  <MySecondComponent />
</MyContainer>
```

You can mix together different types of children, so you can use string literals together with JSX children. This is another way in which JSX is like HTML, so that this is both valid JSX and valid HTML:

```html
<div>
  Here is a list:
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>
```

A React component can also return an array of elements:

```js
render() {
  // No need to wrap list items in an extra element!
  return [
    // Don't forget the keys :)
    <li key="A">First item</li>,
    <li key="B">Second item</li>,
    <li key="C">Third item</li>,
  ];
}
```

### JavaScript Expressions as Children {#javascript-expressions-as-children}

You can pass any JavaScript expression as children, by enclosing it within `{}`. For example, these expressions are equivalent:

```js
<MyComponent>foo</MyComponent>

<MyComponent>{'foo'}</MyComponent>
```

This is often useful for rendering a list of JSX expressions of arbitrary length. For example, this renders an HTML list:

```js{2,9}
function Item(props) {
  return <li>{props.message}</li>;
}

function TodoList() {
  const todos = ['finish doc', 'submit pr', 'nag dan to review'];
  return (
    <ul>
      {todos.map((message) => <Item key={message} message={message} />)}
    </ul>
  );
}
```

JavaScript expressions can be mixed with other types of children. This is often useful in lieu of string templates:

```js{2}
function Hello(props) {
  return <div>Hello {props.addressee}!</div>;
}
```

### Functions as Children {#functions-as-children}

Normally, JavaScript expressions inserted in JSX will evaluate to a string, a React element, or a list of those things. However, `props.children` works just like any other prop in that it can pass any sort of data, not just the sorts that React knows how to render. For example, if you have a custom component, you could have it take a callback as `props.children`:

```js{4,13}
// Calls the children callback numTimes to produce a repeated component
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
      {(index) => <div key={index}>This is item {index} in the list</div>}
    </Repeat>
  );
}
```

Children passed to a custom component can be anything, as long as that component transforms them into something React can understand before rendering. This usage is not common, but it works if you want to stretch what JSX is capable of.

### Booleans, Null, and Undefined Are Ignored {#booleans-null-and-undefined-are-ignored}

`false`, `null`, `undefined`, and `true` are valid children. They simply don't render. These JSX expressions will all render to the same thing:

```js
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```

This can be useful to conditionally render React elements. This JSX only renders a `<Header />` if `showHeader` is `true`:

```js{2}
<div>
  {showHeader && <Header />}
  <Content />
</div>
```

One caveat is that some ["falsy" values](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), such as the `0` number, are still rendered by React. For example, this code will not behave as you might expect because `0` will be printed when `props.messages` is an empty array:

```js{2}
<div>
  {props.messages.length &&
    <MessageList messages={props.messages} />
  }
</div>
```

To fix this, make sure that the expression before `&&` is always boolean:

```js{2}
<div>
  {props.messages.length > 0 &&
    <MessageList messages={props.messages} />
  }
</div>
```

Conversely, if you want a value like `false`, `true`, `null`, or `undefined` to appear in the output, you have to [convert it to a string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#String_conversion) first:

```js{2}
<div>
  My JavaScript variable is {String(myVariable)}.
</div>
```
