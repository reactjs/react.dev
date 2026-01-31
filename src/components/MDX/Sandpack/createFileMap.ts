/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import type {SandpackFile} from '@codesandbox/sandpack-react/unstyled';
import type {PropsWithChildren, ReactElement, HTMLAttributes} from 'react';

export const AppJSPath = `/src/App.js`;
export const StylesCSSPath = `/src/styles.css`;
export const SUPPORTED_FILES = [AppJSPath, StylesCSSPath];

/**
 * Tokenize meta attributes while ignoring brace-wrapped metadata (e.g. {expectedErrors: …}).
 */
function splitMeta(meta: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let depth = 0;
  const trimmed = meta.trim();

  for (let ii = 0; ii < trimmed.length; ii++) {
    const char = trimmed[ii];

    if (char === '{') {
      if (depth === 0 && current) {
        tokens.push(current);
        current = '';
      }
      depth += 1;
      continue;
    }

    if (char === '}') {
      if (depth > 0) {
        depth -= 1;
      }
      if (depth === 0) {
        current = '';
      }
      if (depth < 0) {
        throw new Error(`Unexpected closing brace in meta: ${meta}`);
      }
      continue;
    }

    if (depth > 0) {
      continue;
    }

    if (/\s/.test(char)) {
      if (current) {
        tokens.push(current);
        current = '';
      }
      continue;
    }

    current += char;
  }

  if (current) {
    tokens.push(current);
  }

  if (depth !== 0) {
    throw new Error(`Unclosed brace in meta: ${meta}`);
  }

  return tokens;
}

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
        const tokens = splitMeta(props.meta);
        const name = tokens.find(
          (token) => token.includes('/') || token.includes('.')
        );
        if (name) {
          filePath = name.startsWith('/') ? name : `/${name}`;
        }
        if (tokens.includes('hidden')) {
          fileHidden = true;
        }
        if (tokens.includes('active')) {
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

      if (!filePath) {
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
