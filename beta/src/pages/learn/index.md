---
title: Pika-aloitus
---

<Intro>

Tervetuloa Reactin dokumentaatioon. Tällä sivulla esitellään 80% Reactin konsepteista, joita käytät päivittäin.

</Intro>

<YouWillLearn>

- Miten luodaan ja sijoitetaan komponentteja
- Miten lisätään merkintäkoodia ja tyylejä
- Miten tietoja näytetään
- Miten renderöidään listoja ja ehtoja
- Miten vastataan tapahtumiin ja päivitetään ruutua
- Miten tietoa jaetaan komponenttien välillä

</YouWillLearn>

## Komponenttien luominen ja sijoittaminen {/* components */}

React sovellukset koostuvat komponenteista. Komponentti on pala käyttöliittymää (UI, user interface), jolla on sen oma logiikka ja ulkomuoto. Komponentti voi olla pieni kuin vaikka painonappi tai suuri kuin koko sivu.

React komponentit ovat JavaScript funktioita jotka palauttavat merkintäkoodin:

```js
function Painonappi() {
  return <button>Napsauta minua</button>;
}
```

Nyt kun on esitelty `Painonappi` -komponentti, voidaan se sijoittaa toisen komponentin sisään:

```js {5}
export default function MyApp() {
  return (
    <div>
      <h1>Tervetuloa sovellukseeni</h1>
      <Painonappi />
    </div>
  );
}
```

Huomaa, että `<Painonappi />` alkaa isolla alkukirjaimella. Tästä voit päätellä, että kyseessä on React komponentti. React komponentin nimen on aina alettava isolla alkukirjaimella, kun taas HTML tagit alkavat pienellä alkukirjaimella.

Katsotaanpa lopputulosta:

<Sandpack>

```js
function Painonappi() {
  return <button>Napsauta minua</button>;
}

export default function MyApp() {
  return (
    <div>
      <h1>Tervetuloa sovellukseeni</h1>
      <Painonappi />
    </div>
  );
}
```

</Sandpack>

Avainsanat `export default` määrittävät tiedoston pääkomponentin. Mikäli JavaScript syntaksi ei ole tuttua, [MDN](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) ja [javascript.info](https://javascript.info/import-export) ovat hyviä tietolähteitä.

## Merkintäkoodin kirjoittaminen JSX:llä {/* writing-markup-with-jsx */}

Merkintäkoodi jota näit ylhäällä kutsutaan nimeltään JSX. Sen käyttö on valinnaista, mutta useimmat React projektit käyttävät JSX:ää sen mukavuuden vuoksi. Kaikki [työkalut, joita suosittelemme paikalliseen kehitykseen](/learn/installation) tukevat JSX:ää oletuksena.

JSX on tarkempaa kuin HTML. Sinun täytyy sulkea tagit kuten `<br />`. Komponenttisi ei myöskään voi palauttaa useampia JSX tageja, vaan ne täytyy kääriä yhden pääelementin sisään, kuten `<div>...</div>` tagiin tai tyhjään `<>...</>` elementtiin:

```js {3,6}
function TietoaSivu() {
  return (
    <>
      <h1>Tietoa</h1>
      <p>
        Heippa.
        <br />
        Mitä kuuluu?
      </p>
    </>
  );
}
```

Mikäli sinulla on paljon HTML merkintäkoodia muutettavana JSX koodiksi, voit käyttää [verkkomuunninta](https://transform.tools/html-to-jsx).

## Tyylien lisääminen {/* adding-styles */}

Reactissa voit määritellä CSS luokat käyttämällä `className` attribuuttia. Se toimii samoin kuin HTML kielen [`class`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) attribuutti:

```js
<img className="avatar" />
```

Tämän jälkeen kerrot tyylimäärittelyt erilisessä CSS tiedostossa:

```css
/* CSS koodissasi */
.avatar {
  border-radius: 50%;
}
```

React ei määrää miten lisäät CSS tiedostot. Yksinkertaisimmillaan lisäät [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) tagin HTML merkintäkoodiin. Jos käytät käännöstyökalua tai ohjelmistokehystä, konsultoi niiden dokumentaatiota löytääksesi tavan lisätä CSS tiedostoja projektiisi.

## Tiedon näyttäminen {/* displaying-data */}

JSX mahdollistaa merkintäkoodin käytön JavaScriptissa. Aaltosulkeilla antaa sinun "peruuttaa takaisin" JavaScriptiin, jotta voit upottaa jonkun muuttujan koodistasi ja näytää sen käyttäjälle. Esimerkiksi, tämä tulostaa `kayttaja.nimi`:

```js {3}
return <h1>{kayttaja.nimi}</h1>;
```

Voit myös "peruuttaa takaisin JavaScriptiin" JSX attribuutissa, mutta tässä täytyy käyttää aaltosulkeita lainausmerkkien sijaan. Esimerkiksi `className="avatar"` syöttää `"avatar"` merkkijonon CSS luokaksi, mutta `src={kayttaja.kuvanUrl}` lukee JavaScriptissa `kayttaja.kuvanUrl` muuttujan arvon ja palauttaa sen `src` attribuuttiin:

```js {3,4}
return <img className="avatar" src={kayttaja.kuvanUrl} />;
```

JSX aaltosulkeisiin voi laittaa myös laajempia lausekkeita, esimerkiksi [merkkijonojen yhdistämistä](https://javascript.info/operators#string-concatenation-with-binary):


<Sandpack>

```js
const kayttaja = {
  nimi: 'Hedy Lamarr',
  kuvanUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  kuvanKoko: 90,
};

export default function Profiili() {
  return (
    <>
      <h1>{kayttaja.nimi}</h1>
      <img
        className="avatar"
        src={kayttaja.kuvanUrl}
        alt={'Kuva henkilöstä ' + kayttaja.nimi}
        style={{
          width: kayttaja.kuvanKoko,
          height: kayttaja.kuvanKoko,
        }}
      />
    </>
  );
}
```

```css
.avatar {
  border-radius: 50%;
}

.large {
  border: 4px solid gold;
}
```

</Sandpack>

Ylläolevasta esimerkissä `style={{}}` ei ole erityistä syntaksia, vaan normaali `{}` olio JSX aaltosulkeiden `style={ }` sisällä. Voit käyttää `style` attribuuttia kun tyylisi riippuu JavaScript muuttujista.

## Ehdollinen renderöinti {/* conditional-rendering */}

Reactissa ei ole erityistä syntaksia ehtolauseiden kirjoittamiseen. Sen sijaan voit käyttää samoja tekniikoita kuin mitä käytät kirjoittaessasi tavallista JavaScript koodia. Esimerkiksi, voit käyttää [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) lausetta sisällyttämään JSX koodia ehdollisesti:

```js
let sisalto;
if (onkoKirjautunutSisaan) {
  sisalto = <Hallintapaneeli />;
} else {
  sisalto = <Kirjautumislomake />;
}
return <div>{sisalto}</div>;
```

Mikäli suosit kompaktimpaa koodia, voit käyttää [`?` operaattoria](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator). Toisin kuin `if, se toimii myös JSX:n sisällä:

```js
<div>{onkoKirjautunutSisaan ? <Hallintapaneeli /> : <Kirjautumislomake />}</div>
```

Kun et tarvitse `else` osaa, voit käyttää lyhyempäää [loogista `&&` syntaksia](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation):

```js
<div>{onkoKirjautunutSisaan && <Hallintapaneeli />}</div>
```

Kaikki nämä tavat toimivat myös attribuuttien ehdolliseen määrittelyyn. Jos jokin tässä käyty JavaScript syntaksi ei ole tuttua, voit aina aloittaa käyttämällä `if...else`.

## Listojen renderöinti {/* rendering-lists */}

Tulet käyttämään JavaScriptin ominaisuuksia kuten [`for` silmukkaa](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) sekä [array `map()` funktiota](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) komponenttilistojen renderöintiin.

Esimerkiksi, sanotaan, että sinulla on lista tuotteista:

```js
const tuotteet = [
  {otsikko: 'Kaali', id: 1},
  {otsikko: 'Valkosipuli', id: 2},
  {otsikko: 'Omena', id: 3},
];
```

Komponentin sisällä voit käyttää `map()` funktiota muuttaaksesi tuotelistan listaksi `<li>` elementtejä:

```js
const listaKohteet = tuotteet.map((tuote) => (
  <li key={tuote.id}>{tuote.otsikko}</li>
));

return <ul>{listaKohteet}</ul>;
```

Huomaa miten `<li>` elementillä on `key` attribuutti. Jokaiselle listan kohteelle tulisi antaa merkkijono tai numero, joka yksilöllisesti erottaa kohteen sen sisaruksista. Useimiten, avain tulisi suoraan tietolähteestä, kuten tietokannan ID kentästä. React hyödyntää avaimiasi ymmärtääkseen mitä tapahtui jos myöhemmin lisäät, poistat tai uudelleenjärjestät kohteita.

<Sandpack>

```js
const tuotteet = [
  {otsikko: 'Kaali', onHedelma: false, id: 1},
  {otsikko: 'Valkosipuli', onHedelma: false, id: 2},
  {otsikko: 'Omena', onHedelma: true, id: 3},
];

export default function Ostoslista() {
  const listaKohteet = tuotteet.map((tuote) => (
    <li
      key={tuote.id}
      style={{
        color: tuote.onHedelma ? 'magenta' : 'darkgreen',
      }}>
      {tuote.otsikko}
    </li>
  ));

 return <ul>{listaKohteet}</ul>;
}
```

</Sandpack>

## Vastaaminen tapahtumiin {/* responding-to-events */}

Voit vastata tapahtumiin määrittelemällä tapahtumakäsittelijän komponettiesi sisällä:

```js {2-4,7}
function Painonappi() {
  function kunKlikataan() {
    alert('Napsautit minua!');
  }

  return <button onClick={kunKlikataan}>Napsauta minua</button>;
}
```

Huomaa miten `onClick={kunKlikataan}` ei sisällä sulkeita lopussa! Älä kutsu tapahtumakäsittelijää: sinun täytyy ainoastaan _antaa se_. React kutsuu tapahtumakäsittelijääsi kun käyttäjä napsauttaa painiketta.  

## Ruudun päivittäminen {/* updating-the-screen */}

Usein haluat, että komponenttisi "muistaa" jotain tietoa ja näyttää sitä. Esimerkiksi, ehkäpä haluat laskea montako kertaa painiketta on napsautettu. Tehdäksesi tämän, lisää tila eli _state_ komponenttiisi.

Ensiksi, importtaa [`useState`](/apis/usestate) Reactista:

```js {1,4}
import {useState} from 'react';
```

Nyt voit määritellä tilamuuttujan komponentin sisällä:

```js
function Painonappi() {
  const [count, setCount] = useState(0);
```

Saat kaksi asiaa `useState`:lta. Tämänhetkisen tilan (`count`), ja funktion jolla voit päivittää sitä (`setCount`). Voit antaa niille mitkä tahansa nimet, mutta käytäntö on kutsua niitä seuraavasti: `[something, setSomething]`.

Ensimmäisen kerran kun painike näytetään, `count` on `0` koska `useState()` määrittelyssä annettiin `0`. Kun haluat muuttaa tilaa, kutsu `setCount()` funktiota ja anna sille uusi arvo. Painiketta napsauttamalla luku kasvaa:

```js {5}
function Painonappi() {
  const [count, setCount] = useState(0);

  function kunKlikataan() {
    setCount(count + 1);
  }

  return <button onClick={kunKlikataan}>Napsautettu {count} kertaa</button>;
}
```

React kutsuu komponenttifunktiota uudelleen. Silloin `count` on `1`. Sitten se tulee olemaan `2`. Ja niin edellleen.

Jos renderöit saman komponentin useasti, kullakin komponentilla on oma tilansa. Kokeile napsauttaa painikkeita erikseen:

<Sandpack>

```js
import {useState} from 'react';

function Painonappi() {
  const [count, setCount] = useState(0);

  function kunKlikataan() {
    setCount(count + 1);
  }

  return <button onClick={kunKlikataan}>Napsautit {count} kertaa</button>;
}

export default function MyApp() {
  return (
    <div>
      <h1>Laskurit, jotka päivittyvät erikseen</h1>
      <Painonappi />
      <Painonappi />
    </div>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

Huomaa miten kukin painike "muistaa" sen oman `count` tilan eikä se vaikuta muihin painikkeisiin.

## Hookkien käyttäminen {/* using-hooks */}

Funktiot jotka alkavat sanalla `use` ovat hookkeja. `useState` on Reactin sisäänrakennettu hookki. Löydät lisää sisäänrakennettuja hookkeja [React API referenssistä](/apis). VOit myös kirjoittaa omia hookkeja olemassaolevia yhdistelemällä.

Hookit ovat rajoittavampia kuin normaalit funktiot. Voit kutsua hookkeja _ainoastaan_ komponentin päätasolta (tai muista hookeista). Jos haluat käyttää `useState` hookkia ehdollisesti tai loopissa, luo uusi komponentti ja sijoita se sinne.

## Tiedon jakaminen komponenttien välillä {/* sharing-data-between-components */}

Aikaisemmassa esimerkissä jokaisella `Painonappi` komponentilla oli sen oma `count` tila, sekä kun yksittäistä painiketta napsautettiin, vain sen painikkeen `count` tila muuttui:

<DiagramGroup>

<Diagram name="sharing_data_child" height={734} width={814} alt="Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. Both MyButton components contain a count with value zero.">

Ennen napsautusta, jokaisella Painonappi komponentilla tila on asetettuna nollaksi.
</Diagram>

<Diagram name="sharing_data_child_clicked" height={734} width={814} alt="The same diagram as the previous, with the count of the first child MyButton component highlighted indicating a click with the count value incremented to one. The second MyButton component still contains value zero." >

Napsautuksen jälkeen, vain yhdellä Painonappi komponentilla tila on päivittynyt.

</Diagram>

</DiagramGroup>

However, often you'll need components to _share data and always update together_.

To make both `MyButton` components display the same `count` and update together, you need to move the state from the individual buttons "upwards" to the closest component containing all of them.

In this example, it is `MyApp`:

<DiagramGroup>

<Diagram name="sharing_data_parent" height={770} width={820} alt="Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. MyApp contains a count value of zero which is passed down to both of the MyButton components, which also show value zero." >

Before clicking, count is stored in MyApp and passed down to both children as props.

</Diagram>

<Diagram name="sharing_data_parent_clicked" height={770} width={820} alt="The same diagram as the previous, with the count of the parent MyApp component highlighted indicating a click with the value incremented to one. The flow to both of the children MyButton components is also highlighted, and the count value in each child is set to one indicating the value was passed down." >

After clicking, count updates in MyApp and the new value is passed to both children as props.

</Diagram>

</DiagramGroup>

Now when you click either button, the `count` in `MyApp` will change, which will change both of the counts in `MyButton`. Here's how you can express this in code.

First, _move the state up_ from `MyButton` into `MyApp`:

```js {2,6-10}
function MyButton() {
  // ... we're moving code from here ...
}

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}
```

Then, _pass the state down_ from `MyApp` to each `MyButton`, together with the shared click handler. You can pass information to `MyButton` using the JSX curly braces, just like you previously did with built-in tags like `<img>`:

```js {11-12}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

The information you pass down like this is called _props_. Now the `MyApp` component contains the `count` state and the `handleClick` event handler, and _passes both of them down as props_ to each of the buttons.

Finally, change `MyButton` to _read_ the props you have passed from its parent component:

```js {1,3}
function MyButton({count, onClick}) {
  return <button onClick={onClick}>Clicked {count} times</button>;
}
```

When you click the button, the `onClick` handler fires. Each button's `onClick` prop was set to the `handleClick` function inside `MyApp`, so the code inside of it runs. That code calls `setCount(count + 1)`, incrementing the `count` state variable. The new `count` value is passed as a prop to each button, so they all show the new value.

This is called "lifting state up". By moving state up, we've shared it between components.

<Sandpack>

```js
import {useState} from 'react';

function MyButton({count, onClick}) {
  return <button onClick={onClick}>Clicked {count} times</button>;
}

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

## Next Steps {/* next-steps */}

By now, you know the basics of how to write React code!

Head to [Thinking in React](/learn/thinking-in-react) to see how it feels to build a UI with React in practice.
