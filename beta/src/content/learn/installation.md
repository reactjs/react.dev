---
title: Asennus
---

<Intro>

React on suunniteltu alusta alkaen asteittaiseen käyttöönottoon. Voit käyttää niin paljon tai vähän Reactia kuin tarvitset. Halusitpa sitten koittaa Reactia, lisätä vähän interaktiivisuutta HTML sivuun, tai aloittaa monimutkaisen React-käyttöisen sovelluksen, tämä osio auttaa sinua pääsemään alkuun.

</Intro>

<YouWillLearn isChapter={true}>

- [Miten lisätä Reactia HTML sivuun](/learn/add-react-to-a-website)
- [Miten aloittaa kokonainen React -projekti](/learn/start-a-new-react-project)
- [Miten määritellä editori](/learn/editor-setup)
- [Miten asennetaan Reactin kehitystyökalut](/learn/react-developer-tools)

</YouWillLearn>

## Kokeile Reactia {/*try-react*/}

Reactia kokeillaksesi sinun ei tarvitse asentaa mitään. Kokeile muokata tätä hiekkalaatikkoa!

<Sandpack>

```js
function Tervehdys({nimi}) {
  return <h1>Hei, {nimi}</h1>;
}

export default function App() {
  return <Tervehdys nimi="maailma" />;
}
```

</Sandpack>

Voit muokata sitä suoraan tai avata sen uudessa välilehdessä painamalla "Fork" painiketta oikeasta yläreunasta.

Useimmat sivut Reactin dokumentaatiossa sisältävät hiekkalaatikkoja kuten tämän. Reactin dokumentaation ulkopuolelta löytyy monia hiekkalaatikkoja, jotka tukevat Reactia: esimerkiksi [CodeSandbox](https://codesandbox.io/s/new), [Stackblitz](https://stackblitz.com/fork/react), tai [CodePen](https://codepen.io/pen?&editors=0010&layout=left&prefill_data_id=3f4569d1-1b11-4bce-bd46-89090eed5ddb).


## Kokeile Reactia paikallisesti {/*try-react-locally*/}

Kokeile Reactia paikallisesti omalla tietokoneellasi [lataamalla tämä HTML sivu](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html). Avaa se editorissasi sekä selaimesasi!

## Lisää React sivuun {/*add-react-to-a-page*/}

Jos työskentelet olemassaolevan sivun kanssa ja tarvitset vain vähäsen Reactia, voit [lisätä Reactin script -tagilla.](/learn/add-react-to-a-website)

## Aloita React -projekti {/*start-a-react-project*/}

Jos olet valmis [aloittamaan itsenäisen projektin](/learn/start-a-new-react-project) Reactilla, voit pystyttää minimaalisen ympäristön miellyttävää kehittäjäkokemusta varten. Voit myös aloittaa käyttämällä ohjelmistokehystä, joka teke paljon päätöksiä puolestasi.

## Seuraavat vaiheet {/*next-steps*/}

Suuntaa kohti [Pika-aloitus](/learn) -oppaaseen ja tutustu tärkeimpiin React-ominaisuuksiin, joita kohtaat joka päivä.

