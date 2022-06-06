import {useSandpack} from '@codesandbox/sandpack-react';
import {useContext, useEffect, useMemo, useState} from 'react';
import {
  ensureAllPathsStartWithSlash,
  ensurePathStartsWithSlash,
} from './ensurePathBeginsWithSlash';
import {TypescriptServerContext} from './TypescriptServerProvider';

let globalEnvironmentIdCounter = 0;

export const useTypescriptExtension = () => {
  const tsServerContext = useContext(TypescriptServerContext);
  const [envId] = useState(() => globalEnvironmentIdCounter++);

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

  // Set up the environment.
  useEffect(() => {
    if (!tsServerContext.server) {
      tsServerContext.createServer();
      return;
    }

    const tsServer = tsServerContext.server;
    tsServer.workerClient.call('createEnv', {
      envId,
      files: ensureAllPathsStartWithSlash(sandpack.files) as any /* TODO */,
      entry: ensurePathStartsWithSlash(sandpack.activePath),
    });

    return () => {
      tsServer.workerClient.call('deleteEnv', envId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // other dependencies intentionally omitted - we should initialize once, then do incremental updates.
    envId,
    tsServerContext,
  ]);

  const activePath = sandpack.activePath;
  const extensions = useMemo(() => {
    const tsServer = tsServerContext.server;
    if (!tsServer || !codemirrorExtensions) {
      return [];
    }

    return codemirrorExtensions.codemirrorTypescriptExtensions({
      envId,
      client: tsServer.workerClient,
      filePath: activePath,
    });
  }, [tsServerContext.server, codemirrorExtensions, activePath, envId]);

  return extensions;
};
