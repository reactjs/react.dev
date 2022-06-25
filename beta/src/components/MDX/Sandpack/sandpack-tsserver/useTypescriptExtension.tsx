import {hoverTooltip} from '@codemirror/tooltip';
import {EditorView} from '@codemirror/view';
import {useSandpack} from '@codesandbox/sandpack-react';
import {useContext, useEffect, useMemo, useState} from 'react';
import {getConfigForFilePath} from './config';
import {
  ensureAllPathsStartWithSlash,
  ensurePathStartsWithSlash,
} from './ensurePathBeginsWithSlash';
import {TypescriptServerContext} from './TypescriptServerProvider';
import {useTypescriptCompiler} from './useTypescriptCompiler';

let globalEnvironmentIdCounter = 0;

export const useTypescriptExtension = () => {
  const {
    tsServer,
    codemirrorExtensions,
    setup: setUpGlobalWorker,
  } = useContext(TypescriptServerContext);
  const [envId] = useState(() => globalEnvironmentIdCounter++);
  const {sandpack} = useSandpack();
  const [interacted, setInteracted] = useState(false);
  const [hasEnv, setHasEnv] = useState(false);

  const activePath = sandpack.activePath;
  const isVisible = sandpack.status !== 'initial' && sandpack.status !== 'idle';

  // Set up the environment for this hook once the tsServer is available and the
  // user interacted with the editor.
  useEffect(() => {
    if (!tsServer || !interacted || !isVisible) {
      return;
    }

    tsServer!.workerClient
      .call('createEnv', {
        envId,
        files: ensureAllPathsStartWithSlash(sandpack.files) as any /* TODO */,
        entry: ensurePathStartsWithSlash(sandpack.activePath),
      })
      .then(() => setHasEnv(true));

    return () => {
      setInteracted(false);
      tsServer.workerClient
        .call('deleteEnv', envId)
        .then(() => setHasEnv(true));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // other dependencies intentionally omitted - we should initialize once, then do incremental updates.
    envId,
    tsServer,
    interacted,
    // Destroy the environment when the user scrolls away and Sandpack stops
    // rendering.
    isVisible,
  ]);

  const extensions = useMemo(() => {
    if (!tsServer) {
      return onceOnInteractionExtension(() => {
        setUpGlobalWorker();
        setInteracted(true);
      });
    }

    if (!interacted) {
      return onceOnInteractionExtension(() => {
        setInteracted(true);
      });
    }

    if (!codemirrorExtensions) {
      // Waiting for dependency to load.
      return [];
    }

    return codemirrorExtensions.codemirrorTypescriptExtensions({
      envId,
      client: tsServer.workerClient,
      filePath: activePath,
      config: getConfigForFilePath(activePath),
    });
  }, [
    tsServer,
    interacted,
    codemirrorExtensions,
    envId,
    activePath,
    setUpGlobalWorker,
  ]);

  return {
    extension: extensions,
    envId: hasEnv ? envId : undefined,
  };
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
