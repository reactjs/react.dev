/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useRouter} from 'next/compat/router';
import {useState, useRef, useEffect} from 'react';

const usePendingRoute = () => {
  const pagesRouter = useRouter();
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const currentRoute = useRef<string | null>(null);
  useEffect(() => {
    if (!pagesRouter) {
      return;
    }

    const {events} = pagesRouter;

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
    const handleRouteChangeComplete = () => {
      setPendingRoute(null);
      clearTimeout(routeTransitionTimer);
    };
    events.on('routeChangeStart', handleRouteChangeStart);
    events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      events.off('routeChangeStart', handleRouteChangeStart);
      events.off('routeChangeComplete', handleRouteChangeComplete);
      clearTimeout(routeTransitionTimer);
    };
  }, [pagesRouter]);

  return pendingRoute;
};

export default usePendingRoute;
