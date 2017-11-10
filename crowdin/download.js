var Crowdin = require('crowdin');
var config = require('./config');

var crowdin = new Crowdin({ apiKey: config.key, endpointUrl: config.url });

crowdin.downloadToPath('./translations');
