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

// Example usage:
// activeBanner = {
//   storageId: 'dismiss_banner_blm',
//   normalHeight: 60,
//   smallHeight: 80,
//   content: dismiss => (
//     <div>
//       <a href="test">Test</a> <button onClick={dismiss}>close</button>
//     </div>
//   ),
// };

if (activeBanner) {
  try {
    if (localStorage.getItem(activeBanner.storageId)) {
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
            localStorage.setItem(banner.storageId, 'true');
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
