/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

const readFileSync = require('fs').readFileSync;
const resolve = require('path').resolve;
const safeLoad = require('js-yaml').safeLoad;
const createRedirects = require('./create-redirects');
const path = require('path');

// Reads versions.yml data into GraphQL.
// This is used to generate redirect rules for older documentation versions.
exports.onPostBuild = async ({store}) => {
  const versionsFile = resolve(__dirname, '../../content/versions.yml');
  const file = readFileSync(versionsFile, 'utf8');
  const versions = safeLoad(file);

  const {program} = store.getState();
  const redirectsFilePath = path.join(program.directory, 'vercel.json');

  // versions.yml structure is [{path: string, url: string, ...}, ...]
  await createRedirects(
    versions
      .filter(version => version.path && version.url)
      .map(version => ({
        fromPath: version.path,
        toPath: version.url,
      })),
    redirectsFilePath,
  );
};
