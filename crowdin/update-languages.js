const fs = require('fs');
const path = require('path');

const TRANSLATED_LANGUAGES_JSON_PATH = path.resolve(__dirname, 'languages.json');
const TRANSLATED_PATH = path.resolve(__dirname, '__translated__');

// Determine which languages we have translations downloaded for...
const languages = [];
fs.readdirSync(TRANSLATED_PATH).forEach(entry => {
  if (fs.statSync(path.join(TRANSLATED_PATH, entry)).isDirectory()) {
    languages.push(entry);
  }
});

// Update the languages JSON config file.
// This file is used to display the localization toggle UI.
fs.writeFileSync(
  TRANSLATED_LANGUAGES_JSON_PATH,
  JSON.stringify(languages),
);
