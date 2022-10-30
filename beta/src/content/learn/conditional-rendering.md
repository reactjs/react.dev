---
title: Ehdollinen renderöinti
---

<Intro>

Komponenttiesi täytyy usein näyttää eri asioita eri tilanteissa. Reactissa voit ehdollisesti renderöidä JSX:ää käyttämällä JavaScript syntaksia kuten `if` lauseita, `&&` ja `? :` operaattoreita.

</Intro>

<YouWillLearn>

* Miten palauttaa eri JSX:ää riippuen ehdoista
* Miten sisällyttää tai poissulkea JSX:ää ehdollisesti
* Yleisiä ehtolauseiden syntakseja, joita kohtaat React-koodipohjissa

</YouWillLearn>

## JSX:n palauttaminen ehdollisesti {/*conditionally-returning-jsx*/}

Sanotaan, että sinulla on `PackagingList` komponentti renderöimässä useita `Item` komponentteja, jotka voidaan merkitä pakatuiksi tai ei:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Huomaa, että joillain `Item` komponenteilla on niiden `isPacked` propsi asetettu arvoon `true` eikä `false`. Haluat kuitenkin lisätä valintamerkin (✔) pakattuihin itemeihin jos `isPacked={true}`.

Voit kirjoittaa tämän [`if`/`else` lauseena](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) seuraavasti:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Jos `isPacked` propsi on `true`, tämä koodi **palauttaa eri JSX puun**. Tällä muutoksella, jotkin kohteista saavat valintamerkin loppuun:

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✔</li>;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Kokeile muokata mitä palautuu kummassakin tilassa ja katso miten lopputulos muuttuu!

Huomaa miten luot haaralogiikkaa JavaScriptin `if` ja `return` lauseilla. Reactissa ohjausvirtaa (kuten ehtoja) käsittelee JavaScript.

### Ehdollisesti tyhjän palauttaminen käyttämällä `null` {/*conditionally-returning-nothing-with-null*/}

Jossain tilanteissa et halua renderöidä yhtään mitään. Esimerkiksi sanotaan, että et halua näyttää pakattuja kohteita ollenkaan. Komponentin täytyy kuitenkin palauttaa jotain. Tässä tilanteessa, voit palauttaa `null`:

```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

Jos `isPacked` on tosi, komponentti ei palauta mitään, `null`:n. Muussa tapauksessa se palauttaa JSX:n renderöitäväksi.

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Käytännössä `null`:n palauttaminen komponentista ei ole yleistä, sillä se voi yllättää kehittäjää, joka yrittää renderöidä sitä. Useammin sisällytät tai poissuljet komponentin ehdollisesti pääkomponentin JSX:ssä. Tässä miten se tehdään!

## JSX:n sisällyttäminen ehdollisesti {/*conditionally-including-jsx*/}

Aikaisemmassa esimerkissä hallitsit kumpi (jos kumpikaan!) JSX puu tulisi komponentin palauttaa. Saatoit huomata hieman toistoa renderöinnin ulostulossa:

```js
<li className="item">{name} ✔</li>
```

on hyvin samanlainen kuin

```js
<li className="item">{name}</li>
```

Molemmat ehtohaarat palauttavat `<li className="item">...</li>`:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Vaikka toisto ei ole haitallista, se voi tehdä koodistasi hankalempaa ylläpitää. Entä jos haluat muuttaa `className`:n? Sinun täytyisi tehdä se kahdessa paikassa koodissasi! Tällaisessa tilanteessa voisit ehdollisesti sisällyttää vähän JSX tehdäksesi koodistasi enemmän kuivaa (engl. [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).)

### Ehdollinen (ternary) operaattori (`? :`) {/*conditional-ternary-operator--*/}

JavaScriptissa on kompakti tapa kirjoittaa ehtolauseke -- [conditional operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) taikka "ternary operaattori."

Tämän sijaan:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Voit kirjoittaa tämän:

```js
return (
  <li className="item">
    {isPacked ? name + ' ✔' : name}
  </li>
);
```

Voit lukea sen kuin *"jos `isPacked` on tosi, sitten (`?`) renderöi `name + ' ✔'`, muussa tapauksessa (`:`) renderöi `nimi`."*)

<DeepDive title="Vastaavatko nämä kaksi esimerkkiä toisiaan täysin?">

Jos sinulla on taustaa olio-ohjelmoinnista, saatat olettaa, että kaksi yllä olevaa esimerkkiä ovat hienovaraisesti erilaisia, koska yksi niistä voi luoda kaksi erilaista "instanssia" `<li>` elementistä. Mutta JSX elementit eivät ole "instansseja", sillä ne eivät ylläpidä sisäistä tilaa eivätkä ne ole aitoja DOM-solmuja. Ne ovat kevyitä kuvauksia, kuten pohjapiirustuksia. Joten nämä kaksi esimerkkiä *ovat* itse asiassa täysin toisiaan vastaavia. [Tilan säilyttäminen ja nollaus](/learn/preserving-and-resetting-state) menee syvemmälle siihen miten kaikki tämä toimii.

</DeepDive>

Sanotaan, että haluat kääriä lopullisen kohteen tekstin toiseen HTML tagiin, kuten `<del>`:iin yliviivataksesi sen. Voit lisätä enemmän rivinvaihtoja ja sulkeita, jotta on helpompi upottaa enemmän JSX koodia kussakin tapauksessa:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✔'}
        </del>
      ) : (
        name
      )}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Tämä tyyli toimii hyvin yksinkertaisiin ehtolauseisiin, mutta käytä sitä maltillisesti. Jos komponenttisi sotkeutuvat liian monen sisäkkäisen ehdollisten merintöjen kanssa, hatkitse niiden irroittaminen lapsikomponenteiksi, koodin siistimiseksi. Reactissa merkintäkoodi on osa koodiasi, joten voit käyttää ominaisuuksia kuten muuttujia ja funktioita sekavien lausekkeiden siistimiseksi.

### Looginen AND operaattori (`&&`) {/*logical-and-operator-*/}

Toinen yleinen lyhytoperaatio, johon törmäät on [JavaScriptin looginen AND (`&&`) operaattori](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#:~:text=The%20logical%20AND%20(%20%26%26%20)%20operator,it%20returns%20a%20Boolean%20value.). React komponenttien sisällä tulee usein tilainteita, joissa haluat renderöidä jotain JSX:ää kun ehto on tosi, **tai jättää renderöimättä muutoin.** Käyttämällä `&&` operaattoria voit ehdollisesti renderöidä valintamerkin vain jos `isPacked` on `true`:

```js
return (
  <li className="item">
    {name} {isPacked && '✔'}
  </li>
);
```

Voit lukea tämän kuin *"jos `isPacked`, sitten (`&&`) renderöi valintamerkki, muussa tapauksessa, älä renderöi mitään."*

Tässä se toiminnassa:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

[JavaScriptin && lauseke](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND) palauttaa oikean puolimmaisen arvon (tässä tapauksessa valintamerkin) jos vasen puoli (ehtomme) on `true`. Mutta jos ehto on `false`, koko lausekkeesta tulee `false`. React käsittää `false`:n kuin "aukon" JSX puussa, juuri kuten `null` tai `undefined`, eikä se renderöi mitään sen kohdalle.


<Pitfall>

**Älä aseta numeroita `&&` lausekkeen vasemmalle puolelle.**

Testatakseen ehtolausetta, JavaScript automaattisesti muuttaa vasemman puolen totuusarvoksi. Kuitenkin, jos vasen puoli on `0`, niin silloin koko lauseke saa sen arvokseen (`0`), ja React mielellään renderöi `0`:n tyhjän tilalle.

Yleinen väärinkäsitys on kirjoittaa koodia kuten `messageCount && <p>New messages</p>`. On helppoa olettaa, ettei se renderöi mitään kun `messageCount` on `0`, mutta se oikeasti renderöi luvun `0` itsessään!

Tämän korjataksesi, tee vasemmasta puolesta totuusarvo: `messageCount > 0 && <p>New messages</p>`.

</Pitfall>

### JSX:n määrittäminen muuttujaan ehdollisesti {/*conditionally-assigning-jsx-to-a-variable*/}

Kun lyhytoperaatiot astuvat koodin kirjoittamisen eteen, kokeile käyttää `if` lausetta ja muuttujaa. Voit uudelleenmääritellä muuttujia, jotka on esitelty käytten [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let):iä, joten voit aloittaa tarjoamalla oletussisällön, jota haluat näyttää:

```js
let itemContent = name;
```

Käytä `if` lausetta uudelleenmärittelemään JSX-lause muotoon `itemContent` jos `isPacked` on `true`:

```js
if (isPacked) {
  itemContent = name + " ✔";
}
```

[Aaltosulkeet avaavat "ikkunan takaisin JavaScriptiin".](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world) Upota muuttuja aaltosulkeilla palautetussa JSX puussa,sisentäen aiemmin laskettu lause JSX:n sisässä:

```js
<li className="item">
  {itemContent}
</li>
```

Tämä tyyli on kaikista monisanainen, mutta se on myös joustavin. Tässä se vielä toiminnassa:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✔";
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Kuten aiemmin, tämä toimii sekä teksteille, mutta myös mielivaltaiselle JSX:lle:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✔"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Mikäli JavaScript ei ole tuttua, nämä tyylit voivat tuntua ylivoimaisilta aluksi. Kuitenkin niiden oppiminen helpottavat sinua lukemaan ja kirjoittamaan mitä tahansa JavaScript koodia -- eikä vain React komponentteja! Valitse aluksi yksi jota suosit ja sitten viittaa takaisin tähän oppaaseen mikäli unohdat miten muut toimivatkaan.

<Recap>

* Reactissa ohjaat haaralogiikkaa JavaScriptilla.
* Voit palauttaa JSX-lauseen ehdollisesti käyttäen `if`-lausetta.
* Voit ehdollisesti tallentaa jotain JSX:ää muuttujaan ja sisällyttää sen toisen JSX:n sisään käyttäen aaltosulkeita.
* JSX:ssä, `{cond ? <A /> : <B />}` tarkoittaa *"jos `cond`, renderöi `<A />`, muutoin `<B />`"*.
* JSX:ssä, `{cond && <A />}` tarkoittaa *"jos `cond`, renderöi `<A />`, muutoin ei mitään"*.
* Lyhytoperaatiot ovat yleisiä, mutta sinunu ei tarvitse käyttää niitä jos suosit tavallista `if` lausetta.

</Recap>



<Challenges>

### Näytä kuvake keskeneräisille kohteille hyödyntämällä `? :` {/*show-an-icon-for-incomplete-items-with--*/}

Käytä ehdollista operaattoria (`cond ? a : b`) renderöidäksesi ❌ jos `isPacked` ei ole `true`.

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✔' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

### Näytä kohteen tärkeys hyödyntämällä `&&` {/*show-the-item-importance-with-*/}

Tässä esimerkissä jokainen `Item` vastaanottaa numeerisen `importance` propin. Käytä `&&` lyhytoperaatiota renderöidäksesi "_(Importance: X)_" kursivoituna, mutta vain kohteille joiden tärkeys on suurempi kuin nolla. Listauksen pitäisi päätyä näyttämään seuraavanlaiselta:

* Space suit _(Importance: 9)_
* Helmet with a golden leaf
* Photo of Tam _(Importance: 6)_

Älä unohda lisätä välilyöntiä kohteiden väliin!

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

This should do the trick:

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Huomaa, että sinun täytyy kirjoittaa `importance > 0 && ...` ennemmin kuin `importance && ...`, sillä jos `importance` on `0`, `0`:aa ei renderöidä pelkkänä vastauksena!

Tässä ratkaisussa kahta erillistä ehtolausetta käytetään asettamaan välilyönti nimen ja tärkeyden väliin. Vaihtoehtoisesti voit käyttää fragmentia: `importance > 0 && <> <i>...</i></>` tai lisätä välilyönnin suoraan `<i>`:n sisään:  `importance > 0 && <i> ...</i>`.

</Solution>

### Refaktoroi sarja `? :` käyttämään `if`-lausetta ja muuttujia {/*refactor-a-series-of---to-if-and-variables*/}

Tämä `Drink` komponentti käyttää sarjan `= :` ehtolauseita näyttääkseen erilaista tietoa riippuen onko `name` propsi `"tea"` tai `"coffee"`. Ongelmana on, että tiedot jokaisesta juomasta on hajautettuna usesiin ehtoihin. Refaktoroi koodi käyttämään yhtä `if` lausetta kolmen `? :`-ehdon sijaan.

<Sandpack>

```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{name === 'tea' ? 'leaf' : 'bean'}</dd>
        <dt>Caffeine content</dt>
        <dd>{name === 'tea' ? '15–70 mg/cup' : '80–185 mg/cup'}</dd>
        <dt>Age</dt>
        <dd>{name === 'tea' ? '4,000+ years' : '1,000+ years'}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

Kun olet saanut refaktoroitua koodin käyttämään `if`-lausetta, onko sinulla muita ideoita miten voisit yksinkertaistaa sitä?

<Solution>

Voit tehdä tämän monella eri tavalla, mutta tässä yksi lähtökohta:

<Sandpack>

```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'tea') {
    part = 'leaf';
    caffeine = '15–70 mg/cup';
    age = '4,000+ years';
  } else if (name === 'coffee') {
    part = 'bean';
    caffeine = '80–185 mg/cup';
    age = '1,000+ years';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{part}</dd>
        <dt>Caffeine content</dt>
        <dd>{caffeine}</dd>
        <dt>Age</dt>
        <dd>{age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

Tässä informaatio jokaisesta juomasta on ryhmitetty yhteen sen sijaan, että ne olisi jaettu useisiin ehtoihin. Tämän avulla on helpompi lisätä muita juomia tulevaisuudessa.

Toinen ratkaisu voisi olla poistaa ehto kokonaan siirtämällä informaatio olioon:

<Sandpack>

```js
const drinks = {
  tea: {
    part: 'leaf',
    caffeine: '15–70 mg/cup',
    age: '4,000+ years'
  },
  coffee: {
    part: 'bean',
    caffeine: '80–185 mg/cup',
    age: '1,000+ years'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{info.part}</dd>
        <dt>Caffeine content</dt>
        <dd>{info.caffeine}</dd>
        <dt>Age</dt>
        <dd>{info.age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>