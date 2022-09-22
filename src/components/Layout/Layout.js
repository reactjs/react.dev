/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

import patchDOMForGoogleTranslate from 'utils/patchDOMForGoogleTranslate';
import React, {Component} from 'react';
import Flex from 'components/Flex';
import Footer from 'components/LayoutFooter';
import Header from 'components/LayoutHeader';
import {media} from 'theme';

patchDOMForGoogleTranslate();

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
            marginTop:
              'calc(var(--header-height-large) + var(--survey-banner-height-normal) + var(--social-banner-height-normal))',
            [media.size('medium')]: {
              marginTop:
                'calc(var(--header-height-normal) + var(--survey-banner-height-normal) + var(--social-banner-height-normal))',
            },
            [media.lessThan('small')]: {
              marginTop:
                'calc(var(--header-height-small) + var(--survey-banner-height-small) + var(--social-banner-height-small))',
            },
          }}>
          {children}
        </Flex>
        <Footer layoutHasSidebar={layoutHasSidebar} />
      </div>
    );
  }
}

export default Template;
