/**
 * Provides a single web worker containing a shared typescript services.
 * This avoids us loading 8mb per active Sandpack editor using Typescript features.
 */

import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {ChannelServer, ChannelClient} from './ChannelBridge';
import {CONFIG} from './config';
import {getLocalStorage} from './localStorageHelper';
import type {TSServerWorker} from './tsserver.worker';

type TSServerContext =
  | {server: TSServer; createServer?: undefined}
  | {server?: undefined; createServer: () => void};

export const TypescriptServerContext = createContext<TSServerContext>({
  createServer: () => {},
});

class TSServer {
  worker = new Worker(new URL('./tsserver.worker.ts', import.meta.url), {
    name: 'ts-server',
  });
  renderer = new TSServerRender(getLocalStorage());
  postMessage = (msg: any) => this.worker.postMessage(msg);
  rendererServer = new ChannelServer({
    expose: this.renderer,
    responsePort: {postMessage: this.postMessage},
  });
  workerClient = new ChannelClient<TSServerWorker>(
    {postMessage: this.postMessage},
    true
  );
}

export class TSServerRender {
  constructor(private storage: Storage | undefined) {}

  loadTypescriptCache() {
    const cache = new Map<string, string>();
    const storage = this.storage;

    if (storage) {
      const keys = Object.keys(storage);

      keys.forEach((key) => {
        if (key.startsWith('ts-lib-')) {
          const item = storage.getItem(key);
          if (item) {
            cache.set(key, item);
          }
        }
      });
    }

    return cache;
  }

  saveTypescriptCache(version: string, fsMap: Map<string, string>) {
    fsMap.forEach((file, lib) => {
      const cacheKey = 'ts-lib-' + version + '-' + lib;
      this.storage?.setItem(cacheKey, file);
    });
  }
}

/**
 * Provide a web worker to offload Typescript language services.
 */
export function TypescriptServerProvider(props: {children: ReactNode}) {
  const [tsServer, setTsServer] = useState<TSServer | undefined>(undefined);

  // TODO: we could lazy-load more things here, but I'm not sure it's worth the
  // complexity yet.
  const createTsServer = useCallback(() => {
    if (typeof Worker !== undefined) {
      const tsServer = new TSServer();
      setTsServer(tsServer);
    }
  }, []);

  const context = useMemo<TSServerContext>(() => {
    if (tsServer) {
      return {server: tsServer};
    } else {
      return {createServer: createTsServer};
    }
  }, [tsServer, createTsServer]);

  useEffect(() => {
    if (!tsServer) {
      return;
    }

    tsServer.worker.addEventListener(
      'message',
      tsServer.workerClient.onMessage
    );
    tsServer.worker.addEventListener(
      'message',
      tsServer.rendererServer.onMessage
    );
    if (CONFIG.debugBridge) {
      tsServer.worker.addEventListener('message', (e) => {
        console.log('worker -> render', e.data);
      });
    }

    // We can handle calls back from the worker to the renderer now that we
    // added listeners.
    tsServer.rendererServer.sendReady();

    return () => {
      tsServer.worker.removeEventListener(
        'message',
        tsServer.workerClient.onMessage
      );
      tsServer.worker.removeEventListener(
        'message',
        tsServer.rendererServer.onMessage
      );
      tsServer.worker.terminate();
    };
  }, [tsServer]);

  return (
    <TypescriptServerContext.Provider value={context}>
      {props.children}
    </TypescriptServerContext.Provider>
  );
}
