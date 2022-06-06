/**
 * Provides a single web worker containing a shared typescript services.
 * This avoids us loading 8mb per active Sandpack editor using Typescript features.
 */

import {createContext, ReactNode, useEffect, useState} from 'react';
import {ChannelServer, ChannelClient} from './ChannelBridge';
import {CONFIG} from './config';
import {getLocalStorage} from './localStorageHelper';
import type {TSServerWorker} from './tsserver.worker';

export const TypescriptServerContext = createContext<TSServer | undefined>(
  undefined
);

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
  const [tsserver] = useState(() => {
    if (typeof Worker !== 'undefined') {
      return new TSServer();
    }
    return undefined;
  });

  useEffect(() => {
    if (!tsserver) {
      return;
    }

    tsserver.worker.addEventListener(
      'message',
      tsserver.workerClient.onMessage
    );
    tsserver.worker.addEventListener(
      'message',
      tsserver.rendererServer.onMessage
    );
    if (CONFIG.debugBridge) {
      tsserver.worker.addEventListener('message', (e) => {
        console.log('worker -> render', e.data);
      });
    }

    return () => {
      tsserver.worker.removeEventListener(
        'message',
        tsserver.workerClient.onMessage
      );
      tsserver.worker.removeEventListener(
        'message',
        tsserver.rendererServer.onMessage
      );
      tsserver.worker.terminate();
    };
  }, [tsserver]);

  return (
    <TypescriptServerContext.Provider value={tsserver}>
      {props.children}
    </TypescriptServerContext.Provider>
  );
}
