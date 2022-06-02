import {useSandpack} from '@codesandbox/sandpack-react';
import {useEffect, useMemo, useState} from 'react';
import {ChannelClient, ChannelServer} from './ChannelBridge';
import {DEBUG_EDITOR_RENDER} from './debug';
import {
  ensureAllPathsStartWithSlash,
  ensurePathStartsWithSlash,
} from './ensurePathBeginsWithSlash';
import {getLocalStorage} from './localStorageHelper';
import type {TSServerWorker} from './tsserver.worker';

export const useTypescriptExtension = () => {
  const [tsServerWorker] = useState(() => {
    if (typeof Worker === 'undefined') {
      return undefined;
    }

    const worker = new Worker(
      new URL('./tsserver.worker.ts', import.meta.url),
      {
        name: 'ts-server',
      }
    );

    const postMessage = DEBUG_EDITOR_RENDER.wrap('tx', (msg) =>
      worker.postMessage(msg)
    );

    const renderer = new TSServerRender(getLocalStorage());

    return {
      worker,
      renderer,
      server: new ChannelServer({
        expose: renderer,
        responsePort: {postMessage},
      }),
      client: new ChannelClient<TSServerWorker>({postMessage}, true),
    };
  });

  const [codemirrorExtensions, setCodemirrorExtensions] =
    useState<typeof import('./codemirrorExtensions')>();

  useEffect(() => {
    const loadExtensions = async () => {
      const codemirrorExtensions = await import('./codemirrorExtensions');
      setCodemirrorExtensions(codemirrorExtensions);
    };

    loadExtensions();
  }, []);

  const {sandpack} = useSandpack();

  // Subscribe to responses from the worker.
  useEffect(
    function listener() {
      if (!tsServerWorker) {
        return;
      }

      tsServerWorker.worker.addEventListener(
        'message',
        tsServerWorker.client.onMessage
      );
      tsServerWorker.worker.addEventListener(
        'message',
        tsServerWorker.server.onMessage
      );
      return () => {
        tsServerWorker.worker.removeEventListener(
          'message',
          tsServerWorker.client.onMessage
        );
        tsServerWorker.worker.removeEventListener(
          'message',
          tsServerWorker.server.onMessage
        );
      };
    },
    [tsServerWorker]
  );

  // Send setup data to the worker once.
  useEffect(() => {
    if (!tsServerWorker) {
      return;
    }
    const cache = tsServerWorker.renderer.loadTypescriptCache();
    tsServerWorker.client.call(
      'createTsSystem',
      ensureAllPathsStartWithSlash(sandpack.files) as any /* TODO */,
      ensurePathStartsWithSlash(sandpack.activePath),
      cache
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // other dependencies intentionally omitted - we should initialize once, then do incremental updates.
    tsServerWorker,
  ]);

  const activePath = sandpack.activePath;
  const extensions = useMemo(() => {
    if (!tsServerWorker || !codemirrorExtensions) {
      return [];
    }

    return codemirrorExtensions.codemirrorTypescriptExtensions(
      tsServerWorker.client,
      activePath
    );
  }, [codemirrorExtensions, tsServerWorker, activePath]);

  return extensions;
};

class TSServerRender {
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
