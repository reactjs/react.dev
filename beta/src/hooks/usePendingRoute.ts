/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useRouter} from 'next/router';
import React from 'react';

const usePendingRoute = () => {
  const {events} = useRouter();
  const [pendingRoute, setPendingRoute] = React.useState<string | null>(null);
  const currentRoute = React.useRef<string | null>(null);
  React.useEffect(() => {
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
  }, []);

  return pendingRoute;
};

export default usePendingRoute;
