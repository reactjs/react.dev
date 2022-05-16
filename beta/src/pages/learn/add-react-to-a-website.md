---
title: Lisää React verkkosivulle
---

<Intro>

Sinun ei tarvitse rakentaa koko sivua Reactilla. Reactin lisääminen HTML sivulle ei vaadi asennusta, kestää vain minuutin ja antaa sinun kirjoittaa interaktiivisia komponentteja heti.

</Intro>

<YouWillLearn>

* Miten lisätään Reactia mihin tahansa HTML sivuun minuutissa
* Mitä JSX syntaksi on ja kuinka sitä voi testata
* Miten asennetaan JSX esiprosessori tuotantoa varten

</YouWillLearn>

## Lisää React minuutissa {/*add-react-in-one-minute*/}

React on suunniteltu alusta alkaen asteittaiseen käyttöönottoon. Useimmat verkkosivut eivät ole (eivätkä tarvitse olla) täysin rakennettu Reactilla. Tämä opas näyttää miten listään "ripaus interkatiivisuutta" olemassa olevaan HTML sivuun. 

Kokeile tätä omalla verkkosivullasi tai [tyhjällä HTML tiedostolla](https://gist.github.com/rachelnabors/7b33305bf33776354797a2e3c1445186/archive/859eac2f7079c9e1f0a6eb818a9684a464064d80.zip). Tarvitset vain internet-yhteyden sekä tekstieditorin kuten Notepadin tai VSCoden. (Lue [miten oma editori määritellään](/learn/editor-setup/) syntaksin korostusta varten!)

### 1. Vaihe: Lisää juuri-HTML tagi {/*step-1-add-a-root-html-tag*/}

Avaa ensiksi HTML -sivu, jota haluat muokata. Lisää siihen tyhjä `<div>` tagi merkatakseen kohdan, johon haluat Reactin näyttävän jotain. Anna tälle `<div>`:lle uniikki `id` attribuutin arvo. Esimerkiksi:

```html {3}
<!-- ... olemassa oleva HTML ... -->

<div id="tykkää-painikkeen-juuri"></div>

<!-- ... olemassa oleva HTML ... -->
```

Sitä kutsutaan "juureksi" koska se on mistä Reactin puu alkaa. Voit sijoittaa juuri-HTML tagin kuten tämän minne tahansa `<body>` tagin sisällä. Jätä se tyhjäksi, koska React korvaa sen sisällön React komponentillasi.

Sinulla voi olla niin monta juuri-HTML tagia yhdellä sivulla kuin tarvitset.
### 2. Vaihe: Lisää script -tagit {/*step-2-add-the-script-tags*/}

Lisää kolme `<script>` tagia seuraaviin tiedostoihin HTML sivussa juuri ennen sulkevaa `</body>` tagia:

- [**react.development.js**](https://unpkg.com/react@18/umd/react.development.js) antaa sinun määritellä React komponentteja
- [**react-dom.development.js**](https://unpkg.com/react-dom@18/umd/react-dom.development.js) mahdollistaa Reactin renderöinnin [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model)iin.
- **like_button.js** tiedosto, johon tulet kirjoittamaan komponenttisi seuraavassa vaiheessa!

HTML sivusi pitäisi loppua seuraavasti:

```html
  <!-- sivun loppu -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="like_button.js"></script>
</body>
```

<Gotcha>

Tuotantoon siirtyessä, korvaa "development.js" sanalla "production.min.js"! Kehitysversio Reactista tarjoaa hyödyllisempiä virheviestejä, mutta hidastaa sivuasi *paljon*.

</Gotcha>

### 3. Vaihe: Luo React komponentti {/*step-3-create-a-react-component*/}

Luo tiedosto nimeltään **like_button.js** HTML sivun viereen, lisää tämä koodinpätkä ja tallenna tiedosto. Tämä koodi määrittää React komponentin nimeltään `LikeButton`. (Lue lisää komponenttien tekemisestä [Pika-oppaastamme!](/learn/your-first-component)

```js
'use strict';

function LikeButton() {
  const [liked, setLiked] = React.useState(false);

  if (liked) {
    return 'You liked this!';
  }

  return React.createElement(
    'button',
    {
      onClick: () => setLiked(true),
    },
    'Like'
  );
}
```

### 4. Vaihe: Lisää React komponenttisi sivuun {/*step-4-add-your-react-component-to-the-page*/}

Viimeiseksi, lisää kolme riviä koodia **like_button.js** tiedoston loppuun. Nämä rivit koodia etsivät `<div>` tagin, jonka lisäsit HTML tiedostoon ensimmäisessä vaiheessa, luo React -sovelluksen juuren, ja näyttää sitten "Like" painikkeen React komponentin sen sisällä.

```js
const rootNode = document.getElementById('tykkää-painikkeen-juuri');
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(LikeButton));
```

**Onnittelut! Juuri renderöit ensimmäisen React komponentin verkkosivullasi!**

[Näytä esimerkin koko lähdekoodi](https://gist.github.com/gaearon/0b535239e7f39c524f9c7dc77c44f09e)
[Lataa koko esimerkki (2KT zip)](https://gist.github.com/gaearon/0b535239e7f39c524f9c7dc77c44f09e/archive/651935b26a48ac68b2de032d874526f2d0896848.zip)

#### Voit uudelleenkäyttää komponentteja! {/*you-can-reuse-components*/}

Saatat haluta näyttää React komponentin useissa eri paikoissa samalla HTML sivulla. Tämä on hyödyllistä jos sivun React-käyttöiset osat on erillään toisistaan. Voit tehdä tämän luomalla useita juuri-tageja HTML koodissasi ja sitten renderöimällä React komponentit niiden sisällä kutsumalla `ReactDOM.createRoot()` funktiota. Esimerkiksi:

1. **index.html** tiedostossa, lisää uusi container elementti `<div id="toinen-juuri"></div>`.
2. **like_button.js** tiedostossa, lisää kolme lisäriviä koodia tiedoston loppuun:

```js {6,7,8,9}
const anotherRootNode = document.getElementById('toinen-juuri');
const anotherRoot = ReactDOM.createRoot(anotherRootNode);
anotherRoot.render(React.createElement(LikeButton));
```

Mikäli samaa komponenttia täytyy renderöidä monissa eri paikoissa, voit asettaa CSS `class` luokan `id`:n tilalle jokaiselle juurelle, ja sitten etsiä ne kaikki. Tässä on [esimerkki, joka näyttää kolme "Like" painiketta ja välittää tietoa niille.](https://gist.github.com/gaearon/779b12e05ffd5f51ffadd50b7ded5bc8)

### Vaihe 5: Pienennä JavaScript tuotantoa varten {/*step-5-minify-javascript-for-production*/}

Pienentämätön JavaScript voi merkittävästi hidastaa verkkosivun latausaikoja käyttäjillesi. Ennen verkkosivun siirtämistä tuotantoon, on hyvä idea pienentää eli minifioida script -tiedostot.

- **Jos sinulla ei ole minifiointi-vaihetta** koodeillesi, [täältä löydät yhden tavan asentaa sen](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3).
- **Jos jo minifioit** sovelluksesi koodit, sivusi on tuotantovalmis mikäli varmistat, että tuotantoon siirrettävä HTML koodi lataa versiot Reactista, jotka loppuvat `production.min.js` päätteellä, kuten:

```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
```

## Kokeile Reactia JSX:llä {/*try-react-with-jsx*/}

Esimerkit yllä riippuvat ominaisuuksista, jotka ovat natiivisti tuettuja selaimissa. Tämä on syy miksi **like-button.js** käyttää JavaScript funktiokutsua kertoakseen Reactille mitä näyttää:

```js
return React.createElement('button', {onClick: () => setLiked(true)}, 'Like');
```

Kuitenkin, React tarjoaa myös vaihtoehdon käyttää HTML-tyylistä JavaScript syntaksia nimeltään [JSX](/learn/writing-markup-with-jsx). Esimerkiksi:

```jsx
return <button onClick={() => setLiked(true)}>Like</button>;
```

Nämä kaksi koodinpätkää vastaavat toisiaan. JSX on suosittu syntaksi määrittelemään merkintää JavaScriptissa. Useat kokevat sen tutuksi ja helppokäyttöiseksi käyttöliittymäkoodin kirjoittamiseen--joko Reactin kanssa tai muiden kirjastojen.

> Voit kokeilla muuttaa HTML merkintäkoodia JSX koodiksi käyttämällä [tätä verkkomuunninta](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.17).

### Kokeile JSX:ää {/*try-jsx*/}

Nopein tapa kokeilla JSX:ää projektissasi on lisätä Babel -kääntäjä `<script>` -tagina sivulle. Laita se ennen **`like-button.js`** tiedostoa ja sitten lisää `type="text/babel"` attribuutti **`like-button.js`** tiedoston `<script>` tagiin:

```html {3,4}
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="like-button.js" type="text/babel"></script>
</body>
```
Nyt voit avata **`like-button.js`** tiedoston ja korvata

```js
return React.createElement(
  'button',
  {
    onClick: () => setLiked(true),
  },
  'Like'
);
```

vastaavalla JSX koodilla:

```jsx
return (
  <button onClick={() => setLiked(true)}>
    Like
  </button>
);
```

Merkintäkoodin ja JS-koodin sekoittaminen saattaa aluksi tuntua oudolta, mutta tulet tykkäämään siitä! Lue johdanto sivulta [Merkintäkoodin kirjoittaminen JSX:llä](/learn/writing-markup-with-jsx). Tässä on [esimerkki HTML tiedostosta, jossa on JSX:ää](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html), jonka voit ladata ja testailla.

<Gotcha>

Babel -kääntä on hyvä oppimiseen ja yksinkertaisten demojen luontiin. Kuitenkin, **se tekee sivustasi hitaan ja ei ole sopiva tuotantoon. Kun olet valmis siirtymään eteenpäin, poista Babel `<script>` tagi ja `type="text/babel"` attribuutti, jonka tässä vaiheessa lisäsit. Sen sijaan seuraavassa vaiheessa tulet asentamaan JSX esikääntäjän muuntamaan kaikki `<script>` tagisi automaattisesti JSX:stä JS:ksi. 

</Gotcha>

Tämä lähestymistapa on hyvä oppimiseen ja yksinkertaisiin demoihin. Kuitenkin, se tekee sivustasi hintaan ja **ei ole sopiva tuotantoon**. Kun olet valmis siirtymään eteenpäin, poista tämä uusi `<script>` tagi ja `type="text/babel"` attribuutti, jonka lisäsit. Sen sijaan seuraavassa vaiheessa tulet asentamaan JSX esikääntäjän muuntamaan kaikki `<script>` tagisi automaattisesti. 

### Lisää JSX projektiin {/*add-jsx-to-a-project*/}

JSX:n lisääminen projektiin ei vaadi monimutkaisia työkaluja kuten [bundleria](/learn/start-a-new-react-project#custom-toolchains) tai kehityspalvelinta. JSX esikääntäjän lisääminen on lähes samanlaista kuin CSS esikääntän lisääminen.

Siirry projektisi hakemistoon terminaalissa ja liitä nämä kaksi kometoa (**Varmista, että sinulla on [Node.js](https://nodejs.org/) asennettuna!**):

1. `npm init -y` (mikäli epäonnistuu, [täällä on ratkaisu](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. `npm install babel-cli@6 babel-preset-react-app@3`

Tarvitset vain npm:n asentaaksesi JSX esikääntäjän. Et tarvitse sitä mihinkään muuhun. Sekä React että sovelluskoodisi voi pysyä `<script>` tageina ilman muutoksia.

Onnittelut! Lisäsit juuri **tuotantovalmiin JSX ympäristön** projektiisi.

### Suorita JSX esikääntäjä {/*run-the-jsx-preprocessor*/}

Voit esikääntää JSX koodin siten, että joka kerta kun tallennat tiedoston, jossa on JSX -koodia, muunnin suoritetaan uudelleen, kääntäen JSX tiedoston pelkäksi JavaScript tiedostoksi, jota selain ymmärtää. Tässä on miten se asennetaan:

1. Luo kansio nimeltään **`src`**.
2. Terminaalissa, suorita komento: `npx babel --watch src --out-dir . --presets react-app/prod ` (Älä odota sen valmistumista! Tämä komento aloittaa automaattisen tarkkailijan seuraamaan muutoksia JSX koodissa `src` hakemistossa.)
3. Siirrä JSX koodiksi muunnettu **`like-button.js`** ([sen pitäisi näyttää tältä!](https://gist.githubusercontent.com/gaearon/1884acf8834f1ef9a574a953f77ed4d8/raw/dfc664bbd25992c5278c3bf3d8504424c1104ecf/like-button.js)) uuteen **`src`** hakemistoon

Tarkkailija luo uuden esikäännetyn **`like-button.js`** tiedoston, joka sisältää selaimelle sopivaa JavaScript koodia.

<Gotcha>

Jos törmäät virheeseen "You have mistakenly installed the `babel` package", saatoit vahingossa unohtaa [aikaisemman vaiheen](#add-jsx-to-a-project). Tee se samassa hakemistossa ja yritä uudelleen.

</Gotcha>

Työkalua, jota juuri käytit on Babel ja voit lukea lisää siitä [sen dokumentaatiosta](https://babeljs.io/docs/en/babel-cli/). JSX:n lisäksi, sen avulla voi käyttää uusinta JavaScript syntaksi-ominaisuuksia murehtimatta vanhojen selaimien rikkoutumisesta.

Jos viihdyt kehitystyökalujen kanssa ja haluat niiden tekevän enemmän, [käsittelemme joitain suosituimmista ja helposti lähestyttävistä työkalupakeista täällä](/learn/start-a-new-react-project).

<DeepDive title="React ilman JSX:ää">

Alun perin JSX esiteltiin, jotta Reactilla kirjoittavat komponentit tuntuvat yhtä tutuilta kuin HTML:n kirjoittaminen. Sittemmin syntaksi on yleistynyt. Kuitenkin, on tilanteita joissa et välttämättä halua tai voi käyttää JSX:ää. Sinulla on kaksi vaihtoehtoa:

- Käytä vaihtoehtoista JSX:ää kuten [htm](https://github.com/developit/htm), joka ei käytä kääntäjää—se käyttää JavaScriptin [template stringejä](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) kääntäjän tilalla.
- Käytä [`React.createElement()`](/apis/createelement) funktiota, jolla on erityinen rakenne selitettynä alla.

JSX:llä kirjoittaisit komponentin seuraavasti:

```jsx
function Hello(props) {
  return <div>Hello {props.toWhat}</div>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Hello toWhat="World" />, );
```

`React.createElement()` funktiolla kirjoittaisit sen seuraavasti:

```js
function Hello(props) {
  return React.createElement('div', null, 'Hello ', props.toWhat);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  React.createElement(Hello, { toWhat: 'World' }, null)
);
```

Se hyväksyy kolme argumenttia: `React.createElement(component, props, ...children)`.

Tässä miten ne toimivat:

1. **component**, joka voi olla merkkijono edustamassa HTML elementtiä tai funktiokomponenttia
2. Olio mistä vain [**propseista**, joita haluat välittää](/learn/passing-props-to-a-component)
3. Loput ovat **lapsia**, joita komponentilla saattaa olla, kuten merkkijonoja tai muita elementtejä

Jos tylsistyt kirjoittamaan `React.createElement()`, yksi yleinen tapa on asettaa sille lyhenne:

```js
const e = React.createElement;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e('div', null, 'Hello World'));
```

Jos tykkät käyttää tätä tyyliä, voi olla yhtä kätevää käyttää JSX:ää.

</DeepDive>
