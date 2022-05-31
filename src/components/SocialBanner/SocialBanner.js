/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

// $FlowFixMe Update Flow
import React from 'react';
import { colors, media } from 'theme';

const linkProps = {
  href: 'https://opensource.fb.com/support-ukraine',
  target: '_blank',
  rel: 'noopener',
};

const bannerText = 'Support Ukraine 🇺🇦 ';
const bannerLink = 'Help Provide Humanitarian Aid to Ukraine.';

export default function SocialBanner() {
  const [showBanner, setShowBanner] = React.useState(true);
  const updateVisibily = () => window.scrollY >= 6 ? setShowBanner(false) : setShowBanner(true)
  
  React.useEffect(() => {
    if(window.scrollY >= 6) setShowBanner(false)
    window.addEventListener('scroll', updateVisibily)
    return () => window.removeEventListener('scroll', updateVisibily)
  }, [])

  return (
    <div
      css={{
        display: showBanner ? 'var(--social-banner-display)' : 'none',
        transition: 'opacity 1s ease-out',
        height: 'var(--social-banner-height-normal)',
        fontSize: 18,
        [media.lessThan('large')]: {
          fontSize: 16,
        },
        [media.lessThan('small')]: {
          height: 'var(--social-banner-height-small)',
          fontSize: 14,
        },
      }}>
      <div
        css={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}>
        <span
          css={{
            display: 'flex',
            [media.lessThan('small')]: {
              flexDirection: 'column',
              lineHeight: 1.5,
              textAlign: 'center',
            },
          }}>
          <span
            css={{
              marginRight: '0.5rem',
            }}>
            {bannerText}
          </span>

          <a
            css={{
              color: '#ddd',
              transition: 'color 200ms ease-out',
              ':hover': {
                color: colors.white,
              },
            }}
            {...linkProps}
            target="_blank"
            rel="noopener">
            <span css={{ color: colors.brand }}>{bannerLink}</span>
          </a>
        </span>
      </div>
    </div>
  );
}