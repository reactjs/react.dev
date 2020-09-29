/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

// $FlowFixMe Update Flow
import React, {useState, useLayoutEffect} from 'react';
import BannerContext from './BannerContext';
import {colors, media} from 'theme';
import ButtonLink from 'components/ButtonLink';
import iSurveyGraphic2x from 'images/i_survey@2x.png';
import iSurveyGraphic from 'images/i_survey.png';

let activeBanner = null;
let snoozeStartDate = null;
const today = new Date();

function addTimes(date, days) {
  const time = new Date(date);
  time.setDate(time.getDate() + days);
  return time;
}

// Example usage:
activeBanner = {
  storageId: 'reactjs_banner_2020survey',
  normalHeight: 80,
  smallHeight: 100,
  campaignStartDate: '2020-09-27Z', // the Z is for UTC
  campaignEndDate: '2020-12-13Z', // the Z is for UTC
  snoozeForDays: 7,
  content: dismiss => (
    <div
      css={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}>
      <span
        css={{
          alignItems: 'center',
          flexBasis: 'auto',
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
        }}>
        <span
          css={{
            flexBasis: 100,
            justifyContent: 'flex-end',
            flexGrow: 2,
            textAlign: 'right',
            [media.lessThan('small')]: {
              display: 'none',
            },
          }}>
          <a href="https://www.surveymonkey.co.uk/r/673TZ7T">
            <img
              src={iSurveyGraphic}
              srcSet={`${iSurveyGraphic2x} 2x`}
              width="100"
              height="43"
              alt=" "
            />
          </a>
        </span>
        <span
          css={{
            flexBasis: 'auto',
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0 10px',
            textAlign: 'left',
            [media.lessThan('small')]: {
              textAlign: 'center',
            },
          }}>
          <span
            css={{
              fontSize: 20,
              [media.lessThan('small')]: {
                fontSize: 16,
              },
              paddingRight: '.5em',
            }}>
            {' '}
            We want to hear from you!
          </span>
          <ButtonLink
            to="https://www.surveymonkey.co.uk/r/673TZ7T"
            type="secondary">
            Take our 2020 Community Survey!{' '}
          </ButtonLink>
        </span>
      </span>{' '}
      <span
        onClick={dismiss}
        css={{
          background: colors.darker,
          color: colors.subtle,
          fontSize: 12,
          alignSelf: 'start',
          borderRadius: '0 .25em 0 .25em',
          cursor: 'pointer',
          padding: '.25em',
          position: 'absolute',
          right: 0,
          bottom: '.25em', // Account for border-radius
          transform: 'translateY(100%)',
          transition: 'color 200ms ease-out',
          [media.lessThan('small')]: {
            fontSize: 20,
          },
          ':hover': {
            color: colors.white,
          },
        }}>
        {' '}
        Close
        <svg
          css={{
            color: 'inherit',
            marginLeft: '.5em',
            display: 'inline-block',
            width: '.5em',
          }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 5.8 5.8"
          alt=" ">
          <path
            d="M5.8 5.16L3.54 2.9 5.8.65 5.16 0 2.9 2.26.65 0 0 .65 2.26 2.9 0 5.16l.65.64L2.9 3.54 5.16 5.8l.64-.64z"
            fill="currentColor"
          />
        </svg>
      </span>
    </div>
  ),
};

if (activeBanner) {
  try {
    if (localStorage[activeBanner.storageId]) {
      snoozeStartDate = new Date(
        parseInt(localStorage.getItem(activeBanner.storageId), 10),
      );
    }
  } catch (err) {
    // Ignore.
  }

  try {
    // If it's too early or long past the campaign, don't show the banner:
    if (
      today < new Date(activeBanner.campaignStartDate) ||
      today > new Date(activeBanner.campaignEndDate)
    ) {
      activeBanner = null;
      // If we're in the campaign window, but the snooze has been set and it hasn't expired:
    } else if (
      snoozeStartDate &&
      addTimes(snoozeStartDate, activeBanner.snoozeForDays) >= today
    ) {
      activeBanner = null;
    }
  } catch (err) {
    // Ignore.
  }
}

type Props = {
  children: mixed,
};

export default function BannerContextManager({children}: Props) {
  const [bannerContext, setBannerContext] = useState({
    banner: null,
    dismiss() {},
  });

  // Apply after hydration.
  useLayoutEffect(() => {
    if (activeBanner) {
      let banner = activeBanner;
      setBannerContext({
        banner,
        dismiss: () => {
          try {
            localStorage.setItem(banner.storageId, Date.now().toString());
          } catch (err) {
            // Ignore.
          }
          // Don't show for next navigations within the session.
          activeBanner = null;
          // Hide immediately.
          setBannerContext({
            banner: null,
            dismiss() {},
          });
        },
      });
    }
  }, []);

  return (
    <BannerContext.Provider value={bannerContext}>
      {children}
    </BannerContext.Provider>
  );
}
