---
title: Olioiden päivittäminen tilassa
---

<Intro>

Tila voi pitää sisällään minkä tahansa JavaScript arvon, mukaan lukien oliot. Sinun ei kuitenkaan tulisi muuttaa olioita suoraan, joita pität Reactin tilamuistissa. Sen sijaan kun haluat muuttaa oliota, sinun täytyy luoda uusi (tai ottaa kopio olemassa olevasta), ja sitten asettaa tila käyttämään tätä kopiota.

</Intro>

<YouWillLearn>

- Miten olio päivitetään Reactin tilaan
- Kuinka päivitetään sisäkkäinen olio, ilman mutaatioita
- Mitä muuttumattomuus (engl. immutability) on ja miten et riko sitä
- Miten teet kopioimisesta vähemmän toistuvaa Immerin avulla

</YouWillLearn>

## Mikä on mutaatio? {/* whats-a-mutation */}

Tilaan voit tallentaa minkä tahansa JavaScript arvon.

```js
const [x, setX] = useState(0);
```

Tähän mennessä olet työskennellyt numeroiden, merkkijonojen sekä totuusarvojen kanssa. Tämän kaltaiset JavaScript arvot ovat "muuttumattomia", jotka ovat "vain-luku" tilassa. Voit triggeröidä uudelleen renderöinnin _korvataksesi_ arvon:

```js
setX(5);
```

Tilamuuttujan `x` arvo muuttui arvosta `0` arvoon `5`, mutta _numero `0` itsessään_ ei muuttunut. JavaScriptissä ei ole mahdollista tehdä muutoksia sisäänrakennettuihin primitiivisiin arvoihin, kuten numeroihin, merkkijonoihin taikka totuusarvoihin.

Tarkastellaan nyt objektia tilassa:

```js
const [position, setPosition] = useState({x: 0, y: 0});
```

Teknisesti on mahdollista muuttaa _olion_ sisältöä. **Tätä kutsutaan mutaatioksi:**

```js
position.x = 5;
```

Vaikka Reactin tilassa olevat oliot ovat teknisesti muuttuvia, käsittele niitä kuitenkin **ikään kuin** ne olisivat muuttumattomia, kuten numeroita, totuusarvoja, ja merkkijonoja. Sen sijaan, että aina mutatoisit niitä, sinun tulisi aina korvata ne.

## Käsittele tilaa vain luku -muodossa {/* treat-state-as-read-only */}

Toisin sanoen, sinun tilisi **käsitellä kaikkia JavaScript-olioita, jotka laitat tilaan vain luku -muodossa.**

Tässä esimerkissä pidetään oliota tilasa, joka edustaa pointterin nykyistä sijaintia. Punaisen pisteen on tarkoitus liikkua, kun kosketat tai siirrät kursoria esikatselualueen yli. Mutta piste pysyy alkuperäisessä asennossaan:

<Sandpack>

```js
import {useState} from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  return (
    <div
      onPointerMove={(e) => {
        position.x = e.clientX;
        position.y = e.clientY;
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          borderRadius: '50%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
      />
    </div>
  );
}
```

```css
body {
  margin: 0;
  padding: 0;
  height: 250px;
}
```

</Sandpack>

Ongelma koodissa on tämä.

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

Tämä koodi muuttaa `position` muuttujan oliota [edellisestä renderöinnistä.](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) Mutta ilman tilanmääritysfunktiota React ei tiedä, että olio on muuttunut. React ei siis tee mitään vastauksena. Se on kuin yrittäisi muuttaa tilausta sen jälkeen, kun olet jo syönyt aterian. Vaikka tilan muuttaminen voi toimia joissakin tapauksissa, emme suosittele sitä. Tilan arvoa, johon sinulla on pääsy renderöinnissä, kannattaa käsitellä vain luku -arvona.
Tosiasiassa [uudelleen renderöinnin triggeröiminen](/learn/state-as-a-snapshot#setting-state-triggers-renders) tässä tapauksessa **luo _uuden_ olion ja välittää sen tilan asetusfunktiolle:**

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

`setPosition` koodilla kerrot Reactille:

- Korvaa `position` tällä uudella oliolla
- Ja renderöi tämä komponentti uudelleen

Huomaa miten punainen piste nyt seuraa sinun kursoria kun kosketat tai liikutat hiirtä esikatselualueen yllä:

<Sandpack>

```js
import {useState} from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  return (
    <div
      onPointerMove={(e) => {
        setPosition({
          x: e.clientX,
          y: e.clientY,
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          borderRadius: '50%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
      />
    </div>
  );
}
```

```css
body {
  margin: 0;
  padding: 0;
  height: 250px;
}
```

</Sandpack>

<DeepDive title="Paikallinen mutaatio on ok">

Tällainen koodi on ongelmallista, koska se muuttaa _olemassa olevaa_ oliota tilassa:

```js
position.x = e.clientX;
position.y = e.clientY;
```

Mutta tällainen koodi on **täysin okei**, koska se muuttaa uutta oliota, _joka juuri luotiin_:

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

Itse asiassa se vastaa täysin tämän kirjoittamista:

```js
setPosition({
  x: e.clientX,
  y: e.clientY,
});
```

Mutatointi on ongelma vain kun muutat _olemassa olevaa_ oliota, joka on jo tilassa. Juuri luodun olion muuntaminen on okei, koska _mikään muu koodi ei viittaa siihen vielä._ Sen muuttaminen ei vaikuta vahingossa johonkin siitä riippuvaiseen asiaan. Tätä kutsutaan "paikalliseksi mutaatioksi". Voit jopa tehdä paikallista mutaatiota [renderöinnin aikana.](/learn/keeping-components-pure#local-mutation-your-components-little-secret) Todella kätevää ja täysin ok!

</DeepDive>

## Olioiden kopioiminen spread -syntaksilla {/* copying-objects-with-the-spread-syntax */}

Aikaisemmassa esimerkissä `position` olio luodaan aina uusiksi nykyisen kursorin sijainnin pohjalta. Kuitenkin usein saatat haluta sisällyttää _olemassa olevaa_ dataa osana uutta oliota, jota olet luomassa. Esimerkiksi saatat haluta päivittää _vain yhtä_ kenttää lomakkeessa, mutta säilyttää edelliset arvot kaikille muille kentille.

Nämä syöttökentät eivät toimi koska `onChange`-käsittelijät mutatoivat tilaa:

<Sandpack>

```js
import {useState} from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        First name:
        <input value={person.firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={person.lastName} onChange={handleLastNameChange} />
      </label>
      <label>
        Email:
        <input value={person.email} onChange={handleEmailChange} />
      </label>
      <p>
        {person.firstName} {person.lastName} ({person.email})
      </p>
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
```

</Sandpack>

Esimerkiksi tämä rivi mutatoi tilaa aiemmasta renderöinnistä:

```js
person.firstName = e.target.value;
```

Luotettava tapa saada haluamasi käyttäytyminen on luoda uusi olio ja välittää se `setPerson`:lle. Mutta tässä tapauksessa haluat myös **kopioida olemassa olevat tiedot siihen** koska vain yksi kentistä on muuttunut:

```js
setPerson({
  firstName: e.target.value, // New first name from the input
  lastName: person.lastName,
  email: person.email,
});
```

Voit käyttää `...` [object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals) syntaksia, jotta sinun ei tarvitse kopioida jokaista propertyä erikseen.

```js
setPerson({
  ...person, // Koipioi vanhat kentät
  firstName: e.target.value, // Mutta ylikirjoita tämä
});
```

Nyt lomake toimii!

Huomaa miten et määritellyt erillistä tilamuuttujaa jokaista syöttökenttää varten. Laajemmissa lomakkeissa kaiken datan säilyttäminen oliossa on hyvin kätevää--kunhan päivität sitä oikeaoppisesti!

<Sandpack>

```js
import {useState} from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value,
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value,
    });
  }

  return (
    <>
      <label>
        First name:
        <input value={person.firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={person.lastName} onChange={handleLastNameChange} />
      </label>
      <label>
        Email:
        <input value={person.email} onChange={handleEmailChange} />
      </label>
      <p>
        {person.firstName} {person.lastName} ({person.email})
      </p>
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
```

</Sandpack>

Huomaa, että `...` spread -syntaksi on "matala" (engl. shallow)--se kopioi asioita vain yhden tason syvyydeltä. Tämä tekee siitä nopean, mutta tämä tarkoittaa myös, että jos haluat päivittää sisäkkäistä propertyä, joudut käyttämään sitä useammin.

<DeepDive title="Yhden tapahtumakäsittelijän käyttäminen useille kentille">

Voit myös käyttää `[` ja `]` sulkeita olion määrittelyn sisällä määritelläksesi propertyn dynaamisella nimellä. Tässä on sama esimerkki, mutta yhdellä tapahtumakäsittelijällä kolmen sijaan:

<Sandpack>

```js
import {useState} from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Last name:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input name="email" value={person.email} onChange={handleChange} />
      </label>
      <p>
        {person.firstName} {person.lastName} ({person.email})
      </p>
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
```

</Sandpack>

Tässä `e.target.name` viittaa `name` propertyyn, joka on annettu `<input>` DOM elementille.

</DeepDive>

## Sisäkkäisten olioiden päivittäminen {/* updating-a-nested-object */}

Tarkastellaan seuraavanlaista sisäkkäistä objektirakennetta:

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  },
});
```

Jos haluat päivittää `person.artwork.city`, on selvää, miten se tehdään mutaation avulla:

```js
person.artwork.city = 'New Delhi';
```

Mutta Reactissa tilaa käsitellään muuttumattomana! Jos haluat vaihtaa `city`, sinun pitäisi ensin luoda uusi `artwork`-olio (joka on esitäytetty edellisen olion tiedoilla) ja sitten luoda uusi `person`-olio, joka osoittaa uuteen `artwork`-olioon:

```js
const nextArtwork = {...person.artwork, city: 'New Delhi'};
const nextPerson = {...person, artwork: nextArtwork};
setPerson(nextPerson);
```

Tai kirjoitettuna yksittäisenä funktiokutsuna:

```js
setPerson({
  ...person, // Kopioi muut kentät
  artwork: {
    // mutta korvaa artwork
    ...person.artwork, // samalla arvolla
    city: 'New Delhi', // mutta New Delhillä!
  },
});
```

Tämä on hieman pitkäveteistä, mutta se toimii hyvin monissa tapauksissa:

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

<DeepDive title="Oliot eivät oikeastaan ole sisäkkäisiä">

Tällainen olio näyttää "sisäkkäiseltä" koodissa:

```js
let obj = {
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  },
};
```

"Sisäkkäisyys" on kuitenkin epätarkka tapa ajatella miten oliot käyttäytyvät. Kun koodi suoritetaan, ei ole olemassa mitään "sisäkkäistä" oliota. Kyseessä on oikeastaan kaksi eri oliota:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1,
};
```

Olio `obj1` ei ole olion `obj2` sisällä. Esimerkiksi `obj3` voisi "osoittaa" myös `obj1`:een:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1,
};

let obj3 = {
  name: 'Copycat',
  artwork: obj1,
};
```

Jos muuttaisit `obj3.artwork.city`, se vaikuttaisi molempiin `obj2.artwork.city` sekä `obj1.city` olioihin. Tämä johtuu siitä, että `obj3.artwork`, `obj2.artwork` ja `obj1` ovat samaa oliota. Tätä on vaikea havaita, kun ajatellaan oliota "sisäkkäisinä". Sen sijaan ne ovat erillisiä toisistaan, jotka "osoittavat" toisiaan propertyillä.

</DeepDive>

### Kirjoita tiivis päivityslogiikka Immerillä {/* write-concise-update-logic-with-immer */}

Jos tilasi on syvästi sisäkkäistä, saatat haluat harkita [sen tasoittamista.](/learn/choosing-the-state-structure#avoid-deeply-nested-state) Mutta, jos et halua muuttaa tilasi rakennetta, voit käyttää mielummin oikotietä sisäkkäiseen spreadiin. [Immer](https://github.com/immerjs/use-immer) on suosittu krijasto, jonka avulla voit kirjoittaa kätevää, mutatoivaa syntaksia ja se huolehtii kopioiden tuottamisesta puolestasi. Immerin avulla kirjoittamasi koodi näyttää siltä, että "rikot sääntöjä" ja muunnat oliota:

```js
updatePerson((draft) => {
  draft.artwork.city = 'Lagos';
});
```

Kuitenkin toisin kuin tavallinen mutaatio, tämä ei ylikirjoita aiempaa tilaa!

<DeepDive title="Miten Immer toimii?">

`draft`, jonka Immer tarjoaa on erityinen oliomuoto, jota kutsutaan [Proxy:ksi](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), joka "nauhoittaa" mitä teet sillä. Siksi voit muunnella sitä vapaasti niin paljon kuin haluat! Konepellin alla Immer selvittää, mitä osia luonnoksesta on muutettu, ja tuottaa täysin uuden olion, joka sisältää muokkauksesi.

</DeepDive>

Kokeillaksesi Immeriä:

1. Lisää `use-immer` projektisi `package.json` tiedostoon riippuvuutena
2. Suorita `npm install`
3. Lopuksi korvaa `import { useState } from 'react'` lauseella `import { useImmer } from 'use-immer'`

Tässä ylempi esimerkki muutettu käyttämään Immeriä:

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

Huomaa, kuinka paljon tiiviimpiä tapahtumankäsittelijöistä on tullut. Voit käyttää sekä `useState:a` että `useImmer:a` samassa komponentissa niin monesti kuin haluat. Immer on hyvä tapa pitää päivityskäsittelijät tiiviinä, varsinkin jos tilasi on sisäkkäinen ja olioiden kopiointi johtaa toistuvaan koodiin.

<DeepDive title="Miksi tilan mujtatointia ei suositella Reactissa">

Tähän on useita syitä:

- **Debuggaus:** Jos käytät `console.log` kutsua etkä muuta tilaa, viimeisimmät tilamuutokset eivät häiritse aiempia lokejasi. Näin näet selvästi, miten tila on muuttunut renderöintien välillä.
- **Optimointi:** Reactin yleiset [optimointistrategiat](/apis/react/memo) tukeutuvat työn ohittamiseen jos aiemmat propsit tai tila pysyy samana. Jos et koskaan mutatoi tilaa, on nopeaa tarkistaa oliko mitään muutoksia. Jos `prevObj === obj`, voit olla varma siitä, että mikään ei voinut muokata sitä.
- **Uudet ominaisuudet:** Reactin uudet ominaisuudet, joita olemme rakantamssa tukeutuvat siihen, että tilaa [käsitellään kuin snapshottia.](/learn/state-as-a-snapshot) Jos mutatoit tilan aiempia versioita, se saattaa estää uusien ominaisuuksien käyttöä.
- **Muutokset vaatimuksiin:** Jotkin sovellustoiminnot, kuten Kumoa/Tee uudelleen, muutoshistorian näyttäminen tai antaa käyttäjän palauttaa lomakkeen aiemmat arvot, ovat helpompi toteuttaa kun mitään ei mutatoida. Tämä johtuu siitä, että pidät kopiot aiemmista tiloista muistissa ja käytät niitä uudelleen kun se on asianmukaista. Jos aloitat mutatoivalla tavalla, tämänkaltaiset ominaisuudet voi olla hankala lisätä jälkeenpäin.
- **Yksinkertaisempi toteutus:** Koska React ei turvaudu mutaatioon, sen ei tarvitse tehdä mitään erityistä objekteillesi. Sen ei tarvitse kaapata niiden ominaisuuksia tai kietoa niitä Proxyihin tai tehdä muuta työtä alustuksen yhteydessä. Tämän vuoksi Reactin avulla voit laittaa minkä tahansa objektin tilaan - oli se kuinka suuri tahansa - ilman ylimääräisiä suorituskykyyn tai oikeellisuuteen liittyviä sudenkuoppia.

In practice, you can often "get away" with mutating state in React, but we strongly advise you not to do that so that you can use new React features developed with this approach in mind. Future contributors and perhaps even your future self will thank you!

</DeepDive>

<Recap>

- Treat all state in React as immutable.
- When you store objects in state, mutating them will not trigger renders and will change the state in previous render "snapshots".
- Instead of mutating an object, create a _new_ version of it, and trigger a re-render by setting state to it.
- You can use the `{...obj, something: 'newValue'}` object spread syntax to create copies of objects.
- Spread syntax is shallow: it only copies one level deep.
- To update a nested object, you need to create copies all the way up from the place you're updating.
- To reduce repetitive copying code, use Immer.

</Recap>

<Challenges>

#### Fix incorrect state updates {/* fix-incorrect-state-updates */}

This form has a few bugs. Click the button that increases the score a few times. Notice that it does not increase. Then edit the first name, and notice that the score has suddenly "caught up" with your changes. Finally, edit the last name, and notice that the score has disappeared completely.

Your task is to fix all of these bugs. As you fix them, explain why each of them happens.

<Sandpack>

```js
import {useState} from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    player.score++;
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      lastName: e.target.value,
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>{' '}
        <button onClick={handlePlusClick}>+1</button>
      </label>
      <label>
        First name:
        <input value={player.firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={player.lastName} onChange={handleLastNameChange} />
      </label>
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 10px;
}
input {
  margin-left: 5px;
  margin-bottom: 5px;
}
```

</Sandpack>

<Solution>

Here is a version with both bugs fixed:

<Sandpack>

```js
import {useState} from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value,
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>{' '}
        <button onClick={handlePlusClick}>+1</button>
      </label>
      <label>
        First name:
        <input value={player.firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={player.lastName} onChange={handleLastNameChange} />
      </label>
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
```

</Sandpack>

Ongelma `handlePlusClick` funktiossa oli se, että se muutti `player`-oliota. Tämän seurauksena React ei tiennyt, että on syytä renderöidä uudelleen, eikä päivittänyt pisteitä näytölle. Kun muokkasit ensimmäistä nimeä, tila päivitettiin, mikä käynnisti uudelleenrenderöinnin, joka _myös_ päivitti pisteet näytöllä.

Ongelma `handleLastNameChange` funktiossa oli se, että se ei kopioinut olemassa olevia `...player`-kenttiä uuteen olioon. Tämän vuoksi pisteet hävisivät, kun muokkasit viimeistä nimeä.

</Solution>

#### Etsi ja korjaa mutaatio {/* find-and-fix-the-mutation */}

Staattisella taustalla on raahattava laatikko. Voit muuttaa laatikon väriä valintalistalla.

Mutta siinä on bugi. Jos liikutat laatikkoa ensin ja sitten muutat sen väriä, tausta (jonka ei ole tarkoitus liikkua!) "hyppää" laatikon kohtaan. Näin ei kuitenkaan kuuluisi tapahtua: `Background`:n `position` propsi on asetettu `initialPosition`, joka on `{ x: 0, y: 0 }`. Miksi taustakuva liikkuu värin vaihtamisen jälkeen?

Etsi bugi ja korjaa se.

<Hint>

Jos jokin odottamaton asia muuttuu, kyseessä on mutaatio. Etsi mutaatio tiedostosta `App.js` ja korjaa se.

</Hint>

<Sandpack>

```js App.js
import {useState} from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0,
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition,
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value,
    });
  }

  return (
    <>
      <select value={shape.color} onChange={handleColorChange}>
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background position={initialPosition} />
      <Box color={shape.color} position={shape.position} onMove={handleMove}>
        Drag me!
      </Box>
    </>
  );
}
```

```js Box.js
import {useState} from 'react';

export default function Box({children, color, position, onMove}) {
  const [lastCoordinates, setLastCoordinates] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}>
      {children}
    </div>
  );
}
```

```js Background.js
export default function Background({position}) {
  return (
    <div
      style={{
        position: 'absolute',
        transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
        width: 250,
        height: 250,
        backgroundColor: 'rgba(200, 200, 0, 0.2)',
      }}
    />
  );
}
```

```css
body {
  height: 280px;
}
select {
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

Ongelma oli mutaatiossa `handleMove`:n sisällä. Se muutti `shape.position`, mutta se on sama objekti, johon `initialPosition` osoittaa. Tämän vuoksi sekä muoto että tausta liikkuvat. (Kyseessä on mutaatio, joten muutos ei näy ruudulla ennen kuin asiaan liittymätön päivitys--värimuutos--käynnistää uuden renderöinnin.)

Tämän voi korjata poistamalla mutaatio `handleMove`:sta ja käyttää levityssyntaksia muodon kopioimiseen. Huomaa, että `+=` on mutaatio, joten sinun on kirjoitettava se uudelleen käyttämään tavallista `+`-operaatiota.

<Sandpack>

```js App.js
import {useState} from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0,
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition,
  });

  function handleMove(dx, dy) {
    setShape({
      ...shape,
      position: {
        x: shape.position.x + dx,
        y: shape.position.y + dy,
      },
    });
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value,
    });
  }

  return (
    <>
      <select value={shape.color} onChange={handleColorChange}>
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background position={initialPosition} />
      <Box color={shape.color} position={shape.position} onMove={handleMove}>
        Drag me!
      </Box>
    </>
  );
}
```

```js Box.js
import {useState} from 'react';

export default function Box({children, color, position, onMove}) {
  const [lastCoordinates, setLastCoordinates] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}>
      {children}
    </div>
  );
}
```

```js Background.js
export default function Background({position}) {
  return (
    <div
      style={{
        position: 'absolute',
        transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
        width: 250,
        height: 250,
        backgroundColor: 'rgba(200, 200, 0, 0.2)',
      }}
    />
  );
}
```

```css
body {
  height: 280px;
}
select {
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### Päivitä objekti Immerin avulla {/* update-an-object-with-immer */}

Tämä on sama virheellinen esimerkki kuin edellisessä haasteessa. Tällä kertaa korjaa mutaatio Immerin avulla. Yksinkertaisuuden vuoksi `useImmer` on jo tuotu, joten sinun täytyy muuttaa `shape`-tilamuuttujaa käyttämään sitä.

<Sandpack>

```js App.js
import {useState} from 'react';
import {useImmer} from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0,
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition,
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value,
    });
  }

  return (
    <>
      <select value={shape.color} onChange={handleColorChange}>
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background position={initialPosition} />
      <Box color={shape.color} position={shape.position} onMove={handleMove}>
        Drag me!
      </Box>
    </>
  );
}
```

```js Box.js
import {useState} from 'react';

export default function Box({children, color, position, onMove}) {
  const [lastCoordinates, setLastCoordinates] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}>
      {children}
    </div>
  );
}
```

```js Background.js
export default function Background({position}) {
  return (
    <div
      style={{
        position: 'absolute',
        transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
        width: 250,
        height: 250,
        backgroundColor: 'rgba(200, 200, 0, 0.2)',
      }}
    />
  );
}
```

```css
body {
  height: 280px;
}
select {
  margin-bottom: 10px;
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

<Solution>

Tämä on Immerin avulla uudelleen kirjoitettu ratkaisu. Huomaa, että tapahtumankäsittelijät on kirjoitettu mutoivalla tavalla, mutta virhettä ei esiinny. Tämä johtuu siitä, että Immer ei koskaan mutatoi olemassa olevia objekteja.

<Sandpack>

```js App.js
import {useImmer} from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0,
};

export default function Canvas() {
  const [shape, updateShape] = useImmer({
    color: 'orange',
    position: initialPosition,
  });

  function handleMove(dx, dy) {
    updateShape((draft) => {
      draft.position.x += dx;
      draft.position.y += dy;
    });
  }

  function handleColorChange(e) {
    updateShape((draft) => {
      draft.color = e.target.value;
    });
  }

  return (
    <>
      <select value={shape.color} onChange={handleColorChange}>
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background position={initialPosition} />
      <Box color={shape.color} position={shape.position} onMove={handleMove}>
        Drag me!
      </Box>
    </>
  );
}
```

```js Box.js
import {useState} from 'react';

export default function Box({children, color, position, onMove}) {
  const [lastCoordinates, setLastCoordinates] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}>
      {children}
    </div>
  );
}
```

```js Background.js
export default function Background({position}) {
  return (
    <div
      style={{
        position: 'absolute',
        transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
        width: 250,
        height: 250,
        backgroundColor: 'rgba(200, 200, 0, 0.2)',
      }}
    />
  );
}
```

```css
body {
  height: 280px;
}
select {
  margin-bottom: 10px;
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

</Solution>

</Challenges>
