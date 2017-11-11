'use strict';

const {getLanguageCodeFromPath} = require('./utils');

module.exports = ({boundActionCreators}, {defaultLanguageCode}) => {
  const {createRedirect} = boundActionCreators;

  return ({fromPath, toPath, ...rest}) => {
    toPath = toPath.replace(/^\//, '');

    const languageCode = getLanguageCodeFromPath(toPath);

    fromPath = `/${languageCode}/${fromPath}`;

    createRedirect({
      fromPath,
      toPath,
      ...rest,
    });
  };
};
