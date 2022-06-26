import {SandpackState, useSandpack} from '@codesandbox/sandpack-react';
import {
  useContext,
  useReducer,
  useEffect,
  useDebugValue,
  useRef,
  useCallback,
  useState,
} from 'react';
import {TypescriptServerContext} from './TypescriptServerProvider';

interface TypescriptFileState {
  filePath: string;

  // Store user edit state
  prefer: 'ts' | 'js';
  // Stores the latest JS that the user edited.
  jsFromUserEdit?: string;

  // Store build state
  buildingTs: string;
  // Output of most recent build from ts -> js
  jsFromTs?: string;
  // When defined, we're building ts -> js
  latestBuildPromise?: Promise<unknown>;
}

interface FilesState {
  [tsFilePath: string]: TypescriptFileState;
}

function tsNameToJsName(filePath: string) {
  if (filePath.endsWith('.tsx')) {
    return filePath.slice(0, -4) + '.js';
  }
}

type TranspilerAction =
  | {
      type: 'buildStarted';
      filePath: string;
      promise: Promise<unknown>;
      ts: string;
    }
  | {
      type: 'buildFinished';
      filePath: string;
      js: string | undefined;
      promise: Promise<unknown>;
    }
  | {type: 'sandpackUpdate'; sandpack: SandpackState}
  | {type: 'reset'};

function fileReducer(
  state: TypescriptFileState,
  action: TranspilerAction
): TypescriptFileState {
  switch (action.type) {
    case 'buildStarted': {
      if (action.filePath !== state.filePath) {
        return state;
      }

      return {
        ...state,
        buildingTs: action.ts,
        latestBuildPromise: action.promise,
      };
    }
    case 'buildFinished': {
      if (action.filePath !== state.filePath) {
        return state;
      }
      return {
        ...state,
        jsFromTs: action.js || state.jsFromTs,
        latestBuildPromise:
          action.promise === state.latestBuildPromise
            ? undefined
            : state.latestBuildPromise,
      };
    }
    case 'sandpackUpdate': {
      let draft = {...state};
      let changed = false;

      // Update preferred file type.
      if (
        action.sandpack.activePath === state.filePath &&
        state.prefer !== 'ts'
      ) {
        draft.prefer = 'ts';
        changed = true;
      } else if (
        action.sandpack.activePath === tsNameToJsName(state.filePath) &&
        state.prefer !== 'js'
      ) {
        draft.prefer = 'js';
        changed = true;
      }

      // If the user changes the JS, preserve their changes in our state model.
      const activeCode =
        action.sandpack.files[action.sandpack.activePath]?.code;
      if (
        action.sandpack.activePath === tsNameToJsName(state.filePath) &&
        state.prefer === 'js' &&
        activeCode &&
        activeCode !== state.jsFromTs &&
        activeCode !== state.jsFromUserEdit
      ) {
        draft.jsFromUserEdit = activeCode;
        changed = true;
      }

      return changed ? draft : state;
    }
  }
  return state;
}

/**
 * When sandpack updates:
 *
 * - start transpiling any changed TS files to JS.
 *
 * - If the JS version of a file was the last to be active, ensure it's used
 *   instead of the TS variant of that file.
 */
function allFilesReducer(state: FilesState = {}, action: TranspilerAction) {
  console.log('transpiler:', action, state);
  if (action.type === 'reset') {
    return {};
  }

  // Build updates a single file
  if (action.type === 'buildStarted' || action.type === 'buildFinished') {
    const prevFileState = state[action.filePath];
    if (!prevFileState) {
      console.warn('action for unknown file', action);
      return state;
    }

    const nextState = fileReducer(prevFileState, action);
    if (nextState !== prevFileState) {
      return {
        ...state,
        [action.filePath]: nextState,
      };
    }
    return state;
  }

  // Sandpack state change can update multiple files
  const {sandpack} = action;
  const draft = {...state};
  let changed = false;
  for (const [filePath, fileData] of Object.entries(sandpack.files)) {
    const jsName = tsNameToJsName(filePath);
    if (!jsName) {
      // not a TS file
      continue;
    }

    const currentFileState = state[filePath];
    let nextFileState: TypescriptFileState = state[filePath] ?? {
      buildingTs: '',
      prefer: 'ts',
      filePath,
    };
    nextFileState = fileReducer(nextFileState, action);

    if (nextFileState !== currentFileState) {
      draft[filePath] = nextFileState;
      changed = true;
    }
  }
  return changed ? draft : state;
}

/**
 * When `enabled` and envId !== undefined, compile each .tsx file to .js using the typescript worker.
 */
export function useTypescriptCompiler(
  shouldEnable: boolean,
  envId: number | undefined
) {
  const enabled = Boolean(envId !== undefined && shouldEnable);
  const {sandpack} = useSandpack();
  const sandpackFiles = sandpack.files;
  const [originalFiles] = useState(() => new Set(Object.keys(sandpackFiles)));
  const firstActivePath = useRef(sandpack.activePath);
  const prevActivePath = useRef(sandpack.activePath);
  const {tsServer} = useContext(TypescriptServerContext);
  const [tsToBuildStatus, dispatch] = useReducer(allFilesReducer, {});
  useDebugValue(tsToBuildStatus);

  // Update state as Sandpack changes
  useEffect(() => {
    if (!enabled) {
      return;
    }

    dispatch({type: 'sandpackUpdate', sandpack});
  }, [enabled, sandpack]);

  // Start transpiling as Sandpack changes
  useEffect(() => {
    if (!enabled || envId === undefined) {
      return;
    }

    if (!tsServer) {
      return;
    }

    for (const [filePath, {code}] of Object.entries(sandpackFiles)) {
      const fileState = tsToBuildStatus[filePath];
      if (fileState && fileState.buildingTs !== code) {
        const promise = tsServer.workerClient
          .call('transpileFile', envId, filePath, code)
          .then((maybeJs) => {
            dispatch({
              type: 'buildFinished',
              filePath,
              js: maybeJs,
              promise,
            });
            return maybeJs;
          });
        dispatch({
          type: 'buildStarted',
          filePath,
          promise,
          ts: code,
        });
      }
    }
  }, [tsServer, sandpack, enabled, sandpackFiles, tsToBuildStatus, envId]);

  // Sync our state into Sandpack.
  useEffect(() => {
    const currentActivePath = sandpack.activePath;

    for (const fileState of Object.values(tsToBuildStatus)) {
      const jsFileName = tsNameToJsName(fileState.filePath);
      if (jsFileName) {
        const jsFile = sandpack.files[jsFileName];
        if (
          fileState.prefer === 'ts' &&
          fileState.jsFromTs !== undefined &&
          jsFile?.code !== fileState.jsFromTs
        ) {
          // Create the JS version of each TS file.
          sandpack.updateFile(jsFileName, fileState.jsFromTs);

          // Show the tab for the JS version of each TS file.
          if (
            sandpack.openPaths.includes(fileState.filePath) &&
            !sandpack.openPaths.includes(jsFileName)
          ) {
            sandpack.openFile(jsFileName);
          }
        }

        // If we change to the JS version of a file, and the user has saved JS
        // edits, restore those edits.
        if (
          currentActivePath === jsFileName &&
          prevActivePath.current !== jsFileName &&
          fileState.jsFromUserEdit
        ) {
          sandpack.updateFile(jsFileName, fileState.jsFromUserEdit);
        }
      }
    }

    sandpack.setActiveFile(currentActivePath);
    prevActivePath.current = currentActivePath;
  }, [tsToBuildStatus, sandpack]);

  const reset = useCallback(() => {
    // If we're focusing a .js file we generated, "sandpack.resetAllFiles" will
    // cause the UI to crash with null errors, so reset to a known safe file
    // just in case.
    if (!originalFiles.has(sandpack.activePath)) {
      sandpack.setActiveFile(firstActivePath.current);
    }

    dispatch({type: 'reset'});
  }, [originalFiles, sandpack]);
  return {reset};
}
