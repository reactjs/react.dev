## How does it work?

**Only content from [the `content/docs` directory](https://github.com/reactjs/reactjs.org/tree/master/content/docs) is localized. All other sections/pages remain English only.**

### Downloading content from Crowdin

This directory contains some JavaScript files as well as a symlink for the default language (English) that points to [the `content/docs` directory](https://github.com/reactjs/reactjs.org/tree/master/content/docs):
```sh
.
└── crowdin
   ├── __translated__ #----------------------- Initially empty, except for English
   │   └── en-US
   │       └── docs -> ../../../content/docs
   ├── __untranslated__ #--------------------- Contains symlinks to untranslated content
   │   ├── blog -> ../../content/blog
   │   └── # ...
   ├── config.js #---------------------------- Crowdin configuration settings
   └── download.js #-------------------------- Node Download script
```

To retrieve translations using the Crowdin API, use the Yarn task `yarn crowdin:download`. This will download data into an `__exported__` subdirectory:
```sh
.
└── crowdin
   ├── __exported__
   │   └── # Crowdin expoert goes here ...
   ├── __translated__
   │   └── # ...
   ├── __untranslated__
   │   └── # ...
   └── # ...
```

Next the task identifies which languages have been translated past a certain threshold (specified by `config.js`). For these languages, the script creates symlinks in the `__translated__` subdirectory:
```sh
.
└── crowdin
   ├── __exported__
   │   └── # ...
   ├── __translated__
   │   ├── en-US
   │   │   └── docs -> ../../../content/docs
   │   ├── es-ES
   │   │   └── docs -> ../../__exported__/path/to/docs/es-ES/docs
   │   └── # Other languages that pass the threshold ...
   ├── __untranslated__
   │   └── # ...
   └── # ...
```

### Gatsby integration

A new (local) `gatsby-plugin-crowdin` plugin has been created that knows how to create localized links to certain sections of the website (e.g. things within the translated "/docs" directory).

The `gatsby-source-filesystem` plugin has been configured to read all content from the `crowdin/__translated__/` and  `crowdin/__untranslated__/` (symlinked) directories rather than `content`. This way it consumes translated content when available. (Crowdin provides default language fallbacks for pages/sections that have not yet been translated for any given locale.)

This configuration is done via `gatsby-config.js`:
```js
{
  resolve: 'gatsby-source-filesystem',
  options: {
    name: 'untranslated',
    path: `${__dirname}/crowdin/__untranslated__/`,
  },
},
{
  resolve: 'gatsby-source-filesystem',
  options: {
    name: 'translated',
    path: `${__dirname}/crowdin/__translated__/`,
  },
},
```

Because of the default initial symlink (`crowdin/__translated__/en-US/docs` -> `content/docs`) Gatsby will still serve English content when run locally, even if the Crowdin script has not been run. This should enable fast iteration and creation of new content.

Translations can be updated by running `yarn crowdin:download` (or automatically as part of CI deployment).

### Language selector

The Yarn task `crowdin:update-languages` determines which translated languages have been downloaded. (This task is automatically run before `yarn dev` or `yarn build` in order to just-in-time update the list.) The task writes a list of locales to a local JSON file, `languages.json`:

```sh
.
└── crowdin
   ├── __exported__
   │   └── # ...
   ├── __translated__
   │   └── # ...
   ├── __untranslated__
   │   └── # ...
   ├── translated-languages.json # This is the list of local translations
   └── # ...
```

This `languages.json` list is imported into a translations page (`pages/translations.js`) and used to create a list of links to translated docs.

### Locale persistence

By default, legacy links to docs pages (e.g. `/docs/hello-world.html`) are re-routed to a new page (`docs-language-redirect.js`) that determines which locale to redirect to (e.g. `/en-US/docs/hello-world.html`). This is done as follows:
* First it checks `localStorage` for the user's selected language. If one is found, it is used.
* Next it checks the user's preferred languages (using `navigator.languages`). If any have been translated, it is used.
* Lastly it falls back to English.

Each time a user visits a localized docs path, the website updates their currently selected language (in `localStorage`) so that subsequent visits (within this session or a new session) will restore their selected language.