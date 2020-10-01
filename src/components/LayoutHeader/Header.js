/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

import Banner from 'components/Banner';
import Container from 'components/Container';
import HeaderLink from './HeaderLink';
import {Link} from 'gatsby';
import React from 'react';
import {colors, fonts, media} from 'theme';
import {version} from 'site-constants';
import ExternalLinkSvg from 'templates/components/ExternalLinkSvg';
import DocSearch from './DocSearch';

// $FlowFixMe
import navHeader from '../../../content/headerNav.yml';

import logoSvg from 'icons/logo.svg';

const ContainerWrapper = ({children}) => (
  <div
    css={{
      backgroundColor: 'hsl(222, 14%, 10%)',
    }}>
    {children}
  </div>
);

const Header = ({location}: {location: Location}) => (
  <header
    css={{
      backgroundColor: colors.darker,
      color: colors.white,
      position: 'fixed',
      zIndex: 1,
      width: '100%',
      top: 0,
      left: 0,
      '@media print': {
        display: 'none',
      },
    }}>
    <ContainerWrapper>
      <Container>
        <div style={{position: 'relative'}}>
          <Banner />
        </div>
      </Container>
    </ContainerWrapper>
    <Container>
      <div
        css={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          height: 60,
          [media.between('small', 'large')]: {
            height: 50,
          },
          [media.lessThan('small')]: {
            height: 40,
          },
        }}>
        <Link
          css={{
            display: 'flex',
            marginRight: 10,
            height: '100%',
            alignItems: 'center',
            color: colors.brand,

            ':focus': {
              outline: 0,
              color: colors.white,
            },

            [media.greaterThan('small')]: {
              width: 'calc(100% / 6)',
            },
            [media.lessThan('small')]: {
              flex: '0 0 auto',
            },
          }}
          to="/">
          <img src={logoSvg} alt="" height="20" />
          <span
            css={{
              color: 'inherit',
              marginLeft: 10,
              fontWeight: 700,
              fontSize: 20,
              lineHeight: '20px',
              [media.lessThan('large')]: {
                fontSize: 16,
                marginTop: 1,
              },
              [media.lessThan('small')]: {
                // Visually hidden
                position: 'absolute',
                overflow: 'hidden',
                clip: 'rect(0 0 0 0)',
                height: 1,
                width: 1,
                margin: -1,
                padding: 0,
                border: 0,
              },
            }}>
            React
          </span>
        </Link>

        <nav
          css={{
            flex: '1',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            overflowX: 'auto',
            overflowY: 'hidden',
            WebkitOverflowScrolling: 'touch',
            height: '100%',

            // Hide horizontal scrollbar
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '::-webkit-scrollbar': {
              display: 'none',
            },

            [media.size('xsmall')]: {
              flexGrow: '1',
              width: 'auto',
            },
            [media.greaterThan('xlarge')]: {
              width: null,
            },
            [media.lessThan('small')]: {
              maskImage:
                'linear-gradient(to right, transparent, black 20px, black 90%, transparent)',
            },
          }}>
          {navHeader.items.map(link => (
            <HeaderLink
              key={link.title}
              isActive={location.pathname.includes(link.activeSelector)}
              title={link.title}
              to={link.to}
            />
          ))}
        </nav>

        <DocSearch />

        <div
          css={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: 'auto',

            //[media.lessThan('medium')]: {
            //width: 'auto',
            //},
            //[media.greaterThan('large')]: {
            //width: 'calc(100% / 4)',
            //},
          }}>
          <Link
            css={{
              padding: '5px 10px',
              whiteSpace: 'nowrap',
              ...fonts.small,

              ':hover': {
                color: colors.brand,
              },

              ':focus': {
                outline: 0,
                backgroundColor: colors.lighter,
                borderRadius: 15,
              },

              [media.lessThan('medium')]: {
                display: 'none',
              },
            }}
            to="/versions">
            v{version}
          </Link>
          <Link
            css={{
              display: 'flex',
              alignItems: 'center',
              padding: '5px 10px',
              whiteSpace: 'nowrap',
              ...fonts.small,

              ':hover': {
                color: colors.brand,
              },

              ':focus': {
                outline: 0,
                backgroundColor: colors.lighter,
                borderRadius: 15,
              },
            }}
            to="/languages">
            <LanguagesIcon />{' '}
            <span
              css={{
                marginLeft: '0.5rem',

                [media.lessThan('medium')]: {
                  display: 'none',
                },
              }}>
              Languages
            </span>
          </Link>
          <a
            css={{
              padding: '5px 10px',
              marginLeft: 10,
              whiteSpace: 'nowrap',
              ...fonts.small,

              ':hover': {
                color: colors.brand,
              },

              ':focus': {
                outline: 0,
                backgroundColor: colors.lighter,
                borderRadius: 15,
              },

              [media.lessThan('large')]: {
                display: 'none',
              },
            }}
            href="https://github.com/facebook/react/"
            target="_blank"
            rel="noopener">
            GitHub
            <ExternalLinkSvg
              cssProps={{
                marginLeft: 5,
                verticalAlign: -2,
                color: colors.subtle,
              }}
            />
          </a>
        </div>
      </div>
    </Container>
  </header>
);

const LanguagesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      css={{fill: 'currentColor'}}
      d="
        M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5
        7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09
        5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62
        7l1.62-4.33L19.12 17h-3.24z
      "
    />
  </svg>
);

export default Header;
