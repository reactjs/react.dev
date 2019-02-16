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

const completedLangauges = languages
  .filter(language => language.is_completed)
  .sort((a, b) => a.code.localeCompare(b.code));
const inProgressLangauges = languages
  .filter(language => !language.is_completed)
  .sort((a, b) => a.code.localeCompare(b.code));

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
              {completedLangauges.map(language => (
                <Language
                  key={language.code}
                  code={language.code}
                  name={language.name}
                  translatedName={language.translated_name}
                />
              ))}
            </ul>

            <h2>In Progress</h2>

            <ul
              css={{
                display: 'flex',
                flexWrap: 'wrap',
                marginLeft: -20,
              }}>
              {inProgressLangauges.map(language => (
                <Language
                  key={language.code}
                  code={language.code}
                  name={language.name}
                  translatedName={language.translated_name}
                />
              ))}
            </ul>

            <p>
              Don't see your language above?{' '}
              <a
                href="https://github.com/reactjs/reactjs.org-translation#reactjsorg-translation"
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

const Language = ({code, name, translatedName}) => (
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
    key={code}>
    <div css={{}}>{name}</div>
    <div
      css={{
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 8,
      }}>
      <a href={`https://${code}.reactjs.org/`} rel="nofollow">
        {translatedName}
      </a>
    </div>
    <div css={{marginTop: 10}}>
      <a
        css={{
          fontSize: 12,
        }}
        href={`https://github.com/reactjs/${code}.reactjs.org/`}
        target="_blank"
        rel="noopener">
        Contribute
      </a>
    </div>
  </li>
);

export default Languages;
