---
title: Interaktiivisuuden lisääminen
---

<Intro>

Jotkin asiat ruudulla päivittyvät käyttäjän syötteen mukaan. Esimerkiksi, kuvan klikkaaminen galleriassa vaihtaa aktiivista kuvaa. Reactissa ajan myötä muuttuvia tietoja kutsutaan *tilaksi.* Voit lisätä tilan mihin tahansa komponenttiin ja päivittää sitä tarvittaessa. Tässä luvussa opit miten kirjoitetaan komponentteja, jotka vastaavat toimintohin, päivittävät niiden tilaa sekä näyttävät eri tulostetta ajan myötä.

</Intro>

<YouWillLearn isChapter={true}>

- [Miten käsitellä käyttäjä-aloitteisia tapahtumia](/learn/responding-to-events)
- [Kuinka saada komponentit "muistamaan" tiedot tilaa hyödyntämällä](/learn/state-a-components-memory)
- [Miten React päivittää käyttöliittymää kahdessa vaiheessa](/learn/render-and-commit)
- [Miksi tila ei päivity heti kun muutat sitä](/learn/state-as-a-snapshot)
- [Miten tilapäivityksiä voi lisätä jonoon](/learn/queueing-a-series-of-state-updates)
- [Miten päivittää oliota tilassa](/learn/updating-objects-in-state)
- [Miten päivittää listaa tilassa](/learn/updating-arrays-in-state)

</YouWillLearn>

## Vastaaminen tapahtumiin {/*responding-to-events*/}

Reactissa voit lisätä *tapahtumakäsittelijöitä* JSX koodiin. Tapahtumakäsittelijät ovat funktioitasi, joita kutsutaan vastauksena käyttäjän toimintoihin kuten klikkaukseen, hoverointiin, focusointiin ja niin edelleen.

Sisäänrakennetut komponentit kuten `<button>` tukevat ainoastaan selaimen sisäänrakennettuja tapahtumia kuten `onClick`. Voit kuitenkin luoda omia komponentteja ja niiden tapahtumakäsittelijöiden nimet voivat olla niin sovelluskohtaisia kuin haluat.

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({onPlayMovie, onUploadImage}) {
  return (
    <div>
      <Button onClick={onPlayMovie}>Play Movie</Button>
      <Button onClick={onUploadImage}>Upload Image</Button>
    </div>
  );
}

function Button({onClick, children}) {
  return <button onClick={onClick}>{children}</button>;
}
```

```css
button {
  margin-right: 10px;
}
```

</Sandpack>

<LearnMore path="/learn/responding-to-events">

Lue **[Responding to Events](/learn/responding-to-events)** oppiaksesi miten lisätä tapahtumakäsittelijöitä.

</LearnMore>

## Tila: komponentin muisti {/*state-a-components-memory*/}

Komponenttien on usein muutettava näytön sisältöä vuorovaikutuksen seurauksena. Lomakkeeseen kirjoittaminen päivittää syöttökenttää, kuvakarusellissa "seuraava" napsauttaminen tulisi muuttaa näytettävää kuvaa, "osta"-painike asettaa tuotteen ostoskoriin. Komponenttien täytyy "muistaa" asioita: nykyinen syöte, nykyinen kuva, ostoskori. Reactissa tämän kaltaista komponenttikohtaista muistia kutsutaan *tilaksi.*

Voit lisätä komponentteihin tilan käyttämällä [`useState`](/apis/react/useState) koukkua eli hookkia. *Hookit* ovat erikoisfunktioita, joilla voit käyttää Reactin ominaisuuksia komponenteissasi (tila on yksi näistä ominaisuuksista). `useState` hookilla voit määritellä tilamuuttujan. Sille voidaan antaa alustava tila ja se palauttaa parin arvoja: nykyisen tilan, sekä setter funktion, jolla voit päivittää sitä.

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

Tässä näet miten kuvagalleria käyttää käyttää ja päivittää tilaa napsautuksella:

<Sandpack>

```js
import {useState} from 'react';
import {sculptureList} from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>Next</button>
      <h2>
        <i>{sculpture.name} </i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img src={sculpture.url} alt={sculpture.alt} />
    </>
  );
}
```

```js data.js
export const sculptureList = [
  {
    name: 'Homenaje a la Neurocirugía',
    artist: 'Marta Colvin Andrade',
    description:
      'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
    url: 'https://i.imgur.com/Mx7dA2Y.jpg',
    alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.',
  },
  {
    name: 'Floralis Genérica',
    artist: 'Eduardo Catalano',
    description:
      'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
    url: 'https://i.imgur.com/ZF6s192m.jpg',
    alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.',
  },
  {
    name: 'Eternal Presence',
    artist: 'John Woodrow Wilson',
    description:
      'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
    url: 'https://i.imgur.com/aTtVpES.jpg',
    alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.',
  },
  {
    name: 'Moai',
    artist: 'Unknown Artist',
    description:
      'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
    url: 'https://i.imgur.com/RCwLEoQm.jpg',
    alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.',
  },
  {
    name: 'Blue Nana',
    artist: 'Niki de Saint Phalle',
    description:
      'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
    url: 'https://i.imgur.com/Sd1AgUOm.jpg',
    alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.',
  },
  {
    name: 'Ultimate Form',
    artist: 'Barbara Hepworth',
    description:
      'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
    url: 'https://i.imgur.com/2heNQDcm.jpg',
    alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.',
  },
  {
    name: 'Cavaliere',
    artist: 'Lamidi Olonade Fakeye',
    description:
      "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
    url: 'https://i.imgur.com/wIdGuZwm.png',
    alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.',
  },
  {
    name: 'Big Bellies',
    artist: 'Alina Szapocznikow',
    description:
      'Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.',
    url: 'https://i.imgur.com/AlHTAdDm.jpg',
    alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.',
  },
  {
    name: 'Terracotta Army',
    artist: 'Unknown Artist',
    description:
      'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
    url: 'https://i.imgur.com/HMFmH6m.jpg',
    alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.',
  },
  {
    name: 'Lunar Landscape',
    artist: 'Louise Nevelson',
    description:
      'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
    url: 'https://i.imgur.com/rN7hY6om.jpg',
    alt: 'A black matte sculpture where the individual elements are initially indistinguishable.',
  },
  {
    name: 'Aureole',
    artist: 'Ranjani Shettar',
    description:
      'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
    url: 'https://i.imgur.com/okTpbHhm.jpg',
    alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.',
  },
  {
    name: 'Hippos',
    artist: 'Taipei Zoo',
    description:
      'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
    url: 'https://i.imgur.com/6o5Vuyu.jpg',
    alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.',
  },
];
```

```css
h2 {
  margin-top: 10px;
  margin-bottom: 0;
}
h3 {
  margin-top: 5px;
  font-weight: normal;
  font-size: 100%;
}
img {
  width: 120px;
  height: 120px;
}
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<LearnMore path="/learn/state-a-components-memory">

Lue **[Tila: Komponentin muisti](/learn/state-a-components-memory)** oppiaksesi miten arvo muistetaan ja päivitetään vuorovaikutuksen vuoksi.

</LearnMore>

## Renderöinti ja kommitointi {/*render-and-commit*/}

Ennen kuin komponenttisi näytetään ruudlla, Reactin täytyy renderöidä ne. Tämän prosessin vaiheiden ymmärtäminen auttaa sinua miettimään miten koodiasi suoritetaan ja selittämään sen toimintaa.

Kuvittele, että komponettisi ovat kokkeja keittiössä, kasaten maukkaita aterioita ainesosista. Tässä skenaariossa React on tarjoilija joka laittaa ylös asiakkaiden tilaukset sekä vie tilaukset heille. Tässä käyttöliittymän pyyntö- ja vientiprosessissa on kolme vaihetta:

1. **Triggeröidään** renderöinti (viedään ruokalijan tilaus keittiölle)
2. **Renderöidään** komponentti (valmistellaan tilausta keittiössä)
3. **Kommitoidaan** DOM:iin (asetetaan tilaus pöydälle)

<IllustrationBlock sequential>
  <Illustration
    caption="Triggeröinti"
    alt="React toimii tarjoilijana ravintolassa, hakien tilauksia käyttäjiltä ja tarjoillen niitä Keittiö komponentille."
    src="/images/docs/illustrations/i_render-and-commit1.png"
  />
  <Illustration
    caption="Renderöinti"
    alt="Card kokki antaa Reactille tuoreen Card komponentin."
    src="/images/docs/illustrations/i_render-and-commit2.png"
  />
  <Illustration
    caption="Kommitointi"
    alt="React tarjoaa Card komponentin käyttäjälle heidän pöydälleen."
    src="/images/docs/illustrations/i_render-and-commit3.png"
  />
</IllustrationBlock>

<LearnMore path="/learn/render-and-commit">

Lue **[Render and Commit](/learn/render-and-commit)** oppiaksesi käyttöliittymäpäivityksen elämänkaaren.

</LearnMore>

## Tila tilannekuvana {/*state-as-a-snapshot*/}

Toisin kuin tavalliset JavaScript muuttujat, Reactin tila käyttäytyy enemmän kuin tilannekuva. Tilan muuttaminen ei muuta tilamuuttujaa joka sinulla jo on, vaan sen sijaan triggeröi uudelleenrenderöinnin. Tämä saattaa olla yllättävää aluksi!

```js
console.log(count); // 0
setCount(count + 1); // Pyydä uudelleenrenderöinti arvolla 1
console.log(count); // Silti 0!
```

React toimii tällä tavalla auttaakseen sinua välttämään hienovaraisia vikoja. Tässä on pieni chätti-sovellus. Veikkaa mitä tapahtuu kun painat "Lähetä" ensin ja _sitten_ muutat vastaanottajan Jaakoksi. Kenen nimi tulee näkymään `alert`:ssa viiden sekuntin jälkeen?

<Sandpack>

```js
import {useState} from 'react';

export default function Form() {
  const [to, setTo] = useState('Liisa');
  const [message, setMessage] = useState('Hei');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`Sanoit ${message} henkilölle ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Henkilölle:{' '}
        <select value={to} onChange={(e) => setTo(e.target.value)}>
          <option value="Liisa">Liisa</option>
          <option value="Jaakko">Jaakko</option>
        </select>
      </label>
      <textarea
        placeholder="Viesti"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Lähetä</button>
    </form>
  );
}
```

```css
label,
textarea {
  margin-bottom: 10px;
  display: block;
}
```

</Sandpack>

<LearnMore path="/learn/state-as-a-snapshot">

Lue **[Tila tilannekuvana](/learn/state-as-a-snapshot)** oppiaksesi miksi tila vaikuttaa "vakiolta" ja muuttumattomalta tapahtumakäsittelijöissä.

</LearnMore>

## Tilapäivityksen lisääminen jonoon {/*queueing-a-series-of-state-changes*/}

Tämä komponentti on buginen: kun klikataan "+3" se nostaa pisteytystä vain kerran.

<Sandpack>

```js
import {useState} from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(score + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button
        onClick={() => {
          increment();
          increment();
          increment();
        }}>
        +3
      </button>
      <h1>Score: {score}</h1>
    </>
  );
}
```

```css
button {
  display: inline-block;
  margin: 10px;
  font-size: 20px;
}
```

</Sandpack>

[Tila tilannekuvana](/learn/state-as-a-snapshot) selittää miksi näin tapahtuu. Tilan asettaminen pyytää uudelleenrenderöinnin, mutta ei muuta sitä jo suoritettavassa koodissa. Joten `score` jää arvoksi `0` heti sen jälkeen kun kutsut `setScore(score + 1)`.

```js
console.log(score); // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score); // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score); // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score); // 0
```

Voit korjata tämän antamalla _päivitysfunktion_ tilamuutoksen yhteydessä. Huomaa miten `setScore(score + 1)` muuttaminen `setScore(s => s + 1)` funktioksi korjaa "+3" painikkeen. Tämä on kätevää kun täytyy lisätä useita tilamuutoksia jonoon.

<Sandpack>

```js
import {useState} from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore((s) => s + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button
        onClick={() => {
          increment();
          increment();
          increment();
        }}>
        +3
      </button>
      <h1>Score: {score}</h1>
    </>
  );
}
```

```css
button {
  display: inline-block;
  margin: 10px;
  font-size: 20px;
}
```

</Sandpack>

<LearnMore path="/learn/queueing-a-series-of-state-changes">

Lue **[Tilapäivityksen lisääminen jonoon](/learn/queueing-a-series-of-state-changes)** oppiaksesi miten lisätään useita tilapäivityksiä jonoon ennen seuraavaa renderöintiä.

</LearnMore>

## Olioiden päivittäminen tilassa {/*updating-objects-in-state*/}

Tila voi pitää sisällään mitä vain JavaScript arvoa, kuten olioita. Mutta React tilassa olevia olioita ja listoja ei pitäisi muuttaa suoraan. Sen sijaan kun haluat päivittää oliota ja listaa, luo uusi (tai tee kopio olemassa olevasta), ja sitten päivitä tila käyttämään uutta kopiota.

Yleensä käytät `...` levityssyntaksia kopioidaksesi oliot ja listat joita haluat muuttaa. Esimerkiksi, sisäkkkäisen olion päivittäminen voisi näyttää seuraavalta:

<Sandpack>

```js
import {useState} from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    },
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value,
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value,
      },
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value,
      },
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value,
      },
    });
  }

  return (
    <>
      <label>
        Name:
        <input value={person.name} onChange={handleNameChange} />
      </label>
      <label>
        Title:
        <input value={person.artwork.title} onChange={handleTitleChange} />
      </label>
      <label>
        City:
        <input value={person.artwork.city} onChange={handleCityChange} />
      </label>
      <label>
        Image:
        <input value={person.artwork.image} onChange={handleImageChange} />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img src={person.artwork.image} alt={person.artwork.title} />
    </>
  );
}
```

```css
label {
  display: block;
}
input {
  margin-left: 5px;
  margin-bottom: 5px;
}
img {
  width: 200px;
  height: 200px;
}
```

</Sandpack>

Jos olioiden kopiointi käy tylsäksi, voit käyttää kirjastoa kuten [Immer](https://github.com/immerjs/use-immer) vähentääksesi toistettavaa koodia:

<Sandpack>

```js
import {useImmer} from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    },
  });

  function handleNameChange(e) {
    updatePerson((draft) => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson((draft) => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson((draft) => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson((draft) => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Name:
        <input value={person.name} onChange={handleNameChange} />
      </label>
      <label>
        Title:
        <input value={person.artwork.title} onChange={handleTitleChange} />
      </label>
      <label>
        City:
        <input value={person.artwork.city} onChange={handleCityChange} />
      </label>
      <label>
        Image:
        <input value={person.artwork.image} onChange={handleImageChange} />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img src={person.artwork.image} alt={person.artwork.title} />
    </>
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

```css
label {
  display: block;
}
input {
  margin-left: 5px;
  margin-bottom: 5px;
}
img {
  width: 200px;
  height: 200px;
}
```

</Sandpack>

<LearnMore path="/learn/updating-objects-in-state">

Lue **[Updating Objects in State](/learn/updating-objects-in-state)** oppiaksesi miten olioita voidaan päivittää oikeaoppisesti.

</LearnMore>

## Listojen päivittäminen tilassa {/*updating-arrays-in-state*/}

Listat ovat toisen tyyppisiä muuttuvia JavaScript olioita, joita voit tallettaa tilaan, ja joita tulisi käsitellä vain-luku muotoisina. Juuri kuten olioiden kanssa, kun haluat päivittää listaa tilassa, tarvitset uuden listan (tai kopion olemassa olevasta), ja sitten aseta tila käyttämään uutta listaa:

<Sandpack>

```js
import {useState} from 'react';

let nextId = 3;
const initialList = [
  {id: 0, title: 'Big Bellies', seen: false},
  {id: 1, title: 'Lunar Landscape', seen: false},
  {id: 2, title: 'Terracotta Army', seen: true},
];

export default function BucketList() {
  const [list, setList] = useState(initialList);

  function handleToggle(artworkId, nextSeen) {
    setList(
      list.map((artwork) => {
        if (artwork.id === artworkId) {
          return {...artwork, seen: nextSeen};
        } else {
          return artwork;
        }
      })
    );
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList artworks={list} onToggle={handleToggle} />
    </>
  );
}

function ItemList({artworks, onToggle}) {
  return (
    <ul>
      {artworks.map((artwork) => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={(e) => {
                onToggle(artwork.id, e.target.checked);
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

Jos olioiden kopiointi käy tylsäksi, voit käyttää kirjastoa kuten [Immer](https://github.com/immerjs/use-immer) vähentääksesi toistettavaa koodia:

<Sandpack>

```js
import {useState} from 'react';
import {useImmer} from 'use-immer';

let nextId = 3;
const initialList = [
  {id: 0, title: 'Big Bellies', seen: false},
  {id: 1, title: 'Lunar Landscape', seen: false},
  {id: 2, title: 'Terracotta Army', seen: true},
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList((draft) => {
      const artwork = draft.find((a) => a.id === artworkId);
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList artworks={list} onToggle={handleToggle} />
    </>
  );
}

function ItemList({artworks, onToggle}) {
  return (
    <ul>
      {artworks.map((artwork) => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={(e) => {
                onToggle(artwork.id, e.target.checked);
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

<LearnMore path="/learn/updating-arrays-in-state">

Lue **[Updating Arrays in State](/learn/updating-arrays-in-state)** oppiaksesi miten listoja päivitetään oikeaoppisesti.

</LearnMore>

## Mitä seuraavaksi? {/*whats-next*/}

Siirry seuraavaksi [Vastaaminen tapahtumiin](/learn/responding-to-events) -sivulle lukeaksesi tämän luvun sivu kerrallaan!

Tai, jos aiheet ovat jo tuttuja, mikset lukisi [Tilan hallintaa](/learn/managing-state)?
