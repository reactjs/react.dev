import {useSandpack} from '@codesandbox/sandpack-react';
import {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {
  ensureAllPathsStartWithSlash,
  ensurePathStartsWithSlash,
} from './ensurePathBeginsWithSlash';
import {TypescriptServerContext} from './TypescriptServerProvider';
import {EditorView} from '@codemirror/view';
import {hoverTooltip} from '@codemirror/tooltip';

let globalEnvironmentIdCounter = 0;

export const useTypescriptExtension = () => {
  const {tsServer, codemirrorExtensions, setup} = useContext(
    TypescriptServerContext
  );
  const [envId] = useState(() => globalEnvironmentIdCounter++);
  const {sandpack} = useSandpack();
  const activePath = sandpack.activePath;

  // Set up the environment for this hook once the tsServer is available.
  useEffect(() => {
    if (!tsServer) {
      return;
    }

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
    tsServer,
  ]);

  const extensions = useMemo(() => {
    if (!tsServer) {
      return onceOnInteractionExtension(setup);
    }

    if (!codemirrorExtensions) {
      // Waiting for dependency to load.
      return [];
    }

    return codemirrorExtensions.codemirrorTypescriptExtensions({
      envId,
      client: tsServer.workerClient,
      filePath: activePath,
    });
  }, [tsServer, setup, codemirrorExtensions, activePath, envId]);

  return extensions;
};

/**
 * Call `setup` if the user interacts with the editor
 */
function onceOnInteractionExtension(setup: () => void) {
  let triggered = false;
  return [
    // Trigger on edit intent
    EditorView.updateListener.of((update) => {
      if (triggered) {
        return;
      }

      if (update.view.hasFocus) {
        triggered = true;
        setup();
      }
    }),
    // Trigger on tooltip intent
    hoverTooltip(() => {
      if (triggered) {
        return null;
      }

      triggered = true;
      setup();

      return null;
    }),
  ];
}
