/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import Container from 'components/Container';
import Header from 'components/Header';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import Translatable, {translate} from 'components/Translatable';
import Layout from 'components/Layout';
import React from 'react';
import {sharedStyles} from 'theme';

type Props = {
  location: Location,
};

const PageNotFound = ({location}: Props) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>
            <Translatable>Page Not Found</Translatable>
          </Header>
          <TitleAndMetaTags title={translate('Page Not Found')} />
          <div css={sharedStyles.markdown}>
            <p>
              <Translatable>
                We couldn't find what you were looking for.
              </Translatable>
            </p>
            <p>
              <Translatable>
                Please contact the owner of the site that linked you to the
                original URL and let them know their link is broken.
              </Translatable>
            </p>
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default PageNotFound;
