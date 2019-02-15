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
import React from 'react';
import {media, sharedStyles} from 'theme';

// $FlowFixMe This is a valid path
import languages from '../../content/languages.yml';

const sortedLanguages = languages.sort((a, b) =>
  a.label.localeCompare(b.label),
);

type Props = {
  location: Location,
};

const Languages = ({location}: Props) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>Languages</Header>
          <TitleAndMetaTags title="React - Languages" />

          <div css={sharedStyles.markdown}>
            <p>
              The React documentation is available in the following languages:
            </p>

            <ul
              css={{
                display: 'flex',
                flexWrap: 'wrap',
                marginLeft: -20,
              }}>
              {sortedLanguages.map(language => (
                <li
                  css={{
                    paddingLeft: 20,
                    paddingTop: 20,
                    borderTop: '1px dotted #ececec',
                    paddingBottom: 20,
                    width: '100%',
                    listStyle: 'none',

                    [media.size('small')]: {
                      width: '50%',
                    },

                    [media.size('medium')]: {
                      width: '33.33%',
                    },

                    [media.greaterThan('large')]: {
                      width: '25%',
                    },
                  }}
                  key={language.label}>
                  <h4>{language.label}</h4>
                  <div css={{marginTop: 10}}>
                    <a href={language.url} rel="nofollow">
                      View Documentation
                    </a>
                  </div>
                  <div css={{marginTop: 10}}>
                    <a
                      href={language.repository}
                      target="_blank"
                      rel="noopener">
                      Contribute
                    </a>
                  </div>
                </li>
              ))}
            </ul>

            <p>
              Don't see your language above?{' '}
              <a
                href="https://github.com/reactjs/reactjs.org/issues/new"
                target="_blank"
                rel="noopener">
                Let us know
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default Languages;
