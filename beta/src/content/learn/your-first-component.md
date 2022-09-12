---
title: Ensimmäinen komponenttisi
---

<Intro>

*Komponentit* ovat yksi Reactin ydinkonsepteista. Ne ovat perusta minkä päälle rakennat käyttöliittymiä (UI), mikä tekee niistä täydellisen paikan aloittaa Reactin oppiminen!

</Intro>

<YouWillLearn>

* Mikä on komponentti
* Mikä rooli komponenteilla on React-sovelluksessa
* Miten kirjoittaa ensimmäinen komponenttisi

</YouWillLearn>

## Komponentit: UI:n rakennuspalikoita {/*components-ui-building-blocks*/}

Verkkossa HTML antaa meidän luoda monipuoliset jäsennellyt dokumentit sen sisäänrakennetuilla tageilla kuten `<h1>` ja `<li>`: 

```html
<article>
  <h1>Ensimmäinen komponenttini</h1>
  <ol>
    <li>Komponentit: UI:n rakennuspalikoita</li>
    <li>Komponentin määrittely</li>
    <li>Komponentin käyttäminen</li>
  </ol>
</article>
```

Tämä merkintä edustaa tätä artikkelia `<article>`, sen otsikkoa `<h1>`, ja (lyhennettyä) sisällysluetteloa järjestettynä listana `<ol>`. Tämänkaltainen merkintä yhdistettynä CSS:ään tyylejä varten ja JavaScriptiin vuorovaikutteisuutta varten, löytyy jokaisen sivupalkin, avatarin, modaalilaatikon ja alasvetovalikon takaa—kaikki palaset UI:ta verkossa jota näet. 

Reactilla voit yhdistää merkinnän, CSS ja JavaScriptin mukautetuiksi "komponenteiksi," **uudelleenkäytettäviksi UI elementeiksi sovelluksellesi.** Sisällysluettelon koodi yllä voitaisiin muuttaa `<TableOfContents>` komponentiksi, jota voisit renderöidä jokaisella sivulla. Konepellin alla se käyttää silti samoja HTML tageja, kuten `<article>`, `<h1>`, jne.

Kuten HTML tageilla, voit luoda, järjestää ja upottaa komponentteja koko sivun suunnittelua varten. Esimerkiksi, dokumentaatio jota luet koostuu React komponenteista:

```js
<PageLayout>
  <NavigationHeader>
    <SearchBar />
    <Link to="/docs">Docs</Link>
  </NavigationHeader>
  <Sidebar />
  <PageContent>
    <TableOfContents />
    <DocumentationText />
  </PageContent>
</PageLayout>
```

Kun sovelluksesi kasvaa huomaat, että suuri osa malleista voidaan luoda uudelleenkäyttämällä komponentteja joita olet jo kirjoittanut, nopeuttaen kehitystä. Yllä oleva sisällysluettelo voitaisiin lisätä mille tahansa ruudulle kirjoittamalla `<TableOfContents>`! Voit aloittaa projektisi nopeasti Reactin avoimen lähdekoodin yhteisön jakamien tuhansien komponenttien avulla, kuten [Chakra UI](https://chakra-ui.com/):lla ja [Material UI:lla.](https://material-ui.com/)

## Komponentin määrittely {/*defining-a-component*/}

Perinteisesti verkkosivuja luodessa kehittäjät lisäsivät merkintäkoodia sisältöön ja sitten lisäsivät toiminnallisuutta ripottelemalla vähän JavaScriptia. Tämä toimi hyvin kun toiminnot olivat mukavuustekijöitä verkossa. Nyt sitä odotetaan monilta sivuilta ja kaikilta sovelluksilta. React laittaa interaktiivisuuden ensiksi käyttäen silti samaa teknologiaa: **React komponentti on JavaScript funktio, jota voit _ripotella merkintäkoodilla_**. Tässä miltä se näyttää (voit muokata esimerkkiä alla):

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}
```

```css
img { height: 200px; }
```

</Sandpack>

Ja tässä miten rakennat komponentin:

### 1. Vaihe: Exporttaa komponentti {/*step-1-export-the-component*/}

`export default` etuliite on [vakio JavaScript syntaksi](https://developer.mozilla.org/docs/web/javascript/reference/statements/export) (ei erityisesti Reactille). Sillä voit merkitä pääfunktion tiedostossa, jotta voit myöhemmin importata sen muista tiedostoista. (Lisää importtaamisesta [Komponenttien importtaus ja exporttaus](/learn/importing-and-exporting-components) -sivulta!)

### 2. Vaihe: Määritä funktio {/*step-2-define-the-function*/}

Käyttämällä `function Profile() { }` määrität JavaScript funktion nimeltään `Profile`..

<Gotcha>

React komponentit ovat tavallisia JavaScript funktioita, mutta **niiden nimien on alettava isolla alkukirjaimella** tai ne eivät toimi!

</Gotcha>

### 3. Vaihe: Lisää merkintäkoodia {/*step-3-add-markup*/}

Komponentti palauttaa `<img />` tagin `src` ja `alt` attribuuteilla. `<img /> on kirjoitettu kuten HTML:ssä, mutta se on oikeasti JavaScriptia konepellin alla! Tätä syntaksia kutsutaan nimeltään [JSX](/learn/writing-markup-with-jsx), ja sillä voit upottaa merkintäkoodia JavaScriptissa.

Palautuslause voidaan kirjoittaa yhdellä rivillä, kuten tässä komponentissa:

```js
return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
```

Mutta jos merkintäkoodisi ei ole samalla kuin `return` avainsana, täytyy koodi kääriä sulkujen sisään, kuten tässä:

```js
return (
  <div>
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

<Gotcha>

Ilman sulkuja, kaikki koodi `return` avainsanan jälkeen [jätetään huomiotta](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)!

</Gotcha>

## Komponentin käyttäminen {/*using-a-component*/}

Nyt kun olet määritellyt `Profile` komponentin, voit upottaa sen toisten komponenttien sisään. Esimerkiksi voit exportata `Gallery` komponentin, joka käyttää useampia `Profile` komponentteja:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

### Mitä selain näkee {/*what-the-browser-sees*/}

Huomaa kirjainkokojen ero:

* `<section>` on pienin kirjaimin, joten React tietää viittaamme HTML tagiin.
* `<Profile />` alkaa isolla `P` kirjaimella, joten React tietää, että haluamme käyttää omaa komponenttiaan nimeltään `Profile`.

Ja `Profile` sisältää vielä enemmän HTML koodia: `<img />`. Lopuksi selain näkee seuraavaa:

```html
<section>
  <h1>Amazing scientists</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

### Komponenttien upottaminen ja järjestäminen {/*nesting-and-organizing-components*/}

Komponentit ovat tavallisia JavaScript funktioita, joten voit pitää useita komponentteja samassa tiedostossa. Tämä on hyödyllistä kun komponentit ovat suhteellisen pieniä tai liitttyvät tiiviisti toisiinsa. Jos tämä tiedosto kasvaa suureksi, voit aina siirtää `Profile` komponentin eri tiedostoon. Tulet oppimaan miten tämän voi tehdä [sivulla importeista.](/learn/importing-and-exporting-components).

Sillä `Profile` komponentit renderöidään `Gallery` komponentin sisällä-jopa useita kertoa!-voimme sanoa, että `Gallery` on kuin **pääkomponentti,** joka renderöi jokaisen `Profile`:n "lapsena". Tämä on osa Reactin taikaa: voit määritellä komponentin kerran ja käyttää sitä niin monessa paikassa ja niin monta kertaa kuin haluat.

<DeepDive title="Komponentteja loppuun asti">

React sovelluksesi alkaa "juurikomponentista". Useimmiten se luodaan automaattisesti kun aloitat uuden projektin. Esimerkiksi, jos käytät [CodeSandbox](https://codesandbox.io/):ia tai [Create React App](https://create-react-app.dev/):ia, juurikomponentti määritellään `src/App.js` tiedostossa. Jos käytät [Next.js](https://nextjs.org/) ohjelmistokehystä, juurikomponentti on määritelty `pages/index.js` tiedostossa. Näissä esimerkissä olet exportannut juurikomponentteja.

Useimmat React sovellukset käyttävät komponentteja loppuun asti. Tämä tarkoittaa, että et ainoastaan käytä komponentteja uudelleenkäytettäviin palasiin kuten painikkeisiin, mutta myös suurempiin paloihin kuten sivuplakkeihin, listoihin ja lopulta kokonaisiin sivuihin! Komponentit ovat näppärä tapa järjestää merkintä- ja UI-koodia vaikka joitain käytettäisiin vain kerran.

Ohelmistokehykset kuten Next.js vievät tämän askeleen eteenpäin. Sen sijaan, että käyttäisit tyhjää HTML tiedostoa ja annat Reactin "ottaa sivu haltuun" halliten sivua JavaScriptilla, ne **myös* generoivat HTML:n autoaattisesti React komponenteistasi. Tämä mahdollistaa sovelluksesi näyttämään sisältöä enne kuin JavaScript koodi on latautunut.

Kuitenkin monet verkkosivut käyttävät Reactia [lisätäkseen "ripausta interkatiivisuutta".](/learn/add-react-to-a-website) Niillä on useita juurikomponentteja yhden sijasta koko verkkosivulle. Voit käyttää niin paljon tai niin vähän Reactia kuin tarvitset.

</DeepDive>

<Recap>

Olet nyt saanut ensimakua Reactista! Kerrataanpa muutamia keskeisiä kohtia.

* Reactilla voit luoda komponentteja, **uudelleenkäytettäviä UI elementtejä sovelluksellesi.**
* React-sovelluksessa, jokainen pala käyttöliittymää on komponentti.
* React komponentit ovat tavallisia JavaScript funktioita, paitsi:

  1. Niiden nimien on alettava isolla alkukirjaimella.
  2. Ne palauttavat JSX merkintäkoodia.

</Recap>



<Challenges>

### Exporttaa komponentti {/*export-the-component*/}

Tämä hiekkalaatikko ei toimi, koska juurikomponenttia ei ole exportattu:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

Kokeile korjata se itse ennen kuin katsot ratkaisua!

<Solution>

Lisää `export default` ennen funktion määrittämistä, tällä tavalla:

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

Saatat miettiä miksi pelkän `export` sanan kirjoittaminen yksinään ei riitä esimerkissä olevan ongelman korjaamiseksi. Voit oppia `export` ja `export default`:n eron lukemalla sivun [Importing and Exporting Components.](/learn/importing-and-exporting-components)

</Solution>

### Korjaa palautuslause {/*fix-the-return-statement*/}

Jokin ei nyt ole oiken tässä `return` lauseessa. Voitko korjata sen?

<Hint>

Saatat saada "Unexpected token" virheen tätä virhettä ratkaistaessa. Tässä tapauksessa tarkista, että puolipiste tulee sulkevan sulkeen *jälkeen*. Jättämällä puolipisten `return ( )`:n sisään tuottaa virheen.

</Hint>


<Sandpack>

```js
export default function Profile() {
  return
    <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

<Solution>

Voit ratkaista tämän komponentin siirtämällä palautuslauseen yhdelle riville seuraavasti:

<Sandpack>

```js
export default function Profile() {
  return <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

Tai käärimällä palautetun JSX merkintäkoodin sulkeisiin, jotka aukeavat `return` sanan jälkeen:

<Sandpack>

```js
export default function Profile() {
  return (
    <img 
      src="https://i.imgur.com/jA8hHMpm.jpg" 
      alt="Katsuko Saruhashi" 
    />
  );
}
```

```css
img { height: 180px; }
```

</Sandpack>

</Solution>

### Löydä virhe {/*spot-the-mistake*/}

Jokin on pielessä miten `Profile` komponetti on määritelty ja käytetty. Tunnistatko virheen? (Yritä muistaa miten React erottelee komponentit tavallisista HTML tageista!)

<Sandpack>

```js
function profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <profile />
      <profile />
      <profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<Solution>

React komponenttien nimien on alettava isolla alkukirjaimella.

Muuta `function profile()` lukemaan `function Profile()`, ja sitten muuta jokainen `<profile />` lukemaan `<Profile />`:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

</Solution>

### Oma komponenttisi {/*your-own-component*/}

Kirjoita komponentti alusta alkaen. Voit antaa sille minkä tahansa laillisen nimen ja palauttaa mitä merkintäkoodia haluat. Jos ideat loppuvat, voit kirjoittaa `OnneksiOlkoon` komponentin, joka näyttää `<h1>Hyvää työtä!</h1>`. Älä unohda exportata sitä!

<Sandpack>

```js
// Kirjoita oma komponenttisi alle!

```

</Sandpack>

<Solution>

<Sandpack>

```js
export default function OnneksiOlkoon() {
  return (
    <h1>Hyvää työtä!</h1>
  );
}
```

</Sandpack>

</Solution>

</Challenges>