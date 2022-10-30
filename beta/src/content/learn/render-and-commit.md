---
title: Renderöi ja kommitoi
---

<Intro>

Ennen kuin komponenttisi näkyvät ruudulla, Reactin näytyy renderöidä ne. Tämän
prosessin vaiheiden ymmärtäminen auttaa sinua miettimään miten koodisi suoritetaan ja
selittämään sen käyttäytymistä.

</Intro>

<YouWillLearn>

- Mitä renderöinti tarkoittaa Reactissa
- Milloin ja miksi React renderöi komponentin
- Vaaditut vaiheet komponentin näyttämiseksi näytöllä
- Miksi renderöinti ei aina tuota DOM päivitystä

</YouWillLearn>

Kuvittele, että komponenttisi ovat kokkeja keittiössä kasaamassa maukkaita ruokia raaka-aineista. Tässä skenaariossa React on tarjoilija, joka tuo ja vie asiakkaiden tilaukset. Tässä käyttöliittymän pyyntö- ja käyttöprosessissa on kolme vaihetta:

1. **Triggeröidä** renderöinti (tuoda vierailijan tilaus keittiölle)
2. **Renderöidä** komponentti (tilauksen valmistelu keittiössä)
3. **Kommitoida** DOM:iin (tilauksen asettaminen pöydälle)

<IllustrationBlock sequential>
  <Illustration
    caption="Trigger"
    alt="React as a server in a restaurant, fetching orders from the users and delivering them to the Component Kitchen."
    src="/images/docs/illustrations/i_render-and-commit1.png"
  />
  <Illustration
    caption="Render"
    alt="The Card Chef gives React a fresh Card component."
    src="/images/docs/illustrations/i_render-and-commit2.png"
  />
  <Illustration
    caption="Commit"
    alt="React delivers the Card to the user at their table."
    src="/images/docs/illustrations/i_render-and-commit3.png"
  />
</IllustrationBlock>

## 1. Vaihe: Triggeröi renderöinti {/*step-1-trigger-a-render*/}

On kaksi syytä miksi komponentti renderöidään:

1. Se on komponentin **ensimmäinen renderöinti.**
2. Komponentin (tai yhden sen vanhemman) **tila on päivittynyt.**

### Ensimmäinen renderöinti {/*initial-render*/}

Kun sovelluksesi käynnistyy, sinun täytyy triggeröidä ensimmäinen renderöinti. Ohjelmistokehykset ja hiekkalaatikot usein piilottavat tämän koodin, mutta se tehdään kutsumalla [`createRoot`](https://beta.reactjs.org/apis/react-dom/client/createRoot) funktiota kohde DOM elementillä ja sitten kutsumalla sen `render` metodia komponenttisi kanssa:

<Sandpack>

```js index.js active
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Image />);
```

```js Image.js
export default function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

</Sandpack>

Kokeile kommentoida `root.render()` kutsu ja näet komponentin katoavan!

### Uudelleenrenderöityy tilan päivittyessä {/*re-renders-when-state-updates*/}

Kun komponentti on renderöity aluksi, voit triggeröidä uusia renderöintejä päivittämällä sen tilaa [`set` funktiolla.](/apis/react/useState#setstate) Komponentin tilan päivittäminen automaattisesti lisää renderöinnin jonoon. (Voit kuvitella tätä ravintolan vieraana tilaamassa teetä, jälkiruokaa, ja kaikkea muuta alkuperäisen tilauksen jälkeen, janon tai nälän tilasta riippuen.)

<IllustrationBlock sequential>
  <Illustration
    caption="State update..."
    alt="React as a server in a restaurant, serving a Card UI to the user, represented as a patron with a cursor for their head. They patron expresses they want a pink card, not a black one!"
    src="/images/docs/illustrations/i_rerender1.png"
  />
  <Illustration
    caption="...triggers..."
    alt="React returns to the Component Kitchen and tells the Card Chef they need a pink Card."
    src="/images/docs/illustrations/i_rerender2.png"
  />
  <Illustration
    caption="...render!"
    alt="The Card Chef gives React the pink Card."
    src="/images/docs/illustrations/i_rerender3.png"
  />
</IllustrationBlock>

## 2. Vaihe: React renderöi komponenttisi {/*step-2-react-renders-your-components*/}

Sen jälkeen kun olet triggeröinyt renderin, React kutsuu komponenttejasi päätelläkseen mitä näyttää ruudulla. **"Renderöinti" on React kutsumassa komponenttejasi.**

- **Ensimmäisen renderöinnin** yhteydessä React kutsuu juurikomponenttiasi.
- **Seuraavissa renderöinneissä** React kutsuu komponenttia, jonka tila triggeröi renderöinnin.

Tämä prosessi on rekursiivinen: jos päivitetty komponentti palauttaa jonkin toisen komponentin, React kutsuu _sen_ komponentin seuraavaksi, ja jos se komponentti myös palauttaa jotain, se renderöi _sen_ komponentin seuraavaksi, ja niin edelleen. Tämä prosessi jatkuu kunnes ei ole enempää sisennettyjä komponentteja ja React tietää tarkalleen mitä ruudulla tulisi näkyä.

Seuraavassa esimerkissä, React kutsuu `Gallery()` ja `Image()` komponentteja useita kertoja:

<Sandpack>

```js Gallery.js active
export default function Gallery() {
  return (
    <section>
      <h1>Inspiring Sculptures</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

```js index.js
import Gallery from './Gallery.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Gallery />);
```

```css
img {
  margin: 0 10px 10px 0;
}
```

</Sandpack>

- **Ensimmäisen renderöinnin aikana** React [luo DOM nodet](https://developer.mozilla.org/docs/Web/API/Document/createElement) `<section>`, `<h1>`, ja kolmelle `<img>` tagille.
- **Uudelleenrenderöinnin aikana,** React laskee mitkä niiden propertyistä, jos mitkään, ovat muuttuneet sitten aiemman renderöinnin. Se ei tee näillä tiedoilla mitään ennen seuraavaa commit-vaihetta.

<Pitfall>

Renderöinnin on oltava aina [puhdas laskelma](/learn/keeping-components-pure):

- **Samat sisääntulot, samat ulostulot.** Annettaen samat lähtötiedot, puhtaan funktion tulisi aina palauttaa sama lopputulos. (Kun joku tilaa salaatin tomaateilla, sen ei tulisi saada salaatti sipulilla!)
- **Huolehtii omista asioistaan.** Se ei muuta yhtään oliota tai muuttujaa joka oli olemassa ennen kuin se renderöitiin. (Toisen tilaus ei pitäisi muuttaa kenenkään muun tilausta.)

Muutoin saatat kohdata hämmentäviä bugeja ja arvaamatonta käyttäytymistä kun koodipohjasi monimutkaisuuden kasvaessa. Kehittäessä "Strict Modessa," React kutsuu jokaisen komponentin funktiota kahdesti, joka nostaa pintaan epäpuhtaiden funktioiden virheitä.

</Pitfall>

<DeepDive title="Tehokkuuden optimointi">

Päivitetyn komponentin sisäkkäisten komponenttien renderöinti oletuksena ei ole optimaalinen suorituskyvyn kannalta, jos päivittynyt komoponentti on todella korkealla puussa. Jos törmäät ongelmiin suorituskyvyssä, on useita tapoja ratkaista niitä jälkeenpäin. Näitä käydään läpi [Suorituskyky](https://reactjs.org/docs/optimizing-performance.html#gatsby-focus-wrapper) osiossa. **Älä optimoi ennenaikaisesti!**

</DeepDive>

## 3. Vaihe: React committaa muutokset DOM:iin {/*step-3-react-commits-changes-to-the-dom*/}

Komponenttisi renderöinnin (kutsumisen) jälkeen React muuttaa DOM:ia.

- **Ensimmäisen renderöinnin jälkeen** React käyttää [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) DOM API:a asettaakseen luomansa DOM nodet ruudulle.
- **Uudelleenrenderöinteihin** React käyttää minimaalisen verran vaadittuja operaatioita (jotka lasketaan renderöinnin aikana!), jotta DOM vastaa viimeisintä renderöintitulosta.

**React muuttaa DOM nodeja vain jos renderöintien välissä on eroja.** Esimerkiksi, tässä on komponentti, joka uudelleenrenderöityy eri propseilla joka sekunti. Huomaa miten voit lisätä tekstiä `<input>` kenttään, päivittäen sen `value`:ta, mutta teksti ei poistu kun komponentti uudelleenrenderöityy:

<Sandpack>

```js Clock.js active
export default function Clock({time}) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
  );
}
```

```js App.js hidden
import {useState, useEffect} from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return <Clock time={time.toLocaleTimeString()} />;
}
```

</Sandpack>

Tämä toimii koska viimeisen vaiheen aikana, React päivittää vain `<h1>` tagin sisällön `time`:n arvolla. Se näkee, että `<input>` JSX:ssä on samassa paikassa kuin viimeksi, joten React ei koske `<input>` kenttään tai sen `value`:n!

## Epilogi: Selaimen maalaus {/*epilogue-browser-paint*/}

Kun renderöinti on valmis ja React on päivittänyt DOM:in, selain uudelleenmaalaa ruudun. Vaikka tämä prosessi tunnetaan "selaimen renderöintinä", viittaamme siihen "maalaamisena" sekaannuksien välttämiseksi tässä dokumentaatiossa.

<Illustration
  alt="A browser painting 'still life with card element'."
  src="/images/docs/illustrations/i_browser-paint.png"
/>

<Recap>

- Mikä tahansa ruudunpäivitys React sovelluksessa tapahtuu kolmessa vaiheessa:
  1. Triggeröinti
  2. Renderöinti
  3. Commit
- Voit käyttää Strict Modea löytääksesi virheitä komponenteistasi
- React ei koske DOM:iin jos renderöinnin tulos on sama kuin viimeksi

</Recap>
