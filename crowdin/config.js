const path = require('path');

// Also relates to the crowdin.yaml file in the root directory
module.exports = {
  defaultLanguage: 'en',
  downloadedRootDirectory: path.join('test-17', 'docs'),
  key: process.env.CROWDIN_API_KEY,
  threshold: 50,
  url: 'https://api.crowdin.com/api/project/react',
  whitelist: ['docs'],
};
