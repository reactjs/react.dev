const Crowdin = require('crowdin-node');
const config = require('./config');
const path = require('path');
const {symlink, lstatSync, readdirSync} = require('fs');

const SYMLINKED_TRANSLATIONS_PATH = path.resolve(__dirname, 'translations');
const DOWNLOADED_TRANSLATIONS_PATH = path.resolve(__dirname, '__translations');
const DOWNLOADED_TRANSLATIONS_DOCS_PATH = path.resolve(
  __dirname,
  '__translations',
  'docs',
);

function main() {
  const crowdin = new Crowdin({apiKey: config.key, endpointUrl: config.url});
  process.chdir(SYMLINKED_TRANSLATIONS_PATH);

  crowdin
    // .export() // Not sure if this should be called in the script since it could be very slow
    // .then(() => crowdin.downloadToPath(DOWNLOADED_TRANSLATIONS_PATH))
    .downloadToPath(DOWNLOADED_TRANSLATIONS_PATH)
    .then(() => crowdin.getTranslationStatus())
    .then(locales => {
      const usableLocales = locales
        .filter(
          locale => locale.translated_progress > config.translation_threshold,
        )
        .map(local => local.code);

      const localeDirectories = getDirectories(
        DOWNLOADED_TRANSLATIONS_DOCS_PATH,
      );

      const localeToFolderMap = createLocaleToFolderMap(localeDirectories);

      usableLocales.forEach(locale => {
        createSymLink(localeToFolderMap.get(locale));
      });
    });
}

// Creates a relative symlink from a downloaded translation in the current working directory
// Note that the current working directory of this node process should be where the symlink is created
// or else the relative paths would be incorrect
function createSymLink(folder) {
  symlink(`../__translations/docs/${folder}`, folder, err => {
    if (!err) {
      console.log(`Created symlink for ${folder}.`);
      return;
    }

    if (err.code === 'EEXIST') {
      console.log(
        `Skipped creating symlink for ${folder}. A symlink already exists.`,
      );
    } else {
      console.error(err);
      process.exit(1);
    }
  });
}

// When we run getTranslationStatus(), it gives us 2-ALPHA locale codes unless necessary
// However, the folder structure of downloaded translations always has 4-ALPHA locale codes
// This function creates a map from a locale code to its corresponding folder name
function createLocaleToFolderMap(directories) {
  const twoAlphaLocale = locale => locale.substring(0, 2);
  const localeToFolders = new Map();
  const localeToFolder = new Map();

  for (let locale of directories) {
    localeToFolders.set(
      twoAlphaLocale(locale),
      localeToFolders.has(twoAlphaLocale(locale))
        ? localeToFolders.get(twoAlphaLocale(locale)).concat(locale)
        : [locale],
    );
  }

  localeToFolders.forEach((folders, locale) => {
    if (folders.length === 1) {
      localeToFolder.set(locale, folders[0]);
    } else {
      for (let folder of folders) {
        localeToFolder.set(folder, folder);
      }
    }
  });

  return localeToFolder;
}

function getDirectories(source) {
  return readdirSync(source).filter(
    name =>
      lstatSync(path.join(source, name)).isDirectory() && name !== '_data',
  );
}

main();
