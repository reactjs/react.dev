/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

const {appendFile, exists, readFile, writeFile} = require('fs-extra');

const HEADER_COMMENT = `## Created with gatsby-transformer-versions-yaml`;

// Patterned after the 'gatsby-plugin-netlify' plug-in:
// https://github.com/gatsbyjs/gatsby/blob/main/packages/gatsby-plugin-netlify/src/create-redirects.js
module.exports = async function writeRedirectsFile(
  redirects,
  redirectsFilePath,
) {
  if (!redirects.length) {
    return null;
  }

  // Map redirect data to the format Netlify expects
  // https://www.netlify.com/docs/redirects/
  redirects = redirects.map(redirect => {
    const {
      fromPath,
      isPermanent,
      redirectInBrowser, // eslint-disable-line no-unused-vars
      toPath,
      ...rest
    } = redirect;

    // The order of these parameters is significant.
    const pieces = [
      fromPath,
      toPath,
      isPermanent ? 301 : 302, // Status
    ];

    for (let key in rest) {
      const value = rest[key];

      if (typeof value === `string` && value.indexOf(` `) >= 0) {
        console.warn(
          `Invalid redirect value "${value}" specified for key "${key}". ` +
            `Values should not contain spaces.`,
        );
      } else {
        pieces.push(`${key}=${value}`);
      }
    }

    return pieces.join(`  `);
  });

  let appendToFile = false;

  // Websites may also have statically defined redirects
  // In that case we should append to them (not overwrite)
  // Make sure we aren't just looking at previous build results though
  const fileExists = await exists(redirectsFilePath);
  if (fileExists) {
    const fileContents = await readFile(redirectsFilePath);
    if (fileContents.indexOf(HEADER_COMMENT) < 0) {
      appendToFile = true;
    }
  }

  const data = `${HEADER_COMMENT}\n\n${redirects.join(`\n`)}`;

  return appendToFile
    ? appendFile(redirectsFilePath, `\n\n${data}`)
    : writeFile(redirectsFilePath, data);
};
