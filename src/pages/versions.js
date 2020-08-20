/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

import Layout from 'components/Layout';
import Container from 'components/Container';
import Header from 'components/Header';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import React from 'react';
import {urlRoot} from 'site-constants';
import {sharedStyles} from 'theme';

// $FlowFixMe This is a valid path
import versions from '../../content/versions.yml';

type Props = {
  location: Location,
};

const Versions = ({location}: Props) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>React Versions</Header>
          <TitleAndMetaTags
            canonicalUrl={`${urlRoot}/versions/`}
            title="React - Versions"
          />
          <div css={sharedStyles.markdown}>
            <p>
              A complete release history for React is available{' '}
              <a
                href="https://github.com/facebook/react/releases"
                target="_blank"
                rel="noopener">
                on GitHub
              </a>
              .<br />
              Documentation for recent releases can also be found below.
            </p>
            <p>
              See our FAQ for information about{' '}
              <a href="/docs/faq-versioning.html">
                our versioning policy and commitment to stability
              </a>
              .
            </p>
            {versions.map(version => (
              <div key={version.title}>
                <h3>{version.title}</h3>
                <ul>
                  <li>
                    <a href={version.changelog} target="_blank" rel="noopener">
                      Changelog
                    </a>
                  </li>
                  {version.path && (
                    <li>
                      <a href={version.path} rel="nofollow">
                        Documentation
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default Versions;
