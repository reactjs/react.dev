/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

const readFileSync = require('fs').readFileSync;
const resolve = require('path').resolve;
const {writeFile} = require('fs-extra');

// Patterned after the 'gatsby-plugin-netlify' plug-in:
// https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-plugin-netlify/src/create-redirects.js
module.exports = async function writeRedirectsFile(
  redirects,
  redirectsFilePath,
) {
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

  redirects.forEach(redirect => {
    const {fromPath, isPermanent, toPath} = redirect;

    vercelRedirects[fromPath] = {
      destination: toPath,
      permanent: !!isPermanent,
    };
  });
  /**
   * Make sure we dont have the same redirect already
   */
  oldConfigContent.redirects.forEach(data => {
    if (vercelRedirects[data.source]) {
      delete vercelRedirects[data.source];
    }
  });

  /**
   * Serialize the object to array of objects
   */
  let newRedirects = [];
  Object.keys(vercelRedirects).forEach(value =>
    newRedirects.push({
      source: value,
      destination: vercelRedirects[value].destination,
      permanent: !!vercelRedirects[value].isPermanent,
    }),
  );

  /**
   * We already have a vercel.json so we spread the new contents along with old ones
   */
  const newContents = {
    ...oldConfigContent,
    redirects: [...oldConfigContent.redirects, ...newRedirects],
  };
  return writeFile(redirectsFilePath, JSON.stringify(newContents, null, 2));
};
