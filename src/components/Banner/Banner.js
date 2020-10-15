/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

// $FlowFixMe Update Flow
import React from 'react';
import {colors, fonts, media} from 'theme';
import ExternalLinkSvg from 'templates/components/ExternalLinkSvg';

const linkProps = {
  href: 'https://www.surveymonkey.co.uk/r/673TZ7T',
  target: '_blank',
  rel: 'noopener',
};

export default function Banner() {
  return (
    <div
      css={{
        display: 'var(--banner-display)',
        height: 'var(--banner-height-normal)',
        fontSize: 18,
        [media.lessThan('large')]: {
          fontSize: 16,
        },
        [media.lessThan('small')]: {
          height: 'var(--banner-height-small)',
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
        <a
          css={{
            display: 'flex',
            marginRight: '1rem',
            [media.lessThan('medium')]: {
              display: 'none',
            },
          }}
          {...linkProps}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            css={{
              width: 'auto',
              height: 35,
            }}
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 134 58">
            <g>
              <path
                fill={colors.white}
                d="m60.25002,1.61335l32.24974,1.38664l25.24993,5.24999l10.99997,7.99998l3.74999,8.24998l-1.5,8.24998l-6.24998,5.24999l-10.49997,5.24999l-8.99998,2.24999l0.25,2.99999l4.99999,3.74999c0.00018,0.11336 8.50016,3.11335 8.50016,3.11335c0,0 -11.49997,0.5 -11.50015,0.38664c0.00018,0.11336 -13.24979,-1.38664 -13.24996,-1.5c0.00018,0.11336 -4.49981,-2.63663 -4.49999,-2.74999c0.00018,0.11336 -2.74981,-1.63664 -2.74999,-1.75c0.00018,0.11336 -7.9998,1.36336 -7.99998,1.25c0.00018,0.11336 -25.24976,1.61336 -25.24993,1.5c0.00018,0.11336 -21.99976,-1.38664 -21.99994,-1.5c0.00018,0.11336 -17.74978,-3.38663 -17.74995,-3.49999c0.00018,0.11336 -9.7498,-6.38662 -9.74997,-6.49998c0.00018,0.11336 -3.24982,-6.38662 -3.24999,-6.49998c0.00018,0.11336 2.00017,-9.88662 1.99999,-9.99997c0.00018,0.11336 7.75016,-9.38662 7.74998,-9.49997c0.00018,0.11336 19.75012,-9.38662 19.74995,-9.49997c0.00018,0.11336 23.50012,-4.13663 23.49994,-4.24999"
              />

              <rect
                transform="rotate(-5 37.25019073486327,27.62502670288089)"
                height="18"
                width="18"
                y="18.62503"
                x="25.7502"
                fill="#ccc"
              />
              <rect
                transform="rotate(-5 66.00012207031251,28.125024795532198)"
                height="18"
                width="18"
                y="19.37502"
                x="56.00012"
                fill="#ccc"
              />
              <rect
                transform="rotate(-5 91.75005340576159,25.875030517578093)"
                height="18"
                width="18"
                y="19"
                x="85.00004"
                fill="#ccc"
              />

              <g transform="translate(0,58) scale(0.10000000149011612,-0.10000000149011612) ">
                <path
                  fill={colors.white}
                  d="m570,574c-14,-2 -65,-9 -115,-15c-139,-18 -275,-69 -356,-134c-75,-60 -115,-163 -88,-226c41,-99 236,-151 564,-150c122,1 210,6 246,14c51,13 57,12 67,-4c28,-44 237,-67 326,-35l40,14l-45,6c-86,13 -100,18 -130,44c-29,24 -30,27 -13,34c18,8 18,8 0,5c-53,-6 -4,-72 69,-93c49,-14 49,-14 -51,-9c-117,7 -159,16 -189,45c-18,17 -26,18 -56,9c-18,-5 -114,-13 -211,-16c-165,-5 -197,-3 -363,23c-207,34 -284,116 -224,241c57,119 236,203 479,225c197,18 545,-20 671,-74c110,-47 157,-153 104,-234c-14,-22 -97,-73 -150,-92c-16,-6 -23,-11 -15,-11c25,-2 133,54 162,84c59,59 56,147 -9,211c-33,34 -97,68 -146,79c-124,27 -166,35 -257,44c-124,12 -275,19 -310,15z"
                />
                <path
                  fill={colors.text}
                  d="m377.00009,403.25c-1,-10 -16,-47 -34,-82l-33,-63l-21,36c-24,40 -29,42 -56,21c-21,-16 -18,-22 43,-90l33,-38l19,24c10,13 35,49 56,79c20,30 48,67 62,82c13,15 23,30 20,32c-2,2 -23,7 -46,11c-38,6 -43,4 -43,-12z"
                />
                <path
                  fill={colors.text}
                  d="m674.7493,403c-1,-10 -16,-47 -34,-82l-33,-63l-21,36c-24,40 -29,42 -56,21c-21,-16 -18,-22 43,-90l33,-38l19,24c10,13 35,49 56,79c20,30 48,67 62,82c13,15 23,30 20,32c-2,2 -23,7 -46,11c-38,6 -43,4 -43,-12z"
                />
                <path
                  fill={colors.text}
                  d="m965.49854,402.99999c-1,-10 -16,-47 -34,-82l-33,-63l-21,36c-24,40 -29,42 -56,21c-21,-16 -18,-22 43,-90l33,-38l19,24c10,13 35,49 56,79c20,30 48,67 62,82c13,15 23,30 20,32c-2,2 -23,7 -46,11c-38,6 -43,4 -43,-12z"
                />
              </g>
            </g>
          </svg>
        </a>

        <span
          css={{
            display: 'flex',
            [media.lessThan('small')]: {
              flexDirection: 'column',
              lineHeight: 1.5,
            },
          }}>
          <span
            css={{
              marginRight: '0.5rem',
            }}>
            We want to hear from you!
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
            <span css={{color: colors.brand}}>
              Take our 2020 Community Survey!
            </span>
            <ExternalLinkSvg
              cssProps={{
                verticalAlign: -2,
                display: 'inline-block',
                marginLeft: '0.5rem',
                color: 'inherit',
              }}
            />
          </a>
        </span>

        <div css={{display: 'flex', justifyContent: 'flex-end', flexGrow: 1}}>
          <button
            css={{
              background: 'transparent',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              border: 0,
              backgroundColor: 'hsl(222, 14%, 30%)',
              color: '#ddd',
              cursor: 'pointer',
              transition: 'color 200ms ease-out',
              ':hover': {
                color: colors.white,
              },
              marginLeft: '2rem',
              fontSize: fonts.small.fontSize,
            }}
            onClick={() => {
              // See html.js
              window.__dismissBanner();
            }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              css={{
                width: 10,
                height: 10,
              }}
              viewBox="0 0 5.8 5.8"
              alt="close">
              <path
                d="M5.8 5.16L3.54 2.9 5.8.65 5.16 0 2.9 2.26.65 0 0 .65 2.26 2.9 0 5.16l.65.64L2.9 3.54 5.16 5.8l.64-.64z"
                fill="currentColor"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
