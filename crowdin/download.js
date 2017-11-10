var Crowdin = require('crowdin-node');
var config = require('./config');
var path = require('path');

var crowdin = new Crowdin({ apiKey: config.key, endpointUrl: config.url });
process.chdir(path.resolve(__dirname, 'translations'));

crowdin.downloadToPath(path.resolve(__dirname, '__translations'));

crowdin.getTranslationStatus().then(locales => {
  const usableLocales = locales.filter(locale => locale.translated_progress > config.translation_threshold);

  usableLocales.forEach(locale => {
    createSymLink(locale.code);
  });
});

function createSymLink(localeName) {
  fs.symlink('../../content/' + localeName, localeName, (err) => {
    console.error(err);
    process.exit(1);
  });
}
