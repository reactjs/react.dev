---
title: Komponenttien pitäminen puhtaina
---

<Intro>

Jotkin JavaScript funktiot ovat *puhtaita.* Puhtaat funktiot suorittavat ainoastaan laskelman eikä mitään muuta. Kirjoittamalla komponenttisi puhtaina funktioina voit välttää kokonaisen luokan hämmentäviä bugeja ja arvaamatonta toimintaa koodipohjasi kasvaessa. Saadaksesi nämä hyödyt, on muutamia sääntöjä joita seurata.

</Intro>

<YouWillLearn>

* Mitä puhtaus on ja miten se auttaa bugien välttämisessä
* Miten komponentteja pidetään puhtaina pitämällä muutokset poissa renderöintivaiheesta
* Miten käyttää Strcit Modea etsimään virheitä komponenteistasi

</YouWillLearn>

## Puhtaus: Komponenttisi kaavoina {/*purity-components-as-formulas*/}

Tietojenkäsittelytieteessä (ja etenkin funktionaalisen ohjelmoinnin maailmassa), [puhdas funktio](https://wikipedia.org/wiki/Pure_function) on funktio seuraavilla ominaisuuksilla:

* **Huolehtii omista asioistaan.** Se ei muuta yhtään oliota tai muuttujaa joka oli olemassa ennen kuin sitä kutsuttiin.
* **Samat sisääntulot, samat ulostulot.** Annettaen samat lähtötiedot, puhtaan funktion tulisi aina palauttaa sama lopputulos.

Saatat ehkä jo tietää yhden esimerkin puhtaista funktioista: kaavat matematiikassa.

Harkitse tätä matemaattista kaavaa: <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>.

Jos <Math><MathI>x</MathI> = 2</Math> silloin <Math><MathI>y</MathI> = 4</Math>. Aina. 

Jos <Math><MathI>x</MathI> = 3</Math> silloin <Math><MathI>y</MathI> = 6</Math>. Aina. 

Jos <Math><MathI>x</MathI> = 3</Math>, <MathI>y</MathI> ei joskus ole <Math>9</Math> tai <Math>–1</Math> tai <Math>2.5</Math> riippuen kellonajasta taikka markkinatalouden tilasta. 

Jos <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> ja <Math><MathI>x</MathI> = 3</Math>, <MathI>y</MathI> on _aina_ <Math>6</Math>. 

Jos tästä tehtäisiin JavaScript funktio, se voisi näyttää tältä:

```js
function double(number) {
  return 2 * number;
}
```

Yllä olevassa esimerkissä `double()` on **puhdas funktio.** Jos välität sille `3`, se palauttaa `6`. Aina.

React on suunniteltu tämän konseptin ympärille. **React olettaa, että jokainen komponentti jonka kirjoitat on puhdas funktio.** Tämä tarkoittaa, että kirjoittamasi React komponenttien täytyy palauttaa aina sama JSX:n kun annetaan samat lähtötiedot:

<Sandpack>

```js App.js
function Recipe({ drinkers }) {
  return (
    <ol>    
      <li>Boil {drinkers} cups of milk.</li>
      <li>Add {2 * drinkers} spoons of masala spices.</li>
      <li>Remove from heat, and add {drinkers} spoons of tea.</li>
    </ol>
  );
}

export default function App() {
  return (
    <section>
      <h1>Spiced Chai Recipe</h1>
      <h2>For one</h2> 
      <Recipe drinkers={1} />
      <h2>For a gathering</h2>
      <Recipe drinkers={4} />
    </section>
  );
}
```

</Sandpack>

Kun välität `drinkers={1}` komponentille `Recipe`, se palauttaa JSX:n sisältäen `1 cups of milk`. Aina. 

Kun välität `drinkers={4}`, se palauttaa JSX:n sisältäen `4 cups of milk`. Aina. 

Juuri kuten matemaattinen kaava.

Voit ajatella komponenttisi reseptinä: jos seuraat sitä, etkä esittele uusia ainesosia kesken ruoanlaiton aikana, saat saman aterian joka kerta. Tuo "ateria" on JSX jonka komponentti tarjoaa Reactille [renderöitäväksi](render-and-commit).

<Illustration src="/images/docs/illustrations/i_puritea-recipe.png" alt="Tee resepti x määrälle henkilöitä: ota x kuppia vettä, lisää 2x lusikallista mausteita, ja x lusikallista teetä!" />

## Sivuvaikutukset: (ei-)toivotut seuraukset {/*side-effects-unintended-consequences*/}

Reactin renderöintiprosessin on aina oltava puhdas. Komponenttien täytyisi *palauttaa* vain niiden JSX eikä *muuttaa* yhtään oliota tai muuttujia, jotka olivat olemassa ennen renderöintiä—se tekisi niistä epäpuhtaita!

Tässä komponentti joka rikkoo tätä sääntöä:

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Huonoa: muuttaa olemassa olevaa muuttujaa!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  )
}
```

</Sandpack>

Tämä komponentti lukee ja kirjoittaa `guest` muuttujaan, joka on määritelty sen ulkopuolella. Tämä tarkoittaa, että **komponentin kutsuminen useita kertoja tuottaa eri JSX:ää!** Lisäksi jos _muut_ komponentit lukevat `guest` muuttujaa, nekin tuottavat eri JSX:ää myös, riippuen milloin ne renderöitiin. Tämä ei ole ennustettavissa.

Palataan kaavaamme <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>, nyt jos <Math><MathI>x</MathI> = 2</Math>, emme voi luottaa, että <Math><MathI>y</MathI> = 4</Math>. Testimme epäonnistuisi, käyttäjämme olisivat hämillään, lentokoneita tippuisi taivaalta—näet miten tämä voisi johtaa sekaviin bugeihin!

Voit korjata tämän komponentin [välittämällä `guest` muuttujan proppina](/learn/passing-props-to-a-component):

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

Nyt komponenttisi on puhdas, sillä JSX joka palautetaan riippuu ainoastaan `guest` propista.

Yleisesti ottaen sinun ei tarvitse olettaa komponenttien renderöitävän missään tietyssä järjestyksessä. Sillä ei ole väliä kutsutko <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> ennen vai jälkeen <Math><MathI>y</MathI> = 5<MathI>x</MathI></Math>: molemmat kaavat toimivat erikseen toisistaan. Samalla tavalla, jokaisen komponentin tulisi "miettiä itselleen", eikä koordinoida tai riippua muista renderöinnin aikana. Renderöinti on kuin koulun koe: jokaisen komponentin tulisi laskea JSX itsekseen!

<DeepDive title="Epäpuhtaiden laskelmien tunnistaminen StrictModella">

Vaikka et välttämättä ole käyttänyt niitä kaikkia vielä, Reactissa on kolmenlaista syötettä jota lukea renderöinnin aikana: [propsit](/learn/passing-props-to-a-component), [tila](/learn/state-a-components-memory), ja [konteksti](/learn/passing-data-deeply-with-context). Kannattaa aina kohdella näitä arvoja vain-luku muodossa.

Kun haluat *muuttaa* jotain vastauksena käyttäjän syötteeseen, tulisi [asettaa tila](/learn/state-a-components-memory) muuttujan kirjoittamisen sijaan. Sinun ei tulisi koskaan muuttaa olemassa olevia muuttujia tai olioita kun komponenttisi renderöityy.

React tarjoaa "Strict Mode":n jolloin se kutsuu jokaisen komponentin funktiota kahdesti kehityksen aikana. **Kutsumalla komponentin funktiota kahdesti, Strict Mode auttaa etsimään komponentteja, jotka rikkovat näitä sääntöjä.**

Huoma miten alkuperäinen esimerkki näytti "Guest #2", "Guest #4", ja "Guest #6" seuraavien "Guest #1", "Guest #2", ja "Guest #3" sijasta. Alkuperäinen funktio oli epäpuhdas, joten sen kahdesti kutsuminen rikkoi sen. Korjattu puhdas versio toimii vaikka jos funktiota kutsuttaisiin kahdesti joka kerta. **Puhtaat funktiot vain laskevat, joten niiden kutsuminen kahdesti ei muuta yhtään mitään**--juuri kuten `double(2)` kutsuminen kahdesti ei muuta mitä palautetaan, eikä kaavan ratkaisu <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> kahdesti muuta mitä <MathI>y</MathI> on. Samat lähtötiedot, samat lopputiedot. Aina.

Strict Modella ei ole vaikutusta tuotannossa, joten se ei hidasta sovellusta käyttäjillesi. Ottaaksesi Strict Moden käyttöön, voit kääriä pääkomponenttisi `<React.StrictMode>` sisään. Jotkin kehykset tekevät tämän oletuksena.

</DeepDive>

### Paikallinen mutaatio: Komponenttisi pieni salaisuus {/*local-mutation-your-components-little-secret*/}

Yllä olevassa esimerkissä, ongelma oli, että komponentti muutti *olemass olevaa* muuttujaa kesken renderöinnin. Tätä kutsutaan usein **"mutaatioksi"** kuulostaakseen pelottavemmalta. Puhtaat funktiot eivät mutatoi muuttujia funktion käyttöalueen ulkopuolella tai olioita jotka olivat luotuna ennen kutsua—se tekee niistä epäpuhtaita!

Kuitenkin, **on täysin sallittua muuttaa muuttujia ja olioita, joita olet *juuri* luonut renderöinnin aikana.** Tässä esimerkissä, luot `[]` taulukon ja määrität sen `cups` muuttujaan ja sitten `push` metodia käyttäen lisäät tusinan kuppia siihen:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaGathering() {
  let cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```

</Sandpack>

Jos `cups` muuttuja tai `[]` taulukko olivat luotuna `TeaGathering` funktion ulkopuolella, tämä olisi iso ongelma! Muuttaisit *olemassa olevaa* oliota sijoittamalla kohteita siihen taulukkoon.

Kuitenkin se on sallittua, koska olet luonut ne *saman renderöinnin aikana* `TeaGathering`:n sisällä. Koodi `TeaGathering`:n ulkopuolla ei koskaan tiedä tämän tapahtuneen. Tätä kutsutaan **"paikalliseksi mutaatioksi"**—se on kuin komponenttisi pieni salaisuus.

## Missä _voit_ aiheuttaa sivuvaikutuksia {/*where-you-_can_-cause-side-effects*/}

Vaikka funktionaalinen ohjelmointi nojaa pitkälti puhtauteen, jossain vaiheessa, jossain, _jonkin_ on muututtava. Tämähän on koodauksen koko pointti! Nämä muutokset—ruudunpäivitykset, animaation aloitukset, datan muuttaminen—ovat **sivuvaikutuksia**. Ne ovat asioita, jotka tapahtuvat _"siinä sivussa,"_ ei kesken renderöinnin.

Reactissa, **sivuvaikutukset useimmiten kuuluvat [tapahtumakäsittelijöiden](/learn/responding-to-events) sisään.** Tapahtumakäsittelijät ovat funktioita, joita React suorittaa kun teet jotain toimintoja—esimerkiksi painat nappia. Vaikka tapahtumakäsittelijät on määritelty komponentin *sisällä*, niitä ei suoriteta renderöinnin *aikana*! **Joten tapahtumakäsittelijöiden ei tarvitse olla puhtaita.**

Jos olet olet käyttänyt kaikki vaihtoehdot, etkä löydä oikeaa tapahtumakäsittelijää sivuvaikutuksellesi, voit silti kiinnittää sen palautettuun JSX:ään käyttäen [`useEffect`](/apis/react/useEffect) kutsua komponentissasi. Tämä kertoo Reactille, että kutsuu sitä myöhemmin renderöinnin jälkeen, jolloin sivuvaikutukset ovat sallittuja. **Huomaa, että tämän tavan pitäisi olla sinun viimeinen keino.**

Kun mahdollista, kokeile muotoilla logiikkasi vain renderöinnillä. Yllätyt miten pitkälle sillä pääsee!

<DeepDive title="Miksi React välittää puhtaudesta?">

Puhtaiden funktioiden kirjoittaminen vaatii tottumusta ja itsekuria. Mutta se avaa mahtavia mahdollisuuksia:

* Komponenttisi voidaan suorittaa eri ympäristössä—esimerkiksi palvelinpuolella. Sillä ne palauttaa saman tuloksen samoista lähtötiedoista, yksi komponentti voi palvella monta käyttäjäpyyntöä.
* Voit parantaa tehokkuutta [ohittamalla renderöinnin](TODO:/learn/skipping-unchanged-trees) komponenteille, joiden lähtötiedot eivät ole muuttuneet. Tämä on turvallista koska puhtaat funktiot palauttavat aina saman lopputuloksen, joten ne on turvallista tallentaa.
* Jos jokin data muuttuu kesken renderöinnin syvällä komponenttipuussa, React voi aloittaa renderöinnin uudelleen hukkaamatta aikaa keskeneräiseen renderöintiin. Puhtaus tekee keskeyttämisestä turvallista.

Jokainen uusi Reactin ominaisuus joita rakennamme hyödyntää puhtautta. Tiedonhausta animaatioihin ja tehokkuuteen, komponenttien pitäminen puhtaina avaa tehokkaan React paradigman.

</DeepDive>

<Recap>

* Komponentin on oltava puhdas, tarkoittaen:
  * **Pitää huoli sen omista asioistaan.** It should not change any objects or variables that existed before rendering.
  * **Samat sisääntulot, sama ulostulo.** Annettaen sama syöte, komponentin tulisi aina palauttaa sama JSX. 
* Renderöinti voi tapahtua koska vain, joten komponenttien ei tulisi riippua toistensa renderöintijärjestyksestä.
* Sinun ei pitäisi muuttaa lähtötietoja, joita komponenttisi käyttää renderöintiin. Tämä sisältää propsit, tilan sekä kontekstin. Ruudun päivittämiseksi ["aseta" tila](reacting-to-input-with-state) olemassaolevien olioiden muuttamisen sijaan.
* Pyri ilmaisemaan komponenttisi logiikka JSX:ssä jota palautat. Kun täytyy "muuttaa asioita", useimiten teet sen tapahtumakäsittelijässä. Viimeisenä keinona voit käyttää `useEffect`:ia.
* Puhtaiden funktioiden kirjoittaminen vaatii hieman harjoittelua, mutta se avaa Reactin paradigman voiman.

</Recap>


  
<Challenges>

### Korjaa rikkinäinen kello {/*fix-a-broken-clock*/}

Tämä komponentti yrittää asettaa `<h1>`:n CSS luokan arvoksi `"night"` keskiyöstä aamu kuuteen ja arvoksi `"day"` muina aikoina. Se ei kuitenkaan toimi. Voitko korjata tämän komponentin?

Voit tarkistaa onko ratkaisusi toimiva tilapäisesti muuttamalla tietokoneesi aikavyöhykettä. Kun nykyinen aika on keskiyön ja aamu kuuden välillä, kellon tulisi omata käänteiset värit!

<Hint>

Renderöinti on *laskenta*, sen ei tulisi "tehdä" asioita. Voitko ilmaista saman idean eri tavalla?

</Hint>

<Sandpack>

```js Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  if (hours >= 0 && hours <= 6) {
    document.getElementById('time').className = 'night';
  } else {
    document.getElementById('time').className = 'day';
  }
  return (
    <h1 id="time">
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
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
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

<Solution>

Voit korjata tämän komponentin laskemalla `className`:n ja sisällyttämällä sen renderöinnin lopputuloksessa:

<Sandpack>

```js Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  let className;
  if (hours >= 0 && hours <= 6) {
    className = 'night';
  } else {
    className = 'day';
  }
  return (
    <h1 className={className}>
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
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
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

Tässä esimerkissä sivuvaikutus (DOM:n muuttaminen) ei ole tarpeellista ollenkaan. Täytyy vain palauttaa JSX.

</Solution>

### Korjaa rikkinäinen profiili {/*fix-a-broken-profile*/}

Kaksi `Profile` komponenttia on renderöity vierekkäin eri tiedoilla. Paina "Collapse" ensimmäisessä profiilissa ja sitten "Expand":ia. Huomaat, että molemmat profiilit näyttävät saman henkilön. Tämä on bugi.

Etsi bugin syy ja korjaa se.

<Hint>

Buginen koodi on `Profile.js` tiedostossa. Luithan koko tiedoston?

</Hint>

<Sandpack>

```js Profile.js
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

let currentPerson;

export default function Profile({ person }) {
  currentPerson = person;
  return (
    <Panel>
      <Header />
      <Avatar />
    </Panel>
  )
}

function Header() {
  return <h1>{currentPerson.name}</h1>;
}

function Avatar() {
  return (
    <img
      className="avatar"
      src={getImageUrl(currentPerson)}
      alt={currentPerson.name}
      width={50}
      height={50}
    />
  );
}
```

```js Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  )
}
```

```js utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

<Solution>

Ongelma on, että `Profile` komponentti kirjoittaa olemassa olevaan `currentPerson` muuttujaan ja `Header` sekä `Avatar` komponentit lukevat siitä. Tämä tekee *kaikista niistä* epäpuhtaita ja hankalia ennustaa.

Bugin korjaamiseksi poista `currentPerson` muuttuja. Sen sijaan välitä kaikki tieto `Profile` komponentista `Header`:lle sekä `Avatar`:lle propseilla. Lisää `person` propsi molempiin komponentteihin ja välitä se alas asti.

<Sandpack>

```js Profile.js active
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

export default function Profile({ person }) {
  return (
    <Panel>
      <Header person={person} />
      <Avatar person={person} />
    </Panel>
  )
}

function Header({ person }) {
  return <h1>{person.name}</h1>;
}

function Avatar({ person }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={50}
      height={50}
    />
  );
}
```

```js Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  );
}
```

```js utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

Muista, että React ei takaa komponenttien suorittamista missään tietyssä järjestyksessä, joten et voi kommunikoida niiden välillä asettamalla muuttujia. Kaiken kommunikoinnin tulee tapahtua propsien kautta.

</Solution>

#### Fix a broken story tray {/*fix-a-broken-story-tray*/}

Yrityksesi toimitusjohtaja pyytää sinua lisäämään "stories" ominaisuuden kello sovellukseen, etkä voi sanoa "ei". Olet kirjoittanut `StoryTray` komponentin, joka hyväksyy listan `stories`, ja lopussa on "Create Story" paikanpitäjä.

Olet toteuttanut "Create Story" paikanpitäjän lisäämällä yhden teko-stooryn `stories` listan loppuun, jonka vastaanotat propsina. Mutta jostain syystä, "Create Story" näkyy useamman kerran. Korjaa ongelma.

<Sandpack>

```js StoryTray.js active
export default function StoryTray({ stories }) {
  stories.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

</Sandpack>

<Solution>

Huomaa miten joka kerta kun kello päivittyy, "Create Story" lisätään *kahdesti*. Tämä toimii vinkkinä, että tässä on mutaatio renderöinnin aikana--Strict Mode kutsuu komponenttia kahdesti tehdäkseen nämä ongelmat huomattavemmiksi.

`StoryTray` funktio ei ole puhdas. Kutsumalla vastaanotettua `stories` (propsi) listaa `push` funktiolla, se muuttaa oliota, joka oli luotuna *ennen* kuin `StoryTray` alkoi renderöimään. Tämä tekee siitä bugisen ja erittäin vaikean ennustaa.

Yksinkertaisin ratkaisu on olla koskematta listaan ollenkaan, ja renderöindä "Create Story":n erikseen:

<Sandpack>

```js StoryTray.js active
export default function StoryTray({ stories }) {
  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
      <li>Create Story</li>
    </ul>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Vaihtoehtoisesti, voit luoda _uuden_ listan (kopioimalla edellisen) ennen kuin lisäät kohteita siihen:

<Sandpack>

```js StoryTray.js active
export default function StoryTray({ stories }) {
  // Copy the array!
  let storiesToDisplay = stories.slice();

  // Does not affect the original array:
  storiesToDisplay.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {storiesToDisplay.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Tämä pitää muutokset paikallisina ja funktion puhtaana. Kuitenkin sinun täytyy olla silti varovainen: esimerkiksi, jos yritit muuttaa yhtäkään listan kohdetta, täytyisi sinun kopioida nekin kohteet myös.

On helppo muistaa mitkä operaatiot muuttavat listaa ja mitkä eivät. Esimerkiksi,  `push`, `pop`, `reverse`, ja `sort` muuttavat alkuperäistä listaa, mutta `slice`, `filter`, ja `map` luovat uuden.

</Solution>

</Challenges>
