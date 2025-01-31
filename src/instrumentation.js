export function register() {
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_RUNTIME === 'nodejs'
  ) {
    // watch for changes in the ./src/content directory
    // and trigger an HMR update when a change is detected via a custom WebSocket setup
    const chokidar = require('chokidar');
    const path = require('path');
    const ws = require('ws');

    const wsServer = new ws.Server({
      port: 3001,
    });

    function triggerRefresh() {
      wsServer.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({event: 'refresh'}));
        }
      });
    }

    // the process is in .next so we need to go up two level
    const contentDir = path.resolve(__dirname, '../../src/content');
    const watcher = chokidar.watch(contentDir, {
      ignoreInitial: true,
    });

    watcher.on('all', () => {
      triggerRefresh();
    });
  }
}
