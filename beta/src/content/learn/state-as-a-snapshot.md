---
title: Tila tilannekuvana
---

<Intro>

Tilamuuttujat saattavat näyttää tavallisilta JavaScript muuttujilta, joita voit
lukea ja joihin voit kirjoittaa. Tilamuuttujat käyttäytyvät enemmän kuin tilannekuvana. Tilannemuuttujan asettaminen ei muuta muuttujaa, joka sinulla jo
on, vaan sen sijaan käynnistää uudelleenrenderöinnin.

</Intro>

<YouWillLearn>

* Miten tilamuuttujan asettaminen käynnistää uudelleenrenderöintejä
* Milloin ja miten tila päivittyy
* Miksi tila eo päivity heti kun asetat sen
* Miten tapahtumakäsittelijät saavat "tilannekuvan" tilasta

</YouWillLearn>

## Tilan asettaminen käynnistää renderöintejä {/*setting-state-triggers-renders*/}

Saatat ajatella käyttöliittymäsi muuttuvan suoraan vastauksena käyttäjän tapahtumiin kuten klikkaukseen. Reactissa se poikkeaa hieman tästä ajattelutavasta. Edellisellä sivulla näit, että [tilan asettaminen pyytää uudelleenrenderöintiä](/learn/render-and-commit#step-1-trigger-a-render) Reactilta. Tämä tarkoittaa, että jotta käyttöliittymä voi reagoida tapahtumaan, sinun tulee *päivittää tilaa*.

Tässä esimerkissä kun painat "Send" -painiketta, `setIsSent(true)` käskee Reactia renderöimään käyttöliittymä uudelleen:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');
  if (isSent) {
    return <h1>Your message is on its way!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

Tässä mitä tapahtuu kun klikkaat painiketta:

1. `onSubmit` tapahtumakäsittelijä suoritetaan.
2. `setIsSent(true)` asettaa `isSent` arvoksi `true` ja lisää renderöinnin jonoon.
3. React renderöi uudelleen komponentin uuden `isSent` arvon mukaan.

Otetaan tarkempi katse tilan ja renderöinnin suhteeseen.

## Renderöinti ottaa tilannekuvan ajasta {/*rendering-takes-a-snapshot-in-time*/}

["Renderöinti"](/learn/render-and-commit#step-2-react-renders-your-components) tarkoittaa, että React kutsuu komponenttiasi, joka on funktio. Funktion palauttama JSX on kuten käyttöliittymän tilannekuva ajasta. Sen propsit, tapahtumakäsittelijät sekä paikalliset muuttujat laskettiin **käyttämällä sen tilaa renderöintihetkellä.**

Toisin kuin valokuva tai elokuvan kehys, UI "tilannekuva", jonka palautat on interaktiivinen. Se sisältää logiikkaa kuten tapahtumakäsittelijöitä, jotka määrittävät mitä tapahtuu vastauksena syötteeseen. React sitten päivittää ruudun vastaamaan tätä tilannekuvaa ja yhdistää tapahtumakäsittelijät. Lopputuloksena painikkeen painaminen käynnistää JSX koodisi tapahtumakäsittelijän.

Kun React renderöi komponentin uudelleen:

1. React kutsuu funktiotasi uudelleen.
2. Funktiosi palauttaa uuden JSX tilannekuvan.
3. React sitten päivittää ruudun vastaamaan tilannekuvaa, jonka palautit.

<IllustrationBlock sequential>
    <Illustration caption="React suorittamassa funktiota" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="Tilannekuvan laskeminen" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="DOM puun päivitys" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

Komponentin muistina, tila ei ole kuten tavalliset muuttujat, jotka katoavat kun komponenttisi palautuu. Itse asiassa tila "asuu" itse Reactissa--kuten hyllyllä--komponenttisi ulkopuolella. Kun React kutsuu komponenttiasi, se antaa tilannekuvan tilasta tälle kyseiselle renderöinnille. Komponenttisi palauttaa tilannekuvan käyttöliittymästä uudella joukolla propseja ja tapahtumankäsittelijöitä JSX:ssä, jotka kaikki on laskettu **käyttämällä kyseisen renderöinnin tila-arvoja!**

<IllustrationBlock sequential>
  <Illustration caption="Käsket Reactin päivittämään tilaa" src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React päivittää tilan arvon" src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React välittää tilannekuvan tilan arvosta komponentille" src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

Tässä pieni kokeilu, joka näyttää miten tämä toimii. Tässä esimerkissä saatat olettaa, että "+3" painikkeen painaminen kasvattaa numera kolme kertaa, koska se kutsuu `setNumber(number + 1)` kolmesti.

Katso mitä tapahtuu, kun napsautat "+3"-painiketta:

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

Huomaa, että `number` kasvaa vain kerran per klikkaus!

**Tilan asettaminen muuttaa sen *seuraavalle* renderille.** Ensimmäisen renderöinnin aikana, `number` oli arvoltaan `0`. Sen takia *tuossa renderöinnissä* `onClick` käsittelijän `number` arvo oli silti `0` jopa sen jälkeen, kun `setNumber(number + 1)` oli kutsuttu:

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

Tämän painikkeen tapahtumakäsittelijä kertoo Reactille toimimaan seuraavasti:

1. `setNumber(number + 1)`: `number` on `0` joten `setNumber(0 + 1)`.
    - React valmistelee muuttamaan `number` arvoksi `1` seuraavalle renderöinnille.
2. `setNumber(number + 1)`: `number` on `0` joten `setNumber(0 + 1)`.
    - React valmistelee muuttamaan `number` arvoksi `1` seuraavalle renderöinnille.
3. `setNumber(number + 1)`: `number` on `0` joten `setNumber(0 + 1)`.
    - React valmistelee muuttamaan `number` arvoksi `1` seuraavalle renderöinnille.

Vaikka kutsuit `setNumber(number + 1)` kolme kertaa, *tämän renderin* tapahtumakäsittelijän `number` on aina `0`, joten asetit tilan arvoksi `1` kolme kertaa. Tämän vuoksi React renderöi komponentin uudelleen `number` muuttujan ollen `1` eikä `3`.

Voit myös havainnollistaa tämän myös korvaamalla tilamuuttujat niiden arovilla koodissa. Koska tilamuuttuja `number` on `0` *tässä renderöinnissä*, sen tapahtumakäsittelijä näyttää tältä:

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

Seuraavassa renderöinnissä `number` on `1`, joten *tämän renderöinnin* tapahtumakäsittelijä näyttää tältä:

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

Tämän vuoksi painikkeen klikkaaminen asettaa laskurin arvoksi `2`, ja sitten seuraavalla klikkauksella `3` ja niin edelleen.

## Tila ajan myötä {/*state-over-time*/}

Noh, se oli hauskaa. Kokeile veikata mitä painikkeen klikkaaminen ilmoittaa:

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
        alert(number);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Jos sovellat aiemmin mainittua korvausmenetelmää, voit veikata, että ilmoituksessa lukee "0":

```js
setNumber(0 + 5);
alert(0);
```

Mutta entä jos laitat ajastimen ilmoitukseen, jotta sitä kutsutaan komponentin uudelleen renderöinnin _jälkeen_? Lukisiko siinä "0" vai "5"? Koita veikata!

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
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Yllätyitkö? Jos sovellat aiemmin mainittua korvausmenetelmää, näet, että "tilannekuva" tilasta välitettiin ilmoitukseen.

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

Reactiin tallennettu tila on saattanut muuttua, kun ilmoitus suoritetaan, mutta se ajoitettiin käyttämällä tilannekuvaa tilasta sillä hetkellä, kun käyttäjä oli vuorovaikutuksessa sen kanssa!

**Tilamuuttujan arvo ei koskaan muutu renderöinnin aikana,** vaikka sen tapahtumakäsittelijän koodi olisi asynkroninen. *Tuon renderöinnin* `onClick`:n sisällä `number`:n arvo on edelleen `0`, vaikka `setNumber(number + 5)` kutsuttiin. Sen arvo "kiinnitettiin", kun React "otti tilannekuvan" käyttöliittymästä kutsumalla komponenttiasi.

Tässä on esimerkki siitä, miten tämä tekee tapahtumankäsittelijöistäsi vähemmän alttiita ajoitusvirheille. Alla on lomake, joka lähettää viestin viiden sekunnin viiveellä. Kuvittele tämä skenaario:

1. Painat "Send"-painiketta, lähettäen "Hello" Aliisalle.
2. Ennen viiden sekunnin viiveen päättymistä, muutat "To" kentän arvoksi "Bob".

Mitä odotat, että `alert` näyttää? Näyttäisikö se, "You said Hello to Alice"? Vai, "You said Hello to Bob"? Tee arvaus sen perusteella mitä tiedät ja kokeile sitten:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

**React pitää tilan arvot "kiinteinä" renderöinnin tapahtumakäsittelijöiden sisällä.** Sinun ei tarvitse huolehtia siitä, onko tila muuttunut koodin suorituksen aikana.

Entä jos haluat lukea viimeisimmän tilan ennen uudelleen renderöintiä? Haluat käyttää [tilapäivitysfunktiota](/learn/queueing-a-series-of-state-updates), jota käsitellään seuraavalla sivulla!

<Recap>

* Tilan asettaminen pyytää uutta renderöintiä.
* React tallentaa tilan komponenttisi ulkopuolelle, ikään kuin hyllyyn.
* Kun kutsut `useState`:a, React antaa sinulle tilannekuvan tilasta *tässä renderöinnissä*.
* Muuttujat ja tapahtumankäsittelijät eivät "selviä" uudelleenlatauksista. Jokaisella renderöinnillä on omat tapahtumankäsittelijänsä.
* Jokainen renderöinti (ja sen sisällä olevat funktiot) "näkevät" aina tilannekuvan tilasta, jonka React antoi *tälle* renderöinnille.
* Voit havainnollistaa tilan tapahtumankäsittelijöissä samalla tavalla kuin ajattelet renderöidystä JSX:stä.
* Aikaisemmin luoduilla tapahtumankäsittelijöillä on sen renderöinnin tila-arvot, jossa ne luotiin.

</Recap>



<Challenges>

#### Toteuta liikennevalot {/*implement-a-traffic-light*/}

Tässä on suojatievalo-komponentti, joka kytkeytyy päälle kun painiketta painetaan:

<Sandpack>

```js
import { useState } from 'react';

export default function Liikennevalo() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
  }

  return (
    <>
      <button onClick={handleClick}>
        Vaihda: {walk ? 'Pysähdy' : 'Kävele'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Kävele' : 'Pysähdy'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Lisää `alert` klikkauksen tapahtumakäsittelijään. Kun valo on vihreä se ja sanoo "Kävele", painikkeen painamisen tulisi ilmoittaa "Seuraavaksi pysähdytään". Kun valo on punainen ja sanoo "Pysähdy", painikkeen painamisen tulisi ilmoittaa "Seuraavaksi kävellään".

Onko sillä merkitystä laitatko `alert`:n enne vai jälkeen `setWalk` kutsua?

<Solution>

Sinun `alert`:n pitäisi näyttää tältä:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'Seuraavaksi pysähdytään' : 'Seuraavaksi kävellään');
  }

  return (
    <>
      <button onClick={handleClick}>
        Vaihda: {walk ? 'Pysähdy' : 'Kävele'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Kävele' : 'Pysähdy'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Riippumatta siitä laitatko sen ennen vai jälkeen `setWalk` kutsun, sillä ei merkitystä. Tämän renderin `walk` tilan arvo on "kiinteä". `setWalk` kutsuminen muuttaa sen vain *seuraavalle* renderöinnille, mutta se ei vaikuta aikaisempien renderien tapahtumakäsittelijöihin.

Tämä rivi saattaa vaikuttaa epäintuitiiviselta aluksi:

```js
alert(walk ? 'Seuraavaksi pysähdytään' : 'Seuraavaksi kävellään');
```

Mutta siinä on järkeä, kun luet sen seuraavasti: "Jos liikennevalon väri sanoo 'Kävele', ilmoituksen tulisi olla 'Seuraavaksi pysähdytään.'" Tapahtumakäsittelijässäsi oleva `walk` -muuttuja vastaa kyseisen renderöinnin `walk`-arvoa, eikä se muutu.

Voit tarkistaa, että tämä on oikein soveltamalla korvausmenetelmää. Kun `walk` on `true`, saat:

```js
<button onClick={() => {
  setWalk(false);
  alert('Seuraavaksi pysähdytään');
}}>
  Vaihda: Pysähdy
</button>
<h1 style={{color: 'darkgreen'}}>
  Kävele
</h1>
```
Joten klikkaamalla "Vaihda pysähdykseen" jonotetaan renderöinti, jossa `walk` muuttujan arvoksi on asetettu `false`, ja näytetään ilmoitus "Seuraavaksi pysähdytään".

</Solution>

</Challenges>
