---
title: Aloita uusi React projekti
---

<Intro>

Jos olet aloittamassa uutta projektia, suosittelemme käyttämään työkalupakkia tai ohjelmistokehystä. Nämä työkalut tarjoavat mukavan kehitysympäristön, mutta vaativat paikallisen Node.js asennuksen.

</Intro>

<YouWillLearn>

* Miten työkalupakit eroavat ohjelmistokehyksistä
* Miten aloitetaan projekti minimaalisella työkalupakilla
* Miten aloitetaan projekti täysin varustellulla ohelmistokehyksellä
* Mitä suositut työkalupakit ja ohelmistokehykset pitävät sisällään

</YouWillLearn>

## Valitse oma seikkailusi {/*choose-your-own-adventure*/}


React on kirjasto, jonka avulla voit järjestää käyttöliittymäkoodia hajottamalla koodin palasiksi eli komponenteiksi. React ei huolehdi reitittämisestä tai tiedon hallinnasta. Tämä tarkoittaa, että on useita tapoja aloittaa uusi React projekti:

* [Aloita **HTML tiedostolla ja script -tagilla**.](/learn/add-react-to-a-website) Tämä ei vaadi Node.js asennusta mutta tarjoaa rajoitettuja ominaisuuksia.
* Aloita **minimaalisella työkalupakilla,** lisäät ominaisuuksia projektiisi tarpeen tullen. (Hyvä oppimiseen)
* Aloita **täysikokoisella ohjelmistokehyksellä,** jossa on yleisimpiä ominaisuuksia sisäänrakennettuna kuten tiedon haku ja reititys.

## Aloitus minimaalisella työkalupakilla {/*getting-started-with-a-minimal-toolchain*/}

Jos olet **opiskelemassa Reactia,** suosittelemme [Create React App](https://create-react-app.dev/) ympäristöä. Se on suosituin tapa koittaa Reactia ja rakentaa uusi yhden sivun sovellus. Se on tehty Reactille, mutta se ei sisällä reitittämistä taikka tiedonhakua.

Ensiksi, asenna [Node.js.](https://nodejs.org/en/) Sitten avaa terminaalisi ja suorita seuraava komento luodaksesi projektin:

<TerminalBlock>

npx create-react-app mun-softa

</TerminalBlock>


Nyt voit suorittaa sovelluksesi komennolla:

<TerminalBlock>

cd mun-softa
npm start

</TerminalBlock>

Lisätietoja löydät [lukemalla virallista opasta.](https://create-react-app.dev/docs/getting-started)

> Create React App ei hoida taustajärjestelmän logiikkaa taikka tietokantoja. Voit käyttää sitä minkä taustajärjestelmän kanssa haluat. Kun rakennat projektia, saat kansion täynnä staattisia HTML, CSS ja JS tiedostoja. Koska Create React App ei hyödynnä palvelinta, se ei parasta suorituskykyä. Jos etsit nopeampia latausaikoja ja sisäänrakennettuja ominaisuuksia kuten reitittämistä ja palvelinpuolen logiikkaa, suosittelemme ohjelmistokehystä sen sijaan.

### Suositut vaihtoehdot {/*popular-alternatives*/}

* [Vite](https://vitejs.dev/guide/)
* [Parcel](https://parceljs.org/getting-started/webapp/)

## Rakentaminen Reactilla ja ohjelmistokehyksellä {/*building-with-react-and-a-framework*/}

Jos aiot **aloittaa tuotantovalmiin projektin,** [Next.js](https://nextjs.org/) on hyvä paikka aloittaa. Next.js on suosittu ja kevyt ohjelmistokehys staattisiin sekä palvelin-renderöityihin sovelluksiin Reactilla. Sen mukana tulee pakattuna valmiiksi ominaisuuksia, kuten reititys, tyylit sekä palvelinpuolen renderöinti, jotta saat projektin alkuun nopeasti.

[Next.js Foundations](https://nextjs.org/learn/foundations/about-nextjs) -tutoriaali on hyvä esittely rakentamiseen Reactilla ja Next.js:llä.

### Suositut vaihtoehdot {/*popular-alternatives*/}

* [Gatsby](https://www.gatsbyjs.org/)
* [Remix](https://remix.run/)
* [Razzle](https://razzlejs.org/)

## Kustomoidut työkalupakit {/*custom-toolchains*/}

Saatat pitää enemmän itseluodusta ja -määritellystä työkalupakista. Työkalupakki useimmiten koostuu seuraavista:

* **Paketinhallintajärjestelmä** antaa sinun asentaa, päivittää sekä hallita kolmasien osapuolten paketteja. Suosittuja paketinhallintajärjestelmiä: [npm](https://www.npmjs.com/) (Node.js:ssä sisäänrakennettuna), [Yarn](https://yarnpkg.com/), [pnpm.](https://pnpm.io/)
* **Kääntäjä** antaa sinun kääntää modernin kielen ominaisuuksia ja lisäsyntaksia kuten JSX:ää tai tyyppiannotaatiota selaimille. Suosittuja kääntäjiä: [Babel](https://babeljs.io/), [TypeScript](http://typescript.org/), [swc.](https://swc.rs/)
* **Bundler** antaa sinuun kirjoittaa modulaarista koodia ja yhdistä ne yhteen pieniksi paketeiksi latausajan optimoimiseksi. Suosittuja bundlereita: [webpack](https://webpack.js.org/), [Parcel](https://parceljs.org/), [esbuild](https://esbuild.github.io/), [swc.](https://swc.rs/)
* **Minifioija** tekee koodistasi kompaktimpaa, jotta se latautuu nopeampaa. Suosittuja minifioijia: [Terser](https://terser.org/), [swc.](https://swc.rs/).
* **Palvelin** hoitaa palvelinpyynnöt, jotta voit renderöidä komponentteja HTML:ksi. Suosittuja palvelimia: [Express.](https://expressjs.com/)
* **Lintteri** tarkistaa koodin yleisiä vikoja varten. Suosittuja linttereitä: [ESLint.](https://eslint.org/)
* **Testien suorittaja** antaa sinun suorittaa testejä koodiasi vasten. Suosittuja testien suorittajia: [Jest.](https://jestjs.io/).

Jos suosit oman JavaScript -työkalupakin asennusta alusta alkaen, [katso tämä opas](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) joka luo uudelleen tiettyjä Create React App:in toimintoja. Ohjelmistokehys useimmiten tarjoaa reitityksen ja tiedonhaun ominaisuuden. Suuremmissa projekteissa saatat haluta hallita useita paketteja yhdessä repositoriossa työkalulla kuten [Nx](https://nx.dev/react) tai [Turborepo.](https://turborepo.org/).
