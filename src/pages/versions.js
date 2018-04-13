/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import Container from 'components/Container';
import Header from 'components/Header';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import React from 'react';
import {sharedStyles} from 'theme';

const Versions = () => (
  <Container>
    <div css={sharedStyles.articleLayout.container}>
      <div css={sharedStyles.articleLayout.content}>
        <Header>React Versions</Header>
        <TitleAndMetaTags title="React - Versions" />
        <div css={sharedStyles.markdown}>
          <p>
            A complete release history for React is available{' '}
            <a
              href="https://github.com/facebook/react/releases"
              target="_blank"
              rel="noopener">
              in GitHub
            </a>.
          </p>
          <p>Documentation for recent releases can also be accessed below:</p>
          <ul>
            <li>
              <a href="/version/16.2" rel="nofollow">
                16.2.0
              </a>
            </li>
            <li>
              <a href="/version/16.1" rel="nofollow">
                16.1.1
              </a>
            </li>
            <li>
              <a href="/version/16.0" rel="nofollow">
                16.0.0
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Container>
);

export default Versions;
