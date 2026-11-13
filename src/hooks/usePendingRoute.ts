/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useRouter} from 'next/router';
import {useState, useRef, useEffect} from 'react';

const usePendingRoute = () => {
  const {events} = useRouter();
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const currentRoute = useRef<string | null>(null);
  useEffect(() => {
    let routeTransitionTimer: any = null;

    const handleRouteChangeStart = (url: string) => {
      clearTimeout(routeTransitionTimer);
      routeTransitionTimer = setTimeout(() => {
        if (currentRoute.current !== url) {
          currentRoute.current = url;
          setPendingRoute(url);
        }
      }, 100);
    };
    const handleRouteChangeEnd = () => {
      currentRoute.current = null;
      setPendingRoute(null);
      clearTimeout(routeTransitionTimer);
    };
    events.on('routeChangeStart', handleRouteChangeStart);
    events.on('routeChangeComplete', handleRouteChangeEnd);
    events.on('routeChangeError', handleRouteChangeEnd);

    return () => {
      events.off('routeChangeStart', handleRouteChangeStart);
      events.off('routeChangeComplete', handleRouteChangeEnd);
      events.off('routeChangeError', handleRouteChangeEnd);
      clearTimeout(routeTransitionTimer);
    };
  }, [events]);

  return pendingRoute;
};

export default usePendingRoute;
