/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import Layout from 'components/Layout';
import Container from 'components/Container';
import Header from 'components/Header';
import React from 'react';
import {sharedStyles} from 'theme';

import Translatable from 'components/Translatable';

type Props = {
  location: Location,
};

const JsxCompiler = ({location}: Props) => (
  <Layout location={location}>
    <Container>
      <div css={sharedStyles.articleLayout.container}>
        <div css={sharedStyles.articleLayout.content}>
          <Header>
            <Translatable>JSX Compiler Service</Translatable>
          </Header>
          <div css={sharedStyles.markdown}>
            <p>
              <strong>
                <Translatable>
                  This tool has been removed as JSXTransformer has been
                  deprecated.
                </Translatable>
              </strong>
            </p>
            <p>
              <Translatable>
                We recommend using another tool such as{' '}
                <a href="https://babeljs.io/repl/">the Babel REPL</a>.
              </Translatable>
            </p>
          </div>
        </div>
      </div>
    </Container>
  </Layout>
);

export default JsxCompiler;
