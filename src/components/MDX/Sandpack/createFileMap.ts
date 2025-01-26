/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import type {SandpackFile} from '@codesandbox/sandpack-react/unstyled';
import type {PropsWithChildren, ReactElement, HTMLAttributes} from 'react';

export const AppJSPath = `/src/App.js`;
export const StylesCSSPath = `/src/styles.css`;
export const SUPPORTED_FILES = [AppJSPath, StylesCSSPath];

export const createFileMap = (codeSnippets: any) => {
  return codeSnippets.reduce(
    (result: Record<string, SandpackFile>, codeSnippet: React.ReactElement) => {
      if (
        (codeSnippet.type as any).mdxName !== 'pre' &&
        codeSnippet.type !== 'pre'
      ) {
        return result;
      }
      const {props} = (
        codeSnippet.props as PropsWithChildren<{
          children: ReactElement<
            HTMLAttributes<HTMLDivElement> & {meta?: string}
          >;
        }>
      ).children;
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
          filePath = AppJSPath;
        } else if (props.className === 'language-css') {
          filePath = StylesCSSPath;
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

      return result;
    },
    {}
  );
};
