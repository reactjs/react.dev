/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

'use strict';

import Link from 'gatsby-link';
import PropTypes from 'prop-types';
import React from 'react';
import {getLanguageCodeFromPath} from './utils';

// TODO THis is a hack :( Pass this down via context or some other way?
const DEFAULT_LANGUAGE = 'en';

const DecoratedLink = ({location, to, ...rest}, ...other) => {
  if (to.startsWith('/')) {
    const languageCode =
      getLanguageCodeFromPath(location.pathname.substr(1)) || DEFAULT_LANGUAGE;

    to = `/${languageCode}${to}`;
  }

  return React.createElement(Link, {
    to,
    ...rest,
  });
};

DecoratedLink.propTypes = {
  location: PropTypes.object.isRequired,
  to: PropTypes.string.isRequired,
};

export default DecoratedLink;
