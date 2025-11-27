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
    let routeTransitionTimer: NodeJS.Timeout | undefined = undefined;

    const handleRouteChangeStart = (url: string) => {
      if (routeTransitionTimer) clearTimeout(routeTransitionTimer);
      routeTransitionTimer = setTimeout(() => {
        if (currentRoute.current !== url) {
          currentRoute.current = url;
          setPendingRoute(url);
        }
      }, 100);
    };
    const handleRouteChangeComplete = () => {
      setPendingRoute(null);
      if (routeTransitionTimer) clearTimeout(routeTransitionTimer);
    };
    events.on('routeChangeStart', handleRouteChangeStart);
    events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      events.off('routeChangeStart', handleRouteChangeStart);
      events.off('routeChangeComplete', handleRouteChangeComplete);
      if (routeTransitionTimer) clearTimeout(routeTransitionTimer);
    };
  }, [events]);

  return pendingRoute;
};

export default usePendingRoute;
