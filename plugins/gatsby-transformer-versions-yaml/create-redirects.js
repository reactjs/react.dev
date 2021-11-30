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
  redirects = redirects.map(redirect => {
    const {fromPath, isPermanent, toPath} = redirect;

    const pieces = {
      source: fromPath,
      destination: toPath,
      permanent: !!isPermanent,
    };

    return pieces;
  });

  /**
   * Make sure we dont have the same redirect already
   */
  oldConfigContent.redirects.forEach(data => {
    redirects = redirects.filter(
      newRedirect => newRedirect.source !== data.source,
    );
  });

  /**
   * We already have a vercel.json so we spread the new contents along with old ones
   */
  const newContents = {
    ...oldConfigContent,
    redirects: [...oldConfigContent.redirects, ...redirects],
  };
  writeFile(redirectsFilePath, JSON.stringify(newContents, null, 2));
};
