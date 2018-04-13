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

// $FlowFixMe This is a valid path
import versions from '../../content/versions.yml';

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
            {versions.map(version => (
              <li key={version.title}>
                <a href={version.path} rel="nofollow">
                  {version.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </Container>
);

export default Versions;
