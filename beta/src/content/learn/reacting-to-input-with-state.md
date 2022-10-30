---
title: Reagointi syötteen tilaan
---

<Intro>

React käyttää deklaratiivista tapaa käsitellä käyttöliittymää. Sen sijaan, että manipuloit suoraan käyttöliittymän yksittäisiä osia, määrittelet eri tilat, joissa komponenttisi voi olla, ja vaihdat niiden välillä käyttäjän syötteen perusteella. Tämä muistuttaa sitä, miten suunnittelijat ajattelevat käyttöliittymästä.

</Intro>

<YouWillLearn>

* Miten deklaratiiviinen käyttöliittymäohjelmointi eroaa imperatiivisesta käyttöliittymäohjelmoinnista
* Kuinka luetella eri visuaaliset tilat, joissa komponenttisi voi olla?
* Miten käynnistää muutokset eri visuaalisten tilojen välillä koodista käsin?

</YouWillLearn>

## Miten deklaratiivinen käyttöliittymä vertautuu imperatiiviseen {/*how-declarative-ui-compares-to-imperative*/}

Kun suunnittelet käyttöliittymän vuorovaikutusta, luultavasti mietit, miten käyttöliittymä *muuttuu* käyttäjän toimien seurauksena. Ajattele lomaketta, jonka avulla käyttäjä voi lähettää vastauksen:

* Kun kirjoitat jotain lomakkeeseen, "Lähetä" painike **tulee käyttöön.**
* Kun painat "Lähetä", sekä lomake että painike **poistuu käytöstä,** ja latausikoni **tulee näkyviin.**
* Jos verkkopyyntö onnistuu, lomake **piiloutuu,** ja "Kiitos" viesti **tulee näkyviin.**
* Jos verkkopyyntö epäonnistuu, virheviesti **tulee näkyviin,** ja lomake **tulee käyttöön** uudelleen.

**Imperatiivisessa ohjelmoinnissa,** edellä mainittu viittaa suoraan siihen miten vuorovaikutus toteutetaan. Sinun täytyy kirjoittaa tarkat ohjeet käyttöliittymän manipulointiin sen perusteella mitä juuri tapahtui. Toinen tapa ajatella tätä on: Kuvittele, että olet autossa jonkun vieressä ja kerrot hänelle mihin käännytään joka käännökseltä.

<Illustration src="/images/docs/illustrations/i_imperative-ui-programming.png"  alt="Autossa, jota ohjaa ahdistuneen näköinen henkilö, joka edustaa JavaScriptiä, matkustaja käskee kuljettajaa suorittamaan mutkikkaan navigointisarjan." />

Hän ei tiedä mihin haluat mennä, noudattavat vain käskyjäsi. (Ja jos annat vääriä ohjeita, päädyt väärään paikkaan!) Tätä kutsutaan *imperatiiviseksi*, koska jokaista elementtiä täytyy "käskeä", latausikonista painikkeeseen, kertoen tietokoneelle *miten* päivittää käyttöliittymää.

Tässä imperatiivisen käyttöliittymäohjelmoinnin esimerkissä lomake on rakennettu *ilman* Reactia. Se käyttää selaimen sisäänrakennettua [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model):a.

<Sandpack>

```js index.js active
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm(answer) {
  // Oletetaan, että se yhdistäisi verkkoon.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() == 'istanbul') {
        resolve();
      } else {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      }
    }, 1500);
  });
}

let form = document.getElementById('form');
let textarea = document.getElementById('textarea');
let button = document.getElementById('button');
let loadingMessage = document.getElementById('loading');
let errorMessage = document.getElementById('error');
let successMessage = document.getElementById('success');
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <h2>City quiz</h2>
  <p>
    What city is located on two continents?
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>Submit</button>
  <p id="loading" style="display: none">Loading...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">That's right!</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
</style>
```

</Sandpack>

Käyttöliittymän manipulointi imperatiivisesti toimii hyvin eristetyissä esimerkeissä, mutta siitä tulee eksponentiaalisesti hankalempaa hallita monimutkaisissa järjestelmissä. Kuvittele, että päivität sivua täynnä erilaisia lomakkeita kuten tämä. Uuden käyttöliittymäelementin tai vuorovaikutuksen lisääminen vaatisi huolellista koodin tarkistusta, ettet ole luonut bugia (esimerkiksi, unohtanut näyttää tai piilottaa jotain).

React on rakennettu ratkaisemaan tämä ongelma.

Reactissa et suoraan manipuloi käyttöliittymää--tarkoittaen, että et ota käyttöön, poista käytöstä, näytä/piilota komponentteja suoraan. Sen sijaan **määrittelet mitä haluat näyttää,** ja React päättelee miten käyttöliittymä päivitetään. Kuvittele olevasi taksissa ja kerrot kuskille mihin haluat mennä sen sijaan, että kertoisit mihin kääntyä. On kuskin tehtävä viedä sinut sinne ja hän saattaa jopa tietää joitain oikoteita, joita et ole saattanut ottaa huomioon!

<Illustration src="/images/docs/illustrations/i_declarative-ui-programming.png" alt="Reactin ohjaamassa autossa matkustaja pyytää päästä tiettyyn paikkaan kartalla. React selvittää, miten se tehdään." />

## Käyttöliittymän ajatteleminen deklaratiivisesti {/*thinking-about-ui-declaratively*/}

Nyt olet nähnyt ylhäällä miten lomake toteutetaan imperatiivisesti. Jotta ymmärtäisit paremmin, miten Reactissa ajatellaan, käydään alla läpi tämän käyttöliittymän uudelleen toteuttaminen Reactissa:

1. **Tunnista** komponenttisi eri visuaaliset tilat
2. **Määritä** mikä käynnistää nämä tilamuutokset
3. **Edusta** tila muistissa käyttäen `useState` hookkia
4. **Poista** kaikki epäolennaiset tilamuuttujat
5. **Yhdistä** tapahtumakäsittelijät tilan asettamiseksi

### 1. Vaihe: Tunnista komponenttisi eri visuaaliset tilat {/*step-1-identify-your-components-different-visual-states*/}

Tietojenkäsittelytieteessä olet saattanut kuulla ["tilakoneesta"](https://en.wikipedia.org/wiki/Finite-state_machine), joka voi olla yhdessä useista "tiloista". Jos työskentelet suunnittelijan kanssa, olet saattanut nähdä mallinnuksia erilaisista "visuaalisista tiloista". React on suunnittelun ja tietotekniikan risteyskohta, joten molemmat ideat ovat inspiraation lähteitä.

Ensiksi, täytyy visualisoida kaikki käyttöliittymän eri "tilat", joita käyttäjä saattaa nähdä:

* **Tyhjä**: Lomakkeen "Lähetä" painike on poissa käytöstä.
* **Kirjoittaa**: Lomakkeen "Lähetä" painike on käytössä.
* **Lähettää**: Lomake on kokonaan poissa käytöstä. Latausikoni näkyy.
* **Onnistui**: "Kiitos" viesti näkyy lomakkeen sijaan.
* **Virhe**: Sama kuin Kirjoittaa -tila, mutta lisävirheviestillä.

Juuri kuten suunnittelija haluat "mallintaa" tai luoda "malleja" eri tiloihin ennen kuin lisäät logiikkaa. Esimerkiksi, tässä on malli vain lomakkeen visuaaliselle osalle. Tämä malli ohjataan `status` propsin kautta, jonka oletusarvona on `'empty'`:

<Sandpack>

```js
export default function Form({
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea />
        <br />
        <button>
          Submit
        </button>
      </form>
    </>
  )
}
```

</Sandpack>

Voisit nimetä propsin miten haluat, nimi ei nyt ole niin tärkeää. Kokeile muokata propsi `status = 'empty'` arvoon `status = 'success'` nähdäksesi onnistumisviestin. Mallintamisen avulla voit nopeasti iteroida käyttöliittymää ennen kuin lisäät logiikkaa. Tässä on täyteläisempi prototyyppi samasta komponentista, joka silti ohjataan `status` propsilla:

<Sandpack>

```js
export default function Form({
  // Try 'submitting', 'error', 'success':
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea disabled={
          status === 'submitting'
        } />
        <br />
        <button disabled={
          status === 'empty' ||
          status === 'submitting'
        }>
          Submit
        </button>
        {status === 'error' &&
          <p className="Error">
            Good guess but a wrong answer. Try again!
          </p>
        }
      </form>
      </>
  );
}
```

```css
.Error { color: red; }
```

</Sandpack>

<DeepDive title="Monien visuaalisten tilojen näyttäminen kerralla">

Jos komponentilla on monia visuaalisia tiloja, voi olla kätevää näyttää ne kaikki samalla sivulla:

<Sandpack>

```js App.js active
import Form from './Form.js';

let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>Form ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```

```js Form.js
export default function Form({ status }) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <form>
      <textarea disabled={
        status === 'submitting'
      } />
      <br />
      <button disabled={
        status === 'empty' ||
        status === 'submitting'
      }>
        Submit
      </button>
      {status === 'error' &&
        <p className="Error">
          Good guess but a wrong answer. Try again!
        </p>
      }
    </form>
  );
}
```

```css
section { border-bottom: 1px solid #aaa; padding: 20px; }
h4 { color: #222; }
body { margin: 0; }
.Error { color: red; }
```

</Sandpack>

Tämänkaltaisia sivuja usein kutsutaan "eläviksi tyyliohjeiksi" tai "storybookeiksi".

</DeepDive>

### 2. Vaihe: Määritä, mikä laukaisee nämä tilamuutokset {/*step-2-determine-what-triggers-those-state-changes*/}

Voit käynnistää tilamuutoksen vastauksena kahdenlaiseen syötteeseen:

* **Ihmisen syötteeseen,** kuten painikeen klikkaaminen, tekstin kirjoittaminen, linkkiin navigoiminen.
* **Tietokoneen syötteeseen,** kuten verkkopyynnön vastauksen saapuminen, aikakatkaisun päättyminen, kuvan lataaminen.

<IllustrationBlock>
  <Illustration caption="Ihmisen syötteet" alt="Sormi." src="/images/docs/illustrations/i_inputs1.png" />
  <Illustration caption="Tietokoneen syötteet" alt="Ykkösiä ja nollia." src="/images/docs/illustrations/i_inputs2.png" />
</IllustrationBlock>

Molemmissa tapauksissa, **saatat asettaa [tilamuuttujia](/learn/state-a-components-memory#anatomy-of-usestate) käyttöliittymän päivittämiseksi.** Kehittämässäsi lomakkeessa sinun on vaihdettava tilaa muutaman eri syötteen perusteella:

* **Tekstinsyötön muuttaminen** (ihminen) tulisi muuttaa *Tyhjä* tila *Kirjoitetaan* -tilaan tai päin vastoin, riippuen siitä onko syöttökenttä tyhjä vai ei.
* **Lähetä -painikkeen klikkaaminen** (ihminen) tulisi muuttaa tila *Lähetetään* arvoon.
* **Onnistunut verkkovastaus** (tietokone) tulisi muuttaa tila *Onnistunut* arvoon.
* **Epäonnistunut verkkovastaus** (tietokone) tulisi muuttaa tila *Virhe* arvoon itse virheviestin kanssa.

> Huomaa, että ihmisen syötteet usein vaativat [tapahtumakäsittelijöitä](/learn/responding-to-events)!

Ymmärtääksesi tämän prosessin paremmin voit kokeilla piirtää paperille jokaisen tilan ympyräksi ja jokaisen tilamuutoksen nuolina. Voit hahmotella monia prosesseja tällä tavoin ja selvittää virheet kauan ennen toteutusta.

<DiagramGroup>

<Diagram name="responding_to_input_flow" height={350} width={688} alt="Virtauskaavio vasemmalta oikealle, jossa on 5 ympyrää. Ensimmäisessä ympyrässä, jossa on merkintä 'empty', on yksi nuoli, jossa on merkintä 'start typping' ja joka on yhteydessä ympyrään, jossa on merkintä 'typping'. Kyseisessä ympyrässä on yksi nuoli, jossa on merkintä 'press submit', joka on yhteydessä ympyrään, jossa on merkintä 'submitting', jossa on kaksi nuolta. Vasemmanpuoleinen nuoli on merkitty 'network error', joka liittyy ympyrään 'error'. Oikea nuoli on merkitty merkinnällä 'network success' ja se on yhteydessä ympyrään, jonka nimi on 'success'.">

Lomakkeen tilat

</Diagram>

</DiagramGroup>

### 3. Vaihe: Esitä tila muistissa käyttämällä `useState`:a {/*step-3-represent-the-state-in-memory-with-usestate*/}

Seuraavaksi sinun täytyy esitellä komponenttisi visuaaliset tilat muistissa [`useState`.](/apis/react/useState) hookilla. Yksinkertaisuus on avainasemassa: jokainen osa tilaa on "liikkuva osa", ja **haluat niin vähän "liikkuvia osia" kuin mahdollista.** Suurempi monimutkaisuus johtaa useampiin virheisiin!

Aloita tilalla, jonka on *ehdottomasti oltava* siellä. Sinun on esimerkiksi tallennettava `answer` syötettä varten ja `error` (jos se on olemassa) viimeisimmän virheen tallentamiseksi:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
```

Sitten tarvitset tilamuuttujan, joka kuvaa, minkä aiemmin kuvatuista visuaalisista tiloista haluat näyttää. Muistissa on yleensä useampi kuin yksi tapa esittää tämä, joten sinun täytyy kokeilla sitä.

Jos sinun on vaikea keksiä heti parasta tapaa, aloita lisäämällä niin paljon tiloja, että olet *varma* siitä, että kaikki mahdolliset visuaaliset tilat on katettu:


```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```
Ensimmäinen ideasi ei todennäköisesti ole paras mahdollinen, mutta se ei haittaa - tilan muokkaaminen on osa prosessia!

### 4. Vaihe: Poista kaikki epäolennaiset tilamuuttujat {/*step-4-remove-any-non-essential-state-variables*/}

Haluat välttää toistoa tilasisällössä, jotta seuraat vain olennaisia asioita. Jos käytät hieman aikaa tilarakenteesi uudistamiseen, komponenttisi ovat helpommin ymmärrettävissä, toistoa vähennetään ja tahattomia merkityksiä vältetään. Tavoitteenasi on **estää tapaukset, joissa muistissa oleva tila ei edusta mitään pätevää käyttöliittymää, jonka haluaisit käyttäjän näkevän.** (Et esimerkiksi koskaan halua näyttää virheilmoitusta ja poistaa syötettä käytöstä samaan aikaan, tai käyttäjä ei pysty korjaamaan virhettä!).

Tässä on joitakin kysymyksiä, joita voit kysyä tilamuuttujiltasi:

* **Aiheuttaako tämä tila paradoksin?** Esimerkiksi, `isTyping` ja `isSubmitting` eivät voi molemmat olla arvoltaan `true`. Paradoksi tarkoittaa yleensä sitä, että tilaa ei ole tarpeeksi rajattu. Kahden totuusarvon yhdistelmiä voi olla neljä, mutta vain kolme vastaa kelvollisia tiloja. Jos haluat poistaa "mahdottoman" tilan, voit yhdistää nämä arvot "tilaksi", jonka on oltava yksi kolmesta arvosta: `'typing'`, `'submitting'`, tai `'success'`.
* **Ovatko samat tiedot jo saatavilla toisessa tilamuuttujassa?** Toinen paradoksi: `isEmpty` ja `isTyping` eivät voi olla arvoltaan `true` samaan aikaan. Tekemällä niistä erilliset tilamuuttujat, vaarana on, että ne menevät sekaisin ja aiheuttavat virheitä. Onneksi voit poistaa `isEmpty` ja sen sijaan tarkistaa `answer.length === 0`.
* **Voiko saman tiedon saada toisen tilamuuttujan käänteisluvusta?** `isError`:ia ei tarvita, sillä voit sen sijaan tarkistaa `error !== null`.

Tämän siivouksen jälkeen jäljelle jää 3 (7:stä!) *välttämätöntä* tilamuuttujaa:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', tai 'success'
```
Tiedät, että ne ovat välttämättömiä, kun et voi poistaa yhtään niistä rikkomatta toiminnallisuutta.

<DeepDive title="Eliminating “impossible” states with a reducer">

Nämä kolme muuttujaa ovat tarpeeksi kuvaamaan tämän lomakkeen tilaa. Kuitenkin, on jotain välitiloja, jotka eivät ole järkeviä. Esimerkiksi, ei-null `error` ei ole järkevä kun `status` on `success`. Tilan tarkemmaksi mallintamiseksi, voit käyttää [reduceria.](/learn/extracting-state-logic-into-a-reducer) Reducerien avulla voit yhdistää useita tilamuuttujia yhdeksi olioksi ja tiivistää liittyvät logiikat yhteen!

</DeepDive>

### 5. Vaihe: Yhdistä tapahtumakäsittelijät tilan asettamiseen {/*step-5-connect-the-event-handlers-to-set-state*/}

Lopuksi, luo tapahtumakäsittelijät, jotka asettavat tilamuuttujat. Alla on lopullinen lomake, jossa kaikki tapahtumakäsittelijät on kytketty:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

Vaikka tämä koodi ei ole enää alkuperäinen imperatiivinen esimerkki, se on kestävempi. Kaikkien vuorovaikutuksien ilmaiseminen tilamuutoksina antaa sinun ottaa käyttöön uusia visuaalisia tiloja rikkomatta olemassa olevia tiloja. Se myös antaa sinun muuttaa mitä tulisi näyttää eri tiloissa muuttamatta toimintalogiikkaa itsessään.

<Recap>

* Deklaratiivinen ohjelmointi tarkoittaa käyttöliittymän kuvaamista jokaiselle visuaaliselle tilalle toisin kuin käyttöliittymän mikromanagerointi (imperatiivinen).
* Komponenttia kehitettäessä:
  1. Tunnista kaikki sen visuaaliset tilat.
  2. Määritä ihmisen ja tietokoneen aiheuttamat tilamuutokset.
  3. Mallinna tila `useState`:lla.
  4. Poista epäolennainen tila välttääksesi bugeja ja paradokseja.
  5. Yhdistä tapahtumakäsittelijät tilan asettamiseen.

</Recap>



<Challenges>

#### Lisää ja poista CSS luokka {/*add-and-remove-a-css-class*/}

Toteuta tämä siten, että kuvan klikkaaminen *poistaa* `background--active` CSS luokan sitä ympäröivästä `<div>`, mutta *lisää* `picture--active` luokan `<img>` elementtiin. Taustan klikkaaminen uudestaan palauttaa alkuperäiset luokat. 

Visuaalisesti tulisi odottaa, että klikkaaminen poistaa violetin taustan ja korostaa kuvan reunoja. Kuvan ulkopuolelta klikkaaminen korostaa kuvan taustaa, mutta poistaa kuvan reunojen korostuksen.

<Sandpack>

```js
export default function Picture() {
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

<Solution>

Tällä komponentilla on kaksi visuaalista tilaa: kun kuva on aktiivinen ja kun kuva on inaktiivinen:

* Kun kuva on aktiivinen, CSS luokat ovat `background` ja `picture picture--active`.
* Kun kuva on inaktiivinen, CSS luokat ovat `background background--active` ja `picture`.

Yksi totuusarvo-tilamuuttuja on tarpeeksi muistamaan onko kuva aktiivinen. Alkuperäinen tehtävä oli poistaa tai lisätä CSS luokkia. Kuitenkin Reactissa sinun täytyy *kuvailla' mitä haluat nähdä käyttöliittymäelementtien *manipuloinnin* sijaan. Joten sinun tulee laskea molemmat CSS luokat nykyisen tilan pohjalta. Sinun täytyy myös [estää propagointi](/learn/responding-to-events#stopping-propagation), jotta kuvan klikkaaminen ei rekisteröidy taustakuvan klikkauksena.

Tarkista, että tämä versio toimii klikkaamalla kuvaa ja sen ulkopuolelta:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);

  let backgroundClassName = 'background';
  let pictureClassName = 'picture';
  if (isActive) {
    pictureClassName += ' picture--active';
  } else {
    backgroundClassName += ' background--active';
  }

  return (
    <div
      className={backgroundClassName}
      onClick={() => setIsActive(false)}
    >
      <img
        onClick={e => {
          e.stopPropagation();
          setIsActive(true);
        }}
        className={pictureClassName}
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

Vaihtoehtoisesti, voisit palauttaa kaksi erillistä JSX lohkoa:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);
  if (isActive) {
    return (
      <div
        className="background"
        onClick={() => setIsActive(false)}
      >
        <img
          className="picture picture--active"
          alt="Rainbow houses in Kampung Pelangi, Indonesia"
          src="https://i.imgur.com/5qwVYb1.jpeg"
          onClick={e => e.stopPropagation()}
        />
      </div>
    );
  }
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
        onClick={() => setIsActive(true)}
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

Muista, että jos kaksi eri JSX lohkoa kuvaa samaa puuta, niiden sisennysten (ensimmäinen `<div>` → ensimmäinen `<img>`) tulisi vastata toisiaan. Muutoin, `isActive`:n vaihtaminen loisi koko puun uudelleen ja [palauttaisi sen tilan.](/learn/preserving-and-resetting-state) Jos samanlaiset JSX puut palautetaan molemmissa tiloissa, on parempi kirjoittaa ne samassa palasessa JSX:ää.

</Solution>

#### Profiilieditori {/*profile-editor*/}

Tässä on pieni lomake toteutettuna perinteiselllä JavaScriptilla ja DOM:lla. Leiki tämän kanssa ymmärtääksesi sen toimintaa:

<Sandpack>

```js index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Tämä lomake vaihtaa kahden tilan välillä: muokkaustilassa näet kentät ja katselutilassa näet vain lopputuloksen. Painikkeen teksti vaihtuu "Edit ja "Save" välillä riippuen missä tilassa olet. Kun muutat kenttiä, tervetuloa -viesti pohjalla päivittyy reaaliajassa.

Tehtäväsi on toteuttaa tämä lomake Reactilla. Avuksesi merkintäkoodi on jo muutettu JSX:ksi, mutta sinun tulee toteuttaa kenttien näyttäminen ja piilottaminen juuri kuten alkuperäinen.

Varmista, että se päivittää tekstin lopussa myös!

<Sandpack>

```js
export default function EditProfile() {
  return (
    <form>
      <label>
        First name:{' '}
        <b>Jane</b>
        <input />
      </label>
      <label>
        Last name:{' '}
        <b>Jacobs</b>
        <input />
      </label>
      <button type="submit">
        Edit Profile
      </button>
      <p><i>Hello, Jane Jacobs!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution>

Tarvitset kaksi eri tilamuuttujaa pitämään kenttien arvoja: `firstName` ja `lastName`. Tarvitset myös `isEditing` tilamuuttujan joka pitää yllä näytetäänkö kenttiä vai ei. _Et_ tarvitse `fullName` muuttujaa, koska koko nimi voidaan laskea `firstName` ja `lastName` muuttujien avulla.

Lopuksi, sinun tulisi käyttää [ehdollista renderöintiä](/learn/conditional-rendering) näyttääksesi tai piilottaaksesi syötekentät riippuen `isEditing` muuttujan tilasta.

<Sandpack>

```js
import { useState } from 'react';

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Jacobs');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsEditing(!isEditing);
    }}>
      <label>
        First name:{' '}
        {isEditing ? (
          <input
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value)
            }}
          />
        ) : (
          <b>{firstName}</b>
        )}
      </label>
      <label>
        Last name:{' '}
        {isEditing ? (
          <input
            value={lastName}
            onChange={e => {
              setLastName(e.target.value)
            }}
          />
        ) : (
          <b>{lastName}</b>
        )}
      </label>
      <button type="submit">
        {isEditing ? 'Save' : 'Edit'} Profile
      </button>
      <p><i>Hello, {firstName} {lastName}!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

Vertaa tätä ratkaisua alkuperäiseen imperatiiviseen koodiin. Miten ne poikkeavat?

</Solution>

#### Kehitä imperatiivinen ratkaisu ilman Reactia {/*refactor-the-imperative-solution-without-react*/}

Tässä on alkuperäinen hiekkalaatikko aikaisemmasta haasteesta, imperatiivisesti kirjoitettuna ilman Reactia:

<Sandpack>

```js index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Kuvitte, että Reactia ei olisi olemassa. Voisitko kirjottaa tämän koodin tavalla, joka tekee logiikasta vankempaa ja lähemmäs Reactin tapaa? Miltä se näyttäisi, jos tila olisi eksplisiittistä kuten Reactissa?

Jos et tiedä mistä aloittaisit, alla on suurin osa rakenteesta valmiina. Jos aloitat tästä, täytä puuttuva logiikka `updateDOM` fuktiosta. (Viittaa alkuperäiseen koodiin tarvittaessa.)

<Sandpack>

```js index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    // TODO: show inputs, hide content
  } else {
    editButton.textContent = 'Edit Profile';
    // TODO: hide inputs, show content
  }
  // TODO: update text labels
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

<Solution>

Puuttuva logiikka sisältää kenttien ja sisällön piilottamisen ja näyttämisen, lisäksi painikkeen tekstin päivittämisen:

<Sandpack>

```js index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    'Hello ' +
    firstName + ' ' +
    lastName + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

`updateDOM` funktio, jonka kirjoitit näyttää mitä React tekee pellin alla kun asetat tilan. (Kuitenkin, React myös välttää koskemasta DOM:iin, kohteissa jotka eivät ole muuttuneet viimeisestä renderöinnistä.)

</Solution>

</Challenges>
