/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

import Layout from 'components/Layout';
import Container from 'components/Container';
import Header from 'components/Header';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import Translatable, {translate} from 'components/Translatable';
import React from 'react';
import {urlRoot} from 'site-constants';
import {sharedStyles} from 'theme';

import names from '../../content/acknowledgements.yml';

const Acknowlegements = ({data, location}) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>Acknowledgements</Header>
          <TitleAndMetaTags
            canonicalUrl={`${urlRoot}/acknowledgements.html`}
            title={translate('Acknowledgements')}
          />

          <div css={sharedStyles.markdown}>
            <p>
              <Translatable>
                We'd like to thank all of our contributors:
              </Translatable>
            </p>

            <ul
              css={{
                display: 'flex',
                flexWrap: 'wrap',
              }}>
              {names.map((name, index) => (
                <li
                  css={{
                    flex: '1 0 200px',
                  }}
                  key={index}>
                  {name}
                </li>
              ))}
            </ul>

            <p>
              <Translatable>In addition, we're grateful to</Translatable>
            </p>
            <ul>
              <li>
                <Translatable>
                  <a href="https://github.com/jeffbski">Jeff Barczewski</a> for
                  allowing us to use the{' '}
                  <a href="https://www.npmjs.com/package/react">react</a>{' '}
                  package name on npm.
                </Translatable>
              </li>
              <li>
                <Translatable>
                  <a href="https://christopheraue.net/">Christopher Aue</a> for
                  letting us use the{' '}
                  <a href="https://reactjs.com/">reactjs.com</a> domain name and
                  the <a href="https://twitter.com/reactjs">@reactjs</a>{' '}
                  username on Twitter.
                </Translatable>
              </li>
              <li>
                <Translatable>
                  <a href="https://github.com/ProjectMoon">ProjectMoon</a> for
                  letting us use the{' '}
                  <a href="https://www.npmjs.com/package/flux">flux</a> package
                  name on npm.
                </Translatable>
              </li>
              <li>
                <Translatable>
                  Shane Anderson for allowing us to use the{' '}
                  <a href="https://github.com/react">react</a> org on GitHub.
                </Translatable>
              </li>
              <li>
                <Translatable>
                  <a href="https://github.com/voronianski">
                    Dmitri Voronianski
                  </a>{' '}
                  for letting us use the{' '}
                  <a href="https://labs.voronianski.com/oceanic-next-color-scheme/">
                    Oceanic Next
                  </a>{' '}
                  color scheme on this website.
                </Translatable>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default Acknowlegements;
