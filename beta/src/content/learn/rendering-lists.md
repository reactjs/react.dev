---
title: Listojen renderöinti
---

<Intro>

Saatat usein haluta näyttää useita samanlaisia komponentteja datakokoelmasta. Voit käyttää [JavaScriptin listametodeja](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array#) manipuloidaksesi tietojoukkoja. Tällä sivulla tulet käyttämään [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) ja [`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) metodeita Reactissa suodattaaksesi ja muuttaaksesi tietojoukon komponenttitaulukoksi.

</Intro>

<YouWillLearn>

* Miten komponentteja renderöidään listasta käyttäen JavaScriptin `map()` metodia
* Miten renderöidään tiettyjä komponentteja käyttäen JavaScriptin `filter()` metodia
* Miksi ja milloin käyttää React key:ta

</YouWillLearn>

## Tietojen renderöinti taulukosta {/*rendering-data-from-arrays*/}

Sanotaan, että sinulla on taulukko sisältöä.

```js
<ul>
  <li>Creola Katherine Johnson: mathematician</li>
  <li>Mario José Molina-Pasquel Henríquez: chemist</li>
  <li>Mohammad Abdus Salam: physicist</li>
  <li>Percy Lavon Julian: chemist</li>
  <li>Subrahmanyan Chandrasekhar: astrophysicist</li>
</ul>
```

Ainoa ero taulukon alkioiden välillä on niiden sisältö eli data. Usein täytyy näyttää useita ilmentymiä samasta komponentista eri datalla käyttöliittymiä rakentaesa: kommenttilistoista profiilikuvien gallerioihin. Näissä tilanteissa voit tallentaa datan JavaScriptin olioihin ja taulukoihin käyttämällä metodeja kuten `map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) ja [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) renderöidäksesi niistä komponenttilistan.

Tässä lyhyt esimerkki miten luoda kohdelistaus tietojoukosta:

1. **Siirrä** datat taulukkoon:

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];
```

1. **Mäppää** `people` kohteet uuteen taulukkoon `listItems` koostuen JSX:sta:

```js
const listItems = people.map(person => <li>{person}</li>);
```

3. **Palauta** `listItems` komponentistasi käärittynä `<ul>` sisään:

```js
return <ul>{listItems}</ul>;
```

Tässä lopputulos:

<Sandpack>

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```

```css
li { margin-bottom: 10px; }
```

</Sandpack>

Huomaa hiekkalaatikko yllä, joka näyttää konsolivirheen:

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

Opit miten tämä virhe korjataan myöhemmin tällä sivulla. Ennen kuin menemme siihen, jäsennetään dataasi hieman.

## Taulukon tietojen suodattaminen {/*filtering-arrays-of-items*/}

Tätä dataa voidaan jäsentää vielä enemmän.

```js
const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
}, {
  name: 'Percy Lavon Julian',
  profession: 'chemist',  
}, {
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
}];
```

Sanotaan, että haluat näyttää vain henkilöt joiden ammatti on `'chemist'`. Voit käyttää JavaScriptin `filter()` metodia palauttaaksesi vain ne henkilöt. Tämä metodi ottaa talukon kohteista ja välittää ne "testin" läpi (funktion, joka palauttaa `true` tai `false`) ja palauttaa uuden taulukon sisältäen vain ne kohteet jotka läpäisiviät testin (palautti `true`).

Haluat vain kohteet joissa `profession` on `'chemist'`. Tämä "testaus" funktio tälle näyttäisi seuraavalta `(person) => person.profession === 'chemist'`. Tässä kuinka se vielä kootaan:

1. **Luo** uusi taulukko `chemists` sisältäen vain "chemist" henkilöt kutsumalla `filter()` metodia `people` taulukossa suodattaen `person.profession === 'chemist'`:

```js
const chemists = people.filter(person =>
  person.profession === 'chemist'
);
```

1. Nyt **mäppää** `chemists`:

```js {1,13}
const listItems = chemists.map(person =>
  <li>
     <img
       src={getImageUrl(person)}
       alt={person.name}
     />
     <p>
       <b>{person.name}:</b>
       {' ' + person.profession + ' '}
       known for {person.accomplishment}
     </p>
  </li>
);
```

1. Lopuksi, **palauta** `listItems` komponentistasi:

```js
return <ul>{listItems}</ul>;
```

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const listItems = chemists.map(person =>
    <li>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Pitfall>

Nuolifunktiot implisiittisesti palauttavat lausekkeen heti `=>` jälkeen, joten et tarvitse `return` lausetta:

```js
const listItems = chemists.map(person =>
  <li>...</li> // Implisiittinen palautus!
);
```

Kuitenkin, **sinun täytyy kirjoittaa `return` eksplisiittisesti jos `=>` jälkeen tulee `{` aaltosulje!**

```js
const listItems = chemists.map(person => { // Aaltosulje
  return <li>...</li>;
});
```

Nuolifunktiot, jotka sisältävät `=> {` sanotaan omaavan ["block body":n.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body) Niissä voit kirjoittaa enemmän kuin yhden rivin koodia, mutta sinun *täytyy* kirjoittaa `return` lauseke. Jos unohdat sen, mitään ei palaudu!

</Pitfall>

## Listojen pitäminen järjestyksessä käyttämällä `key`:ta {/*keeping-list-items-in-order-with-key*/}

Huomaa, että kaikki alla yllä olevat hiekkalaatikot näyttävät virheen konsolissa:

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

Joudut antamaan jokaiselle taulukon kohteelle `key`:n -- merkkijonon tai numeron joka tunnistaa yksilöllisesti sen muista taulukon kohteista:

```js
<li key={person.id}>...</li>
```

<Note>

JSX elementit suoraan `map()` kutsun sisällä tarvitsevat aina avaimet!

</Note>

Avaimet kertovat Reactille mitkä taulukon kohteet vastaavat mitäkin komponenttia, jotta se voi yhdistää ne myöhemmin. Tästä tulee tärkeää jos taulukon kohteet voivat liikkua (esim. suodatuksen seurauksena), kohteita lisätään tai poistetaan. Hyvin valittu `key` auttaa Reactia päättämään mitä oikeastaan on tapahtunut tehdäkseen oikeat päivitykset DOM-puuhun.

Sen sijaan, että avaimet luotaisiin lennosta, kannattaa sisällyttää ne datassasi:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}</b>
          {' ' + person.profession + ' '}
          known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js data.js active
export const people = [{
  id: 0, // Used in JSX as a key
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1, // Used in JSX as a key
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2, // Used in JSX as a key
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3, // Used in JSX as a key
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4, // Used in JSX as a key
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<DeepDive title="Useiden DOM-kohteiden näyttäminen jokaikselle taulukon kohteelle">

Mitä teet kun yhden kohteen täytyy renderlidä useampi DOM-kohde?

Lyhyt [`<>...</>` Fragment](/apis/react/Fragment)-syntaksi ei anna sinun välittää avainta, joten joudut joko sisällyttämään ne `<div>`:n sisälle, tai voit käyttää hieman pitempää ja [eksplisiittisempää `<Fragment>` syntaksia:](/apis/react/Fragment#rendering-a-list-of-fragments)

```js
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

Fragmentit häviävät DOM:sta, joten tämä tuottaa tasaisen listauksen elementeistä `<h1>`, `<p>`, `<h1>`, `<p>`, ja niin edelleen.

</DeepDive>

### Mistä saat `key`:n {/*where-to-get-your-key*/}

Eri tietolähteet tarjoavat eri lähteet avaimille:

* **Data tietokannasta:** Jos datasi tulee tietokannasta, voit käyttää tietokannan avaimia/ID:tä, jotka ovat luonnostaan uniikkeja.
* **Paikallisesti luotu data:** Jos datasi on luotu ja tallennettu paikallisesti (esim. muistiinpanot muistiinpanosovelluksessa), käytä kasvavaa laskuria, [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID):ta, tai a pakettia kuten [`uuid`](https://www.npmjs.com/package/uuid) kohteita luodessa.

### Avainten säännöt {/*rules-of-keys*/}

* **Avainten on oltava uniikkeja sen sisaruksiin nähden.** Kuitenkin, on sallittau käyttää samoja avaimia JSX kohteissa _eri_ taulukoissa.
* **Avaimet eivät saa muuttua** tai se tuhoaa niiden koko tarkoituksen! Älä luo niitä kun renderöidään.

### Miksi React tarvitsee avaimia? {/*why-does-react-need-keys*/}

Kuvittele, että tiedostoilla työpöydälläsi ei olisi nimiä. Sen sijaan viittaisit niihin niiden järjestyksen perusteella -- ensimmäinen tiedosto, toinen tiedosto, ja niin edelleen. Voisit tottua siihen, mutta kun poistat tiedoston niin siitä tulisi sekavaa. Toisesta tiedostosta tulisi ensimmäinen, kolmannesta toinen, ja niin edelleen.

Tiedostonimet kansioissa ja JSX avaimet taulukossa palvelevat samantapaiseen tarkoitukseen. Sen avulla voidaan yksilöidä kohteet sen sisaruksista. Hyvin valittu avain tarjoaa enemmän tietoa kuin pelkän sijainnin taulukossa. Vaikka _sijainti_ muuttuisi uudelleenjärjestyksen seurauksena, `key`:n avulla React tunnistaa kohteet sen elinkaaren aikana.

<Pitfall>

Saatat tuntea houkutusta käyttää kohteen indeksiä taulukossa sen avaimena. Itse asiassa, sitä React käyttää kun et määrittele `key`:ta ollenkaan. Kohteiden järjestys muuttuu ajan kuluessa, jos kohteita lisätään, poistetaan tai jos taulukko järjestetään uudelleen. Indeksi avaimena johtaa usein hienovaraisiin ja sekaviin bugeihin.

Vastaavasti, älä luo avaimia lennosta. esim `key={Math.random()}`. Tämän seurauksena avaimet eivät koskaan vastaa toisiaan renderöintien välillä johtaen jokaisen komponentin ja DOM-kohteen uudelleenluontiin joka kerta. Tämä ei ole ainoastaan hidasta, mutta se myös unohtaa käyttäjän syötteen listan kohteissa. Käytä sen sijaan vakaita ID:ta datan pohjalta.

Huomaa, että komponenttisi eivät vastaanota `key`:ta propsina. React käyttää sitä vinkkinä vain itselleen. Jos komponenttisi tarvitsee ID:n, täytyy se välittää erillisenä propsina: `<Profile key={id} userId={id} />`.

</Pitfall>

<Recap>

Tällä sivulla olet oppinut:

* Miten siirtää dataa komponenteista ulos tietorakenteisiin kuten taulukoihin ja olioihin.
* Miten luodaan joukkoja samanlaisia komponentteja käyttämällä JavaScript:n `map()` metodia.
* Miten luodaan taulukkoja suodatetuista kohteista käyttämällä JavaScript:n `filter()` metodia.
* Miksi ja miten asetetaan `key` jokaisen kokoelman komponentille, jotta React voi pitää kohteita yllä vaikka niiden sijainti tai data muuttuisi.

</Recap>



<Challenges>

#### Listan jakaminen kahteen {/*splitting-a-list-in-two*/}

Tämä esimerkki näyttää listan kaikista henkilöistä.

Muuta se näyttämään kaksi erillistä listaa toinen toisensa jälkeen: **Chemists** ja **Everyone Else**. Kuten aiemmin, voit määritellä mikäli henkilö on kemisti tarkistamalla jos `person.profession === 'chemist'`.

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Solution>

Voit myös käyttää `filter()` metodia kahdesti, luoden kaksi erillistä taulukkoa ja sitten mäppäät molemmat niistä:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <h2>Chemists</h2>
      <ul>
        {chemists.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
      <h2>Everyone Else</h2>
      <ul>
        {everyoneElse.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

Tässä ratkaisussa, `map` kutsut sijoitetaan suoraan samalle riville `<ul>` elementteihin, mutta voit esitellä muuttujia niille mikäli koet sen luettavempana.

Tässä on vielä hieman koodin toistoa renderöityjen listojen kesken. Voit mennä pidemmälle ja siirtää toistuvan koodin `<ListSection>` komponenttiin:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

Tarkkaavainen lukija saattaa huomata, että kahden `filter` kutsun takia tarkistamme jokaisen henkilön ammatin kahdesti. Propertyn tarkistaminen on hyvin nopeaa, joten tässä esimerkissä se ei haittaa. Jos logiikkasi kuitenkin olisi raskaampaa kuin tässä, voisit korvata `filter` kutsut silmukalla, joka manuaalisesti luo taulukot ja tarkistaa henkilön vain kerran.

Itse asiassa, jos `people` ei koskaan muutu, voit siirtää tämän koodin pois komponentistasi. Reactin näkökulmasta riittää, että annat sille taulukon JSX-kohteita. Ei ole merkitystä miten luot kyseisen taulukon:

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

let chemists = [];
let everyoneElse = [];
people.forEach(person => {
  if (person.profession === 'chemist') {
    chemists.push(person);
  } else {
    everyoneElse.push(person);
  }
});

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

</Solution>

#### Sisäkkäiset listat yhdessä komponenetissa {/*nested-lists-in-one-component*/}

Tee lista resepteista tästä taulukosta! Näytä jokaiselle reseptille taulukossa sen otsikko `<h2>` elementtinä ja listaa sen ainesosat `<ul>` elementissä.

<Hint>

Tämä vaatii kaksi sisäkkäistä `map` kutsua.

</Hint>

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

Tässä yksi tapa, jota voit käyttää:

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

Jokainen `recipes` valmiiksi sisältää `id` kentän, joten ulompi silmukka käyttää sitä sen `key`:na. Ainesosia läpikäydessä ei ole ID:ta jota voisit käyttää. Kuitenkin on kohtuullista olettaa, että samoja ainesosia ei listata kahdesti samassa reseptissa, joten sen nimi voi toimia sen `key`:na. Vaihtoehtoisesti, voit muuttaa tietorakennetta sisällyttämään ID:n tai käyttää sen indeksiä `key`:na (sillä varauksella, että et voi turvallisesti järjestää ainesosia uudelleen).

</Solution>

#### Irrota lista-elementti omaan komponenttiin {/*extracting-a-list-item-component*/}

Tämä `RecipeList` komponentti sisältää kaksi `map` kutsua. Yksinkertaistaaksesi sen, luo `Recipe` komponentti siitä joka vastaanottaa `id`, `name` ja `ingredients` propsit. Mihin sijoittaisit ulomman `key`:n ja miksi?

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

Voit kopioida JSX-koodin ulommasta `map`:sta uuteen `Recipe` komponenttiin ja palauttaa sen JSX:n. Voit sitten muuttaa `recipe.name` lukemaan `name`, `recipe.id` lukemaan `id`, ja niin edelleen ja välittää ne propseina `Recipe` komponentille:

<Sandpack>

```js
import { recipes } from './data.js';

function Recipe({ id, name, ingredients }) {
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        {ingredients.map(ingredient =>
          <li key={ingredient}>
            {ingredient}
          </li>
        )}
      </ul>
    </div>
  );
}

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <Recipe {...recipe} key={recipe.id} />
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

Tässä `<Recipe {...recipe} key={recipe.id} />` on lyhytsyntaksi joka "välittää kaikki propertyt `recipe` oliosta propseina `Recipe` komponentille". Voisit myös kirjoittaa jokaisen propsin eksplisiittisesti: `<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />`.

**Huomaa, että `key` on määritelty `<Recipe>` komponenttiin eikä `Recipe` komponentin palauttamaan juuri-`<Div>` elementtiin.** Tämä siksi koska `key` tarvitaan suoraan ympäröivän taulukon yhteydessä. Aiemmin sinulla oli taulukko `<div>` elementtejä, joten jokainen niistä tarvitsi `key`:n, mutta nyt sinulla on taulukko `<Recipe>`:ja. Toisin sanoen, kun irrotat komponentin koodista, älä unohda siirtää `key`:ta kopioidun JSX koodin ulkopuolelle.

</Solution>

#### Listat erottimella {/*list-with-a-separator*/}

Tämä esimerkki renderöi kuuluisan Katsushika Hokusain haikun, jokaisen rivin ollessa kääritty `<p>` tagin sisään. Tehtäväsi on sijoittaa `<hr />` erotin jokaisen kappaleen jälkeen. Lopputuloksen rakennelman pitäisi näyttää tältä:

```js
<article>
  <p>I write, erase, rewrite</p>
  <hr />
  <p>Erase again, and then</p>
  <hr />
  <p>A poppy blooms.</p>
</article>
```

Haiku sisältää vain kolme riviä, mutta ratkaisusi tulisi toimia minkä tahansa rivimäärän kanssa. Huomaa, että `<hr />` elementit näkyvät `<p>` elementtien *välissä*, ei vain alussa tai lopussa!

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, index) =>
        <p key={index}>
          {line}
        </p>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

(Tämä on harvinainen tilanne missä indeksi avaimena on hyväksyttävää koska runon rivit eivät koskaan järjesty uudelleen.)

<Hint>

Sinun täytyy joko muuttaa `map` manuaaliseksi silmukaksi tai käyttää fragmentia.

</Hint>

<Solution>

Voit kirjoittaa manuaalisen silmukan, sijoittaen `<hr />` ja `<p>...</p>` palautustaulukoon edetessäsi:

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  let output = [];

  // Fill the output array
  poem.lines.forEach((line, i) => {
    output.push(
      <hr key={i + '-separator'} />
    );
    output.push(
      <p key={i + '-text'}>
        {line}
      </p>
    );
  });
  // Remove the first <hr />
  output.shift();

  return (
    <article>
      {output}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

Alkuperäisen rivin indeksin käyttäminen `key`.na ei enää toimi sillä erottimet ja kappaleet ovat nyt samassa taulukossa. Kuitenkin, voit antaa niille erillisen avaimen käyttämällä jälkiliitettä, esim. `key={i + '-text'}`.

Vaihtoehtoisesti voit renderöidä kokoelman fragmenteja, jotka sisältävät `<hr />` ja `<p>...</p>` tagit. Kuitenkin `<>...</>` lyhytsyntaksi ei tue avainten välittämistä, joten joutuisit kirjoittamaan `<Fragment>`:n eksplisiittisesti:

<Sandpack>

```js
import React, { Fragment } from 'react';

const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, i) =>
        <Fragment key={i}>
          {i > 0 && <hr />}
          <p>{line}</p>
        </Fragment>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

Muista, fragmentit (useiten kirjoitettuna `<> </>`) antavat sinun ryhmittää JSX-kohteita lisäämättä ylimääräisiä `<div>`-elementtejä!

</Solution>

</Challenges>
