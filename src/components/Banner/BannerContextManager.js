/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

// $FlowFixMe Update Flow
import React, {useState, useLayoutEffect} from 'react';
import BannerContext from './BannerContext';
import {colors} from 'theme';
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
  normalHeight: 100,
  smallHeight: 140,
  campaignStartDate: '2020-09-28Z', // the Z is for UTC
  campaignEndDate: '2020-10-13Z', // the Z is for UTC
  snoozeForDays: 7,
  content: dismiss => (
    <div
      css={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}>
      <a
        href="https://www.surveymonkey.co.uk/r/673TZ7T"
        css={{
          alignItems: 'center',
          flexBasis: 'auto',
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
        }}>
        <span
          css={{
            flexBasis: 134,
            justifyContent: 'flex-end',
            flexGrow: 2,
            textAlign: 'right',
          }}>
          <img
            src={iSurveyGraphic}
            srcSet={`${iSurveyGraphic2x} 2x`}
            width="134"
            height="58"
            alt=" "
          />
        </span>
        <span
          css={{
            flexBasis: 'auto',
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0 10px',
            textAlign: 'left',
          }}>
          We want to hear from you! Participate in React's 2020 Community
          Survey! <ButtonLink type="secondary">Take our survey </ButtonLink>
        </span>
      </a>{' '}
      <svg
        css={{
          color: colors.subtle,
          flexBasis: '.5em',
          flexShrink: 0,
          flexGrow: 0,
          alignSelf: 'start',
          cursor: 'pointer',
          transition: 'color 200ms ease-out',
          ':hover': {
            color: colors.white,
          },
        }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 5.8 5.8"
        alt="close"
        onClick={dismiss}>
        <path
          d="M5.8 5.16L3.54 2.9 5.8.65 5.16 0 2.9 2.26.65 0 0 .65 2.26 2.9 0 5.16l.65.64L2.9 3.54 5.16 5.8l.64-.64z"
          fill="currentColor"
        />
      </svg>{' '}
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
