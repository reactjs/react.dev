---
title: Lisää React verkkosivulle
---

<Intro>

React on suunniteltu alusta asti asteittaiseen käyttöönottoon sekä voit käyttää niin vähän tai paljon Reactia kuin tarvitset. Mikäli työskentelet micro-käyttöliittymien, olemassaolevien järjestelmien, tai vain kokeilet Reactin käyttöä, voit lisätä interaktiivisia React komponentteja HTML sivuun vain muutamalla rivillä koodia-ilman kehitysympäristöä.

</Intro>

## Lisää React minuutissa {/*add-react-in-one-minute*/}

Voit lisätä React komponentin olemassa olevaan HTML sivuun alle minuutissa. Kokeile tätä omalla verkkosivullasi tai [tyhjällä HTML tiedostolla](https://gist.github.com/rachelnabors/7b33305bf33776354797a2e3c1445186/archive/859eac2f7079c9e1f0a6eb818a9684a464064d80.zip)—tarvitset vain internet-yhteyden sekä tekstieditorin kuten Notepadin (tai VSCode—lue ohjeemme [oman editorin määrittelystä](/learn/editor-setup/))!

### Vaihe 1: Lisää elementti HTML koodiin {/*step-1-add-an-element-to-the-html*/}

HTML sivuun, jota haluat muokata, lisää tyhjä HTML elementti kuten tyhjä `<div>` tagi uniikilla `id` attribuutilla merkitäksesi kohdan johon haluat tulostaa jotain Reactilla.

Voit asettaa "container" elementin kuten tämän `<div>` tagin minne tahansa `<body>` tagien sisällä. React korvaa HTML elementtien välisen sisällön, joten useimmiten se on tyhjä. Sinulla voi olla niin monta HTML elementtiä yhdellä sivulla kuin tarvitset.

```html {3}
<!-- ... olemassa oleva HTML ... -->

<div id="komponentti-tulee-tähän"></div>

<!-- ... olemassa oleva HTML ... -->
```

### Vaihe 2: Lisää script -tagit {/*step-2-add-the-script-tags*/}

Lisää kolme `<script>` tagia seuraaviin tiedostoihin HTML sivussa juuri ennen sulkevaa `</body>` tagia:

- [**react.development.js**](https://unpkg.com/react@18/umd/react.development.js) lataa Reactin ytimen
- [**react-dom.development.js**](https://unpkg.com/react-dom@18/umd/react-dom.development.js) mahdollistaa Reactin renderöinnin [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model)iin.
- **like_button.js** johon tulet kirjoittamaan komponenttisi seuraavassa vaiheessa!

<Gotcha>

Kun siirrytään tuotantoon, korvaa "development.js" sanalla "production.min.js".

</Gotcha>

```html
  <!-- sivun loppu -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="like_button.js"></script>
</body>
```

### Vaihe 3: Luo React komponentti {/*step-3-create-a-react-component*/}

Luo tiedosto nimeltään **like_button.js** HTML sivun viereen, lisää tämä koodinpätkä ja tallenna tiedosto. Tämä koodi määrittää React komponentin nimeltään `LikeButton`. [Voit oppia komponettien luomisesta oppassamme.](/learn/your-first-component)

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

### Vaihe 4: Lisää React komponenttisi sivuun {/*step-4-add-your-react-component-to-the-page*/}

Viimeiseksi, lisää kolme riviä koodia **like_button.js** tiedoston pohjaan. Nämä kolme riviä koodia etsivät `<div>` tagin, jonka lisäsit HTML tiedostoon ensimmäisessä vaiheessa, luo React -sovelluksen, ja näyttää sitten "Like" painikkeen React komponentin sen sisällä.

```js
const domContainer = document.getElementById('komponentti-tulee-tähän');
const root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(LikeButton));
```

**Onnittelut! Juuri renderöit ensimmäisen React komponentin verkkosivullasi!**

- [Näytä esimerkin koko lähdekoodi](https://gist.github.com/rachelnabors/c64b3aeace8a191cf5ea6fb5202e66c9)
- [Lataa koko esimerkki (2KT zip)](https://gist.github.com/rachelnabors/c64b3aeace8a191cf5ea6fb5202e66c9/archive/7b41a88cb1027c9b5d8c6aff5212ecd3d0493504.zip)

#### Voit uudelleenkäyttää komponentteja! {/*you-can-reuse-components*/}

Saatat haluta näyttää React komponentin useissa eri paikoissa samalla HTML sivulla. Tämä on hyödyllisintä, kun sivun React-käyttöiset osat on eristetty toisistaan. Voit tehdä tämän kutsumalla `ReactDOM.createRoot()` funktiota useampia kertoja useilla "container" elementeillä.

1. **index.html** tiedostossa, lisää uusi container elementti `<div id="komponentti-tulee-tähän-myös"></div>`.
2. **like_button.js** tiedostossa, lisää uusi `ReactDOM.render()` uudelle container elementille:

```js {6,7,8,9}
const root1 = ReactDOM.createRoot(
  document.getElementById('komponentti-tulee-tähän')
);
root1.render(React.createElement(LikeButton));

const root2 = ReactDOM.createRoot(
  document.getElementById('komponentti-tulee-tähän-myös')
);
root2.render(React.createElement(LikeButton));
```

Katso [esimerkki, joka näyttää "Like" painikkeen kolmesti ja antaa dataa sille](https://gist.github.com/rachelnabors/c0ea05cc33fbe75ad9bbf78e9044d7f8)!

### Vaihe 5: Pienennä JavaScript tuotantoa varten {/*step-5-minify-javascript-for-production*/}

Pienentämätön JavaScript voi merkittävästi hidastaa verkkosivun latausaikoja käyttäjillesi. Ennen verkkosivun siirtämistä tuotantoon, on hyvä idea pienentää eli minifioida script -tiedostot.

- **Jos sinulla ei ole minifiointi-vaihetta** koodeillesi, [täältä löydät yhden tavan asentaa sen](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3).
- **Jos jo minifioit** sovelluksesi koodit, sivusi on tuotantovalmis mikäli varmistat, että tuotantoon siirrettävä HTML koodi lataa versiot Reactista, jotka loppuvat `production.min.js` päätteellä, kuten:

```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
```

## Kokeile Reactia JSX:llä {/*try-react-with-jsx*/}

Esimerkit yllä riippuvat ominaisuuksista, jotka ovat natiivisti tuettuja selaimissa. Tämä on syy miksi **like_button.js** käyttää JavaScript funktiokutsua kertoakseen Reactille mitä näyttää:

```js
return React.createElement('button', {onClick: () => setLiked(true)}, 'Like');
```

Kuitenkin, React tarjoaa myös vaihtoehdon käyttää HTML-tyylistä JavaScript syntaksia nimeltään [JSX](/learn/writing-markup-with-jsx). Esimerkiksi:

```jsx
return <button onClick={() => setLiked(true)}>Like</button>;
```

Nämä kaksi koodinpätkää vastaavat toisiaan. JSX on suosittu syntaksi määrittelemään merkintää JavaScriptissa. Useat kokevat sen tutuksi ja helppokäyttöiseksi käyttöliittymäkoodin kirjoittamiseen--joko Reactin kanssa tai muiden kirjastojen. Saatat nähdä "merkintäkoodia ripoteltuna ympäri JavaScript koodiasi" muissa projekteissa!

> Voit kokeilla muuttaa HTML merkintäkoodia JSX koodiksi käyttämällä [tätä verkkomuunninta](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.17).

### Kokeile JSX:ää {/*try-jsx*/}

Nopein tapa kokeilla JSX:ää projektissasi on lisätä Babel -kääntäjä sivusi `<head>` tagien sisälle Reactin sekä ReactDOMin kanssa, kuten:

```html {6}
<!-- ... loput <head> elementistä ... -->

<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>

<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>

</head>
<!-- ... loput <body> elementistä ... -->
```

Nyt voit käyttää JSX merkintäkieltä missä tahansa `<script>` tageissa lisäämällä `type="text/babel"` attribuutin siihen. Esimerkiksi: 

```jsx {1}
<script type="text/babel">
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<h1>Hello, world!</h1>);
</script>
```

Muuttaaksesi **like_button.js** tiedoston käyttämään JSX:ää:

1. **like_button.js** tiedostossa, korvaa

```js
return React.createElement(
  'button',
  {
    onClick: () => setLiked(true),
  },
  'Like'
);
```

seuraavalla:

```jsx
return <button onClick={() => setLiked(true)}>Like</button>;
```

1. **index.html** tiedostossa, lisää `type="text/babel"` like -painikkeen script -tagiin:

```html
<script src="like_button.js" type="text/babel"></script>
```

Tässä on [esimerkki HTML tiedostosta JSX:n kanssa](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html), jonka voit ladata itsellesi ja leikkiä sen kanssa.


Tämä lähestymistapa on hyvä oppimiseen ja yksinkertaisiin demoihin. Kuitenkin, se tekee sivustasi hintaan ja **ei ole sopiva tuotantoon**. Kun olet valmis siirtymään eteenpäin, poista tämä uusi `<script>` tagi ja `type="text/babel"` attribuutti, jonka lisäsit. Sen sijaan seuraavassa vaiheessa tulet asentamaan JSX esikääntäjän muuntamaan kaikki `<script>` tagisi automaattisesti. 

### Lisää JSX projektiin {/*add-jsx-to-a-project*/}

JSX:n lisääminen projektiin ei vaadi monimutkaisia työkaluja kuten [bundleria](/learn/start-a-new-react-project#custom-toolchains) tai kehityspalvelinta. JSX esikääntäjän lisääminen on lähes samanlaista kuin CSS esikääntän lisääminen.

Siirry projektisi hakemistoon terminaalissa ja liitä nämä kaksi kometoa (**Varmista, että sinulla on [Node.js](https://nodejs.org/) asennettuna!**):

1. `npm init -y` (mikäli epäonnistuu, [täällä on ratkaisu](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. `npm install babel-cli@6 babel-preset-react-app@3`

Tarvitset vain npm:n asentaaksesi JSX esikääntäjän. Et tarvitse sitä mihinkään muuhun. Sekä React että sovelluskoodisi voi pysyä `<script>` tageina ilman muutoksia.

Onnittelut! Lisäsit juuri **tuotantovalmiin JSX ympäristön** projektiisi.

### Suorita JSX esikääntäjä {/*run-the-jsx-preprocessor*/}

Voit esikääntää JSX koodin siten, että joka kerta kun tallennat tiedoston, jossa on JSX -koodia, muunnin suoritetaan uudelleen, kääntääkseen JSX tiedoston pelkäksi JavaScript tiedostoksi.

1. Luo kansio nimeltään **src**
2. Terminaalissa, suorita komento: `npx babel --watch src --out-dir . --presets react-app/prod ` (Älä odota sen valmistumista! Tämä komento aloittaa automaattisen tarkkailijan JSX koodillesi.)
3. Siirrä JSX koodiksi muunnettu **like_button.js** uuteen **src** hakemistoon (tai luo **like_button.js** tiedosto, joka sisältää tämän [JSX aloituskoodin](https://gist.githubusercontent.com/rachelnabors/ffbc9a0e33665a58d4cfdd1676f05453/raw/652003ff54d2dab8a1a1e5cb3bb1e28ff207c1a6/like_button.js))

Tarkkailija luo uuden esikäännetyn **like_button.js** tiedoston, joka sisältää selaimelle sopivaa pelkää JavaScript koodia.

<Gotcha>

Jos törmäät virheeseen "You have mistakenly installed the `babel` package", saatoit vahingossa unohtaa [aikaisemman vaiheen](#add-jsx-to-a-project). Tee se samassa hakemistossa ja yritä uudelleen.

</Gotcha>

Bonuksena, tämä antaa sinun käyttää modernin JavaScript syntaksin ominaisuuksia kuten luokkia murehtimatta vanhojen selaiten tukevuutta. Työkalu, jota juuri käytimme on nimeltään Babel, ja voit lukea lisää siitä [sen dokumentaatiosta](https://babeljs.io/docs/en/babel-cli/).

Jos viihdyt kehitystyökalujen kanssa ja haluat niiden tekevän enemmän, [käsittelemme joitain suosituimmista ja helposti lähestyttävistä työkalupakeista täällä](/learn/start-a-new-react-project).

<DeepDive title="React ilman JSX:ää">

Alun perin JSX esiteltiin, jotta Reactilla kirjoittavat komponentit tuntuvat yhtä tutuilta kuin HTML:n kirjoittaminen. Sittemmin syntaksi on yleistynyt. Kuitenkin, on tilanteita joissa et välttämättä halua tai voi käyttää JSX:ää. Sinulla on kaksi vaihtoehtoa:

- Käytä vaihtoehtoista JSX:ää kuten [htm](https://github.com/developit/htm), joka ei käytä kääntäjää—se käyttää JavaScriptin natiiveja Tagged Templateja.
- Käytä [`React.createElement()`](/apis/createelement) funktiota, jolla on erityinen rakene selitettynä alla.

JSX:llä kirjoittaisit komponentin seuraavasti:

```jsx
function Hello(props) {
  return <div>Hello {props.toWhat}</div>;
}

ReactDOM.render(<Hello toWhat="World" />, document.getElementById('root'));
```

`React.createElement()` funktiolla kirjoittaisit sen seuraavasti:

```js
function Hello(props) {
  return React.createElement('div', null, `Hello ${props.toWhat}`);
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

Se hyväksyy kolme argumenttia: `React.createElement(component, props, children)`. Tässä miten ne toimivat:

1. **component**, joka voi olla merkkijono edustamassa HTML elementtiä tai funktiokomponenttia
2. Olio mistä vain [**propseista**, joita haluat välittää](/learn/passing-props-to-a-component)
3. Olio mistä vain **lapsista**, joita komponentilla saattaa olla, kuten merkkijonoja

Jos tylsistyt kirjoittamaan `React.createElement()`, yksi yleinen tapa on asettaa sille lyhenne:

```js
const e = React.createElement;

ReactDOM.render(e('div', null, 'Hello World'), document.getElementById('root'));
```

Jos käytät tätä lyhennettä `React.createElement()` funktiosta, voi olla jopa melkein yhtä kätevää käyttää Reactia ilman JSX:ää.

</DeepDive>
