---
title: Komponenttien importtaus ja exporttaus
---

<Intro>

Komponenttien taika perustuu niiden uudelleenkäytettävyyteen: voit luoda komponentteja, jotka koostuvat toisista komponenteista. Mutta kun upotat enemmän ja enemmän komponentteja, on usein järkevää hajottaa niitä eri tiedostoihin. Näin voit pitää tiedostot helppolukuisina ja uudelleenkäyttää komponentteja useammissa paikoissa.

</Intro>

<YouWillLearn>

* Mikä juurikomponenttitiedosto on
* Miten importata ja exportata komponentti
* Milloin käyttää default exportteja sekä nimettyjä importteja ja exportteja
* Miten importata ja exportata useita komponentteja yhdestä tiedostosta
* Miten hajottaa komponentti useisiin tiedostoihin

</YouWillLearn>

## Juurikomponenttitiedosto {/*the-root-component-file*/}

[Ensimmäinen komponenttisi](/learn/your-first-component) -sivulla teit `Profile` komponentin sekä `Gallery` komponentin joka renderöi sen:

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

Tässä esimerkissä nämä löytyvät **juurikomponenttitiedostosta** nimeltään `App.js`. [Create React App](https://create-react-app.dev/):ssa sovelluksesi elää `src/App.js` tiedostossa. Riippuen asennuksestasi, juurikomponenttisi saattaa olla toisessa tiedostossa. Jos käytät ohkelmistokehystä, jossa on tiedostopohjainen reititys, kuten Next.js, juurikomponenttisi on eri jokaiselle sivulle.

## Komponentin exporttaus ja importtaus {/*exporting-and-importing-a-component*/}

Mitä jos haluat muuttaa laskeutumissivua tulevaisuudessa ja asettaa listan tiedekirjoista siihen? Tai siirtää kaikki profiilit jonnekin muualle? On järkevää siirtää `Gallery` ja `Profile` pois juurikomponentin tiedostosta. Tämä tekee niistä modulaarisempia ja uudelleenkäytettäviä muissa tiedostoissa. Voit siirtää komponentin kolmessa vaiheessa:


1. **Luo** uusi JS tiedosto johon komponentin voi laittaa.
2. **Exporttaa** funktiokomponenttisi tiedostosta (käyttämällä joko [default](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) tai [nimettyjä](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports) exportteja).
3. **Importtaa** se tiedostoon, jossa tulet käyttämään komponenttia (käyttäen vastaavaa tapaa [default](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#importing_defaults) tai [nimettyjen](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module) exporttien importtaukseen).

Tässä sekä `Profile` että `Gallery` on siirretty pois `App.js` tiedostosta uuteen tiedostoon nimeltään `Gallery.js`. Nyt voit muuttaa `App.js` importtaamaan `Gallery` komponentin `Gallery.js` tiedostosta:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js Gallery.js
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
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Huomaa miten tämä esimerkki jakautuu kahteen komponenttitiedostoon:

1. `Gallery.js`:
     - Määrittelee `Profile` komponentin, jota käytetään vain tiedoston sisällä eikä sitä ole exportattu.
     - Exporttaa `Gallery` komponentin **default exporttina**.
2. `App.js`:
     - Importtaa `Gallery`:n **default importtina** `Gallery.js` tiedostosta.
     - Exporttaa juuri `App` komponentin **default exporttina**.


<Note>

Saatat huomata tiedostoja, jotka luopuvat `.js` päätteestä, kuten:

```js 
import Gallery from './Gallery';
```

Molemmat `'./Gallery.js'` tai `'./Gallery'` toimivat Reactin kanssa, kuitenkin ensin mainittu on lähempänä miten [natiivit ES Moduulit](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules) toimivat.

</Note>

<DeepDive title="Default exportit vai nimetyt exportit">

JavaScriptissa on kaksi ensisijaista tapaa exportata arvoja: default exportit ja nimetyt exportit. Tähän mennessä esimerkit ovat käyttäneet ainoastaan default exportteja. Voit kuitenkin käyttää jompaa kumpaa tai molempia samassa tiedostossa. **Tiedostossa voi olla ainoastaan yksi _default_ exportti, mutta sillä voi olla niin monta _nimettyä_ exporttia kuin haluat.**

![Default ja nimetyt exportit](/images/docs/illustrations/i_import-export.svg)

Miten exporttaat komponenttisi määrää miten se täytyy importata. Saat virheen jos yrität importata default exporttia samalla tavalla kuin nimettyä exporttia! Tämän kaavion avulla voit seurata tapoja:

| Syntaksi         | Export-lause                           | Import-lause |
| -----------      | -----------                                | -----------                  |
| Default    | `export default function Button() {}` | `import Button from './button.js';`     |
| Nimetty    | `export function Button() {}`         | `import { Button } from './button.js';` |

Kun kirjoitat _default_ importtia, voit antaa sille minkä tahansa nimen `import`:n jälkeen. Esimerkiksi, voit kirjoittaa `import Banana from './button.js'` ja se silti tarjoaa saman default exportin. Verrattuna nimettyihin importteihin, nimen on vastattava toisiaan molemmin puolin. Siksi niitä kutsutaan _nimetyiksi_ importeiksi!

**Ihmiset usein käyttävät default exportteja jos tiedosto exporttaa ainoastaan yhden komponentin, ja käytävät nimettyjä exportteja jos se exporttaa useita kompoenntteja ja arvoja.** Riippumatta siitä kumpaa koodityyliä suosit, anna aina merkityksellisiä nimiä komponenteillesi ja tiedostoille jotka pitävät niitä sisällään. Komponentin ilman nimiä, kuten `export default () => {}` ei suosita sillä ne tekevät virheenkorjauksesta hankalempaa.

</DeepDive>

## Useiden komponenttien exporttaus ja importtaus samasta tiedostosta {/*exporting-and-importing-multiple-components-from-the-same-file*/}

Mitä jos haluat näyttää vain yhden `Profile`:n gallerian sijaan? Sinun täytyy exportata `Profile` komponentti, myös. Mutta `Gallery.js` tiedostossa on jo *default* exportti, ja sinulla ei voi olla _kahta_ default exporttia. Voit luoda uuden tiedoston, jossa on default exportti, tai voit lisätä *nimetyn exportin* `Profile`:lle. **Tiedosto voi pitää sisällään vain yhden default exportin, mutta se voi sisältää useita nimettyjä exportteja!**

> Vähentääksesi mahdollista sekaannusta default ja nimettyjen exporttien välillä, jotkin tiimit valitsevat pitäytymään yhdessä tavassa (default tai nimetty), tai välttävät niiden yhteiskäyttöä yhdessä tiedostossa. Tämä on mieltymyskysymys. Käytä sitä mikä toimii parhaiten sinulle!

Ensiksi, **exporttaa** `Profile` tiedostosta `Gallery.js` käyttämällä nimettyä exporttia (ei `default` avainsanaa):

```js
export function Profile() {
  // ...
}
```

Sitten **importtaa** `Profile` tiedostosta `Gallery.js` tiedostoon `App.js` käyttäen nimettyä importtia (aaltosulkeilla):

```js
import { Profile } from './Gallery.js';
```

Lopuksi **renderöi** `<Profile />` komponentista `App`:

```js
export default function App() {
  return <Profile />;
}
```
Nyt `Gallery.js` sisältää kaksi exporttia: default `Gallery` exportin, sekä nimetyn `Profile` exportin. `App.js` importtaa molemmat näistä. Kokeile muokata `<Profile />` lukemaan `<Gallery />` tässä esimerkissä:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

```js Gallery.js
export function Profile() {
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
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Käytät nyt nimettyjä ja default exportteja yhdessä:

* `Gallery.js`:
  - Exporttaa `Profile` komponentin **nimettynä exporttina nimeltään `Profile`**.
  - Exporttaa `Gallery` komponentin **default exporttina**.
* `App.js`:
  - Importtaa `Profile`:n **nimettynä importtina nimeltään `Profile`** tiedostosta `Gallery.js`.
  - Importtaa `Gallery`:n **default importtina** tiedostosta `Gallery.js`.
  - Exporttaa juuri `App` komponentin **default exporttina**.

<Recap>

Tällä sivulla opit:

* Mikä juurikomponenttitiedosto on
* Miten importata ja exportata komponentti
* Milloin käyttää default exportteja sekä nimettyjä importteja ja exportteja
* Miten exportata useita komponentteja yhdestä tiedostosta

</Recap>



<Challenges>

### Jaa komponentteja edelleen {/*split-the-components-further*/}

Tällä hetkellä `Gallery.js` exporttaa molemmat `Profile`:n sekä `Gallery`:n, joka on hieman sekavaa.

Siirrä `Profile` komponentti sen omaan `Profile.js` tiedostoon ja sitten muuta `App` komponentti renderöimään molemmat `<Profile />` ja `<Gallery />` yksi toisensa jälkeen.

Voit käyttää joko default tai nimettyä exporttia `Profile` komponentille, mutta varmista, että käytät vastaavaa import-syntaksia sekä `App.js` että `Gallery.js` tiedostoissa! Voit viitata taulukkoon: 

| Syntaksi         | Export-lause                           | Import-lause |
| -----------      | -----------                                | -----------                  |
| Default    | `export default function Button() {}` | `import Button from './button.js';`     |
| Nimetty    | `export function Button() {}`         | `import { Button } from './button.js';` |

<Hint>

Älä unohda importata komponenttia missä sitä kutsutaan. Eikö `Gallery` käytä `Profile`:a myöskin?

</Hint>

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <div>
      <Profile />
    </div>
  );
}
```

```js Gallery.js active
// Siirä minut Profile.js tiedostoon!
export function Profile() {
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

```js Profile.js
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Kun olet saanut sen toimimaan toisella exportilla, varmista, että se toimii toisellakin tapaa.

<Solution>

Tässä ratkaisu nimetyillä exporteilla:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
import { Profile } from './Profile.js';

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

```js Profile.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Tässä ratkaisu default exporteilla:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import Profile from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
import Profile from './Profile.js';

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

```js Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

</Solution>

</Challenges>