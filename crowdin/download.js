const Crowdin = require('crowdin-node');
const {downloadedRootDirectory, key, threshold, url, whitelist} = require('./config');
const {existsSync, mkdirSync} = require('fs');
const {join, resolve} = require('path');
const {symlink, lstatSync, readdirSync} = require('fs');

const TRANSLATED_PATH = resolve(__dirname, '__translated__');
const EXPORTED_PATH = resolve(__dirname, '__exported__');

// Path to the "docs" folder within the downloaded Crowdin translations bundle.
const downloadedDocsPath = resolve(
  EXPORTED_PATH,
  downloadedRootDirectory,
);

// Sanity check (local) Crowdin config file for expected values.
const validateCrowdinConfig = () => {
  const errors = [];
  if (!key) {
    errors.push('key: No process.env.CROWDIN_API_KEY value defined.');
  }
  if (!Number.isInteger(threshold)) {
    errors.push(`threshold: Invalid translation threshold defined.`);
  }
  if (!downloadedRootDirectory) {
    errors.push('downloadedRootDirectory: No root directory defined for the downloaded translations bundle.');
  }
  if (!url) {
    errors.push('url: No Crowdin project URL defined.');
  }
  if (errors.length > 0) {
    console.error('Invalid Crowdin config values for:\n• ' + errors.join('\n• '));
    throw Error('Invalid Crowdin config');
  }
};

// Download Crowdin translations (into EXPORTED_PATH),
// Filter languages that have been sufficiently translated (based on config.threshold),
// And setup symlinks for them (in TRANSLATED_PATH) for Gatsby to read.
const downloadAndSymlink = () => {
  const crowdin = new Crowdin({apiKey: key, endpointUrl: url});
  crowdin
    // .export() // Not sure if this should be called in the script since it could be very slow
    // .then(() => crowdin.downloadToPath(EXPORTED_PATH))
    .downloadToPath(EXPORTED_PATH)
    .then(() => crowdin.getTranslationStatus())
    .then(locales => {
      const usableLocales = locales
        .filter(
          locale => locale.translated_progress > threshold,
        )
        .map(local => local.code);

      const localeDirectories = getLanguageDirectories(downloadedDocsPath);
      const localeToFolderMap = createLocaleToFolderMap(localeDirectories);

      usableLocales.forEach(locale => {
        const languageCode = localeToFolderMap.get(locale);
        const rootLanguageFolder = resolve(TRANSLATED_PATH, languageCode);

        if (Array.isArray(whitelist)) {
          if (!existsSync(rootLanguageFolder)) {
            mkdirSync(rootLanguageFolder);
          }

          // Symlink only the whitelisted subdirectories
          whitelist.forEach(subdirectory => {
            createSymLink(join(languageCode, subdirectory));
          });
        } else {
          // Otherwise symlink the entire language export
          createSymLink(languageCode);
        }
      });
    });

};

// Creates a relative symlink from a downloaded translation in the current working directory
// Note that the current working directory of this node process should be where the symlink is created
// or else the relative paths would be incorrect
const createSymLink = (relativePath) => {
  const from = resolve(downloadedDocsPath, relativePath);
  const to = resolve(TRANSLATED_PATH, relativePath);
  symlink(from, to, err => {
    if (!err) {
      return;
    }

    if (err.code === 'EEXIST') {
      // eslint-disable-next-line no-console
      console.info(`Symlink already exists for ${to}`);
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
      lstatSync(join(source, name)).isDirectory() && name !== '_data',
  );

validateCrowdinConfig();
downloadAndSymlink();