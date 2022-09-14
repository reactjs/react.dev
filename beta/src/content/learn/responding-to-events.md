---
title: Tapahtumiin vastaaminen
---

<Intro>

React antaa sinun lisätä *tapahtumakäsittelijöitä* JSX:sssä. Tapahtumakäsittelijät ovat omia funktioitasi, joita kutsutaan vastauksena vuorovaikutuksiin kuten klikkauseen, hoveriin, lomakkeiden kohteiden focusointiin, jne.

</Intro>

<YouWillLearn>

* Eri tavat kirjoittaa tapahtumakäsittelijä
* Miten välittää tapahtumakäsittelijän logiikka pääkomponentista
* Miten tapahtumat leviävät ja miten sen voi estää

</YouWillLearn>

## Tapahtumakäsittelijöiden lisääminen {/*adding-event-handlers*/}

Lisätäksesi tapahtumakäsittelijän, täytyy ensiksi määritellä funktio ja sitten [välittää se propsina](/learn/passing-props-to-a-component) sopivalle JSX tagille. Esimerkiksi, tässä on painike, joka ei tee vielä mitään:

<Sandpack>

```js
export default function Button() {
  return (
    <button>
      I don't do anything
    </button>
  );
}
```

</Sandpack>

Voit laittaa sen näyttämään viestin kun käyttäjä klikkaa tekemällä nämä kolme vaihetta:

1. Määritä funktio nimeltään `handleClick` komponentin `Button` *sisällä*.
2. Toteuta logiikka funktion sisällä (käytä `alert` funktiota näyttääksesi viestin).
3. Lisää `onClick={handleClick}` `<button>` tagiin JSX:ssä.

<Sandpack>

```js
export default function Button() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Määrittelit `handleClick` funktion ja [välitit sen propsina](/learn/passing-props-to-a-component) `<button>`:lle.  `handleClick` on **tapahtumaksäittelijä**. Tapahtumakäsittelijäfunktiot:

* ovat useimmiten määritelty komponenttien *sisällä*.
* alkavat sanalla `handle`, jonka jälkeen nimeen tulee tapahtuman nimi.

> Tavanomaisesti tapahtumakäsittelijät alkavat sanalla `handle` ja sisältävät tapahtuman nimen. Näet usein `onClick={handleClick}`, `onMouseEnter={handleMouseEnter}`, ja niin edelleen.

Vaihtoehtoisesti voit määritellä tapahtumakäsittelijän samalla rivillä JSX:ssä.

```jsx
<button onClick={function handleClick() {
  alert('You clicked me!');
}}>
```

Tai tiiviimmin nuolifunktioilla:

```jsx
<button onClick={() => {
  alert('You clicked me!');
}}>
```

Kaikki nämä tyylit vastaavat toisiaan. Samalla rivillä olevat tapahtumakäsittelijät ovat käteviä lyhyihin funktioihin.

<Gotcha>

Tapahtumakäsittelijöihin annetut funktiot täytyy välitää, niitä ei pidä kutsua. Esimerkiksi:

| funktion välittäminen (oikein)           | funktion kutsuminen (väärin) |
|----------------------------------------|--------------------------------|
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

Ero on hienovarainen. Ensimmäisessä esimerkissä `handleClick` funktio välitetään `onClick` tapahtumakäsittelijäksi. Tämä kertoo Reactille, että sen täytyy muistaa se ja kutsua sitä vain kun käyttäjä klikkaa painiketta.

Toisessa esimerkissä `handleClick()` lopussa oleva `()` kutsuu funktiota *heti* [renderöinnin](/learn/render-and-commit) aikana ilman yhtään klikkausta. Näin tapahtuu, koska JSX aaltosulkeiden välissä [`{` ja `}`](/learn/javascript-in-jsx-with-curly-braces) oleva JavaScript suoritetaan heti. 

Kun kirjoitat koodia samalle riville, sama sudenkuoppa esiintyy uudelleen eri tavalla:

| funktion välittäminen (oikein)           | funktion kutsuminen (väärin) |
|----------------------------------------|--------------------------------|
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |


Tällä tavoin annettua koodia ei kutsuta klikkauksen yhteydessä. Sitä kutsutaan joka kerta kun komponentti renderöidään:

```jsx
// Tämä ilmoitus kutsutaan kun komponentti renderöidään, ei klikattaessa!
<button onClick={alert('You clicked me!')}>
```

Jos haluat määritellä tapahtumakäsittelijän samalla rivillä, kääri se anonyymiin funktioon tällä tavoin:

```jsx
<button onClick={() => alert('You clicked me!')}>
```

Sen sijaan, että koodi suoritettaisiin joka renderöinnin yhteydessä, tämä luo uuden funktion myöhemmin kutsuttavaksi.

Molemmissa tilanteissa välität funktion:

* `<button onClick={handleClick}>` välittää `handleClick` funktion.
* `<button onClick={() => alert('...')}>` välittää `() => alert('...')` funktion.

> Tutustu [JavaScript Refresheriin](TODO:/learn/a-javascript-refresher#arrow-functions) saadaksesi lisätietoa nuolifunktioista.

</Gotcha>

### Propsien lukeminen tapahtumakäsittelijöissä {/*reading-props-in-event-handlers*/}

Sillä tapahtumakäsittelijät ovat määritelty komponentin sisällä, niillä on pääsy komponenttien propseihin. Tässä on painike, joka klikattaessa näyttää `message` prosin ilmoituksena:

<Sandpack>

```js
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="Playing!">
        Play Movie
      </AlertButton>
      <AlertButton message="Uploading!">
        Upload Image
      </AlertButton>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Näin nämä kaksi painiketta voivat näyttää eri viestejä. Kokeile muuttaa niille välitettyjä viestejä.

### Tapahtumakäsittelijöiden välittäminen propseina {/*passing-event-handlers-as-props*/}

Usein haluat pääkomponentin pystyä määritellä alakomponentin tapahtumakäsittelijän. Esimerkiksi painikkeet: riippuen missä käytät `Button` komponenttia, saatat haluta kutsua eri funktiota. Ehkäpä yksi toistaa videota ja toinen lähettää kuvan palvelimelle.

Voit tehdä tämän välittämällä tapahtumakäsittelijän propsina alakomponentille: 

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`Playing ${movieName}!`);
  }

  return (
    <Button onClick={handlePlayClick}>
      Play "{movieName}"
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Uploading!')}>
      Upload Image
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Kiki's Delivery Service" />
      <UploadButton />
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>


Tässä, `Toolbar` komponentti renderöi `PlayButton` komponentin sekä `UploadButton` komponentin:

- `PlayButton` välittää `handlePlayClick` funktion `onClick` propsina `Button`:lle.
- `UploadButton` välittää `() => alert('Uploading!')` funktion `onClick` propsina `Button`:lle.

Lopuksi, `Button` komponenttisi hyväksyy `onClick` propsin. Se välittää propsin suoraan selaimen sisäänrakennettuun `<button>` elementtiin `onClick={onClick}` koodilla. Tämä kertoo Reactille, että kutsuu välitettyä funktiota klikkauksen yhteydessä.

Jos käytät [design system:iä](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969), on yleistä komponenttien kuten painikkeiden sisältää tyylit mutta ei käyttäytymistä. Sen sijaan komponentit kuten `PlayButton` ja `UploadButton` välittävät tapahtumakäsittelijät alaspäin.

### Tapahtumakäsittelijän propsien nimeäminen {/*naming-event-handler-props*/}

Sisäänrakennetut elementit kuten `<button>` ja `<div>` tukevat ainoastaan [selaimen tapahtumien nimiä](TODO:/apis/react-dom/events) kuten `onClick`. Kuitenkin, kun rakennat omia komponenttejasi, voit nimetä niiden tapahtumakäsittelijöiden propsit miten haluat.

> Tavanomaisesti, tapahtumakäsittelijän propsien kuuluisi alkaa sanalla `on`, ja jatkua isolla kirjaimella.

Esimerkiksi, `Button` komponentin `onClick` propsi voitaisiin kutusua `onSmash`:

<Sandpack>

```js
function Button({ onSmash, children }) {
  return (
    <button onClick={onSmash}>
      {children}
    </button>
  );
}

export default function App() {
  return (
    <div>
      <Button onSmash={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onSmash={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Tässä esimerkissä, `<button onClick={onSmash}>` kertoo, että selaimen `<button>` elementti (pienin kirjaimin) tarvitsee silti propsin nimeltään `onClick`, mutta kustomoidun `Button` komponentin vastaanottaman propsin nimi voi olla mikä tahansa!

Kun komponenttisi tukee useampia interaktioita, saatat nimetä tapahtumakäsittelijöiden propsit sovelluskohtaisin konseptein. Esimerkiksi tämä `Toolbar` komponentti vastaanottaa `onPlayMovie` sekä `onUploadImage` tapahtumakäsittelijät:

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

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Huomaa, miten `App` komponentin ei tarvitse tietää *mitä* `Toolbar` tekee sen `onPlayMovie` tai `onUploadImage` tapahtumakäsittelijöillä. Se on `Toolbar` komponentin toteutusyksityiskohta. Tässä, `Toolbar` välittää ne `Button`:nien `onClick` käsittelijöinä, mutta se voisi myöhemmin myös kutsua niitä pikanäppäimestä. Propsien nimeäminen sovelluskohtaisten vuorovaikutusten kautta, kuten `onPlayMovie`, antaa joustavuuden muuttaa niitä myöhemmin.

## Tapahtuman leviäminen {/*event-propagation*/}

<!--
// TODO illo
-->

Komponenttisi tapahtumankäsittelijät nappaavat tapahtumia myös alakomponenteista. Tätä usein kutsutaan "kuplimiseksi" tai "propagoinniksi": se alkaa sieltä missä tapahtuma esiintyi ja nousee puussa ylemmäs. 

Tämä `<div>` sisältää kaksi painiketta. Sekä `<div>` tagi *että* painikkeet omaavat ikioman `onClick` käsittelijän. Mitä arvelet mitä tapahtumakäsittelijää kutsutaan, kun painiketta klikataan?

<Sandpack>

```js
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <button onClick={() => alert('Playing!')}>
        Play Movie
      </button>
      <button onClick={() => alert('Uploading!')}>
        Upload Image
      </button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

Jos klikkaat jompaa kumpaa painiketta, sen `onClick` suoritetaan ensin, jonka jälkeen `<div>` tagin `onClick`. Joten kaksi viestiä tulee näkyviin. Jos klikkaat työkalupalkkia vain `<div>`:n `onClick` suoritetaan.

<Gotcha>

Kaikki tapahtumat propagoituvat Reactissa paitsi `onScroll`, joka toimii vain siinä JSX tagissa johon sen liität.

</Gotcha>

### Propagoinnin pysäyttäminen {/*stopping-propagation*/}

Tapahtumakäsittelijät vastaanottavat **tapahtumaolion** niiden ainoana argumenttina. Tavanomaisesti sitä usein kutsutaan `e` kirjaimella, joka on lyhenne sanasta "event". Voit käyttää tätä oliota lukeaksesi tietoa tapahtumasta.

Tämä tapahtumaolio mahdollistaa myös tapahtuman propagoinnin estämisen. Jos haluat estää tapahtuman propagoinnin pääkomponenteille, kutsu `e.stopPropagation()` funktiota kuten tämä `Button` komponentti tekee:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <Button onClick={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onClick={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

Kun klikkaat painiketta:

1. React kutsuu `<button>` tagille annettua `onClick` käsittelijää. 
2. Tämä `Button`:ssa määritelty käsittelijä tekee seuraavat asiat:
   * Kutsuu `e.stopPropagation()` funktiota, estäen tapahtuman kuplimisen.
   * Kutsuu `onClick` funktiota, joka on `Toolbar` komponentista välitetty propsi.
3. `Toolbar` komponentissa määritelty funktio näyttää painikkeen oman ilmoituksen.
4. Sillä propagointi on pysäytetty, `<div>` tagin `onClick` käsittelijää ei suoriteta.

`e.stopPropagation()` funktion tuloksena painikkeiden klikkaaminen näyttää vain yhden ilmoituksen (`button`:sta) kahden ilmoituksen sijaan (`<button>`:sta sekä `<div>`:sta). Painikkeen klikkaaminen ei ole sama asia kuin ympäröivä työkalupalkki, joten propagoinnin pysäyttäminen on järkevää tälle UI:lle.

<DeepDive title="Nappaa tapahtumavaiheet">

<!--
// TODO Illo
-->

Harvinaisissa tapauksissa saatat haluta napata kaikki lapsielementtien tapahtumat, *vaikka ne olisivat estäneet propagoinnin*. Esimerkiksi, ehkäpä haluat kerätä analytiikkatietoja jokaisesta klikkauksesta, riippumatta propagointilogiikasta. Voit tehdä tämän lisäämällä `Capture` tapahtumanimen perään:
```js
<div onClickCapture={() => { /* suoritetaan ensin */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

Jokainen tapahtuma propagoituu kolmaessa vaiheessa:

1. Se kulkee alaspäin, kutsuen kaikki `onClickCapture` käsittelijät.
2. Se suorittaa klikatun elementin `onClick` käsittelijän. 
3. Se kulkee ylöspäin, kutsuen kaikki `onClick` käsittelijät.

Tapahtumien nappaaminen on kätevää koodille kuten reitittimille taikka analytiikalle, mutta et todennäköisesti tule käyttämään sitä sovelluskoodissa.

</DeepDive>

### Käsittelijöiden välittäminen vaihtoehtona propagoinnille {/*passing-handlers-as-alternative-to-propagation*/}

Huomaa kuinka tämä klikkauskäsittelijä suorittaa yhden rivin koodia _ja sitten_ kutsuu välitettyä `onClick` proppia:

```js {4,5}
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

Voisit halutessasi lisätä lisää koodia tähän käsittelijään ennen `onClick` tapahtumakäsittelijän kutsumista. Tämä tapa mahdollistaa *vaihtoehdon* propagoinnille. Sen avulla alakomponentit käsittelevät tapahtuman, silti antaen pääkomponenttien määritellä lisäkäyttäytymisiä. Toisin kuin propagointi, se ei ole automaattista. Kuitenkin tällä tavalla voit selkeästi seurata koko koodiketjua, jota kutsutaan jonkin tapahtuman seurauksena.

Jos nojaat propagointiin ja on hankalaa jäljittää mikä käsittelijä suoritetaan ja miksi, kokeile tätä tapaa sen sijaan.

### Oletustoiminnon estäminen {/*preventing-default-behavior*/}

Jotkin selaintapahtumat sisältävät oletustoimintoja. Esimerkiksi kun `<form>`:ssa olevaa painiketta klikataan, submit -tapahtuma lataa koko sivun uudelleen oletusarvoisesti:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={() => alert('Submitting!')}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Voit kutsua tapahtumaolion `e.preventDefault()` funktiota estääksesi tämän tapahtumasta:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Submitting!');
    }}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Älä sekoita `e.stopPropagation()` ja `e.preventDefault()` funktioita. Molemmat ovat hyödyllisiä, mutta ne eivät liity toisiinsa:

* [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) estää ylempien tagien käsittelijöiden suorittamisen.
* [`e.preventDefault()` ](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) estää selaimen oletustoiminnon muutamissa tapahtumissa, joissa sellainen on.

## Voiko tapahtumakäsittelijöillä olla sivuvaikutuksia? {/*can-event-handlers-have-side-effects*/}

Totta kai! Tapahtumakäsittelijät ovat paras paikka sivuvaikutuksille.

Toisin kuin renderöintifunktiot, tapahtumakäsittelijöiden ei tarvitse olla [puhtaita](/learn/keeping-components-pure), joten ne ovat hyvä hyvä paikka *muuttaa* jotain. Esimerkiksi, syöttökentän arvon muuttaminen kirjoituksen seurauksena, tai listan muuttaminen painikkeen painalluksen seurauksena. Kuitenkin, jotta voit muuttaa jotain tietoa, se täytyy ensiksi tallentaa. Reactissa tämä tapahtuu käyttämällä [tilaa, komponentin muistia](/learn/state-a-components-memory). Tulet oppimaan siitä kaiken seuraavalla sivulla.

<Recap>

* Voit käsitellä tapahtumia välittämällä funktion propsina elementille kuten `<button>`.
* Tapahtumakäsittelijät tulee välitää, **ei kutsua!** `onClick={handleClick}`, ei `onClick={handleClick()}`.
* Voit määritellä tapahtumakäsittelijän funktion erikseen tai samalla rivillä.
* Tapahtumakäsittelijät määritellään komponentin sisällä, jotta ne saavat pääsyn propseihin.
* Voit määritellä tapahtumakäsittelijän yläkomponentissa ja välittää sen propsina alakomponentille.
* Voit määritellä omian tapahtumakäsittelijäpropseja sovelluskohtaisilla nimillä.
* Tapahtumat propagoituvat ylöspäin. Kutsu `e.stopPropagation()` estääksesi sen.
* Tapahtumilla saattaa olla ei toivottuja oletustoimintoja. Kutsu `e.preventDefault()` estääksesi sen.
* Tapahtumakäsittelijän kutsuminen alakomponentista on hyvä vaihtoehto propagoinnille.

</Recap>



<Challenges>

### Korjaa tapahtumakäsittelijä {/*fix-an-event-handler*/}

Painikkeen painamisen on tarkoitus vaihtaa sivun taustaväriä valkoisen ja musta välillä. Klikattaessa mitään ei kuitenkaan tapahdu. Korjaa ongelma. (Älä huoli `handleClick`:n sisällä olevasta logiikasta, se on hyvä sellaisenaan.)

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick()}>
      Kytke valot
    </button>
  );
}
```

</Sandpack>

<Solution>

Ongelma on, että `<button onClick={handleClick()}>` _kutsuu_ `handleClick` functiota renderöinnin aikana _välittämisen_ sijaan. Poistamalla `()`-kutsun, jotta koodissa lukee `<button onClick={handleClick}>` korjaa ongelman:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick}>
      Kytke valot
    </button>
  );
}
```

</Sandpack>

Vaihtoehtoisesti voit kääriä kutsun toisen funktion sisään, kuten `<button onClick={() => handleClick()}`:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={() => handleClick()}>
      Kytke valot
    </button>
  );
}
```

</Sandpack>

</Solution>

### Yhdistä tapahtumat {/*wire-up-the-events*/}

Tää `ColorSwitch` komponentti renderöi painikkeen. Sen on tarkoitus muuttaa sivun väriä. Yhdistä se `onChangeColor` tapahtumakäsittelijään, jonka se saa propsina sen yläkomponentilta, jotta painikkeen klikkaaminen vaihtaa väriä.

Kun olet tehnyt tämän, huomaa, että painikkeen klikkaaminen myös kasvattaa sivun lukua. Koodin kirjoittanut kollegasi vaatii, että `onChangeColor` ei kasvata laskuria. Mitä muuta saattaa tapahtua? Korjaa se, jotta painikkeen painaminen vaihtaa *vain* väriä, ja se _ei_ kasvata lukua.

<Sandpack>

```js ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button>
      Vaihda väriä
    </button>
  );
}
```

```js App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Klikkauksia sivulla: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

<Solution>

Ensiksi, sinun täytyy lisätä tapahtumakäsittelijä, tällä tavoin `<button onClick={onChangeColor}>`.

Tämä kuitenkin luo ongelman kasvavasta luvusta. Jos `onChangeColor` ei tee tätä, kuten kollegasi niin väittää, silloin ongelma on, että tämä tapahtuma propagoituu ylöspäin ja jokin muu käsittelijä tekee sen. Ongelman ratkaisemiseksi, sinun täytyy estää propagointi. Älä unohda kutsua `onChangeColor` funktiota.

<Sandpack>

```js ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onChangeColor();
    }}>
      Vaihda väriä
    </button>
  );
}
```

```js App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Klikkauksia sivulla: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
