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
  useRef,
  useState,
} from 'react';
import {ChannelServer, ChannelClient} from './ChannelBridge';
import {CONFIG} from './config';
import {getLocalStorage} from './localStorageHelper';
import type {TSServerWorker} from './tsserver.worker';

type TSServerContext =
  | {
      tsServer: TSServer;
      codemirrorExtensions: typeof import('./codemirrorExtensions') | undefined;
      setup?: undefined;
    }
  | {tsServer?: undefined; codemirrorExtensions?: undefined; setup: () => void};

export const TypescriptServerContext = createContext<TSServerContext>({
  setup: () => {},
});

export class TSServer {
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

// Cache structure:
// ts-lib:${version}:list - list of all files that should be in the cache, as JSON
// ts-lib:${version}:file:${filePath} - a file in the cache
function getFileListKey(version: string) {
  return `ts-lib:${version}:list`;
}
function getFileCachePrefix(version: string) {
  return `ts-lib:${version}:file:`;
}
function getFileCacheKey(version: string, filePath: string) {
  return getFileCachePrefix(version) + filePath;
}

export class TSServerRender {
  constructor(private storage: Storage | undefined) {}

  loadTypescriptCache(version: string) {
    const storage = this.storage;
    if (!storage) {
      return undefined;
    }

    const cache = new Map<string, string>();
    const listJSON = storage.getItem(getFileListKey(version));
    if (listJSON === null) {
      return undefined;
    }

    const list = JSON.parse(listJSON);
    for (const fileName of list) {
      const item = storage.getItem(getFileCacheKey(version, fileName));
      if (item !== null) {
        cache.set(fileName, item);
      } else {
        // Cache missing some files, can't use it.
        console.warn('Typescript libraries cache missing file:', fileName);
        return undefined;
      }
    }

    return cache;
  }

  saveTypescriptCache(version: string, fsMap: Map<string, string>) {
    const list = Array.from(fsMap.keys());
    this.storage?.setItem(getFileListKey(version), JSON.stringify(list));
    fsMap.forEach((content, fileName) => {
      const cacheKey = getFileCacheKey(version, fileName);
      this.storage?.setItem(cacheKey, content);
    });
  }
}

/**
 * Provide a web worker to offload Typescript language services.
 */
export function TypescriptServerProvider(props: {children: ReactNode}) {
  const startedLoading = useRef(false);
  const [tsServer, setTsServer] = useState<TSServer | undefined>(undefined);
  const [codemirrorExtensions, setCodemirrorExtensions] =
    useState<typeof import('./codemirrorExtensions')>();

  const createTsServer = useCallback(() => {
    if (
      startedLoading.current === false &&
      typeof Worker !== undefined &&
      tsServer === undefined
    ) {
      // Need to use a ref so we create the worker only once.
      startedLoading.current = true;
      import('./codemirrorExtensions').then(setCodemirrorExtensions);
      const tsServer = new TSServer();
      setTsServer(tsServer);
    }
  }, [tsServer]);

  const context = useMemo<TSServerContext>(() => {
    if (tsServer) {
      return {tsServer, codemirrorExtensions};
    } else {
      return {setup: createTsServer};
    }
  }, [tsServer, codemirrorExtensions, createTsServer]);

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
