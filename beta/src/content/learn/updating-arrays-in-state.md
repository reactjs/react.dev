---
title: Taulukkojen päivittäminen tilassa
---

<Intro>

Taulukot ovat mutatoitavissa, mutta niitä tulisi käsitellä kuin ne olisivat ei-mutatoitavissa kun tallennat niitä tilaan. Kuten olioiden kanssa, päivitä tilaan tallennettu taulukko luomalla uusi (tai tekemällä kopio vanhasta) ja sitten aseta tila käyttämään uutta taulukkoa.

</Intro>

<YouWillLearn>

- Miten lisätä, poistaa, tai muuttaa taulukon kohteita Reactin tilassa
- Miten päivittää taulukon sisällä olevaa oliota
- Miten teet taulukoiden kopioimisesta vähemmän toistuvaa Immerillä

</YouWillLearn>

## Taulukkojen päivittäminen ilman mutaatiota {/*updating-arrays-without-mutation*/}

JavaScriptissa taulukot ovat kuin toisenlainen olio. [Kuten olioiden kanssa](/learn/updating-objects-in-state), **sinun tulisi käsitellä Reactin tilan taulukkoja vain-luku muodossa.** Tämä tarkoittaa, että sinun ei pitäisi uudelleen määritellä taulukon kohteita `arr[0] = 'bird'` tavalla eikä kannattaisi käyttää mutatoivia tapoja muokata taulukkoa, kuten `push()` ja `pop()`.

Sen sijaan, joka kerta kun haluat päivittää taulukkoa, haluat välittää *uuden* taulukon tilan asettajafunktiolle. Voit tehdä tämän luomalla uuden taulukon alkuperäisestä taulukosta kutsumalla sen ei-mutatoivia metodeja kuten `filter()` ja `map()`. Sitten voit asettaa uuden taulukon tilaksi.

Tässä on viitetaulukko yleisistä taulukon toiminnoista. Kun käsittelet taulukoita Reactin tilassa, sinun pitäisi välttää metodeja taulukon vasemmalla sarakkeella, ja sen sijaan suosia metodeja taulukon oikealla sarakkeella:

|               | vältä (mutatoi taulukkoa)           | suosi (palauttaa uuden taulukon)                                        |
| ------------- | ----------------------------------- | ----------------------------------------------------------------------- |
| lisääminen    | `push`, `unshift`                   | `concat`, `[...arr]` spread syntaksi ([esimerkki](#adding-to-an-array)) |
| poistaminen   | `pop`, `shift`, `splice`            | `filter`, `slice` ([esimerkki](#removing-from-an-array))                |
| korvaaminen   | `splice`, `arr[i] = ...` määrittely | `map` ([esimerkki](#replacing-items-in-an-array))                       |
| järestäminen  | `reverse`, `sort`                   | kopioi taulukko ensin ([esimerkki](#making-other-changes-to-an-array))  |

Vaihtoehtoisesti, voit [käyttää Immeriä](#write-concise-update-logic-with-immer), jonka avulla voit käyttää metodeja molemmista sarakkeista.

<Pitfall>

Unfortunately, [`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) and [`splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) are named similarly but are very different:

* `slice` lets you copy an array or a part of it.
* `splice` **mutates** the array (to insert or delete items).

In React, you will be using `slice` (no `p`!) a lot more often because you don't want to mutate objects or arrays in state. [Updating Objects](/learn/updating-objects-in-state) explains what mutation is and why it's not recommended for state.

</Pitfall>

### Taulukkoon lisääminen {/*adding-to-an-array*/}

`push()` funktio tekee mutaation, jota et halua:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setName('');
        artists.push({
          id: nextId++,
          name: name,
        });
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Sen sijaan luo *uusi* taulukko, joka sisältää aiemman taulukonkohteet *ja* uuden kohteen taulukon lopussa. Tämän toteuttamiseen on useita tapoja, mutta helpoin on käyttää `...` [array spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals) syntaksia:

```js
setArtists( // Korvaa tila
  [ // uudella taulukolla
    ...artists, // joka sisältää vanhat kohteet
    { id: nextId++, name: name } // ja yhden uuden lopussa
  ]
);
```

Nyt se toimii oikein:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setName('');
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Taulukon spread syntaksilla voit myös lisätä kohteen taulukon alkuun, sijoittamalla sen *ennen* alkuperäistä `...artists` taulukkoa:

```js
setArtists([
  { id: nextId++, name: name },
  ...artists // Aseta vanhat kohteet loppuun
]);
```

Näin spread syntaksi hoitaa sekä `push()` funktion että `unshift()` funktion työt. Kokeile yllä olevassa hiekkalaatikossa!

### Taulukosta poistaminen {/*removing-from-an-array*/}

Helpoin tapa poistaa kohde taulukosta on *suodattamalla se pois*. Toisin sanoen, luot uuden taulukon, joka ei sisällä poistettavaa kohdetta. Voit tehdä tämän käyttämällä `filter`metodia, esimerkiksi:

<Sandpack>

```js
import { useState } from 'react';

let initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [artists, setArtists] = useState(
    initialArtists
  );

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            {artist.name}{' '}
            <button onClick={() => {
              setArtists(
                artists.filter(a =>
                  a.id !== artist.id
                )
              );
            }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Klikkaa "Delete" painiketta muutaman kerran ja tarkastele sen klikkauskäsittelijää.

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

Tässä `artists.filter(a => a.id !== artist.id)` tarkoittaa "luo uusi taulukko, joka koostuu `artists` kohteista, joiden ID:t ovat eri kuin `artist.id`". Toisin sanoen, jokaisen artistin "Delete" painike suodattaa _juuri sen_ artistin pois taulukosta, ja sitten pyytävät uudelleen renderöintiä lopullisella taulukolla. Huomaa, että `filter` ei muokkaa olemassa olevaa taulukkoa.

### Taulukon muuntaminen {/*transforming-an-array*/}

Jos haluat muuntaa joitakin tai kaikkia taulukon kohteita, voit käyttää `map()` metodia luodaksesi **uuden** taulukon. Funktion, jonka välität `map` metodille voi määritellä mitä teet kullekin kohteelle sen datan tai indeksin (tai molempien) pohjalta.

Tässä esimerkissä taulukko sisältää koordinaatit kahdelle ympyrälle ja yhdelle neliölle. Kun painat painiketta, se siirtää vain ympyröitä 50 pikseliä alaspäin. Se tekee tämän luomalla uuden taulukon käyttäen `map()` funktiota:

<Sandpack>

```js
import { useState } from 'react';

let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 100 },
  { id: 1, type: 'square', x: 150, y: 100 },
  { id: 2, type: 'circle', x: 250, y: 100 },
];

export default function ShapeEditor() {
  const [shapes, setShapes] = useState(
    initialShapes
  );

  function handleClick() {
    const nextShapes = shapes.map(shape => {
      if (shape.type === 'square') {
        // No change
        return shape;
      } else {
        // Return a new circle 50px below
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
    });
    // Re-render with the new array
    setShapes(nextShapes);
  }

  return (
    <>
      <button onClick={handleClick}>
        Move circles down!
      </button>
      {shapes.map(shape => (
        <div
          key={shape.id}
          style={{
          background: 'purple',
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          borderRadius:
            shape.type === 'circle'
              ? '50%' : '',
          width: 20,
          height: 20,
        }} />
      ))}
    </>
  );
}
```

```css
body { height: 300px; }
```

</Sandpack>

### Taulukon kohteiden korvaaminen {/*replacing-items-in-an-array*/}

On yleistä, että haluat korvata yhden tai useamman kohteen taulukossa. 
It is particularly common to want to replace one or more items in an array. Määritykset kuten `arr[0] = 'bird'` mutatoivat alkuperäistä taulukkoa, joten sen sijaan voit käyttää `map` metodia myös tähän.

Korvataksesi kohteen, luo uusi taulukko `map`:lla. `map` kutsun sisälle vastaanotat kohteen indeksin toisena argumenttina. Käytä sitä päättämään, palautetaanko alkuperäinen kohde (ensimmäinen argumentti) vai jotain muuta:

<Sandpack>

```js
import { useState } from 'react';

let initialCounters = [
  0, 0, 0
];

export default function CounterList() {
  const [counters, setCounters] = useState(
    initialCounters
  );

  function handleIncrementClick(index) {
    const nextCounters = counters.map((c, i) => {
      if (i === index) {
        // Increment the clicked counter
        return c + 1;
      } else {
        // The rest haven't changed
        return c;
      }
    });
    setCounters(nextCounters);
  }

  return (
    <ul>
      {counters.map((counter, i) => (
        <li key={i}>
          {counter}
          <button onClick={() => {
            handleIncrementClick(i);
          }}>+1</button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

### Tiettyyn kohtaan lisääminen {/*inserting-into-an-array*/}

Joskus saatat haluta sijoittaa kohteen tiettyyn kohtaan, joka ei kuitenkaan ole taulukon alussa tai lopussa. Voit tehdä tämän käyttämällä `...` syntaksia yhdessä `slice()` metodin kanssa. `slice()` metodi antaa sinun leikata "palan" taulukosta. Sijoittaaksesi kohteen, luot uuden taulukon joka levittää "palan" _ennen_ sijoituskohtaa, sitten uuden kohteen, ja lopuksi loput alkuperäisestä taulukosta.

Tässä esimerkissä, "Insert" painike sijoittaa aina indeksiin `1`:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState(
    initialArtists
  );

  function handleClick() {
    const insertAt = 1; // Could be any index
    const nextArtists = [
      // Items before the insertion point:
      ...artists.slice(0, insertAt),
      // New item:
      { id: nextId++, name: name },
      // Items after the insertion point:
      ...artists.slice(insertAt)
    ];
    setArtists(nextArtists);
    setName('');
  }

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        Insert
      </button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

### Muiden muutosten tekeminen taulukkoihin {/*making-other-changes-to-an-array*/}

On joitakin asioita, joita et voi tehdä pelkällä spread syntaksilla ja ei-mutatoivilla metodeilla kuten `map()`:lla ta` `filter()`:lla. Esimerkiksi, saatat haluta kääntää taulukon järjestyksen tai suodattaa taulukkoa. JavaScriptin `reverse()`- ja `sort()`-metodit muuttavat alkuperäistä taulukkoa, joten niitä ei voi käyttää suoraan.

**Kuitenkin, voit kopioida taulukon ensiksi ja sitten tehdä muutoksia siihen.**

Esimerkiksi:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies' },
  { id: 1, title: 'Lunar Landscape' },
  { id: 2, title: 'Terracotta Army' },
];

export default function List() {
  const [list, setList] = useState(initialList);

  function handleClick() {
    const nextList = [...list];
    nextList.reverse();
    setList(nextList);
  }

  return (
    <>
      <button onClick={handleClick}>
        Reverse
      </button>
      <ul>
        {list.map(artwork => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Tässä käytät `[...list]` spread syntaksia luodaksesi kopion alkuperäisestä taulukosta ensiksi. Nyt kun kopio on luotu, voit käyttää mutatoivia metodeja kuten `nextList.reverse()` tai `nextList.sort()`, tai jopa määrittää yksittäisiä kohteita `nextList[0] = "something"` määrittelyllä.

Kuitenkin, **vaikka kopioisit taulukon, et voi mutatoida _sen sisällä_ olevia kohteita suoraan.** Tämä siksi koska kopiointi on pinnallista--uusi taulukko sisältää samat kohteet kuin alkuperäinen. Joten jos muokkaat kopioidun taulukon sisällä olevia olioita, mutatoit olemassa olevaa tilaa. Esimerkiksi, alla oleva koodi on ongelmallista.

```js
const nextList = [...list];
nextList[0].seen = true; // Ongelma: mutatoi list[0] kohdetta
setList(nextList);
```
Vaikka `nextList` ja `list` ovat kaksi eri taulukkoa, **`nextList[0]` ja `list[0]` osoittavat samaan olioon.** Joten muuttamalla `nextlist[0].seen` kohdetta muutat myös `list[0].seen` kohdetta. Tämä on tilanmuutos, jota tulisi välttää! Voit ratkaista ongelman samalla tavalla kuin [sisäkkäisten olioiden päivittäminen](/learn/updating-objects-in-state#updating-a-nested-object)--eli kopioimalla yksittäiset kohteet, joita haluat muuttaa mutatoinnin sijaan. Näin se onnistuu.

## Olioiden päivittäminen taulukon sisällä {/*updating-objects-inside-arrays*/}

Oliot eivät _oikeasti_ sijaitse taulukkojen "sisällä". Ne saattavat näyttäytyä olevan "sisällä" koodissa, mutta jokainen olio taulukossa on erillinen arvo johon taulukko "osoittaa". Tämän takia täytyy olla tarkkana kun muutat sisäkkäisiä kenttiä kuten `list[0]`. Toisen henkilön taideteoslista saattaa osoittaa samaan kohteeseen taulukossa!

**Päivittäessä sisäkkäistä tilaa, sinun täytyy luoda kopioita siihen pisteeseen saakka mitä haluat päivittää, ja aina ylätasoon asti.** Katsotaan miten tämä toimii.

Tässä esimerkissä, kahdella erillisellä taideteoslistalla on sama aloitustila. Niiden on tarkoitus olla eristettyinä, mutta mutaation seurauksena niiden tila on vahingossa jaettu. Valintaruudun valitseminen yhdessä listassa vaikuttaa toiseen listaan:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    const myNextList = [...myList];
    const artwork = myNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setMyList(myNextList);
  }

  function handleToggleYourList(artworkId, nextSeen) {
    const yourNextList = [...yourList];
    const artwork = yourNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setYourList(yourNextList);
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

Ongelma on seuraavassa koodissa:

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // Ongelma: mutatoi olemassa olevaa kohdetta
setMyList(myNextList);
```

Vaikka `myNextList` taulukko on uusi, *kohteet* ovat samat kuin alkuperäisessä `myList` taulukossa. Joten `artwork.seen`:n muuttaminen muuttaa *alkuperäistä* taideteoskohdetta. Tuo taideteos on myös `yourArtworks` taulukossa, joka aiheuttaa bugin. Tällaisia bugeja voi olla vaikea ajatella, mutta onneksi ne katoavat jos vältät tilan mutatointia.

**Voit käyttää `map` metodia korvataksesi vanhan kohteen sen päivitetyllä versiolla ilman mutatointia.**

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // Luo *uusi* olio muutoksilla
    return { ...artwork, seen: nextSeen };
  } else {
    // Ei muutosta
    return artwork;
  }
});
```

Tässä, `...` on olion levityssyntaksi, jota käytetään [uuden kopion luomiseksi.](/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax)


With this approach, none of the existing state items are being mutated, and the bug is fixed:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    setMyList(myList.map(artwork => {
      if (artwork.id === artworkId) {
        // Create a *new* object with changes
        return { ...artwork, seen: nextSeen };
      } else {
        // No changes
        return artwork;
      }
    }));
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        // Create a *new* object with changes
        return { ...artwork, seen: nextSeen };
      } else {
        // No changes
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

Yleisesti ottaen, **sinun tulisi mutatoida oliota joita olet juuri luonut.** Jos olet sijoittamassa *uutta* taideteosta, voisit mutatoida taulukkoa, mutta jos käsittelet jotain, joka on jo tilassa, sinun täytyy tehdä kopio.

### Kirjoita tiivis päivityslogiikka Immerillä {/*write-concise-update-logic-with-immer*/}

Sisennettyjen taulukoiden päivittäminen ilman mutaatiota saattaa koitua toistuvaksi. [Juuri kuten olioiden kanssa](/learn/updating-objects-in-state#write-concise-update-logic-with-immer):

- Yleisesti ottaen sinun ei tulisi päivittää tilaa kahta tasoa syvemmältä. Jos tilaoliosi ovat todella syviä, saatat haluta [järjestää ne eri tavalla](/learn/choosing-the-state-structure#avoid-deeply-nested-state), jotta ne olisivat tasaisia.
- Jos et haluat muuttaa tilasi rakennetta, saatat pitää [Immer](https://github.com/immerjs/use-immer):stä, jonka avulla voit kirjoittaa kätevällä mutta mutatoivalla syntaksilla, hoitaen kopiot puolestasi.

Tässä on Art Bucket List esimerkki uudelleenkirjoitettuna Immerillä:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, updateMyList] = useImmer(
    initialList
  );
  const [yourArtworks, updateYourList] = useImmer(
    initialList
  );

  function handleToggleMyList(id, nextSeen) {
    updateMyList(draft => {
      const artwork = draft.find(a =>
        a.id === id
      );
      artwork.seen = nextSeen;
    });
  }

  function handleToggleYourList(artworkId, nextSeen) {
    updateYourList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourArtworks}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Huomaa miten Immerillä **mutatointi kuten `artwork.seen = nextSeen` on nyt sallittua:**

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```

Tämä siksi koska et mutatoi _alkuperäistä_ tilaa, vaan mutatoit erityistä `draft` oliota, jonka Immer tarjoaa. Vastaavasti, voit käyttää mutatoivia metodeja kuten `push()` ja `pop()` `draft` olion sisällöille.

Konepellin alla Immer luo aina uuden tilan alusta pohjautuen muutoksiin, joita teit `draft` oliolle. Tämä pitää tapahtumakäsittelijäsi todella tiiviinä mutatoimatta tilaa.

<Recap>

- Voit laittaa taulukkoja tilaan, mutta et voi muuttaa niitä.
- Mutatoinnin sijaan luot *uuden* version siitä ja päivität tilan vastaamaan sitä.
- Voit käyttää `[...arr, newItem]` array levityssyntaksia luodaksesi taulukon uusilla kohteilla.
- Voit käyttää `filter()` ja `map()` metodeja luodaksesi uuden taulukon suodatetuilla tai muunneltuilla kohteilla.
- Voit käyttää Immeriä pitääksesi koodin tiivinä.

</Recap>



<Challenges>

#### Päivitä kohdetta ostoskorissa {/*update-an-item-in-the-shopping-cart*/}

Täytä `handleIncreaseClick`:n logiikka, jotta "+":n painaminen kasvattaa vastaavaa numeroa:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {

  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

Voit käyttää `map` funktiota luodaksesi uuden taulukon, ja sitten käyttää `...` olion levityssyntaksia luodaksesi kopion muutetusta oliosta uuteen taulukkoon:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Poista kohde ostoskorista {/*remove-an-item-from-the-shopping-cart*/}

Ostoskorissa on toimiva "+" painike, mutta "-" painike ei tee mitään. Sinun täytyy lisätä tapahtumakäsittelijä siihen, jotta painaminen vähentää `count` lukua kyseisestä tuotteesta. Jos painat "-" kun luku on 1, tuote tulisi automaattisesti poistua ostoskorista. Varmista, että se ei koskaan näytä lukua 0.

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

Voit ensiksi käyttää `map` metodia tuottaaksesi uuden taulukon ja sitten `filter` poistaaksesi tuotteet, joilla `count` on asetettu arvoksi `0`:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  function handleDecreaseClick(productId) {
    let nextProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count - 1
        };
      } else {
        return product;
      }
    });
    nextProducts = nextProducts.filter(p =>
      p.count > 0
    );
    setProducts(nextProducts)
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button onClick={() => {
            handleDecreaseClick(product.id);
          }}>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Korjaa mutaatiot käyttämällä ei-mutatoivia tapoja {/*fix-the-mutations-using-non-mutative-methods*/}

Tässä esimerkissä, kaikki tapahtumakäsittelijät `App.js` tiedostossa käyttävät mutaatiota. Lopputuloksena on, että tehtävien muokkaaminen ja poistaminen ei toimi. Uudelleenkirjoita `handleAddTodo`, `handleChangeTodo` ja `handleDeleteTodo` käyttämään ei-mutatoivia metodeja:

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution>

`handleAddTodo` funktiossa voit käyttää taulukon levityssyntaksia. `handleChangeTodo` funktiossa voit luoda uuden taulukon käyttämällä `map` metodia. `handleDeleteTodo` funktiossa voi luoda uuden taulukon käyttämällä `filter` metodia. Nyt listan pitäisi toimia oikein:

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

</Solution>


#### Korjaa mutaatiot Immerillä {/*fix-the-mutations-using-immer*/}

Tämä on sama esimerkki kuin aiempi haaste. Tällä kertaa korjaa mutaatiot käyttämällä Immeriä. Avuksesi `useImmer` on jo tuotu, joten sinun täytyy muuttaa `todos` tilamuuttuja käyttämään sitä.

<Sandpack>

```js App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution>

Immerillä voit luoda koodia mutatoivalla tavalla, kunhan mutatoit Immerin antama `draft` olion osia. Tässä kaikki mutaatiot on tehty `draft`:lle, joten koodi toimii:

<Sandpack>

```js App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(draft => {
      const todo = draft.find(t =>
        t.id === nextTodo.id
      );
      todo.title = nextTodo.title;
      todo.done = nextTodo.done;
    });
  }

  function handleDeleteTodo(todoId) {
    updateTodos(draft => {
      const index = draft.findIndex(t =>
        t.id === todoId
      );
      draft.splice(index, 1);
    });
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Voit myös yhdistellä mutatoivaa ja ei-mutatoivaa tapaa Immerillä.

Esimerkiksi, tämä versio `handleAddTodo` funktiosta on toteutettu mutatoimalla Immerin `draft` oliota, kun taas `handleChangeTodo` ja `handleDeleteTodo` funktiot käyttävät ei-mutatoivia `map` ja `filter` metodeja:

<Sandpack>

```js App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(todos.map(todo => {
      if (todo.id === nextTodo.id) {
        return nextTodo;
      } else {
        return todo;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    updateTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Immerillä voit käyttää tyyliä, joka tuntuu luonnollisimmalta kuhunkin tapaukseen.

</Solution>

</Challenges>
