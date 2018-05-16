const {readdirSync, statSync, writeFileSync} = require('fs');
const {join, resolve} = require('path');

const TRANSLATED_LANGUAGES_JSON_PATH = resolve(__dirname, 'languages.json');
const TRANSLATED_PATH = resolve(__dirname, '__translated__');

// Determine which languages we have translations downloaded for...
const languages = [];
readdirSync(TRANSLATED_PATH).forEach(entry => {
  if (statSync(join(TRANSLATED_PATH, entry)).isDirectory()) {
    languages.push(entry);
  }
});

// Update the languages JSON config file.
// This file is used to display the localization toggle UI.
writeFileSync(
  TRANSLATED_LANGUAGES_JSON_PATH,
  JSON.stringify(languages),
);
