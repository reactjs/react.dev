---
title: JavaScriptia JSX:ssa aaltosulkeilla
---

<Intro>

JSX:lla voit kirjoittaa HTML-tyylistä merkintäkoodia JavaScript tiedoston sisällä, pitäen renderöintilogiikan ja sisällön samassa paikassa. Joksus haluat käyttää vain vähän JavaScript logiikkaa tai viitata dynaamiseen muuttujaan merkintäkoodin sisällä. Tässä tilanteessa voit käyttää aaltosulkeita JSX koodissasi avataksesi ikkunan JavaScriptiin.

</Intro>

<YouWillLearn>

* Miten välität merkkijonoja heittomerkeillä
* Miten viittaat JavaScript muuttujaan JSX:n sisällä aaltosulkeilla
* Miten kutsut JavaScript funktiota JSX:n sisällä aaltosulkeilla
* Miten käytät JavaScript oliota JSX:n sisällä aaltosulkeilla

</YouWillLearn>

## Merkkijonojen välittäminen heittomerkeillä {/*passing-strings-with-quotes*/}

Kun haluat välittää merkkijonoattribuutin JSX koodissa, voit käyttää heittomerkkejä tai lainausmerkkejä:

<Sandpack>

```js
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/7vQD0fPs.jpg"
      alt="Gregorio Y. Zara"
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Tässä `"https://i.imgur.com/7vQD0fPs.jpg"` ja `"Gregorio Y. Zara"` välitetään merkkijonoina.

Mutta entä jos haluat dynaamisesti määritellä `src` tai `alt` tekstit? Voit käyttää **JavaScript arvoja korvaamalla `"` ja `"` merkeillä `{` ja `}`**:

<Sandpack>

```js
export default function Avatar() {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Huomaa `className="avatar"` määrittelee `"avatar"` CSS luokan nimen joka tekee kuvasta pyöreän ja `src={avatar}` joka lukee JavaScript muuttujan `avatar` arvon. Tämä tapahtuu siksi koska aaltosulkeilla voit käyttää JavaScriptia suoraan merkintäkoodissasi.

## Aaltosulkeiden käyttö: Ikkuna JavaScriptin maailmaan {/*using-curly-braces-a-window-into-the-javascript-world*/}

JSX on erityinen tapa kirjoittaa JavaScriptia. Se tarkoittaa, että on mahdollista käyttää JavaScriptia sen sisällä—aaltosulkeilla `{ }`. Alla oleva esimerkki ensiksi määrittelee nimen `name` tutkijalle, sitten upottaa sen aaltosulkeilla `<h1>` tagin sisälle:

<Sandpack>

```js
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return (
    <h1>{name}'s To Do List</h1>
  );
}
```

</Sandpack>

Kokeile muuttaa `name`:n arvoa arvosta `'Gregorio Y. Zara'` arvoksi `'Hedy Lamarr'`. Huomaatko miten To Do -listan otsikko muuttuu?

Mikä tahansa JavaScript -lauseke toimii aaltosulkeiden välissä, mukaanlukien funktiokutsut kuten `formatDate()`:

<Sandpack>

```js
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>To Do List for {formatDate(today)}</h1>
  );
}
```

</Sandpack>

### Missä käyttää aaltosulkeita {/*where-to-use-curly-braces*/}

Voit käyttää aaltosulkeita JSX:n sisällä kahdella tavalla:

1. **Tekstinä** suoraan JSX tagin sisällä: `<h1>{name}'s To Do List</h1>` toimii, mutta `<{tag}>Gregorio Y. Zara's To Do List</{tag}>`  ei toimi.
2. **Attribuutteina** immediately following the `=` sign: `src={avatar}` will read the `avatar` variable, but `src="{avatar}"` will pass the string `{avatar}`.

## Kaksoisaaltosulkeiden käyttö: CSS ja muut oliot JSX:ssä {/*using-double-curlies-css-and-other-objects-in-jsx*/}

Merkkijonojen, numeroiden sekä muiden JavaScript lauseiden lisäksi voit antaa oliota JSX:ssä. Oliot myös merkitään aaltosulkeilla, kuten `{ name: "Hedy Lamarr", inventions: 5 }`. Siksi, jotta voit välittää JS olion JSX:ssä, joudutaan käärimään olio toisien aaltosukleiden sisään: `person={{ name: "Hedy Lamarr", inventions: 5 }}`.

Saatat nähdä tämän rivinsisäisissä CSS tyyleissä JSX:ssä. React ei pakota rivinsisäisten tyylien käyttöä (CSS luokat toimivat hyvin useimmissa tilanteissa). Mutta kun tarvitset rivinsisäisiä tyylejä, voit välittää olion `style` attribuutille seuraavasti:

<Sandpack>

```js
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Improve the videophone</li>
      <li>Prepare aeronautics lectures</li>
      <li>Work on the alcohol-fuelled engine</li>
    </ul>
  );
}
```

```css
body { padding: 0; margin: 0 }
ul { padding: 20px 20px 20px 40px; margin: 0; }
```

</Sandpack>

Kokeile muuttaa `backgroundColor` ja `color` arvoja.

Erotat kunnolla JavaScript olion aaltosulkeiden sisällä kun kirjoitat sen seuraavasti:

```js {2-5}
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

Seuraavalla kertaa kun näet `{{` ja `}}` JSX:ssä, tiedät että se tarkoittaa vain oliota JSX:ssä aaltosulkeiden sisällä!

<Gotcha>

Rivinsisäinen `style` ominaisuudet kirjoitetaan camelCase muodossa. Esimerkiksi HTML `<ul style="background-color: black">` kirjoitettaisiin seuraavasti `<ul style={{ backgroundColor: 'black' }}>` komponentissasi.

</Gotcha>

## Lisää hauskuutta JavaScript olioilla ja aaltosulkeilla {/*more-fun-with-javascript-objects-and-curly-braces*/}

Voit siirtää useita lauseita yhteen olioon ja viitata niihin JSX koodissasi aaltosulkeissa:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Tässä esimerkissä `person` JavaScript olio sisältää `name` merkkijonon ja `theme` olion:

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

Komponentti voi käyttää näitä arvoja `person` oliosta seuraavasti:

```js
<div style={person.theme}>
  <h1>{person.name}'s Todos</h1>
```

JSX on minimaalinen mallinnuskieli, koska sen avulla voi järjestää dataa ja logiikkaa JavaScriptia käyttämällä.

<Recap>

Nyt tiedät melkein kaiken JSX:stä:

* JSX attribuutit heittomerkkien välissä välitetään merkkijonona.
* Aaltosulkeilla tuot JavaScript logiikan ja muuttujat merkintäkoodiin.
* Ne toimivat JSX tagien sisällä sisältönä tai suoraan `=` merkin jälkeen attribuuteissa.
* `{{` ja `}}` ei ole erityistä syntaksia: se on JavaScriptin olio JSX aaltosulkeiden sisällä.

</Recap>

<Challenges>

### Korjaa ongelma {/*fix-the-mistake*/}

Tämä koodi kaatuu virheellä `Objects are not valid as a React child`:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Löydätkö ongelman?

<Hint>Katso mitä aaltosulkeiden sisällä on. Onko se oikein?</Hint>

<Solution>

Näin käy koska esimerkki renderöi *kokonaisen olion itsessään* merkintäkoodiksi merkkijonon sijaan: `<h1>{person}'s Todos</h1>` yrittää renderöidä kokonaista `person` oliota! Raa'an olion välittäminen tekstisisältönä heittää virheen sillä React ei tiedä miten haluat näyttää sen.

Kokeile korjata se korvaamalla `<h1>{person}'s Todos</h1>` koodilla `<h1>{person.name}'s Todos</h1>`:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

### Poimi tieto olioon {/*extract-information-into-an-object*/}

Siirrä kuvan URL `person` olioon.

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<Solution>

Siirrä kuvan URL `person.imageUrl` ominaisuuteen ja lue se `<img>` tagissa käyttämällä aaltosulkeita:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  imageUrl: "https://i.imgur.com/7vQD0fPs.jpg",
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={person.imageUrl}
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

### Kirjoita Write an expression inside JSX curly braces {/*write-an-expression-inside-jsx-curly-braces*/}

Alla olevassa oliossa kuvan URL osoite on rakennettu neljästä palasta: pohja URL, `imageId`, `imageSize` ja tiedostopäätteestä.

Kuvan URL halutaan rakentuvan näistä attribuuteista: pohja URL (aina `'https://i.imgur.com/'`), `imageId` (`'7vQD0fP'`), `imageSize` (`'s'`) ja tiedostopääte (aina `'.jpg'`). Kuitenkin jotain on pielessä miten `<img>` tagi määrittelee sen `src` attribuutin.

Voitko korjata sen?

<Sandpack>

```js

const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Tarkistaaksesi, että ratkaisusi on toimiva, kokeile muuttaa `imageSize` arvoa arvoksi `'b'`. Kuvan koon pitäisi muuttua muokkauksen jälkeen.

<Solution>

Voit kirjoittaa sen näin `src={baseUrl + person.imageId + person.imageSize + '.jpg'}`.

1. `{` avaa JavaScript lauseen
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` tuottaa oikean URL merkkijonon
3. `}` sulkee JavaScript lauseen

<Sandpack>

```js
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Voit myös siirtää lauseen erilliseen funktioon kuten `getImageUrl`:

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js'

const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={getImageUrl(person)}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Muuttujat ja funktiot auttavat aina pitämään merkintäkoodin yksinkertaisena!

</Solution>

</Challenges>