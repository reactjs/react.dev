/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import React from 'react';

import {LiveRunner} from './LiveRunner';
import {RunnerFile} from './types';

function Sandpack({children}: {children: React.ReactNode}) {
  let codeSnippets = React.Children.toArray(children) as React.ReactElement[];
  let isSingleFile = true;

  const files = codeSnippets.reduce(
    (result: RunnerFile[], codeSnippet: React.ReactElement) => {
      if (codeSnippet.props.mdxType !== 'pre') {
        return result;
      }
      const {props} = codeSnippet.props.children;
      let filePath: string; // path in the folder structure
      let fileHidden = false; // if the file is available as a tab
      let fileActive = false; // if the file tab is shown by default

      if (props.metastring) {
        const [name, ...params] = props.metastring.split(' ');
        if (name.endsWith('.json')) return result;
        filePath = name;
        if (params.includes('hidden')) {
          fileHidden = true;
        }
        if (params.includes('active')) {
          fileActive = true;
        }
        isSingleFile = false;
      } else {
        if (props.className === 'language-js') {
          filePath = 'App.js';
        } else if (props.className === 'language-css') {
          filePath = 'styles.css';
          fileHidden = true;
        } else {
          throw new Error(
            `Code block is missing a filename: ${props.children}`
          );
        }
      }
      if (result.some((file) => file.path === filePath)) {
        throw new Error(
          `File ${filePath} was defined multiple times. Each file snippet should have a unique path name`
        );
      }
      result.push({
        path: filePath,
        code: (props.children as string).trim(),
        hidden: fileHidden,
        active: fileActive,
      });

      return result;
    },
    []
  );

  return (
    <div className="sandpack-container my-8" translate="no">
      <LiveRunner files={files} />
    </div>
  );
}

Sandpack.displayName = 'Sandpack';

export default Sandpack;
