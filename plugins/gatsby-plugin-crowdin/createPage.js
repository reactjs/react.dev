'use strict';

const {getLanguageCodeFromPath} = require('./utils');

module.exports = (
  {boundActionCreators},
  {defaultLanguageCode, languageCodes},
) => {
  const {createPage, createRedirect} = boundActionCreators;

  return ({path, ...rest}) => {
    // Gatsby paths always start with a "/".
    // Our code below is easier to read if we strip it though.
    path = path.substr(1);

    const languageCode = getLanguageCodeFromPath(path);
    const localizedPath = `/${languageCode}/${path}`;

    createPage({
      path: localizedPath,
      ...rest,
    });

    // Re-route non-language-specified URLs based on language code.
    // (See github.com/gatsbyjs/gatsby/pull/2890)
    // This provides backwards compatibility for links that existed before i18n,
    // And ensures that users will get served the most appropriate content by default.
    // We only need to do this once per "page" so just do it when we detect the default language.
    if (languageCode === defaultLanguageCode) {
      for (let languageCode in languageCodes) {
        // Extract language code (eg "zn") from language & region code strings (eg "zn-CH").
        const language = languageCode.indexOf('-')
          ? languageCode.split('-')[0]
          : languageCode;

        createRedirect({
          fromPath: `/${path}`,
          toPath: `/${languageCode}/${path}`,
          redirectInBrowser: true,
          Language: language,
        });
      }
    }
  };
};
