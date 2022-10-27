---
title: Propsien välittäminen komponentille
---

<Intro>

React komponentit käyttävät *propseja* kommunikoidakseen toistensa välillä. Jokainen pääkomponentti voi välittää tietoa sen lapsikomponenteille antamalla niille propseja. Propsit saattavat muistuttaa HTML attribuuteista, mutta ne voivat välittää mitä tahansa JavaScript arvoa, kuten oliota, listoja ja funktioita.

</Intro>

<YouWillLearn>

* Miten välittää propseja komponentille
* Miten lukea propseja komponentista
* Miten määritellä oletusarvoja propseille
* Miten välittää JSX:ää komponenteille
* Miten propsit muuttuvat ajan kanssa

</YouWillLearn>

## Tuttuja propseja {/*familiar-props*/}

Propsit ovat tietoa jota välität JSX tagille. Esimerkiksi `className`, `src`, `alt`, `width` ja `height` ovat muutamia propseja, joita voit välittää `<img>` tagille:

<Sandpack>

```js
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}

export default function Profile() {
  return (
    <Avatar />
  );
}
```

```css
body { min-height: 120px; }
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Propsit joita välität `<img>` tagille ovat esimääriteltyjä (ReactDOM mukautuu [HTML standardiin](https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element)). Mutta voit välittää mitä tahansa propseja *omalle* komponentillesi, kuten `<Avatar>`:lle, mukauttaaksesi sen. Tässä miten!

## Propsien välittäminen komponentille {/*passing-props-to-a-component*/}

Seuraavassa koodissa `Profile` komponentti ei välitä yhtään propsia sen `Avatar` lapsikomponentille:

```js
export default function Profile() {
  return (
    <Avatar />
  );
}
```

Voit antaa `Avatar`:lle propseja kahdessa vaiheessa.

### 1. Vaihe: Välitä propsi lapsikomponentille {/*step-1-pass-props-to-the-child-component*/}

Ensiksi välitä jokin propsi `Avatar`:lle. Esimerkiksi anna sille kaksi propsia: `person` (olio) ja `size` (numero):

```js
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```

> Mikäli aaltosulkeet `person=` hämmentävät sinua, muista että [ne ovat vain olioita](/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx) JSX aaltosulkeiden sisällä.

Nyt voit lukea näitä propseja `Avatar` komponentin sisällä.

### 2. Vaihe: Lue propsit lapsikomponentin sisällä {/*step-2-read-props-inside-the-child-component*/}

Voit lukea nämä propsit listaamalla niiden nimet `person, size` pilkulla eroteltuna `({` and `})` sisällä suoraan `function Avatar` jälkeen. Näin voit käyttää niitä `Avatar` koodin sisällä, kuten käyttäisit muuttujia.

```js
function Avatar({ person, size }) {
  // person and size are available here
}
```

Lisää vähän logiikkaa `Avatar`:lle, joka hyödyntää `person` ja `size` proppeja renderöinnissä, ja olet valmis.

Nyt voit määritellä `Avatar`:n renderöimään monella erilaisella tavalla eri propseilla. Kokeile muuttaa arvoja!

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <div>
      <Avatar
        size={100}
        person={{ 
          name: 'Katsuko Saruhashi', 
          imageId: 'YfeOqp2'
        }}
      />
      <Avatar
        size={80}
        person={{
          name: 'Aklilu Lemma', 
          imageId: 'OKS67lh'
        }}
      />
      <Avatar
        size={50}
        person={{ 
          name: 'Lin Lanying',
          imageId: '1bX5QH6'
        }}
      />
    </div>
  );
}
```

```js utils.js
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
body { min-height: 120px; }
.avatar { margin: 10px; border-radius: 50%; }
```

</Sandpack>

Propsien avulla voit ajatella pää- ja lapsikomponentteja erikseen. Esimerkiksi voit muuttaa `person` tai `size` propsia `Profile`:n sisällä ilman, että täytyy miettiä miten `Avatar` käyttää niitä. Samoin voit muuttaa miten `Avatar` käyttää näitä propseja ilman, että täytyy katsoa `Profile` koodia.

Voit ajatella propseja "säätiminä", joita voit säätää. Niillä on sama rooli kuin argumenteilla on funktioissa—itse asiassa, propsit _ovat_ ainoa argumentti komponenttiisi! React komponentit hyväksyvät yhden argumentin, `props` olion:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```
Useimmiten ei tarvitse kirjoittaa koko `props` oliota itsessään, vaan voit destrukturoida sen yksittäisiksi propseiksi.

<Pitfall>

**Älä unohda `{` ja `}` aaltosulkeita** `(` ja `)` sulkeiden sisällä kun määrität propseja:

```js
function Avatar({ person, size }) {
  // ...
}
```

Tätä syntaksia kutsutaan ["destrukturoinniksi"](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter) ja se vastaa argumenttien lukemiseen funktiossa:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

</Pitfall>

## Oletusarvon määrittäminen propsille {/*specifying-a-default-value-for-a-prop*/}

Jos haluat antaa propsille oletusarvon johon turvautua kun arvoa ei ole määritelty, voit tehdä sen destrukturoinnissa laittamalla `=` ja oletusarvon sen jälkeen:

```js
function Avatar({ person, size = 100 }) {
  // ...
}
```

Nyt jos `<Avatar person={...} />` renderöidään ilman `size` propsia, `size` asetetaan arvoon `100`.

Oletusarvoa käytetään vain jos `size` propsi puuttuu tai jos välität `size={undefined}`. Mutta jos välität `size={null}` tai `size={0}`, oletusarvoa **ei** käytetä.

## Propsien välittäminen JSX spread-syntaksilla {/*forwarding-props-with-the-jsx-spread-syntax*/}

Joskus propsien välittäminen käy toistuvaksi:

```js
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

Toistuvassa koodissa ei ole mitään väärää-se voi olla luettavempaa. Mutta ajoittain saatat arvostaa ytimekkyyttä. Jotkin komponentit välittävät kaikki niiden propsit niiden lapsikomponenteilleen, kuten tämä `Profile` tekee sen `Avatar`:lle. Koska se ei itse käytä suoraan yhtään propsia, voi olla järkevää käyttää lyhyttä "spread" syntaksia:

```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

Tämä välittää kaikki `Profile`:n propsit `Avatar`:lle ilman jokaisen nimen listaamista.

**Käytä spread-syntaksia hillitysti.** Jos käytät sitä jokaisessa komponentissa, jotain on pielessä. Useimmiten se osoittaa, että sinun täytyisi jakaa komponenttisi osiin ja välittää JSX lapsina. Tästä lisää seuraavaksi!

## JSX:n välittäminen lapsena {/*passing-jsx-as-children*/}

On yleistä upottaa selaimen sisäänrakennettuja tageja toisiinsa:

```js
<div>
  <img />
</div>
```

Joskus haluat upottaa omia komponentteja samalla tavalla:

```js
<Card>
  <Avatar />
</Card>
```

Kun upotat sisältöä JSX tagiin, pääkomponentti vastaanottaa sisällön proppina nimeltään `children`. Esimerkiksi `Card` komponentti vastaanottaa `children` propin, joka sisältää `<Avatar />` komponentin ja renderöi sen diviin käärittynä:

<Sandpack>

```js App.js
import Avatar from './Avatar.js';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{ 
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}
```

```js Avatar.js
import { getImageUrl } from './utils.js';

export default function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}
```

```js utils.js
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
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

Kokeile korvata `<Card>` komponentista `<Avatar>` jollain tekstillä nähdäksesi miten `Card` komponentti voi kääriä mitä vain sisältöä. Sen ei tarvitse "tietää" mitä renderöidään sen sisällä. Näet tätä tapaa käytettävän monissa paikoissa.

Voit ajatella komponenttia, jolla on `children` proppi kuin sillä olisi "aukko" joka voidaan "täyttää" sen pääkomponentista mielivaltaisella JSX:llä. Voit käyttää `children` proppia visuaalisiin wrappereihin: paneeleihin, ruudukkoihin, jne.

<Illustration src="/images/docs/illustrations/i_children-prop.png" alt='A puzzle-like Card tile with a slot for "children" pieces like text and Avatar' />

## Miten prosit muuttuvat ajan kanssa {/*how-props-change-over-time*/}

`Clock` komponentti alla vastaanottaa kaksi propsia sen pääkomponentilta: `color` ja `time`. (Pääkomponentin koodi on jätetty pois koska se käyttää [tilaa](/learn/state-a-components-memory), johon emme vielä syvenny.)

Kokeile muuttaa väriä valintaruudusta alla:

<Sandpack>

```js Clock.js active
export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
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
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

Tämä esimerkki havainnollistaa, että **komponentti voi vastaanottaa erilaisia propseja ajan saatossa.** Propsit eivät aina ole staattisia! Tässä `time` propsi muuttuu joka sekunti ja `color` propsi muuttuu kun valitset toisen värin. Propsit kuvastavat komponentin dataa ajan kuluessa, ei ainoastaan alussa.

Propsit ovat kuitenkin muuttumattomia (engl. [immutable](https://en.wikipedia.org/wiki/Immutable_object)). Kun komponentin täytyy muuttaa sen propseja (esimerkiksi vastauksena käyttäjän toimintoon tai uuteen dataan), sen täytyy "kysyä" sen pääkomponentilta antaakseen sille _eri propsit_-uuden olion! Sen vanhat propsit sitten heitetään pois ja lopulta JavaScript moottori suorittaa roskienkeruun palauttaen niiden käyttämän muistin.


**Älä yritä "muuttaa propseja".** Kun sinun täytyy vastata käyttäjän syötteeseen (kuten värin muutokseen), täytyy "asettaa tila", josta voit oppia lisää lukemalla [Tila: Komponentin muisti](/learn/state-a-components-memory).

<Recap>

* Välittääksesi propseja, lisää ne JSX:ään kuten tekisit HTML attribuuteilla.
* Lukeaksesi propseja, käytä `function Avatar({ person, size })` destrukturointi -syntaksia.
* Voit määritellä oletusarvon kuten `size = 100`, jota käytetään puuttuvissa sekä `undefined` propseissa.
* Voit välittää kaikki propsit käyttämällä `<Avatar {...props} />` JSX spread syntaksia, mutta älä käytä sitä liikaa!
* Sisäkkäinen JSX koodi kuten `<Card><Avatar /></Card>` ilmenee `Card` komponentin `children` proppina.
* Propsit ovat vain-luku snapshotteja ajasta: joka renderillä se vastaanottaa uuden version propseista.
* Et voi muuttaa propseja. Kun tarvitset interaktiivisuutta, käytä tilaa.

</Recap>



<Challenges>

### Erota komponentti {/*extract-a-component*/}

Tämä `Gallery` komponentti sisältää samanlaista merkintäkoodia kahdelle profiilille. Luo `Profile` komponentti vähentääksesi koodin toistoa. Sinun täytyy päättää mitä propseja välität sille.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <section className="profile">
        <h2>Maria Skłodowska-Curie</h2>
        <img
          className="avatar"
          src={getImageUrl('szV5sdG')}
          alt="Maria Skłodowska-Curie"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b> 
            physicist and chemist
          </li>
          <li>
            <b>Awards: 4 </b> 
            (Nobel Prize in Physics, Nobel Prize in Chemistry, Davy Medal, Matteucci Medal)
          </li>
          <li>
            <b>Discovered: </b>
            polonium (element)
          </li>
        </ul>
      </section>
      <section className="profile">
        <h2>Katsuko Saruhashi</h2>
        <img
          className="avatar"
          src={getImageUrl('YfeOqp2')}
          alt="Katsuko Saruhashi"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b> 
            geochemist
          </li>
          <li>
            <b>Awards: 2 </b> 
            (Miyake Prize for geochemistry, Tanaka Prize)
          </li>
          <li>
            <b>Discovered: </b>
            a method for measuring carbon dioxide in seawater
          </li>
        </ul>
      </section>
    </div>
  );
}
```

```js utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

<Hint>

Aloita irroittamalla merkintäkoodi toiselle tutkijalle. Sitten etsi kohdat, jotka eivät vastaa toista esimerkin tutkijaa, ja tee kohdista muokattavia propsien avulla.

</Hint>

<Solution>

Tässä ratkaisussa `Profile` komponentti sallii usieta propseja: `imageId` (merkkijono), `name` (merkkijono), `profession` (merkkijono), `awards` (lista merkkijonoista), `discovery` (merkkijono) ja `imageSize` (numero).

Huomaa, että `imageSize` propsilla on oletusarvo, jonka takia emme välitä sitä komponentille.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Profile({
  imageId,
  name,
  profession,
  awards,
  discovery,
  imageSize = 70
}) {
  return (
    <section className="profile">
      <h2>{name}</h2>
      <img
        className="avatar"
        src={getImageUrl(imageId)}
        alt={name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li><b>Profession:</b> {profession}</li>
        <li>
          <b>Awards: {awards.length} </b>
          ({awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {discovery}
        </li>
      </ul>
    </section>
  );
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile
        imageId="szV5sdG"
        name="Maria Skłodowska-Curie"
        profession="physicist and chemist"
        discovery="polonium (chemical element)"
        awards={[
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ]}
      />
      <Profile
        imageId='YfeOqp2'
        name='Katsuko Saruhashi'
        profession='geochemist'
        discovery="a method for measuring carbon dioxide in seawater"
        awards={[
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ]}
      />
    </div>
  );
}
```

```js utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

Huomaa miten et tarvitse erillistä `awardCount` propsia jos `awards` on lista. Voit käyttää vain `awards.length` saadaksesi määrän palkinnoista. Muista, että propsit voivat olla mitä vain arvoja ja se tarkoittaa myös listoja.

Toinen ratkaisu, joka on lähempänä aikaisempia esimerkkejä tällä sivulla on ryhmittää kaikki tieto henkilöstä yhteen olioon ja välittää olio yhtenä propsina:

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Profile({ person, imageSize = 70 }) {
  const imageSrc = getImageUrl(person)

  return (
    <section className="profile">
      <h2>{person.name}</h2>
      <img
        className="avatar"
        src={imageSrc}
        alt={person.name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li>
          <b>Profession:</b> {person.profession}
        </li>
        <li>
          <b>Awards: {person.awards.length} </b>
          ({person.awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {person.discovery}
        </li>
      </ul>
    </section>
  )
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile person={{
        imageId: 'szV5sdG',
        name: 'Maria Skłodowska-Curie',
        profession: 'physicist and chemist',
        discovery: 'polonium (chemical element)',
        awards: [
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ],
      }} />
      <Profile person={{
        imageId: 'YfeOqp2',
        name: 'Katsuko Saruhashi',
        profession: 'geochemist',
        discovery: 'a method for measuring carbon dioxide in seawater',
        awards: [
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ],
      }} />
    </div>
  );
}
```

```js utils.js
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
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

Vaikka syntaksi näyttää hivenen erilaiselta koska kuvailet JavaScript olion ominaisuuksia JSX attribuuttien sijaan. Nämä esimerkit vastaavat lähes toisiaan, voit valita jomman kumman tavan.

</Solution>

### Säädä kuvan kokoa propsin avulla {/*adjust-the-image-size-based-on-a-prop*/}

Tässä esimerkissä `Avatar` vastaanottaa numeerisen `size` propsin, joka määrittää `<img>`:n leveyden ja korkeuden. `size` propsi on asetettu arvoon `40` tässä esimerkissä, Kuitenkin jos avaat kuva uudessa välilehdessä, huomaat, että kuva itsessään on suurempi (`160` pikseliä). Oikea kuvan koko määritellään minkä pikkukuvan kokoa pyydät.

Muuta `Avatar` komponentti pyytämään lähimpää kuvan kokoa `size` propsin perusteella. Erityisesti jos `size` on pienempi kuin `90` anna `'s'` ("small") mielummin kuin `'b'` ("big") `getImageUrl` funktiolle. Varmista että muutoksesi toimivat renderöimällä profiilikuvat `size` propsin eri avvoilla ja avaamalla kuvat uudella välilehdellä.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person, 'b')}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <Avatar
      size={40}
      person={{ 
        name: 'Gregorio Y. Zara', 
        imageId: '7vQD0fP'
      }}
    />
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

<Solution>

Tässä miten voisit tehdä sen:

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Voit myös näyttää tarkemman kuvan korkean pikselitiheyden näytöille huomioimalla [`window.devicePixelRatio`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio):n.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

const ratio = window.devicePixelRatio;

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size * ratio > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={70}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Propseilla voit koteloida tämänkaltaisen logiikan `Avatar` komponentin sisään (ja muuttaa sitä myöhemmin tarvittaessa), jotta kaikki voivat käyttää `<Avatar>` komponenttia miettimättä miten kuvia pyydetään ja niiden kokoa muutetaan.

</Solution>

### JSX:n välittäminen `children` propsissa {/*passing-jsx-in-a-children-prop*/}

Luo `Card` komponentti alla olevasta merkintäkoodista ja käytä `children` propsia välittääksesi eri JSX:ää sille:

<Sandpack>

```js
export default function Profile() {
  return (
    <div>
      <div className="card">
        <div className="card-content">
          <h1>Photo</h1>
          <img
            className="avatar"
            src="https://i.imgur.com/OKS67lhm.jpg"
            alt="Aklilu Lemma"
            width={70}
            height={70}
          />
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h1>About</h1>
          <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
        </div>
      </div>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

<Hint>

Kaikki komponentin tagin sisälle laittamasi JSX välitetään `children` propsina komponentille.

</Hint>

<Solution>

Tässä miten voit käyttää `Card` komponenttia molemmissa paikoissa:

<Sandpack>

```js
function Card({ children }) {
  return (
    <div className="card">
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card>
        <h1>Photo</h1>
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card>
        <h1>About</h1>
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

Voit myös tehdä `title` propsin jos haluat jokaisen `Card` komponentin aina sisältämään otsikon:

<Sandpack>

```js
function Card({ children, title }) {
  return (
    <div className="card">
      <div className="card-content">
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card title="Photo">
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card title="About">
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

</Solution>

</Challenges>
