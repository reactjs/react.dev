/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import Layout from 'components/Layout';
import Container from 'components/Container';
import Header from 'components/Header';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import Translatable, {translate} from 'components/Translatable';
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
          <Header>
            <Translatable>React Versions</Translatable>
          </Header>
          <TitleAndMetaTags
            canonicalUrl={`${urlRoot}/versions/`}
            title={translate('Versions')}
          />
          <div css={sharedStyles.markdown}>
            <p>
              <Translatable>
                A complete release history for React is available{' '}
                <a
                  href="https://github.com/facebook/react/releases"
                  target="_blank"
                  rel="noopener">
                  on GitHub
                </a>
                .
              </Translatable>
              <br />
              <Translatable>
                Documentation for recent releases can also be found below.
              </Translatable>
            </p>
            <p>
              <Translatable>
                See our FAQ for information about{' '}
                <a href="/docs/faq-versioning.html">
                  our versioning policy and commitment to stability
                </a>
                .
              </Translatable>
            </p>
            {versions.map(version => (
              <div key={version.title}>
                <h3>{version.title}</h3>
                <ul>
                  <li>
                    <a href={version.changelog} target="_blank" rel="noopener">
                      <Translatable>Changelog</Translatable>
                    </a>
                  </li>
                  {version.path && (
                    <li>
                      <a href={version.path} rel="nofollow">
                        <Translatable>Documentation</Translatable>
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
