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
let snooze_start_date = null;
const today = new Date();

function addTimes(date, days) {
  const time = new Date(date);
  time.setDate(time.getDate() + days);
  return time;
}

// Example usage:
// activeBanner = {
//   storageId: 'react_banner',
//   normalHeight: 60,
//   smallHeight: 80,
//   campaign_start_date: '4 Sep 2020',
//   campaign_end_date: '28 Oct 2020',
//   snooze_for_days: 7,
//   content: dismiss => (
//     <div>
//       <a href="test">Test</a> <button onClick={dismiss}>close</button>
//     </div>
//   ),
// };

if (activeBanner) {
  try {
    if (localStorage[activeBanner.storageId]) {
      snooze_start_date = new Date(
        parseInt(localStorage.getItem(activeBanner.storageId), 10),
      );
    }
  } catch (err) {
    // Ignore.
  }

  try {
    // If it's too early or long past the campaign, don't show the banner:
    if (
      today < new Date(activeBanner.campaign_start_date) ||
      today > new Date(activeBanner.campaign_end_date)
    ) {
      activeBanner = null;
      // If we're in the campaign window, but the snooze has been set and it hasn't expired:
    } else if (
      snooze_start_date &&
      addTimes(snooze_start_date, activeBanner.snooze_for_days) >= today
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
