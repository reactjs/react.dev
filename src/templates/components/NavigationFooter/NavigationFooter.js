/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import Container from 'components/Container';
import Flex from 'components/Flex';
import Link from 'gatsby-link';
import React from 'react';
import {colors, fonts, media} from 'theme';

type Props = {
  next?: string,
  prev?: string,
  location: Location,
};

const NavigationFooter = ({next, prev, location}: Props) => {
  return (
    <div
      css={{
        background: colors.dark,
        color: colors.white,
        paddingTop: 50,
        paddingBottom: 50,
      }}>
      <Container>
        <Flex
          type="ul"
          halign="space-between"
          css={{
            [media.between('small', 'medium')]: {
              paddingRight: 240,
            },

            [media.between('large', 'largerSidebar')]: {
              paddingRight: 280,
            },

            [media.between('largerSidebar', 'sidebarFixed', true)]: {
              paddingRight: 380,
            },
          }}>
          <Flex basis="50%" type="li">
            {prev && (
              <div>
                <SecondaryLabel>Previous article</SecondaryLabel>
                <div
                  css={{
                    paddingTop: 10,
                  }}>
                  <PrimaryLink location={location} to={prev}>
                    {linkToTitle(prev)}
                  </PrimaryLink>
                </div>
              </div>
            )}
          </Flex>
          {next && (
            <Flex
              halign="flex-end"
              basis="50%"
              type="li"
              css={{
                textAlign: 'right',
              }}>
              <div>
                <SecondaryLabel>Next article</SecondaryLabel>
                <div
                  css={{
                    paddingTop: 10,
                  }}>
                  <PrimaryLink location={location} to={next}>
                    {linkToTitle(next)}
                  </PrimaryLink>
                </div>
              </div>
            </Flex>
          )}
        </Flex>
      </Container>
    </div>
  );
};

export default NavigationFooter;

const linkToTitle = (link: string): string =>
  link.replace(/-/g, ' ').replace('.html', '');

type PrimaryLinkProps = {
  children: string,
  to: string,
  location: Location,
};

const PrimaryLink = ({children, to, location}: PrimaryLinkProps) => {
  // quick fix
  // TODO: replace this with better method of getting correct full url
  const updatedUrl =
    (location && location.pathname.replace(/\/[^/]+\.html/, '/' + to)) || to;
  return (
    <Link
      css={{
        display: 'inline',
        textTransform: 'capitalize',
        borderColor: colors.subtle,
        transition: 'border-color 0.2s ease',
        fontSize: 30,
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',

        [media.lessThan('large')]: {
          fontSize: 24,
        },
        [media.size('xsmall')]: {
          fontSize: 16,
        },
        ':hover': {
          borderColor: colors.white,
        },
      }}
      to={updatedUrl}>
      {children}
    </Link>
  );
};

const SecondaryLabel = ({children}: {children: string}) => (
  <div
    css={{
      color: colors.brand,
      ...fonts.small,
    }}>
    {children}
  </div>
);
