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
import {media, sharedStyles} from 'theme';

// $FlowFixMe This is a valid path
import languages from '../../content/languages.yml';

// Status enums indicate what percentage of "core" content has been translated:
// 0: Incomplete (0–49%)
// 1: Partially complete (50–94%)
// 2: Complete (95–100%)
const {complete, incomplete, partial} = languages.reduce(
  (reduced, language) => {
    switch (language.status) {
      case 0:
        reduced.incomplete.push(language);
        break;
      case 1:
        reduced.partial.push(language);
        break;
      case 2:
        reduced.complete.push(language);
        break;
    }
    return reduced;
  },
  {complete: [], incomplete: [], partial: []},
);

type Props = {
  location: Location,
};

const Languages = ({location}: Props) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>
            <Translatable>Languages</Translatable>
          </Header>
          <TitleAndMetaTags
            canonicalUrl={`${urlRoot}/languages/`}
            title={translate('Languages')}
          />

          <div css={sharedStyles.markdown}>
            <p>
              <Translatable>
                The React documentation is available in the following languages:
              </Translatable>
            </p>

            <LanguagesGrid languages={complete} />

            <h2>
              <Translatable>In Progress</Translatable>
            </h2>
            <LanguagesGrid languages={partial} />

            <h2>
              <Translatable>Needs Contributors</Translatable>
            </h2>
            <LanguagesGrid languages={incomplete} />

            <p>
              <Translatable>Don't see your language above?</Translatable>{' '}
              <a
                href="https://github.com/reactjs/reactjs.org-translation#reactjsorg-translation"
                target="_blank"
                rel="noopener">
                <Translatable>Let us know</Translatable>
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

const LanguagesGrid = ({languages}) => (
  <ul
    css={{
      display: 'flex',
      flexWrap: 'wrap',
      marginLeft: -20,
    }}>
    {languages
      .sort((a, b) => a.code.localeCompare(b.code))
      .map(({code, name, status, translated_name}) => (
        <Language
          key={code}
          code={code}
          name={name}
          status={status}
          translatedName={translated_name}
        />
      ))}
  </ul>
);

const Language = ({code, name, status, translatedName}) => {
  const prefix = code === 'en' ? '' : `${code}.`;

  return (
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
        {status === 0 && translatedName}
        {status > 0 && (
          <a
            href={`https://${prefix}reactjs.org/`}
            rel="nofollow"
            lang={code}
            hrefLang={code}>
            {translatedName}
          </a>
        )}
      </div>
      <div css={{marginTop: 10}}>
        <a
          css={{
            fontSize: 12,
          }}
          href={`https://github.com/reactjs/${prefix}reactjs.org/`}
          target="_blank"
          rel="noopener">
          <Translatable>Contribute</Translatable>
        </a>
      </div>
    </li>
  );
};

export default Languages;
