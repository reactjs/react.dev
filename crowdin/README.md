## How does this work?

### Downloading content from Crowdin

This subdirectory contains some JavaScript files as well as a symlink for the default language (English) that points to [the `content` directory](https://github.com/reactjs/reactjs.org/tree/master/content):
```sh
.
└── crowdin
   ├── config.js    # Crowdin configuration settings
   ├── download.js  # Node Download script
   └── translations
       └── en-US -> ../../content
```

Translations can be downloaded locally with `yarn crowdin:download`. This uses the Crowdin API to download data into an `__exports` subdirectory:
```sh
.
└── crowdin
   ├── config.js    # Crowdin configuration settings
   ├── download.js  # Node Download script
   ├── translations
   │    └── en-US -> ../../content
   └── __exports
        └── ...     # Downloaded translations go here
```

Next the task identifies which languages have been translated past a certain threshold (specified by `crowdin/config.js`). For these languages, the script creates symlinks in the `translations` subdirectory:
```sh
.
└── crowdin
   ├── config.js    # Crowdin configuration settings
   ├── download.js  # Node Download script
   ├── translations
   │    ├── en-US -> ../../content
   │    ├── es-ES -> ../__exports/.../es-ES
   │    ├── zh-CN -> ../__exports/.../zh-CN
   │    └── ...     # Other symlinks go here
   └── __exports
        └── ...     # Downloaded translations go here
```

### Gatsby integration

A new (local) `gatsby-plugin-crowdin` plugin has been created that knows how to create localized links to certain sections of the website. **For now, only content from [the `content/docs` directory](https://github.com/reactjs/reactjs.org/tree/master/content/docs) is localized. All other sections/pages remain English only.**

The `gatsby-source-filesystem` plugin has also been reconfigured to read all content from the `crowdin/translations/*` (symlinked) directories rather than `content`. This way it consumes translated content when available. (Crowdin provides default language content for sections that have not yet been translated for any given locale.)

Because of the default symlink (`crowdin/translations/en-US` -> `content`) Gatsby will serve English content when run locally, even if the Crowdin script has not been run. This should enable fast iteration and creation of new content.