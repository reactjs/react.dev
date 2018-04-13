const readFileSync = require('fs').readFileSync;
const resolve = require('path').resolve;
const safeLoad = require('js-yaml').safeLoad;
const createRedirects = require('./create-redirects');
const path = require('path');

// Reads versions.yml data into GraphQL.
// This is used to generate redirect rules for older documentation versions.
exports.onPostBuild = async ({store}) => {
  const path = resolve(__dirname, '../../content/versions.yml');
  const file = readFileSync(path, 'utf8');
  const versions = safeLoad(file);

  // versions.yml structure is [{title: string, path: string, url: string}, ...]
  createRedirects(
    versions.map(version => ({
      fromPath: version.path,
      toPath: version.url,
    })),
    getPublicFolder(store),
  );
};

function buildPrefixer(prefix, ...paths) {
  return (...subpaths) => path.join(prefix, ...paths, ...subpaths);
}

function getPublicFolder(store) {
  const {program} = store.getState();

  return buildPrefixer(program.directory, `public`);
}
