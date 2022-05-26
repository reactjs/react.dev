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
    const handleRouteChangeComplete = () => {
      setPendingRoute(null);
      clearTimeout(routeTransitionTimer);
    };
    events.on('routeChangeStart', handleRouteChange);
    events.on('routeChangeComplete', handleRouteChangeComplete);
    return () => {
      events.off('routeChangeStart', handleRouteChange);
      events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, []);

  return pendingRoute;
};

export default usePendingRoute;
