const path = require('path');

// Also relates to the crowdin.yaml file in the root directory
module.exports = {
  key: process.env.CROWDIN_API_KEY,
  url: 'https://api.crowdin.com/api/project/react',
  threshold: 50,
  downloadedRootDirectory: path.join('test-17', 'docs'),
};
