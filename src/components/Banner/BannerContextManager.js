/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

// $FlowFixMe Update Flow
import React, {useState, useLayoutEffect} from 'react';
import BannerContext from './BannerContext';

let activeBanner = null;
let snoozeStartDate = null;
const today = new Date();

function addTimes(date, days) {
  const time = new Date(date);
  time.setDate(time.getDate() + days);
  return time;
}

activeBanner = {
  storageId: 'reactjs_banner_2020survey',
  normalHeight: 50,
  smallHeight: 75,
  campaignStartDate: '2020-09-27Z', // the Z is for UTC
  campaignEndDate: '2020-12-13Z', // the Z is for UTC
  snoozeForDays: 7,
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
