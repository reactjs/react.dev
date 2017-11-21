/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

'use strict';

module.exports = async ({page, boundActionCreators}) => {
  const {createPage} = boundActionCreators;

  return new Promise(resolvePromise => {
    // page.matchPath is a special key that's used for matching pages only on the client.
    // Explicitly wire up all error code wildcard matches to redirect to the error code page.
    if (page.path.includes('docs/error-decoder.html')) {
      page.matchPath = 'docs/error-decoder:path?';
      page.context.slug = 'docs/error-decoder.html';

      createPage(page);
    }

    resolvePromise();
  });
};
