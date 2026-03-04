/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect, useRef} from 'react';
import {useSandpack} from '@codesandbox/sandpack-react/unstyled';

/**
 * Bridges file contents from the Sandpack editor to the RSC client entry
 * running inside the iframe. When the Sandpack bundler finishes compiling,
 * reads all raw file contents and posts them to the iframe via postMessage.
 */
export function RscFileBridge() {
  const {sandpack, dispatch, listen} = useSandpack();
  const filesRef = useRef(sandpack.files);

  // TODO: fix this with useEffectEvent
  // eslint-disable-next-line react-compiler/react-compiler
  filesRef.current = sandpack.files;

  useEffect(() => {
    const unsubscribe = listen((msg: any) => {
      if (msg.type !== 'done') return;

      const files: Record<string, string> = {};
      for (const [path, file] of Object.entries(filesRef.current)) {
        files[path] = file.code;
      }

      dispatch({type: 'rsc-file-update', files} as any);
    });

    return unsubscribe;
  }, [dispatch, listen]);

  return null;
}
