/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

const resolve = require('path').resolve;
const {writeFile} = require('fs-extra');
const readFileSync = require('fs').readFileSync;
const safeLoad = require('js-yaml').safeLoad;
const path = require('path');
const versionsFile = resolve(__dirname, '../../content/versions.yml');
const file = readFileSync(versionsFile, 'utf8');
const versions = safeLoad(file);
const redirectsFilePath = path.join('vercel.json');

function writeRedirectsFile(redirects, redirectsFilePath) {
  if (!redirects.length) {
    return null;
  }

  /**
   * We will first read the old config to validate if the redirect already exists in the json
   */
  const vercelConfigPath = resolve(__dirname, '../../vercel.json');
  const vercelConfigFile = readFileSync(vercelConfigPath);
  const oldConfigContent = JSON.parse(vercelConfigFile);
  /**
   * Map data as vercel expects it to be
   */

  let vercelRedirects = {};

  redirects.forEach((redirect) => {
    const {fromPath, isPermanent, toPath} = redirect;

    vercelRedirects[fromPath] = {
      destination: toPath,
      permanent: !!isPermanent,
    };
  });

  /**
   * Make sure we dont have the same redirect already
   */
  oldConfigContent.redirects.forEach((data) => {
    if(vercelRedirects[data.source]){
      delete vercelRedirects[data.source];
    }
  });

  /**
   * Serialize the object to array of objects
   */
  let newRedirects = [];
  Object.keys(vercelRedirects).forEach((value) =>
    newRedirects.push({
      source: value,
      destination: vercelRedirects[value].destination,
      permanent: !!vercelRedirects[value].isPermanent,
    })
  );

  /**
   * We already have a vercel.json so we spread the new contents along with old ones
   */
  const newContents = {
    ...oldConfigContent,
    redirects: [...oldConfigContent.redirects, ...newRedirects],
  };
  writeFile(redirectsFilePath, JSON.stringify(newContents, null, 2));
}

// versions.yml structure is [{path: string, url: string, ...}, ...]
writeRedirectsFile(
  versions
    .filter((version) => version.path && version.url)
    .map((version) => ({
      fromPath: version.path,
      toPath: version.url,
    })),
  redirectsFilePath
);
