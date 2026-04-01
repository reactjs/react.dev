'use client';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect, useRef} from 'react';
import {useRouter} from 'next/navigation';

export function DevContentRefresher() {
  const router = useRouter();
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    socketRef.current = new WebSocket(
      `${protocol}://${window.location.hostname}:3001`
    );

    socketRef.current.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.event === 'refresh') {
        void (async () => {
          await fetch('/api/__dev-refresh', {
            method: 'POST',
          });
          router.refresh();
        })();
      }
    });

    return () => {
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [router]);

  return null;
}
