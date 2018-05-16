/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import Container from 'components/Container';
import Header from 'components/Header';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import Link from 'gatsby-link';
import React from 'react';
import {sharedStyles} from 'theme';

// $FlowFixMe This is a valid path
import languages from '../../crowdin/languages.json';

const Translations = () => (
  <Container>
    <div css={sharedStyles.articleLayout.container}>
      <div css={sharedStyles.articleLayout.content}>
        <Header>Translations</Header>
        <TitleAndMetaTags title="React - Translations" />
        <div css={sharedStyles.markdown}>
          <p>
            React docs have been translated by the community into the following
            languages:
          </p>
          <ul>
            {languages.map(language => (
              <li key={language}>
                <Link to={`/${language}/docs/hello-world.html`}>
                  {language}
                </Link>
              </li>
            ))}
          </ul>
          <p>
            Visit{' '}
            <a
              href="https://crowdin.com/project/react"
              target="_blank"
              rel="noopener">
              crowdin.com/project/react
            </a>{' '}
            if you would like to contribute to these translations.
          </p>
        </div>
      </div>
    </div>
  </Container>
);

export default Translations;
