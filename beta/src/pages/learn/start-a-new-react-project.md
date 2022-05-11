---
title: Aloita uusi React projekti
---

<Intro>

Jos olet opettelemassa Reactia tai harkitsen sen lisäämistä olemassa olevaan projektiin, voit aloittaa nopeasti [lisäämällä Reactin mille tahansa HTML sivulle script -tagien avulla](/learn/add-react-to-a-website).
Mikäli projektisi tulee tarvitsemaan useita komponentteja ja tiedostoja, voi olla aika harkita muita alla olevia vaihtoehtoja!

</Intro>

## Valitse oma polkusi {/*choose-your-own-adventure*/}

React on kirjasto, jonka avulla voit järjestää käyttöliittymäkoodia hajottamalla koodin palasiksi eli komponenteiksi. React ei huolehdi reitittämisestä tai tiedon hallinnasta. Näihin ominaisuuksiin saatat haluta käyttää kolmansien osapuolien kirjastoja tai kirjoittaa omia ratkaisujasi. Tämä tarkoittaa, että on useita tapoja aloittaa uusi React projekti:


* Aloita **minimaalisella työkalupakilla,** lisäät ominaisuuksia projektiisi tarpeen tullen.
* Aloita **täysikokoisella ohjelmistokehyksellä,** jossa on yleisimpiä toiminnallisuuksia sisäänrakennettuna.

Mikäli olet aloittamassa, rakentamassa jotain isoa, tai haluat asentaa oman ympäristön, tämä opas ohjaa sinut oikealle polulle.

## React-työkalupakin käytön aloittaminen {/*getting-started-with-a-react-toolchain*/}

Jos olet aloittamassa Reactin käyttöä, suosittelemme Create React App](https://create-react-app.dev/) ympäristöä. Se on suosituin tapa kokeilla Reactin ominaisuuksia ja mahtava tapa rakentaa uusi yhden-sivun sovellus. Create React App on mielipiteetön työkalu konfiguroitu vain Reactille. Työkalupakki auttaa mm. seuraavissa asioissa:

* Skaalautuu useisiin tiedostoihin ja komponentteihin
* Kolmansien osapuolien npm -pakettien käyttö
* Tunnistaa yleisiä virheitä aikaisin
* CSS ja JS koodin muokkaaminen reaaliajassa
* Optimoi koodin lopputuloksen tuotantoa varten

Pääset aloittamaan koodauksen Create React App:lla yhdellä rivillä terminaalissasi! (**Tarkista, että sinulla on [Node.js](https://nodejs.org/) asennettuna!**)

<TerminalBlock>

npx create-react-app mun-softa

</TerminalBlock>


Nyt voit suorittaa sovelluksesi komennolla:

<TerminalBlock>

cd mun-softa
npm start

</TerminalBlock>

Lisätietoja löydät [lukemalla virallista opasta](https://create-react-app.dev/docs/getting-started).

> Create React App ei hoida backendin logiikkaa taikka tietokantoja; se tuottaa vain frontendin kehitysputken. Tämä tarkoittaa, että voit käyttää sitä minkä tahansa taustajärjestelmän kanssa haluat. Mutta jos etsit lisäominaisuuksia kuten reitittämistä ja palvelinpuolen logiikkaa, jatka lukemista!

### Muut vaihtoehdot {/*other-options*/}

Create React APp on hyvä vaihtoehto Reactin käytön aloittamiseen, mutta jos haluat vielä kevyemmän työkalupakit, voit kokeilla yhtä näistä muista:

* [Vite](https://vitejs.dev/guide/)
* [Parcel](https://parceljs.org/)
* [Snowpack](https://www.snowpack.dev/tutorials/react)

## Rakentaminen Reactilla ja ohjelmistokehyksellä {/*building-with-react-and-a-framework*/}

Jos aiot aloittaa suuren, tuotanto-valmiin projektin, [Next.js](https://nextjs.org/) on hyvä aloituspaikka. Next.js on suosittu ja kevyt ohjelmistokehys staattisiin sekä palvelin-renderöityihin sovelluksiin Reactilla. Sen mukana tulee pakattuna valmiiksi ominaisuuksia, kuten reititys, tyylit sekä palvelinpuolen renderöinti, jotta saat projektin alkuun nopeasti.

[Aloita rakentaminen Next.js -kehyksellä](https://nextjs.org/docs/getting-started) virallisen oppaan avulla.

### Muut vaihtoehdot {/*other-options-1*/}

* [Gatsby](https://www.gatsbyjs.org/):lla voit luoda staattisia verrkosivua Reactin skeä GraphQL:n avulla.
* [Razzle](https://razzlejs.org/) on palvelinpuolen renderöintikehys, joka ei vaadi yhtään konfigurointia, mutta tarjoaa enemmän joustavuutta kuin Next.js.

## Kustomoidut työkalupakit {/*custom-toolchains*/}

Saatat pitää enemmän itseluodusta ja -määritellystä työkalupakista. JavaScript työkalupakki useimmiten koostuu seuraavista:

* **Paketinhallintajärjestelmä**—antaa sinun asentaa, päivittää sekä hallita kolmasien osapuolten paketteja. [Yarn](https://yarnpkg.com/) ja [npm](https://www.npmjs.com/) ovat kaksi suosittua paketinhallintajärjestelmää.
* **Bundler**—antaa sinuun kirjoittaa modulaarista koodia ja yhdistä ne yhteen pieniksi paketeiksi latausajan optimoimiseksi. [Webpack](https://webpack.js.org/), [Snowpack](https://www.snowpack.dev/), [Parcel](https://parceljs.org/) ovat suosittuja bundlereita.
* **Kääntäjä**—antaa sinun krijoittaa modernia JavaScript koodia, joka silti toimii vanhemmissa selaimissa. [Babel](https://babeljs.io/) on yksi hyvä esimerkki.

Laajemmassa projektissa saatat haluta käyttää työkalua hallitsemaan useita paketteja yhdessä repositoryssa. [Nx](https://nx.dev/react) on esimerkki sellaisesta työkalusta.

Jos suosit oman JavaScript työkalupakin asennusta alusta alkaen, [katso tämä opas](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) joka luo uudelleen tiettyjä Create React Appin toimintoja.