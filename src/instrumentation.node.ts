/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare global {
  var __reactDocsDevWatcher:
    | {
        close: () => void;
      }
    | undefined;
}

export function registerDevContentWatcher() {
  if (globalThis.__reactDocsDevWatcher) {
    return;
  }

  const chokidar: any = require('chokidar');
  const path: any = require('path');
  const ws: any = require('ws');

  const watchTargets = [
    path.join(process.cwd(), 'src/content/**/*'),
    path.join(process.cwd(), 'src/sidebar*.json'),
    path.join(process.cwd(), 'src/siteConfig.js'),
  ];

  const socketServer = new ws.WebSocketServer({port: 3001});
  const watcher = chokidar.watch(watchTargets, {
    ignoreInitial: true,
  });

  const broadcastRefresh = () => {
    socketServer.clients.forEach((client: any) => {
      if (client.readyState === ws.WebSocket.OPEN) {
        client.send(JSON.stringify({event: 'refresh'}));
      }
    });
  };

  watcher.on('all', broadcastRefresh);

  globalThis.__reactDocsDevWatcher = {
    close() {
      watcher.close().catch(() => {});
      socketServer.close();
    },
  };
}
