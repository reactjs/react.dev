---
title: Tilapäivitysten lisääminen jonoon
---

<Intro>

Tilamuuttujan asettaminen lisää toisen renderöinnin jonoon. Toisinaan saatat haluta suorittaa useita operaatioita arvolla ennen seuraavan renderöinnin lisäämistä jonoon. Tätä varten on hyvä ymmärtää, miten React erittelee tilapäivitykset.

</Intro>

<YouWillLearn>

* Mitä "niputtaminen" on ja kuinka React käyttää sitä prosessoidessaan useita tilapäivityksiä
* Useiden päivitysten soveltaminen samaan tilamuuttujaan peräkkäin

</YouWillLearn>

## React niputtaa tilapäivitykset {/*react-batches-state-updates*/}

Saatat olettaa, että painamalla "+3"-painiketta laskurin lukuu kasvaa kolme kertaa, koska se kutsuu `setNumber(number + 1)` kolmesti:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Kuitenkin saatat muistaa edellisestä osasta, [kunkin renderin tila-arvot ovat kiinteät](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time), joten `number` muuttujan arvo ensimmäisen renderöinnin tapahtumakäsittelijässä on aina `0`, riippumatta siitä miten monesti kutsut `setNumber(1)` funktiota:

```js
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```

Mutta tässä on yksi muukin tekijä, joka käydään läpi. **React odottaa kunnes *kaikki* koodi tapahtumakäsittelijässä on suoritettu ennen tilapäivitysten laskentaa.** Tämän vuoksi uudelleen renderöinti tapahtuu kaikkien `setNumber()` kutsujen *jälkeen*.

Tämä saattaa muistuttaa tarjoilijasta ottamassa tilauksia vastaan ravintolassa. Tarjoilija ei juokse keittiöön heti kun mainitset ensimmäisen aterian. Sen sijaan hän antaa sinun tehdä tilauksesi loppuun asti, tehdä siihen muutoksia ja sitten ottaa tilauksia vastaan muilta henkilöiltä pöydässä.

<Illustration src="/images/docs/illustrations/i_react-batching.png"  alt="An elegant cursor at a restaurant places and order multiple times with React, playing the part of the waiter. After she calls setState() multiple times, the waiter writes down the last one she requested as her final order." />

Tämän avulla voit päivittää useita tilamuuttujia--jopa useista komponenteista--ilman ylimääräisten [uudelleen renderöintien.](/learn/render-and-commit#re-renders-when-state-updates) triggeröintiä. Tämä tarkoittaa kuitenkin myös sitä, että käyttöliittymä päivittyy vasta _jälkeen_, kun tapahtumankäsittelijäsi ja siinä oleva koodi on suoritettu. Tämä käyttäytyminen, joka tunnetaan myös nimellä **niputtaminen** (engl. batching), ja se saa React-sovelluksesi toimimaan paljon nopeammin. Sen avulla vältetään myös sekavat "puolivalmiit" renderöinnit, joissa vain osa muuttujista on päivitetty.

**React ei niputa *useita* tarkoituksellisia tapahtumia kuten klikkauksia**--jokainen klikkaus käsitellään erikseen. Voit olla varma, että React tekee niputtamista vain silloin, kun se on yleisesti ottaen turvallista. Näin varmistetaan, että jos esimerkiksi ensimmäinen painikkeen napsautus poistaa lomakkeen käytöstä, toinen napsautus ei lähetä lomaketta uudelleen.

## Saman tilamuuttujan päivittäminen useita kertoja ennen seuraavaa renderöintiä {/*updating-the-same-state-variable-multiple-times-before-the-next-render*/}

Tämä on harvinainen käyttötapaus, mutta jos haluat päivittää saman tilamuuttujan useita kertoja ennen seuraavaa renderöintiä, sen sijaan, että välittäisit *seuraavan tilan arvon* kuten `setNumber(number + 1)`, voit välittää *funktion*, joka laskee seuraavan tilan jonon edellisen tilan perusteella, kuten `setNumber(n => n + 1)`. Se on tapa käskeä Reactia "tekemään jotain tila-arvolla" sen sijaan, että se vain korvaisi sen.

Kokeile kasvattaa laskuria nyt:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Tässä, `n => n + 1` on**päivitysfunktio.** Kun välität sen tila-asettajalle:

1. React lisää tämän funktion jonoon prosessoitavaksi kun kaikki muut koodi tapahtumakäsittelijässä on suoritettu.
2. Seuraavan renderöinnin aikana React käy jonon läpi ja antaa sinulle lopullisen päivitetyn tilan.

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

Näin React käy läpi nämä rivit koodia tapahtumakäsittelijää suoritettaessa:

1. `setNumber(n => n + 1)`: `n => n + 1` on funktio. React lisää sen jonoon.
1. `setNumber(n => n + 1)`: `n => n + 1` on funktio. React lisää sen jonoon.
1. `setNumber(n => n + 1)`: `n => n + 1` on funktio. React lisää sen jonoon.

Kun kutsut `useState` funktiota renderöinnin aikana, React käy jonon läpi. Edellinen `number`:n tila oli `0`, joten React välittää sen ensimmäiselle päivitysfunktiolle argumenttina `n`. Sitten React ottaa edellisen päivitysfunktion paluuarvon ja siirtää sen seuraavalle päivitysfunktiolle `n` muuttujana, ja niin edelleen:

|  päivitys jonossa | `n` | palauttaa |
|--------------|---------|-----|
| `n => n + 1` | `0` | `0 + 1 = 1` |
| `n => n + 1` | `1` | `1 + 1 = 2` |
| `n => n + 1` | `2` | `2 + 1 = 3` |

React tallentaa `3` lopulliseksi tulokseksi ja palauttaa sen `useState`:sta.

Tämän vuoksi napsauttamalla "+3" yllä olevassa esimerkissä arvo kasvaa oikein 3:lla.
### Mitä tapahtuu, jos päivität tilan sen korvaamisen jälkeen? {/*what-happens-if-you-update-state-after-replacing-it*/}

Entä tämä tapahtumankäsittelijä? Mitä luulet, että `number` on seuraavassa renderöinnissä?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Tämä tapahtumankäsittelijä käskee Reactia tekemään seuraavaa:

1. `setNumber(number + 5)`: `number` on `0`, joten `setNumber(0 + 5)`. React lisää *"korvaa arvolla `5`"* sen jonoon.
2. `setNumber(n => n + 1)`: `n => n + 1` on päivitysfunktio. React lisää *tuon funktion* sen jonoon.

Seuraavan renderöinnin aikana React käy läpi tilajonon:

|   päivitys jonossa       | `n` | palauttaa |
|--------------|---------|-----|
| "replace with `5`" | `0` (käyttämätön) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |

React tallentaa `6` lopulliseksi tulokseksi ja palauttaa sen `useState`:sta.

> Olet ehkä huomannut, että `setState(x)` toimii kuten `setState(n => x)`, mutta `n` on käyttämätön!

### Mitä tapahtuu, jos korvaat tilan sen päivittämisen jälkeen? {/*what-happens-if-you-replace-state-after-updating-it*/}

Kokeillaan vielä yhtä esimerkkiä. Mitä luulet, että `number` on seuraavassa renderöinnissä?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
        setNumber(42);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Näin React käy läpi nämä rivit koodia tapahtumakäsittelijää suoritettaessa:

1. `setNumber(number + 5)`: `number` on `0`, joten `setNumber(0 + 5)`. React lisää *"korvaa arvolla `5`"* sen jonoon.
2. `setNumber(n => n + 1)`: `n => n + 1` on päivitysfunktio. React lisää *tuon funktion* sen jonoon.
3. `setNumber(42)`: React lisää *"korvaa arvolla `42`"* sen jonoon.

Seuraavan renderöinnin aikana React käy läpi tilajonon:

|   päivitys jonossa       | `n` | palauttaa |
|--------------|---------|-----|
| "korvaa arvolla `5`" | `0` (käyttämätön) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |
| "korvaa arvolla `42`" | `6` (käyttämätön) | `42` |

Sitten React tallentaa `42` lopulliseksi tulokseksi ja palauttaa sen `useState`:sta.

Yhteenvetona voit ajatella näin, mitä välität `setNumber` tila-asettimeen:

* **Päivitysfunktion** (esim. `n => n + 1`) lisätään jonoon.
* **Minkä tahansa arvon** (esim. numero `5`) lisää "korvaa arvolla `5`" jonoon, huomioimatta sitä, mikä on jo jonossa.

Tapahtumankäsittelijän päätyttyä React käynnistää uuden renderöinnin. Uudelleen renderöinnin aikana React käsittelee jonon. Päivitysfunktiot suoritetaan renderöinnin aikana, joten **päivitysfunktioiden on oltava [puhtaita](/learn/keeping-components-pure)** ja *palauttavat* vain tuloksen. Älä yritä asettaa tilaa niiden sisältä tai suorittaa muita sivuvaikutuksia. Strict Modessa, React suorittaa jokaisen päivitysfunktion kahdesti (mutta hylkää toisen tuloksen) auttaakseen sinua löytämään virheitä.

### Nimeämiskäytännöt {/*naming-conventions*/}

On tavallista nimetä päivitysfunktion argumentti vastaavan tilamuuttujan alkukirjaimilla:

```js
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

Jos haluat yksityiskohtaisempaa koodia, toinen yleinen käytäntö on toistaa koko tilamuuttujan nimi, kuten `setEnabled(enabled => !enabled)`, tai käyttää etuliitettä kuten `setEnabled(prevEnabled => !prevEnabled)`.

<Recap>

* Tilan asettaminen ei muuta tilamuuttujaa olemassa olevassa renderöinnissä, vaan pyytää uutta renderöintiä.
* React käsittelee tilapäivitykset sen jälkeen, kun tapahtumakäsittelijät ovat lopettaneet suorituksensa. Tätä kutsutaan niputtamiseksi.
* Jos haluat päivittää jonkin tilan useita kertoja yhdessä tapahtumassa, voit käyttää `setNumber(n => n + 1)`-päivitysfunktiota.

</Recap>



<Challenges>

#### Korjaa pyyntöjen laskuri {/*fix-a-request-counter*/}

Olet kehittämässä taiteen markkinapaikkasovellusta, jonka avulla käyttäjä voi tehdä useita tilauksia taide-esineestä samanaikaisesti. Joka kertan, kun käyttäjä painaa "Osta"-painiketta, "Vireillä"-laskurin pitäisi kasvaa yhdellä. Kolmen sekuntin kuluttua "Vireillä"-laskurin pitäisi pienentyä ja "Toteutunut" laskurin pitäisi kasvaaa.

Vireillä -laskuri ei kuitenkaan käyttäydy tarkoitetulla tavalla. Kun painat "Osta", se laskee arvoon `-1` (minkä ei pitäisi olla mahdollista!). Ja jos painat nopeasti kahdesti, molemmat laskurit näyttävät käyttäytyvän arvaamattomasti.

Miksi näin tapahtuu? Korjaa molemmat laskurit.

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(pending + 1);
    await delay(3000);
    setPending(pending - 1);
    setCompleted(completed + 1);
  }

  return (
    <>
      <h3>
        Vireillä: {pending}
      </h3>
      <h3>
        Toteutunut: {completed}
      </h3>
      <button onClick={handleClick}>
        Osta
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

<Solution>

`handleClick`-tapahtumankäsittelijän sisällä `pending` ja `completed` arvot vastaavat arvoja, jotka ne olivat klikkaustapahtuman aikaan. Ensimmäisessä renderöinnissä `pending` oli `0`, joten `setPending(pending - 1)` muuttuu `setPending(-1)`, mikä on väärin. Koska haluat *kasvattaa* tai *vähentää* laskureita sen sijaan, että asettaisit ne klikkauksen aikana määritettyyn konkreettiseen arvoon, voit sen sijaan välittää niille päivitysfunktiot:

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(p => p + 1);
    await delay(3000);
    setPending(p => p - 1);
    setCompleted(c => c + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

Näin varmistetaan, että kun kasvatat tai vähennät laskuria, se tehdään suhteessa sen *viimeisimpään* tilaan eikä siihen, mikä tila oli napsautushetkellä.

</Solution>

#### Toteuta tilajono itse {/*implement-the-state-queue-yourself*/}

Tässä haasteessa toteutat pienen osan Reactista alusta alkaen! Se ei ole niin vaikeaa kuin miltä se kuulostaa.

Selaa hiekkalaatikon esikatselua. Huomaa, että siinä näkyy **neljä testitapausta.** Ne vastaavat aiemmin tällä sivulla näkemiäsi esimerkkejä. Tehtävänäsi on toteuttaa `getFinalState`-funktio niin, että se palauttaa oikean tuloksen jokaisessa näistä tapauksista. Jos toteutat sen oikein, kaikkien neljän testin pitäisi mennä läpi.

Saat kaksi argumenttia: `baseState` on aloitustila, joka sisältää numeroita (kuten `0`) ja `queue`, joka on taulukko, joka sisältää sekoituksen numeroita (kuten `5`) ja päivitysfunktioita (kuten `n => n + 1`) siinä järjestyksessä kuin ne on lisätty.

Tehtäväsi on palauttaa lopullinen tila, aivan kuten tämän sivun taulukot osoittavat!

<Hint>

Jos tunnet olevasi jumissa, aloita tästä koodirakenteesta:

```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // TODO: apply the updater function
    } else {
      // TODO: replace the state
    }
  }

  return finalState;
}
```

Täytä puuttuvat rivit!

</Hint>

<Sandpack>

```js processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  // TODO: do something with the queue...

  return finalState;
}
```

```js App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

<Solution>

Tämä on täsmälleen tällä sivulla kuvattu algoritmi, jota React käyttää lopullisen tilan laskemiseen:

<Sandpack>

```js processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // Apply the updater function.
      finalState = update(finalState);
    } else {
      // Replace the next state.
      finalState = update;
    }
  }

  return finalState;
}
```

```js App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

Nyt tiedät, miten tämä osa Reactia toimii!

</Solution>

</Challenges>