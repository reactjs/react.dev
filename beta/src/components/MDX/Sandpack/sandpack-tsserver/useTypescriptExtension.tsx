import {hoverTooltip} from '@codemirror/tooltip';
import {EditorView} from '@codemirror/view';
import {useSandpack} from '@codesandbox/sandpack-react';
import {useContext, useEffect, useMemo, useState} from 'react';
import {
  ensureAllPathsStartWithSlash,
  ensurePathStartsWithSlash,
} from './ensurePathBeginsWithSlash';
import {TypescriptServerContext} from './TypescriptServerProvider';

let globalEnvironmentIdCounter = 0;

export const useTypescriptExtension = () => {
  const {
    tsServer,
    codemirrorExtensions,
    setup: setUpGlobalWorker,
  } = useContext(TypescriptServerContext);
  const [envId] = useState(() => globalEnvironmentIdCounter++);
  const {sandpack} = useSandpack();
  const activePath = sandpack.activePath;
  const [enabled, setEnabled] = useState(false);

  // Set up the environment for this hook once the tsServer is available and the
  // user interacted with the editor.
  useEffect(() => {
    if (!tsServer || !enabled) {
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
    enabled,
  ]);

  const extensions = useMemo(() => {
    if (!tsServer) {
      return onceOnInteractionExtension(() => {
        setUpGlobalWorker();
        setEnabled(true);
      });
    }

    if (!enabled) {
      return onceOnInteractionExtension(() => {
        setEnabled(true);
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
    });
  }, [
    tsServer,
    enabled,
    codemirrorExtensions,
    envId,
    activePath,
    setUpGlobalWorker,
  ]);

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
