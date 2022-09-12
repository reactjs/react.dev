---
title: Editorin asentaminen
---

<Intro>

Oikein määritelty editori voi tehdä koodista selkeämpää lukea ja nopeampaa kirjoittaa. Se voi jopa helpottaa löytämään bugeja samalla kun kirjoitat niitä! Jos tämä on ensimmäinen kerta asentamassa editoria tai haluat virittää nykyistä editoriasi, meillä on muutamia suosituksia.

</Intro>

<YouWillLearn>

* Mitkä ovat suosituimmat editorit
* Miten koodi muotoillaan automaattisesti

</YouWillLearn>

## Editorisi {/*your-editor*/}

[VS Code](https://code.visualstudio.com/) on yksiä suosituimpia editoreita käytössä nykypäivänä. Sillä on suuri kauppa lisäosille ja se integroituu hyvin suosittujen palveluiden kuten GitHubin kanssa. Useimmat alla olevista ominaisuuksista voidaan lisätä VS Codeen lisäosina, joka tekee siitä todella konfiguroitavan!

Muita suosittuja tekstieditoreita React-yhteisössä ovat muun muassa:

* [WebStorm](https://www.jetbrains.com/webstorm/) on IDE ohjelmointiympäristö suunniteltu erityisesti JavaScriptille.
* [Sublime Text](https://www.sublimetext.com/) editorissa on tuki JSX:lle sekä TypeScriptille, [syntaksin korostus](https://stackoverflow.com/a/70960574/458193) ja sisäänrakennettu automaattinen täydennys.
* [Vim](https://www.vim.org/) on laajasti konfiguroitava tekstieditori, joka tekee tekstin luomisesta ja muokkaamisesta tehokasta. Useissa UNIX ja Applen macOS järjestelmissä se tulee mukana "vi" komentona.

## Suositellut tekstieditoreiden ominaisuudet {/*recommended-text-editor-features*/}

Joissain editoreissa nämä ominaisuudet tulevat sisäänrakennettuna, mutta jotkin saattavat tarvita lisäosan. Tarkista millaista tukea editorisi tarjoaa ollaksesi varma!

### Lintterit {/*linting*/}

Koodilintterit taikka "nukan poistajat" etsivät ongelmia koodistasi kun kirjoitat, auttaen korjaamaan ne ajoissa. [ESLint](https://eslint.org/) on suosittu, avoimen lähdekoodin lintteri JavaScriptille.

* [Asenna ESLint suositelluilla määrityksillä Reactille](https://www.npmjs.com/package/eslint-config-react-app) (tarkista, että sinulla on [Node asennettuna!](https://nodejs.org/en/download/current/))
* [Integroi ESLint VSCodeen virallisella lisäosalla](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

**Varmista, että olet ottanut käyttöön kaikki [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) säännöt projektillesi.** Ne ovat olennaisia ja nappaavat vakavimmat bugit ajoissa. Suositeltu [`eslint-config-react-app`](https://www.npmjs.com/package/eslint-config-react-app) esiasetus sisältää ne valmiiksi.

### Muotoilu {/*formatting*/}

Vihoviimeinen asia on joutua keskustelemaan toisen kehittäjän kanssa aihesta [sarkain vs välilyönti](https://www.google.com/search?q=tabs+vs+spaces)! Onneksi [Prettier](https://prettier.io/) siivoaa koodisi uudelleen muotoilemalla sen pitäytymään muutettaviin esimääriteltyihin sääntöihin. Suorita Prettier ja kaikki välilehtesi muutetaan välilyönneiksi-ja kaikki sisennykset, lainausmerkit, jne tulee muuttumaan konfiguraation mukaiseksi. Ihanteellisessa tilanteessa Prettier suoritetaan kun tallennat tiedostosi, nopeasti tehden nämä muutokset sinulle.

Voit asentaa [Prettier lisäosan VSCodeen](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) seuraamalla näitä vaiheita:

1. Käynnistä VS Code
2. Käytä Quick Open -ominaisuutta (paina `CTRL/CMD + P`)
3. Liitä `ext install esbenp.prettier-vscode`
4. Paina rivinvaihtoa

#### Muotoilun muutos tallentaessa {/*formatting-on-save*/}

Ihannetilanteessa sinun pitäisi muotoilla koodisi jokaisen tallennuksen yhteydessä. VS Codessa on asetus tätä varten!

1. VS Codessa, paina `CTRL/CMD + SHIFT + P`.
2. Kirjoita "settings"
3. Paina rivinvahtoa
4. Hakupalkissa, hae "format on save"
5. Varmista, että "format on save" vaihtoehto on valittuna!

> Jos ESLint säännöissäsi on muotoilusääntöjä, ne voivat olla ristiriidassa Prettierin kanssa. Suosittelemme poistamaan käytöstä kaikki ESLint muotoilusäännöt käyttämällä [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier), jotta ESLint on *ainoastaan* käytössä logiikkavirheiden etsimiseen. Jos haluat pakottaa, että tiedostot määritellään ennen kuin pull request yhdistetän, käytä [`prettier --check`](https://prettier.io/docs/en/cli.html#--check) komentoa CI työkalussasi.
