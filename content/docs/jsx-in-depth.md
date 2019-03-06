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

La première partie d'une balise JSX détermine le type de l'élément React en question.

Les types commençant par une lettre majuscule indiquent que la balise JSX fait référence à un composant React. Ces balises sont compilées en références directes à la variable nommée, donc si vous utilisez l'expression JSX  `<Foo />`, `Foo` doit être dans le scope.

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

Si vous n'utilisez pas un bundler Javascript et que vous ne chargez pas React à partir d'une balise `<script>`, il est déjà dans le scope en tant que `React` global.

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

### Les composants qui définissent les utilisateurs doivent commencés par une majuscule {#user-defined-components-must-be-capitalized}

Quand un élément commence avec une lettre minuscule il fait référence à un composant intégré tel que `<div>` ou `<span>` et donne une chaîne de caractères `'div'` ou `'span'` passée à `React.createElement`. Les types qui commencent avec une lettre majuscule comme `<Foo />` sont compilés en `React.createElement(Foo)` et correspondent à un composant défini ou importé dans votre fichié Javascript.

Nous recommandons de nommer les composants avec une lettre majuscule. Si vous avez un composant qui démarre avec une lettre minuscule, affectez-le à une variable avec une lettre majuscule avant de l'utiliser dans votre JSX.

Par exemple, ce code ne s'executera pas comme prévu:

```js{3,4,10,11}
import React from 'react';

// Faux! Ceci est un composant est devrait commencé par une lettre majuscule:
function hello(props) {
  // Correct! Cette utilisation de <div> fonctionne car div est une balise HTML valide:
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // Faux! React pense que <hello /> est une balise HTML car il ne commence pas par une majuscule:
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
  // Correct! React sait que <Hello /> est un composant car il commence par une majuscule.
  return <Hello toWhat="World" />;
}
```

### Choix du type au moment de l'exécution {#choosing-the-type-at-runtime}

Vous ne pouvez pas utiliser une expression générale pour le type d'un élément React. Si vous voulez utiliser une expression pour définir le type d'un élément, initialisez-la d'abord à une variable en minuscule. Cela arrive en général lorsque vous voulez afficher un composant différent basé sur une props:

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

Pour `MyComponent`, la valeur de `props.foo` sera `10` parce que l'expression `1 + 2 + 3 + 4` est calculée.

Les déclarations `if` et les boucles `for` ne sont pas des expressions en Javascript, donc elle ne peuvent pas être directement utilisées en JSX. À la place, vous pouvez les mettre dans le code environnant. Par exemple:

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

### Les expressions littérales {#string-literals}

Vous pouvez passer une expression littérale comme props. Les deux expressions JSX ci-dessous sont équivalentes:

```js
<MyComponent message="hello world" />

<MyComponent message={'hello world'} />
```

Quand vous passez une expression littérale, sa valeur est du HTML non-échappé. Donc ces deux expressions JSX sont équivalentes:

```js
<MyComponent message="&lt;3" />

<MyComponent message={'<3'} />
```

Ce comportement n'est en général pas pertinent, ce n'est mentionné ici que par souci d'exhaustivité.

### Les props initialisées à "true" {#props-default-to-true}

Si vous n'affectez aucune valeur à une props, sa valeur par défaut sera `true`. Ces deux expressions JSX sont équivalentes:

```js
<MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```

En général, nous ne recommandons pas cette utilisationcar cela peut être confondu avec [l'abrévation des objets ES6](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_2015) `{foo}` qui est l'abréviation de `{foo: foo}` aulieu de `{foo: true}`. Ce comportement existe uniquement pour qu'il corresponde au comportement du HTML.

### Syntaxe de décomposition {#spread-attributes}

Si vous avez déjà un objet `props` et vous voulez l'utiliser en JSX, vous pouvez utiliser l'opérateur de diffusion ("spread operator") `...` pour faire passer l'ensemble de l'objet props. Ces deux composants sont équivalents:

```js{7}
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;
}
```

Vous pouvez aussi choisir certaines props que votre composant utilisera en passant toutes les autres props avec l'opérateur de diffusion.

```js{2}
const Button = props => {
  const { kind, ...other } = props;
  const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
  return <button className={className} {...other} />;
};

const App = () => {
  return (
    <div>
      <Button kind="primary" onClick={() => console.log("cliqué!")}>
        Hello World!
      </Button>
    </div>
  );
};
```

Dans l'exemple ci-dessus, la prop `kind` est utilisée en toute sécurité et *n'est pas* passée à l'élément `<button>` dans le DOM.
Toutes les autres props sont passées via l'objet `...other` rendant ce composant très flexible. Vous pouvez voir que cela passe les props `onClick` et `children`.

Les attributs de diffusion peuvent être utiles, mais ils permettent aussi de passer facilement des props inutiles aux composants qui ne s'en soucient pas ou de passer des attributs HTML invalides au DOM. Nous vous recommandons d'utiliser cette syntaxe avec parcimonie.  

## Les enfants en JSX {#children-in-jsx}

Dans les expressions JSX qui contiennent une balise ouvrante et une balise fermante, le contenu entre ces deux balises est passé comme une prop spéciale: `props.children`. Il existe plusieurs moyens pour passer ces enfants:

### Littéraux de chaînes de caractères {#string-literals-1}

Vous pouvez mettre une chaîne de caractères entre une balise ouvrante et une fermante et `props.children` définira cette chaîne de caractère. Ceci est utile pour la plupart des éléments HTML intégrés. Par exemple:

```js
<MyComponent>Hello world!</MyComponent>
```

Ceci est du JSX valide, et `props.children` dans `MyComponent` sera simplement la chaîne de caractères `"Hello world!"`. Le HTML est non-échappé, donc vous pouvez généralement écrire du JSX de la même façon que vous écrivez du HTML, c'est-à-dire :

```html
<div>Ceci est à la fois du HTML &amp; du JSX valides.</div>
```

JSX supprime les espaces en début et en fin de ligne. Il supprime également les lignes vides. Les nouvelles lignes adjacentes aux balises sont supprimées; les nouvelles lignes qui apparaissent au milieu d'une chaîne de caractères sont condensées en un seul espace. Donc, tous les codes ci-dessous donnent le même résultat :

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

### Enfants JSX {#jsx-children}

Vous pouvez fournir plus d'éléments JSX en tant qu'enfants. Ceci est utile pour afficher les composants imbriqués :

```js
<MyContainer>
  <MyFirstComponent />
  <MySecondComponent />
</MyContainer>
```

Vous pouvez mélanger ensemble différents types d'enfants, il est donc possible d'utiliser des chaînes de caractères littérales avec des enfants JSX. Nous avons ici encore un aspect où JSX fonctionne comme le HTML, ceci est du code JSX et HTML valide:

```html
<div>
  Here is a list:
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>
```

Un composant React peut aussi renvoyer un tableau d'éléments:

```js
render() {
  // Pas besoin d'envelopper les éléments de la liste dans un élément supplémentaire !
  return [
    // N'oubliez pas les "keys" :)
    <li key="A">First item</li>,
    <li key="B">Second item</li>,
    <li key="C">Third item</li>,
  ];
}
```

### Les expressions JavaScript comme Enfants {#javascript-expressions-as-children}

Vous pouvez passer n'importe quelle expression JavaScript en tant qu'enfant, en l'enfermant dans des `{}`. Par exemple, ces expressions sont équivalentes :

```js
<MyComponent>foo</MyComponent>

<MyComponent>{'foo'}</MyComponent>
```

Ceci est souvent utile pour rendre une liste d'expressions JSX de longueur arbitraire. Par exemple, cela rend une liste HTML :

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

Les expressions JavaScript peuvent être mélangées avec d'autres types d'enfants. Ceci est souvent utile à la place des modèles de chaînes de caractères:

```js{2}
function Hello(props) {
  return <div>Hello {props.addressee}!</div>;
}
```

### Les fonctions comme Enfants {#functions-as-children}

Normalement, les expressions Javascript insérées dans JSX évalueront une chaîne, un élément React ou une liste de ceux-ci. Cependant, `props.children` fonctionne exactement comme n'importe quelle prop dans le sens qu'elle peut passer n'importe quel genre de données, pas seulement celles que React sait rendre. Par exemple, si vous avez un composant personnalisé, vous pouvez lui faire prendre le callback `props.children' : 

```js{4,13}

// Appelle les enfants callback numTimes pour produire un composant répété
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
      {(index) => <div key={index}>Ceci est l'item {index} de la liste</div>}
    </Repeat>
  );
}
```

Les enfants passés à un composant personnalisé peuvent être n'importe quoi, tant que ce composant les transforme en quelque chose que React peut comprendre avant le rendu. Cette utilisation n'est pas courante, mais elle fonctionne si vous voulez étendre ce dont JSX est capable.

### Booléens, Null, et Undefined Sont Ignorés {#booleans-null-and-undefined-are-ignored}

`false`, `null`, `undefined`, et `true` sont des enfants valides. Ils ne sont pas rendus. Ces expressions JSX rendront toutes la même chose :

```js
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```

Ceci peut être utile pour le rendu conditionnel des éléments React. Ce JSX rend un `<Header />` uniquement si `showHeader` est à `true`:

```js{2}
<div>
  {showHeader && <Header />}
  <Content />
</div>
```

Une mise en garde s'impose : certaines valeurs ["falsy"](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), comme le nombre `0`, sont rendus par React. Par exemple, ce code ne se comportera pas comme vous l'esperez car `0` sera affichée lorsque `props.messages` est un tableau vide:

```js{2}
<div>
  {props.messages.length &&
    <MessageList messages={props.messages} />
  }
</div>
```

Pour corriger cela, assurez-vous que l'expression avant `&&` est toujours un booléen:

```js{2}
<div>
  {props.messages.length > 0 &&
    <MessageList messages={props.messages} />
  }
</div>
```

À l'inverse, si vous voulez qu'une valeur comme `false`, `true`, `null`, ou `undefined` apparaisse comme rendu, vous devez d'abord la [convertir en une chaîne de caractères](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#String_conversion) 

```js{2}
<div>
  Ma variable Javascript est {String(myVariable)}.
</div>
```
