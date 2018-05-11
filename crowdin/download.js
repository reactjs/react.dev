const Crowdin = require('crowdin-node');
const config = require('./config');
const path = require('path');
const {symlink, lstatSync, readdirSync} = require('fs');

const SYMLINKED_TRANSLATIONS_PATH = path.resolve(__dirname, 'translations');
const DOWNLOADED_TRANSLATIONS_PATH = path.resolve(__dirname, '__translations');

// Path to the "docs" folder within the downloaded Crowdin translations bundle.
const downloadedDocsPath = path.resolve(
  __dirname,
  '__translations',
  config.downloadedRootDirectory,
  'docs',
);

// Sanity check (local) Crowdin config file for expected values.
const validateCrowdinConfig = () => {
  const errors = [];
  if (!config.key) {
    errors.push('key: No process.env.CROWDIN_API_KEY value defined.');
  }
  if (!Number.isInteger(config.threshold)) {
    errors.push(`threshold: Invalid translation threshold defined.`);
  }
  if (!config.downloadedRootDirectory) {
    errors.push('downloadedRootDirectory: No root directory defined for the downloaded translations bundle.');
  }
  if (!config.url) {
    errors.push('url: No Crowdin project URL defined.');
  }
  if (errors.length > 0) {
    console.error('Invalid Crowdin config values for:\n• ' + errors.join('\n• '));
    throw Error('Invalid Crowdin config');
  }
};

// Download Crowdin translations (into DOWNLOADED_TRANSLATIONS_PATH),
// Filter languages that have been sufficiently translated (based on config.threshold),
// And setup symlinks for them (in SYMLINKED_TRANSLATIONS_PATH) for Gatsby to read.
const downloadAndSymlink = () => {
  const crowdin = new Crowdin({apiKey: config.key, endpointUrl: config.url});
  crowdin
    // .export() // Not sure if this should be called in the script since it could be very slow
    // .then(() => crowdin.downloadToPath(DOWNLOADED_TRANSLATIONS_PATH))
    .downloadToPath(DOWNLOADED_TRANSLATIONS_PATH)
    .then(() => crowdin.getTranslationStatus())
    .then(locales => {
      const usableLocales = locales
        .filter(
          locale => locale.translated_progress > config.threshold,
        )
        .map(local => local.code);

      const localeDirectories = getLanguageDirectories(downloadedDocsPath);
      const localeToFolderMap = createLocaleToFolderMap(localeDirectories);

      usableLocales.forEach(locale => {
        createSymLink(localeToFolderMap.get(locale));
      });
    });

};

// Creates a relative symlink from a downloaded translation in the current working directory
// Note that the current working directory of this node process should be where the symlink is created
// or else the relative paths would be incorrect
const createSymLink = (folder) => {
  const from = path.resolve(downloadedDocsPath, folder);
  const to = path.resolve(SYMLINKED_TRANSLATIONS_PATH, folder);
  symlink(from, to, err => {
    if (!err) {
      return;
    }

    if (err.code === 'EEXIST') {
      // eslint-disable-next-line no-console
      console.info(`Symlink already exists for ${folder}`);
    } else {
      console.error(err);
      process.exit(1);
    }
  });
};

// Crowdin.getTranslationStatus() provides ISO 639-1 (e.g. "fr" for French) or 639-3 (e.g. "fil" for Filipino) language codes,
// But the folder structure of downloaded translations uses locale codes (e.g. "fr-FR" for French, "fil-PH" for the Philippines).
// This function creates a map between language and locale code.
const createLocaleToFolderMap = (directories) => {
  const localeToLanguageCode = locale => locale.includes('-') ? locale.substr(0, locale.indexOf('-')) : locale;
  const localeToFolders = new Map();
  const localeToFolder = new Map();

  for (let locale of directories) {
    const languageCode = localeToLanguageCode(locale);

    localeToFolders.set(
      languageCode,
      localeToFolders.has(languageCode)
        ? localeToFolders.get(languageCode).concat(locale)
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
};

// Parse downloaded translation folder to determine which langauges it contains.
const getLanguageDirectories = source =>
  readdirSync(source).filter(
    name =>
      lstatSync(path.join(source, name)).isDirectory() && name !== '_data',
  );

validateCrowdinConfig(config);
downloadAndSymlink();