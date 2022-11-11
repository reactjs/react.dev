---
title: Merkintäkoodin kirjoittaminen JSX:llä
---

<Intro>

*JSX* on lisäsyntaksi JavaScriptille, jonka avulla voit kirjoittaa HTML:n tyylistä merkintäkoodia JavaScript tiedoston sisällä. Vaikka on muita tapoja kirjoittaa komponentteja, useimmat React kehittäjät pitävät JSX:n tiiviydestä ja iso osa koodipohjista käyttää sitä.

</Intro>

<YouWillLearn>

* Miksi React sekoittaa merkintäkoodia ja renderöintilogiikkaa
* Miten JSX poikeeaan HTML:stä
* Miten dataa voidaan näyttää JSX:llä

</YouWillLearn>

## JSX: Laitetaan merkintäkoodi JavaScriptiin {/*jsx-putting-markup-into-javascript*/}

Verkkosivut on rakennettu HTML:n, CSS:n ja JavaScriptin varaan. Monien vuosien ajan web-kehittäjät pitivät sisällön HTML:ssä, suunnittelun CSS:ssä ja logiikan JavaScriptissä - usein erillisissä tiedostoissa! Sisältö merkittiin HTML:ään, kun taas sivun logiikka oli erikseen JavaScriptissä:

<DiagramGroup>

<Diagram name="writing_jsx_html" height={237} width={325} alt="HTML-merkki, jossa on violetti tausta ja div, jossa on kaksi alatunnistetta: p ja form.">

HTML

</Diagram>

<Diagram name="writing_jsx_js" height={237} width={325} alt="Kolme JavaScript-käsittelijää keltaisella taustalla: isLoggedIn, onClick ja onSubmit.">

JavaScript

</Diagram>

</DiagramGroup>

Mutta kun verkkosivuista tuli interaktiivisempia, logiikka enimmäkseen määräsi sisällön.  JavaScript vastasi HTML:stä! Tästä syystä **Reactissa renderointilogiikka ja merkintä asuvat yhdessä samassa paikassa - komponenteissa**.

<DiagramGroup>

<Diagram name="writing_jsx_sidebar" height={330} width={325} alt="React komponentti, jossa on HTML- ja JavaScript koodia aiemmasta esimerkistä sekoitettuna. Funktion nimi on Sidebar, joka kutsuu isLoggedIn funktiota, korostettuna keltaisella. Sisennettynä ja violetilla korostettuna funktiossa on p tagi edellisestä esimerkistä ja Form tagi, joka viittaa komponenttiin seuraavassa kaaviossa.">

`Sidebar.js` React komponentti

</Diagram>

<Diagram name="writing_jsx_form" height={330} width={325} alt="React komponentti, jossa on HTML- ja JavaScript koodia edellisistä esimerkeistä sekoitettuna. Funktion nimi on Form, joka sisältää kaksi tapahtumakäsittelijää, onClick ja onSubmit korostettuna keltaisella. Tapahtumakäsittelijöiden jälkeen on HTML korostettuna violetilla. HTML sisältää lomakkeen ja syöttöelementin sisennettynä, kullakin elementillä onClick propsi.">

`Form.js` React komponentti

</Diagram>

</DiagramGroup>

Pitämällä painikkeen renderointilogiikka ja merkintäkoodi yhdessä voidaan varmistua siitä, että ne pysyvät synkronoituina keskenään jokaisen muokkauksen yhteydessä. Toisiinsa liittymättömät yksityiskohdat, kuten painikkeen ja sivupalkin merkintäkoodi on erillään toisistaan, tehden molempien muuttamisesta yksinään turvallisempaa.

Jokainen React komponentti on JavaScript funktio, joka saattaa sisältää merkintäkoodia, jonka React renderöi selaimeen. React komponentit käyttävät syntaksilisäosaa nimeltään JSX edustamaan merkintäkieltä. JSX näyttää lähes samalta kuin HTML, mutta se on hieman tiukempaa ja voi näyttää dynaamista sisältöä. Parhain tapa ymmärtää tämä on kääntää vähän HTML koodia JSX:ksi.

<Note>

JSX ja React ovat kaksi eri asiaa. Niitä usein käytetään yhdessä, mutta *voit* [käyttää niitä itsenäisesti](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform) toisistaan. JSX on syntaksilisä, kun taas React on JavaScript kirjasto.

</Note>

## Muunnetaan HTML koodi JSX koodiksi {/*converting-html-to-jsx*/}

Oletataan, että sinulla on vähän (täysin validia) HTML:ää.

```html
<h1>Hedy Lamarrin tehtävälista</h1>
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  class="photo"
>
<ul>
    <li>Keksi uusi liikennevalo
    <li>Harjoittele elokuvakohtausta
    <li>Paranna spektritekniikkaa
</ul>
```

Ja haluat laittaa sen komponenttiisi:

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

Jos kopioit ja liität sen sellaisenaan, se ei toimi:


<Sandpack>

```js
export default function TodoList() {
  return (
    // Tämä ei ihan toimi
    <h1>Hedy Lamarrin tehtävälista</h1>
    <img 
      src="https://i.imgur.com/yXOvdOSs.jpg" 
      alt="Hedy Lamarr" 
      class="photo"
    >
    <ul>
        <li>Keksi uusi liikennevalo
        <li>Harjoittele elokuvakohtausta
        <li>Paranna spektritekniikkaa
    </ul>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

Tämä tapahtuu siksi, koska JSX on tiukempaa ja siinä on muutama sääntö enemmän kuin HTML:ssä. Jos luet virheviestin yllä, se ohjeistaa korjaamaan merkintäkoodin tai voit seurata ohjetta alla.

<Note>

Usein Reactin virheviestit auttavat sinua löytämään missä ongelma on. Kannattaa lukea niitä, jos jäät jumiin!

</Note>

## JSX koodin säännöt {/*the-rules-of-jsx*/}

### 1. Palauta yksi juurielementti {/*1-return-a-single-root-element*/}

Palauttaaksesi useita elementtejä komponentista, **kääri ne yhden tagin sisään.**

Esimerkiksi, voit käyttää `<div>`:

```js {1,11}
<div>
  <h1>Hedy Lamarrin tehtävälista</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</div>
```

Jos et halua lisätä ylimääräistä `<div>` tagia merkintäkoodiisi, voit kirjotitaa `<>` ja `</>` sen sijaan:

```js {1,11}
<>
  <h1>Hedy Lamarrin tehtävälista</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

Tätä tyhjää tagia kutsutaan *[Fragmentiksi.](/apis/react/Fragment)* Fragmenttien avulla voit ryhmittää asioita jättämättä jälkiä selaimen HTML puuhun.

<DeepDive title="Miksi useat JSX tagit täytyy kääriä?">

JSX näyttää samalta kuin HTML, mutta pellin alla se muunnetaan tavallisiksi JavaScript-olioiksi. Et voi palauttaa kahta oliota funktiosta käärimättä niitä taulukkoon. Tämä selittää miksi et voi palauttaa kahta JSX tagia käärimättä niitä yhteen tagiin tai Fragmenttiin.

</DeepDive>

### 2. Sulje kaikki tagit {/*2-close-all-the-tags*/}

JSX edellyttää tagien eksplisiittistä sulkemista: itsestään sulkeutuvat tagit, kuten `<img>` täytyy muuttua `<img />` muotoon, ja tagit kuten `<li>oranges` täytyy kirjoittaa `<li>oranges</li>` muodossa.

Tältä näyttää Hedy Lamarrin kuva ja listan kohteet suljettuina:

```js {2-6,8-10}
<>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
   />
  <ul>
    <li>Keksi uusi liikennevalo</li>
    <li>Harjoittele elokuvakohtausta</li>
    <li>Paranna spektritekniikkaa</li>
  </ul>
</>
```

### 3. camelCase:a <s>kaikki</s> useimmat asiat! {/*3-camelcase-salls-most-of-the-things*/}

JSX muuttuu JavaScriptiksi ja attribuutit kirjoitettuna JSX:ssä muuttuvat JavaScript olioiden avaimiksi. Komponenteissasi saatat useasti haluta lukea nuo attribuutit muuttujiin. Mutta JavaScriptissa on omia rajoitteitaan muuttujien nimeämisessä. Esimerkiksi, nimet eivät voi sisältää viivoja tai varattuja sanoja kuten `class`.

Tämän takia Reactissa monet HTML ja SVG attribuutit kirjoitetaan camelCase muodossa. Esimerkiksi, sen sijaan, että kirjoittaisit `stroke-width` käytät `strokeWidth`. Kerta `class` on varattu sana, Reactissa kirjoitat `className`, joka on nimetty [vastaavan DOM ominaisuuden](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) mukaan:

```js {4}
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  className="photo"
/>
```

Voit [löytää kaikki nämä attribuutit Reactin DOM Elementseistä.](TODO) Jos muistat jonkun väärin, älä huoli. React viestii mahdollisia korjauksia [selaimen konsoliin.](https://developer.mozilla.org/docs/Tools/Browser_Console)

<Pitfall>

Historiallisista syistä, [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) sekä [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) attribuutit kirjoitetaan kuten HTML:ssä, viivoilla.

</Pitfall>

### Pro-tip: Käytä JSX muunninta {/*pro-tip-use-a-jsx-converter*/}

Kaikkien näiden attribuuttien muuttaminen olemassa olevassa merkintäkoodissa on työlästä! Suosittelemme käyttämään [muunninta](https://transform.tools/html-to-jsx) kääntääksesi olemassa olevan HTML:n ja SVG:n JSX:ksi. Muuntimet ovat käteviä käytännössä, mutta on silti kannattavaa ymmärtää mitä tapahtuu, jotta voit viihtyisästi kirjoittaa itse JSX:ää.

Tässä lopullinen tulos:

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarrin tehtävälistä</h1>
      <img 
        src="https://i.imgur.com/yXOvdOSs.jpg" 
        alt="Hedy Lamarr" 
        className="photo" 
      />
      <ul>
        <li>Keksi uusi liikennevalo</li>
        <li>Harjoittele elokuvakohtausta</li>
        <li>Paranna spektritekniikkaa</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

<Recap>

Nyt tiedät miksi JSX on olemssa ja miten sitä käytetään komponenteissa:

* React komponentit ryhmittää renderöintilogiikan merkintäkoodin kanssa, sillä ne liittyvät toisiinsa.
* JSX on samanlaista kuin HTML, muutamin poikkeuksin. Voit käyttää [muunninsta](https://transform.tools/html-to-jsx) jos tarvitset.
* Virheviestit usein ohjeistavat oikeaan suuntaan merkintäkoodin korjaamiseksi.

</Recap>



<Challenges>

#### Muunna vähän HTML koodia JSX koodiksi {/*convert-some-html-to-jsx*/}

Tämä HTML liitettiin komponenttiin, mutta se ei ole validia JSX:ää. Korjaa se:

<Sandpack>

```js
export default function Bio() {
  return (
    <div class="intro">
      <h1>Tervetuloa verkkosivuilleni!</h1>
    </div>
    <p class="summary">
      Löydät ajatukseni täältä.
      <br><br>
      <b>Ja <i>kuvia</b></i> tutkijoista!
    </p>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

On oma päätöksesi käytätkö muunninta tai teetkö muunnoksen käsin!

<Solution>

<Sandpack>

```js
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>Tervetuloa verkkosivuilleni!</h1>
      </div>
      <p className="summary">
        Löydät ajatukseni täältä.
        <br /><br />
        <b>Ja <i>kuvia</i></b> tutkijoista!
      </p>
    </div>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

</Solution>

</Challenges>
