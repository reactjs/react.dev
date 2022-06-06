import {useSandpack} from '@codesandbox/sandpack-react';
import {useContext, useEffect, useMemo, useState} from 'react';
import {
  ensureAllPathsStartWithSlash,
  ensurePathStartsWithSlash,
} from './ensurePathBeginsWithSlash';
import {TypescriptServerContext} from './TypescriptServerProvider';

let globalSystemIdCounter = 0;

export const useTypescriptExtension = () => {
  const tsServerWorker = useContext(TypescriptServerContext);
  const [envId] = useState(() => globalSystemIdCounter++);

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

  // Send setup data to the worker once.
  useEffect(() => {
    if (!tsServerWorker) {
      return;
    }
    tsServerWorker.rendererServer.sendReady();
    tsServerWorker.workerClient.call('createEnv', {
      envId,
      files: ensureAllPathsStartWithSlash(sandpack.files) as any /* TODO */,
      entry: ensurePathStartsWithSlash(sandpack.activePath),
    });

    return () => {
      tsServerWorker.workerClient.call('deleteEnv', envId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // other dependencies intentionally omitted - we should initialize once, then do incremental updates.
    envId,
    tsServerWorker,
  ]);

  const activePath = sandpack.activePath;
  const extensions = useMemo(() => {
    if (!tsServerWorker || !codemirrorExtensions) {
      return [];
    }

    return codemirrorExtensions.codemirrorTypescriptExtensions({
      envId,
      client: tsServerWorker.workerClient,
      filePath: activePath,
    });
  }, [codemirrorExtensions, tsServerWorker, activePath, envId]);

  return extensions;
};
