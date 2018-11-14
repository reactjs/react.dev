/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

'use strict';

module.exports = async ({page, actions}) => {
  const {createPage} = actions;

  return new Promise(resolvePromise => {
    if (page.path.includes('docs/error-decoder.html')) {
      page.context.slug = 'docs/error-decoder.html';

      createPage(page);
    }
    resolvePromise();
  });
};
