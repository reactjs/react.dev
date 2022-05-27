import {useRouter} from 'next/router';
import React from 'react';

const usePendingRoute = () => {
  const {events} = useRouter();
  const [pendingRoute, setPendingRoute] = React.useState<string | null>(null);
  const currentRoute = React.useRef<string | null>(null);
  React.useEffect(() => {
    let routeTransitionTimer: any = null;

    const handleRouteChange = (url: string) => {
      routeTransitionTimer = setTimeout(() => {
        if (currentRoute.current === url) return;
        currentRoute.current = url;
        setPendingRoute(url);
      }, 100);
    };
    const cleanupPendingState = () => {
      setPendingRoute(null);
      clearTimeout(routeTransitionTimer);
    };
    events.on('routeChangeStart', handleRouteChange);
    events.on('routeChangeComplete', cleanupPendingState);
    events.on('routeChangeError', cleanupPendingState);
    return () => {
      events.off('routeChangeStart', handleRouteChange);
      events.off('routeChangeComplete', cleanupPendingState);
      events.off('routeChangeError', cleanupPendingState);
      clearTimeout(routeTransitionTimer);
    };
  }, []);

  return pendingRoute;
};

export default usePendingRoute;
