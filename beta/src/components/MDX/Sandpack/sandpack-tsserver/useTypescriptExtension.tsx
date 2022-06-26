import {hoverTooltip} from '@codemirror/tooltip';
import {EditorView} from '@codemirror/view';
import {useSandpack} from '@codesandbox/sandpack-react';
import {useContext, useDebugValue, useEffect, useMemo, useState} from 'react';
import {getConfigForFilePath} from './config';
import {
  ensureAllPathsStartWithSlash,
  ensurePathStartsWithSlash,
} from './ensurePathBeginsWithSlash';
import {TypescriptServerContext} from './TypescriptServerProvider';
import {useTypescriptCompiler} from './useTypescriptCompiler';

let globalEnvironmentIdCounter = 0;

type InitOn = 'interaction' | 'visible';

export const useTypescriptExtension = (initOn: InitOn) => {
  const {
    tsServer,
    codemirrorExtensions,
    setup: setUpGlobalWorker,
  } = useContext(TypescriptServerContext);
  const [envId] = useState(() => globalEnvironmentIdCounter++);
  const {sandpack} = useSandpack();
  const [shouldHaveEnv, setShouldHaveEnv] = useState(false);
  const [hasEnv, setHasEnv] = useState(false);

  const activePath = sandpack.activePath;

  // Set up the Typescript compiler & create the environment.
  useEffect(() => {
    if (!shouldHaveEnv) {
      return;
    }

    if (!tsServer) {
      setUpGlobalWorker();
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
      setHasEnv(false);
      tsServer.workerClient.call('deleteEnv', envId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [envId, tsServer, shouldHaveEnv, setUpGlobalWorker]);

  // Handle editor visibility change
  const isVisible = sandpack.status !== 'initial' && sandpack.status !== 'idle';
  useEffect(() => {
    if (initOn === 'visible' && isVisible && !shouldHaveEnv) {
      setShouldHaveEnv(true);
    }

    if (shouldHaveEnv && !isVisible) {
      setShouldHaveEnv(false);
    }
  }, [isVisible, initOn, shouldHaveEnv]);

  const extensions = useMemo(() => {
    if (!shouldHaveEnv && initOn === 'interaction') {
      return onceOnInteractionExtension(() => {
        setShouldHaveEnv(true);
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
    shouldHaveEnv,
    initOn,
    codemirrorExtensions,
    envId,
    tsServer?.workerClient,
    activePath,
  ]);

  useDebugValue(`envId: ${envId}, alive: ${hasEnv}`);

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
