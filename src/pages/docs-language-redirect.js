/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import {getSelectedLanguage} from 'utils/languageUtils';

const DocsRedirect = ({location}) => {
  // Redirect the user to their most recent locale, or English as a fallback.
  const language = getSelectedLanguage();

  return <Redirect to={`/${language}${location.search.substr(1)}`} />;
};

DocsRedirect.propTypes = {
  location: PropTypes.object.isRequired,
};

export default DocsRedirect;
