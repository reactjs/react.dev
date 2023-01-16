/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import type {SandpackFile} from '@codesandbox/sandpack-react';
import {SnippetTargetLanguage} from './SnippetLanguage';

export const createFileMap = (
  codeSnippets: React.ReactElement[],
  snippetTargetLanguage: SnippetTargetLanguage
) => {
  let hasTSVersion = false;
  const isTSFile = (filePath: string) => /\.(ts|tsx)$/.test(filePath);
  const isJSFile = (filePath: string) => /\.(js|jsx)$/.test(filePath);

  const files = codeSnippets.reduce<Record<string, SandpackFile>>(
    (result, codeSnippet) => {
      if ((codeSnippet.type as any).mdxName !== 'pre') {
        return result;
      }
      const {props} = codeSnippet.props.children;
      let filePath; // path in the folder structure
      let fileHidden = false; // if the file is available as a tab
      let fileActive = false; // if the file tab is shown by default

      if (props.meta) {
        const [name, ...params] = props.meta.split(' ');
        filePath = '/' + name;
        if (params.includes('hidden')) {
          fileHidden = true;
        }
        if (params.includes('active')) {
          fileActive = true;
        }
      } else {
        if (props.className === 'language-js') {
          filePath = '/App.js';
        } else if (props.className === 'language-tsx') {
          filePath = '/App.tsx';
        } else if (props.className === 'language-css') {
          filePath = '/styles.css';
        } else {
          throw new Error(
            `Code block is missing a filename: ${props.children}`
          );
        }
      }
      if (result[filePath]) {
        throw new Error(
          `File ${filePath} was defined multiple times. Each file snippet should have a unique path name`
        );
      }

      result[filePath] = {
        code: (props.children || '') as string,
        hidden: fileHidden,
        active: fileActive,
      };

      if (isTSFile(filePath)) {
        hasTSVersion = true;
      }

      return result;
    },
    {}
  );

  for (const filePath in files) {
    // Only remove JS files if we have a TS version available.
    // If no TS version is available we continue to display JS files.
    // Assuming that if one file is available as TS, every file is.
    // Assuming a JS version is available all the time.
    if (snippetTargetLanguage === 'ts' && isJSFile(filePath) && hasTSVersion) {
      delete files[filePath];
    } else if (snippetTargetLanguage === 'js' && isTSFile(filePath)) {
      delete files[filePath];
    }
  }

  return {files, hasTSVersion};
};
