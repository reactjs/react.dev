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

## Komponenttien luominen ja sijoittaminen {/*components*/}

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

## Merkintäkoodin kirjoittaminen JSX:llä {/*writing-markup-with-jsx*/}

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

## Tyylien lisääminen {/*adding-styles*/}

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

## Tiedon näyttäminen {/*displaying-data*/}

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

## Ehdollinen renderöinti {/*conditional-rendering*/}

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

## Listojen renderöinti {/*rendering-lists*/}

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

## Vastaaminen tapahtumiin {/*responding-to-events*/}

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

## Ruudun päivittäminen {/*updating-the-screen*/}

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

## Hookkien käyttäminen {/*using-hooks*/}

Funktiot jotka alkavat sanalla `use` ovat hookkeja. `useState` on Reactin sisäänrakennettu hookki. Löydät lisää sisäänrakennettuja hookkeja [React API referenssistä](/apis). VOit myös kirjoittaa omia hookkeja olemassaolevia yhdistelemällä.

Hookit ovat rajoittavampia kuin normaalit funktiot. Voit kutsua hookkeja _ainoastaan_ komponentin päätasolta (tai muista hookeista). Jos haluat käyttää `useState` hookkia ehdollisesti tai loopissa, luo uusi komponentti ja sijoita se sinne.

## Tiedon jakaminen komponenttien välillä {/*sharing-data-between-components*/}

Aikaisemmassa esimerkissä jokaisella `Painonappi` komponentilla oli sen oma `count` tila, ja kun yksittäistä painiketta napsautettiin, vain painetun painikkeen `count` tila muuttui:

<DiagramGroup>

<Diagram name="sharing_data_child" height={734} width={814} alt="Puukaavio joka näyttää kolme komponenttia, yhden MyApp pääkomponentin sekä kaksi MyButton lapsikomponenttia. Molemmat MyButton komponentit sisältävät count tilan, jonka arvo on nolla.">

Ennen napsautusta, jokaisella Painonappi komponentilla tila on asetettuna nollaksi.

</Diagram>

<Diagram name="sharing_data_child_clicked" height={734} width={814} alt="Sama kaavio kuin aiemmin, mutta ensimmäisen MyButton komponentin count tila on korostettuna osoittaen klikkausta, jolloin count tila on noussut yhteen. Toinen MyButton komponentti silti sisältää arvon nolla." >

Napsautuksen jälkeen, vain yhdellä Painonappi komponentilla tila on päivittynyt.

</Diagram>

</DiagramGroup>

Usein kuitenkin komponenttien täytyy _jakaa tietoa ja päivittyä sen mukana_.

Jotta molemmat `MyButton` komponentit näyttävät saman `count` luvun sekä päivittyvät sen mukana, täytyy yksilöllinen tila poistaa nappi -komponenteilta "ylöspäin" lähimmälle pääkomponentille.

Tässä esimerkissä se on `MyApp`:

<DiagramGroup>

<Diagram name="sharing_data_parent" height={770} width={820} alt="Puukaavio sisältäen kolme komponenttia, yhden MyApp pääkomponentin sekä kaksi MyButton lapsikomponenttia. MyApp pitää sisällään count tilan arvolla nolla, joka on annettu molemmille MyButton komponenteille, jotka myöskin näyttävät arvoa nolla." >

Ennen napsautusta, count tila on MyApp komponentissa ja annettu molemmille lapsikomponenteille proppeina.

</Diagram>

<Diagram name="sharing_data_parent_clicked" height={770} width={820} alt="Sama kaavio kuin aiemmin, jossa MyApp komponentin count tila on korostettu osoittaen klikkausta, jolloin tilan arvo on noussut yhteen. Tiedon virtaus molempiin lapsikomponentteihin on myös korostettu, sekä tila kummassakin lapsikomponentissa on asetettu yhdeksi osoittaen tilan virtausta alaspäin." >

Klikkauksen jälkeen tila päivittyy MyApp komponentissa sekä uusi arvo on annettu molemmille lapsikomponenteille proppeina.

</Diagram>

</DiagramGroup>

Nyt kun klikkaat kumpaakin painiketta, `count` tila `MyApp` komponentissa muuttuu. Tämä muutos muuttaa molempien `MyButton` komponenttien tilat.Tässä vielä miten se tehtäisiin koodissa.

Ensiksi, _siirrä tila ylöspäin_ `MyButton` komponentista `MyApp` komponenttiin:

```js {2,6-10}
function MyButton() {
  // ... siirretään tila täältä ...
}

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Laskurit, jotka päivittyvät erikseen</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}
```

Sitten _anna tila alaspäin_ `MyApp` komponentissa kuhunkin `MyButton` komponenttiin yhdessä klikkauksen tapahtumakäsittelijän kanssa. Voit antaa tietoa `MyButton` komponenttiin käyttäen JSX aaltosulkeita, aivan kuten aiemmin teit sisäänrakennettujen `<img>` tagien kanssa:

```js {11-12}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Laskurit jotka päivittyvät yhdessä</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

Tietoa, jota annat alaspäin näin kutsutaan _propeiksi_ (engl. props). Nyt `MyApp` komponentti sisältää `count` tilan, `handleClick` tapahtumakäsittelijän, sekä _antaa molemmat näistä proppeina_ kullekin painikkeelle.

Lopuksi, mutta `MyButton` _lukemaan_ propit, jotka annoit sille sen pääkomponentista:

```js {1,3}
function MyButton({count, onClick}) {
  return <button onClick={onClick}>Napsautit {count} kertaa</button>;
}
```

Kun klikkaat painiketta, `onClick` tapahtumakäsittelijää kutsutaan. Jokaisen painikkeen `onClick` proppi on asetettu `handleClick` funktioon `MyApp` komponentissa, joten koodi sen sisällä suoritetaan. Se koodi kutsuu `setCount(count + 1)`, nostaen `count` tilamuuttujaa. Uusi `count` tila annetaan proppina kullekin painikkeelle jolloin ne kaikki näyttävät samaa uutta arvoa.

Tätä kutsutaan "tilan nostamiseksi ylös". Siirtämällä tilaa ylös jaamme sitä komponenttien välillä.

<Sandpack>

```js
import {useState} from 'react';

function MyButton({count, onClick}) {
  return <button onClick={onClick}>Napsautit {count} kertaa</button>;
}

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Laskurit jotka päivittyvät yhdessä</h1>
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

## Seuraavat vaiheet {/*next-steps*/}

Tähän mennessä osaat miten kirjoitetaan perusteet React koodista!

Siirry seuraavaksi [Ajattelua Reactissa](/learn/thinking-in-react) nähdäksesi, miltä käyttöliittymän rakentaminen Reactilla tuntuu käytännössä.
