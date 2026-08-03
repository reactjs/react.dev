/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use client';

import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

declare const gtag: (...args: any[]) => void;

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined' || typeof gtag === 'undefined') return;
    gtag('event', 'pageview', {event_label: pathname});
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const terminationEvent = 'onpagehide' in window ? 'pagehide' : 'unload';
    const handler = () => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'timing', {
          event_label: 'JS Dependencies',
          event: 'unload',
        });
      }
    };
    window.addEventListener(terminationEvent, handler);
    return () => window.removeEventListener(terminationEvent, handler);
  }, []);

  return null;
}

export function ScrollRestoration() {
  useEffect(() => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      history.scrollRestoration = 'auto';
    }
  }, []);
  return null;
}
