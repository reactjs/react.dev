---
title: Ajattelu Reactissa
---

<Intro>

React saattaa muuttaa miten ajattelet mallien katsomista ja rakentamiasi sovelluksia. Kun rakennat käyttöliittymää Reactilla, rikot sen ensin palasiksi eli *komponenteiksi*. Sitten, kuvailet erilaiset visuaaliset tilat jokaiselle komponentillesi. Lopuksi, yhdistät komponettisi toisiinsa, jotta data liikkuu niiden läpi. Tässä oppaassa käymme läpi haettavan tuotetaulukon luomista Reactin avulla.

</Intro>

## Alota mallista {/*start-with-the-mockup*/}

Kuvittele, että sinulla on JSON API ja malli designerilta.

JSON API palauttaa dataa, joka näyttää seuraavalta:

```json
[
  {"category": "Fruits", "price": "$1", "stocked": true, "name": "Apple"},
  {"category": "Fruits", "price": "$1", "stocked": true, "name": "Dragonfruit"},
  {
    "category": "Fruits",
    "price": "$2",
    "stocked": false,
    "name": "Passionfruit"
  },
  {"category": "Vegetables", "price": "$2", "stocked": true, "name": "Spinach"},
  {
    "category": "Vegetables",
    "price": "$4",
    "stocked": false,
    "name": "Pumpkin"
  },
  {"category": "Vegetables", "price": "$1", "stocked": true, "name": "Peas"}
]
```

Ja malli tältä:

<img
  src="/images/docs/s_thinking-in-react_ui.png"
  width="300"
  style={{margin: '0 auto'}}
/>

Käyttöliittymän toteuttaminen Reactissa seuraa usein viittä samaa vaihetta.

## 1. Vaihe: Riko käyttöliittymä komponenttihierarkiaan {/*step-1-break-the-ui-into-a-component-hierarchy*/}

Aloita piirtämällä laatikkoja jokaisen komponentin ja alakomponentin ympärille mallissa ja nimeämällä ne. Jos työskentelet designerin kanssa, he ovat saattaneet jo nimetä nämä komponentit heidän suunnittelutyökalussaan. Tarkista heiltä!

Riippuen taustastasi, voit ajatella mallin jakamista osiin eri tavoin:

- **Ohjelmointi**--käytä samaa tekniikkaa päättääkseen mikäli sinun pitää luoda uusi funktio tai olio. Yksi tekniikka on [single responsibility -periaate](https://en.wikipedia.org/wiki/Single_responsibility_principle), joka tarkoittaa, että komponentin täytyisi tehdä vain yksi asia. Mikäli se päätyy kasvamaan, se pitäisi jakaa pienempiin alakomponentteihin.
- **CSS**--harkitse mille tekisit luokka-valitsimia. (Kuitenkin, komponentit koostuvat pienistä palasista.)
- **Design**--harkiste miten järjestäisit mallin eri tasoihin.

Huomaat jos JSON:isi on hyvin määriteltyä, se usein mäppäytyy komponentin rakenteeseen käyttöliittymässäsi. Tämä siksi, koska UI ja tietomalleilla usein on sama tietoarkkitehtuuri--eli, sama muoto. Erota käyttöliittymäsi komponenteiksi, jossa jokainen komponentti vastaa yhtä palasta tietomalliasi.

Ruudulla on viisi komponenttia:

<FullWidth>

<CodeDiagram flip>

<img
  src="/images/docs/s_thinking-in-react_ui_outline.png"
  width="500"
  style={{margin: '0 auto'}}
/>

1. `FilterableProductTable` (harmaa) sisältää koko sovelluksen.
2. `SearchBar` (sininen) vastaanottaa käyttäjän syötteen.
3. `ProductTable` (laventeli) näyttää ja suodattaa listan käyttäjän syötteen perusteella.
4. `ProductCategoryRow` (vihreä) näyttää otsikon jokaiselle kategorialle.
5. `ProductRow` (keltainen) näyttää rivin jokaiselle tuotteelle.

</CodeDiagram>

</FullWidth>

Jos katsot `ProductTable`:a (laventeli), huomaat että taulukon otsake (jooka sisältää "Name" ja "Price") ei ole oma komponenttinsa. Tämä on mieltymyskysymys ja voisit tehdä kummin päin tahansa. Tässä esimerkissä se on osa `ProductTable`:a koska se näkyy `ProductTable`:n listassa. Kuitenkin, jos tämä otsake kasvaa monimutkaiseksi (esim. jos lisäät suodattamisen), olisi järkevää tehdä siitä oma `ProductTableHeader` komponenttinsa.

Nyt kun olet tunnistanut komponentit mallista, järjestä ne hierarkiaan. Komponentit, jotka näkyvät toisen komponentin sisällä mallissa, pitäisi olla lapsena hierarkiassa:

- `FilterableProductTable`
  - `SearchBar`
  - `ProductTable`
    - `ProductCategoryRow`
    - `ProductRow`

## 2. Vaihe: Rakenna staattinen versio Reactissa {/*step-2-build-a-static-version-in-react*/}

Nyt kun olet tehnyt komponenttihierarkian on aika toteuttaa sovelluksesi. Yksikertaisin tapa on rakentaa versio, joka renderöi käyttöliittymän tietomallista ilman interkatiivisuutta. Usei on helpompi rakentaa staattinen versio ensin ja sitten lisätä interkatiivisuus jälkikäteen. Staattisen version rakentaminen vaatii paljon kirjoittamista muttei ajattelua, kuitenkin interaktiivisuuden lisääminen vaatii paljon ajattelua ja ei paljoa kirjoittamista.

Rakentaaksesi staattisen version sovelluksestasi, joka renderöi tietomallisi, käytä [komponentteja](/learn/your-first-component), jotka uudelleenkäyttävät toisia komponennteja ja välittävät tietoa käyttämällä [propseja.](/learn/passing-props-to-a-component) Propsit ovat tapa välittää tietoa pääkomponentilta alakomponentille. (Jos [tila](/learn/state-a-components-memory) on konseptina tuttu, älä käytä tilaa ollenkaan kun rakennat tämän staattisen version. Tila vaaditaan vain interaktiivisuuteen, eli kun tieto muuttuu ajan kuluessa. Kerta tämä on staattinen versio sovelluksta, et tarvitse sitä.)

Voit rakentaa joko "ylhäältä alas" aloittamalla komponenteilla, jotka ovat hierarkiassa ylempänä (kuten `FilterableProductTable`) tai "alhaalta ylös" työstämällä komponentteja alhaalla (kuten `ProductRow`). Yksinkertaisin esimerkein, useimmiten on helpompi tehä ylhäältä alaspäin, kun taas suuremmissa projekteissa on helpompi tehdä alhaalta ylöspäin.

<Sandpack>

```jsx App.js
function ProductCategoryRow({category}) {
  return (
    <tr>
      <th colSpan="2">{category}</th>
    </tr>
  );
}

function ProductRow({product}) {
  const name = product.stocked ? (
    product.name
  ) : (
    <span style={{color: 'red'}}>{product.name}</span>
  );

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({products}) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category}
        />
      );
    }
    rows.push(<ProductRow product={product} key={product.name} />);
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <label>
        <input type="checkbox" /> Only show products in stock
      </label>
    </form>
  );
}

function FilterableProductTable({products}) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

const PRODUCTS = [
  {category: 'Fruits', price: '$1', stocked: true, name: 'Apple'},
  {category: 'Fruits', price: '$1', stocked: true, name: 'Dragonfruit'},
  {category: 'Fruits', price: '$2', stocked: false, name: 'Passionfruit'},
  {category: 'Vegetables', price: '$2', stocked: true, name: 'Spinach'},
  {category: 'Vegetables', price: '$4', stocked: false, name: 'Pumpkin'},
  {category: 'Vegetables', price: '$1', stocked: true, name: 'Peas'},
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px;
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 10px;
}
td {
  padding: 2px;
  padding-right: 40px;
}
```

</Sandpack>

(Jos tämä koodi näyttää pelottavalta, käy [Pika-aloitus](/learn/) läpi ensiksi!

Komponenttien rakentamisen jälkeen sinulta löytyy kirjasto uudelleenkäytettäviä komponentteja, jotka renderöivät tietomallisi. Sillä tämä on staattinn sovellus, komponentit ainoastaan palauttavat JSX:ää. Komponentit ylhäällä hierarkiassa (`FilterableProductTable`) saavat tietomallisi proppeina. Tätä kutsutaan _yksisuuntaiseksi tiedonkuluksi_ sillä tieto kulkee alas vain yläkomponenteista komponentteihin alhaalla puussa.

<Gotcha>

Tässä kohtaa sinun ei pitäisi käyttää mitään tila-arvoja. Se tulee seuraavassa vaiheessa!

</Gotcha>

## 3. Vaihe: Etsi minimaalinen, mutta täysinäinen mallinnus UI:n tilasta {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

Jotta voit tehdä käyttöliittymästä interaktiivisen, käyttäjien täytyy voida muuttaa taustalla olevaa tietomallia. Tähän tulet käyttämään _tilaa_.

Ajattele tilaa minimaalisena tiedon muutoksena, jota sovelluksesi täytyy muistaa. Tärkein periaate tilan järjestelyssä on pitää se kuivana [DRY (Don't Repeat Yourself).](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) Selvitä kaikista pienin kuvaus tilasta, jota sovelluksesi tarvitsee ja laske kaikki muu tarpeen vaatiessa. Esimerkiksi jos olet rakentamassa ostoslistaa, voit tallentaa kohteet taulukkona tilaan. Jos haluat myös näyttää myös määrän kohteista listalla, älä tallenna lukua toisena tila-arvona, vaan lue taulukon pituus.

Nyt ajattele kaikkia tiedonpalasia tässä esimerkkisovelluksessa:

1. Alkupäinen lista tuotteista
2. Hakulause, jonka käyttäjä on syöttänyt
3. Valintaruudun arvo
4. Lista suodatetuista tuotteista

Mitkä näistä ovat tiloja? Tunnista ne, jotka eivät ole:

- Pysyykö se **muuttumattona** ajan kuluessa? Jos näin, se ei ole tila.
- Onko se **välitetty pääkomponentista** propsien avulla? Jos näin, se ei ole tila.
- **Voitko laskea sen** alkuperäisen tilan tai propsien avulla komponentissasi? Jos näin, se ei _varmasti_ ole tila!

Se mitä jää jäljelle on varmaankin tila.

Käydään ne vielä läpi yksitellen:

1. Alkuperäinen lista tuotteista **välitetään propseina, joten se ei ole tila.**
2. Hakulause vaikuttaa olevan tila sillä se muuttuu ajan kuluessa eikä sitä voida laskea mistään.
3. Valintaruudun arvo vaikuttaa olevan tila sillä se muuttuu ajan kuluessa eikä sitä voida laskea mistään.
4. Lista suodatetuista tuotteista **ei ole tila sillä se voidaan laskea** alkuperäisestä tuotelistasta suodattamalla hakulauseen ja valintaruudun perusteella.

Tämä tarkoittaa, että vain hakulause ja valintaruudun arvo ovat tiloja. Hienosti tehty!

<DeepDive title="Props vs State">

On kaksi "mallia" tietoa Reactissa: propsit ja tila. Nämä kaksi poikkeavat toisistaan:

- [**Propsit** ovat kuin argumentteja, joita välität](/learn/passing-props-to-a-component) funktiolle. Niillä pääkomponentti välittää tietoa alakomponentille ja mukauttaa sen ulkoasua. Esimerkiksi `Form` komponentti voi välittää `color` propin `Button` komponentille.
- [**Tila** on kuin komponentin muisti.](/learn/state-a-components-memory) Sillä komponentti voi seurata jotain tietoa ja muuttaa sitä tapahtumien perusteella. Esimerkiksi `Button` komponetti voi seurata `isHovered` tilaa.

Propsit ja tila ovat eri asioita, mutta ne toimivat yhdesäs. Pääkomponentti usei pitää jotain tietoa tilassa (jotta se voi muuttaa sitä), ja _välittää ne alas_ alakomponenteille niiden propseina. On okei jos näiden ero tuntuu epämääräiseltä ensimmäisellä lukukerralla. Tämä saattaa vaatia vähän harjoittelua.

</DeepDive>

## 4. Vaihe: Tunnista missä tilan kuuluisi elää {/*step-4-identify-where-your-state-should-live*/}

Kun olet tunnistanut sovelluksesi minimaalisen tilan, täytyy tunnistaa mikä komponentti on vastuussa tilan muuttamisesta, tai _omistaa_ tilan. Muista: React käyttää yksisuuntaista tiedonkulkua välittäen tietoa alaspäin komponenttihierarkiassa pääkomponentilta alakomponentille. Se ei välttämättä heti aluksi ole selkeää minkä komponentin pitäisi omistaa mitäkin tilaa. Tämä saattaa olla haastaa jos konsepti on uusi, mutta voit selvittää sen seuraavilla ohjeilla!

Jokaiselle palalle tilaa sovelluksessasi:

1. Tunnista _jokainen_ komponentti, joka renderöi jotain sen tilan pohjalta.
2. Etsi niiden lähin yhteinen pääkomponentti--komponentti kaikkien niiden yläpuolella hierarkiassa.
3. Päätä missä tilan kuuluisi elää:
   1. Usei voit laittaa tilan suoraan yhteiseen pääkomponenttiin.
   2. Voit myös laittaa tilan yhteistä pääkomponenttia korkeammalle.
   3. Jos et löydä komponenttia, jonka olisi järkevä omistaa tila, luo uusi komponentti pelkästään ylläpitämään tilaa ja lisää se jonnekkin hierarkiassa yhteisen pääkomponentin yläpuolelle.

Edellisessä vaiheessa sait kaksi palaa tilaa sovelluksessa: hakulauseen sekä valintaruudun arvon. Tässä esimerkissä molemmat näkyvät yhdessä, jotta on helpompi ajatella niitä yksittäisenä palana tilaa.

Käydään läpi strategiaa tälle tilalle:

1. **Tunnista komponentit, jotka käyttävät tilaa:**
   - `ProductTable`:n täytyy suodataa tuotelista tilan perusteella (hakulauseella ja valintaruudun arvolla).
   - `SearchBar`:n täytyy näyttää tila (hakulause ja valintaruudun arvo).
2. **Etsi niiden yhteinen pääkomponentti:** Ensimmäinen komponentti, jonka molemmat jakavat on `FilterableProductTable`.
3. **Päätä missä tila elää**: Pidämme hakulauseen ja valintaruudun arvon `FilterableProductTable` komponentissa.

Joten tila elää `FilterableProductTable` komponentissa.

Lisää tila komponenttiin käyttämällä [`useState()` Hookkia.](/apis/usestate) Hookeilla pääset käsiksi komponentin [renderöintisykliin](/learn/render-and-commit). Lisä kaksi tilamuuttujaa `FilterableProductTable` komponentin yläosassa ja määritä sovelluksesi aloitusarvot:

```js
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
```

Sitten välitä `filterText` ja `inStockOnly` komponenteille `ProductTable` ja `SearchBar` propseina:

```js
<div>
  <SearchBar filterText={filterText} inStockOnly={inStockOnly} />
  <ProductTable
    products={products}
    filterText={filterText}
    inStockOnly={inStockOnly}
  />
</div>
```

Alat näkemään miten sovelluksesi tulee käyttäytymään. Muokkaa `filterText` oletusarvoa arvosta `useState('')` arvoon `useState('fruit')` hiekkalaatikossa alla. Näet sekä hakulaatikon että taulukon päivittyvän:

<Sandpack>

```jsx App.js
import {useState} from 'react';

function FilterableProductTable({products}) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar filterText={filterText} inStockOnly={inStockOnly} />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly}
      />
    </div>
  );
}

function ProductCategoryRow({category}) {
  return (
    <tr>
      <th colSpan="2">{category}</th>
    </tr>
  );
}

function ProductRow({product}) {
  const name = product.stocked ? (
    product.name
  ) : (
    <span style={{color: 'red'}}>{product.name}</span>
  );

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({products, filterText, inStockOnly}) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category}
        />
      );
    }
    rows.push(<ProductRow product={product} key={product.name} />);
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({filterText, inStockOnly}) {
  return (
    <form>
      <input type="text" value={filterText} placeholder="Search..." />
      <label>
        <input type="checkbox" checked={inStockOnly} /> Only show products in
        stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: 'Fruits', price: '$1', stocked: true, name: 'Apple'},
  {category: 'Fruits', price: '$1', stocked: true, name: 'Dragonfruit'},
  {category: 'Fruits', price: '$2', stocked: false, name: 'Passionfruit'},
  {category: 'Vegetables', price: '$2', stocked: true, name: 'Spinach'},
  {category: 'Vegetables', price: '$4', stocked: false, name: 'Pumpkin'},
  {category: 'Vegetables', price: '$1', stocked: true, name: 'Peas'},
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px;
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 5px;
}
td {
  padding: 2px;
}
```

</Sandpack>

Huomaa, että lomakkeen muokkaaminen ei toimi vielä. Hiekkalaatikon konsolissa on virhe, joka kertoo miksi:

<ConsoleBlock level="error">

You provided a \`value\` prop to a form field without an \`onChange\` handler. This will render a read-only field.

</ConsoleBlock>

Ylläolevassa hiekkalaatikossa, `ProductTable` ja `SearchBar` lukevat `filterText` ja `inStockOnly` propsit renderöidäkseen taulukon, syöttölaatikon sekä valintaruudun. Esimerkiksi tässä on miten `SearchBar` täyttää syöttölaatikon arvon:

```js {1,6}
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."/>
```

Kuitenkaan, et ole vielä lisännyt yhtään koodia vastaamaan käyttäjän toimintoihin kuten kirjoittamiseen. Tämä on viimeinen vaiheesi.

## 5. Vaihe: Lisää käänteinen tiedonkulku {/*step-5-add-inverse-data-flow*/}

Tällä hetkellä sovelluksesi renderöityy oikein, kun propsit ja tila kulkevat alas hierarkiassa. Mutta muuttaaksesi tila käyttäjän syötteen perusteella, joudutaan tukemaan tiedon kulkemista toiseen suuntaan: lomakekomponentit syvällä hierarkiassa joutuvat päivittämään tilaa `FilterableProductTable` komponentissa.

React tekee tästä tiedonkulusta selkeää, mutta se vaatii hieman enemmän kirjoittamista kuin kaksisuuntaisessa tiedonkulussa. Jos koitat kirjoittaa tai valita valintaruutua ylläolevassa esimerkissä huomaat, että React ei välitä syötteestäsi. Tämä on tarkoituksellista. Kirjoittamalla `<input value={filterText} />` olet asettanut `input` elementin `value` propin olemaan aina yhtä `filterText` tilan kanssa, joka annetaan `FilterableProductTable` komponentissa. Sillä `filterText` tilaa ei koskaan aseteta, syöttökenttä ei koskaan muutu.

Halutaankin tehdä siten, että kun käyttäjä muuttaa lomakkeiden syöttetä, tila päivittyy vastaamaan näitä muutoksia. Tilan omistaa `FilterableProductTable` komponentti, joten ainoastaan se voi kutsua `setFilterText` ja `setInStockOnly` funktioita. Jotta `SearchBar` voisi päivittää `FilterableProductsTable`:n tilaa, täytyy nämä funktiot antaa `SearchBar`:lle.

```js {2,3,10,11}
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
```

`SearchBar` komponentissa lisää `onChange` tapahtumakäsittelijä ja muuta yläkomponentin tila sieltä käsin:

```js {5}
<input
  type="text"
  value={filterText}
  placeholder="Search..."
  onChange={(e) => onFilterTextChange(e.target.value)}
/>
```

Nyt sovellus toimii täysin!

<Sandpack>

```jsx App.js
import {useState} from 'react';

function FilterableProductTable({products}) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly}
      />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly}
      />
    </div>
  );
}

function ProductCategoryRow({category}) {
  return (
    <tr>
      <th colSpan="2">{category}</th>
    </tr>
  );
}

function ProductRow({product}) {
  const name = product.stocked ? (
    product.name
  ) : (
    <span style={{color: 'red'}}>{product.name}</span>
  );

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({products, filterText, inStockOnly}) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category}
        />
      );
    }
    rows.push(<ProductRow product={product} key={product.name} />);
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange,
}) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
        />{' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: 'Fruits', price: '$1', stocked: true, name: 'Apple'},
  {category: 'Fruits', price: '$1', stocked: true, name: 'Dragonfruit'},
  {category: 'Fruits', price: '$2', stocked: false, name: 'Passionfruit'},
  {category: 'Vegetables', price: '$2', stocked: true, name: 'Spinach'},
  {category: 'Vegetables', price: '$4', stocked: false, name: 'Pumpkin'},
  {category: 'Vegetables', price: '$1', stocked: true, name: 'Peas'},
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px;
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding: 4px;
}
td {
  padding: 2px;
}
```

</Sandpack>

Voit oppia kaiken tapahtumankäsittelystä ja tilan päivittämisestä [Interaktiivisuuden lisääminen](/learn/adding-interactivity) -osiossa.

## Mihin seuraavaksi {/*where-to-go-from-here*/}

Tämä oli hyvin lyhyt johdatus siihen, kuinka ajatella komponenttien ja sovelluksien rakentamista Reactila. Voit [aloittaa React projektin](/learn/installation) heti tai [sukeltaa syvemmälle syntaksiin](/learn/describing-the-ui), jota tässä oppaassa käytettiin.
