/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import React, {Component} from 'react';
import Flex from 'components/Flex';
import Footer from 'components/LayoutFooter';
import Header from 'components/LayoutHeader';
import {media} from 'theme';

const JS_NPM_URLS = [
  '//unpkg.com/docsearch.js@2.4.1/dist/cdn/docsearch.min.js',
];

type Props = {
  children: Function,
  location: Location,
};

class Template extends Component<Props> {
  render() {
    const {children, location} = this.props;

    // TODO - is there a better way to check if we need we have a sidebar?
    let layoutHasSidebar = false;
    if (
      location.pathname.match(
        /^\/(docs|tutorial|community|blog|contributing|warnings)/,
      )
    ) {
      layoutHasSidebar = true;
    }

    const js = JS_NPM_URLS.map(url => <script key={url} src={url} />);

    return (
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 40px)',
        }}>
        <Header location={location} />
        <Flex
          direction="column"
          shrink="0"
          grow="1"
          valign="stretch"
          css={{
            flex: '1 0 auto',
            marginTop: 60,
            [media.between('medium', 'large')]: {
              marginTop: 50,
            },
            [media.lessThan('medium')]: {
              marginTop: 40,
            },
          }}>
          {children}
          {js}
        </Flex>
        <Footer layoutHasSidebar={layoutHasSidebar} />
      </div>
    );
  }
}

export default Template;
