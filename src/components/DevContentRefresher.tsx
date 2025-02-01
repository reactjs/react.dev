'use client';

import {useRouter} from 'next/navigation';
import {useRef, useEffect} from 'react';

export function DevContentRefresher() {
  const router = useRouter();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:3001');

    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.event === 'refresh') {
        console.log('Refreshing content...');
        // @ts-ignore
        router.hmrRefresh(); // Triggers client-side refresh
      }
    };

    return () => {
      wsRef.current?.close();
    };
  }, [router]);

  return null;
}
