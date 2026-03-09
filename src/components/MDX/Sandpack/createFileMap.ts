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
import {Children, isValidElement} from 'react';
import type {
  PropsWithChildren,
  ReactElement,
  HTMLAttributes,
  ReactNode,
} from 'react';
import {getMDXName} from '../getMDXName';

export const AppJSPath = `/src/App.js`;
export const StylesCSSPath = `/src/styles.css`;
export const SUPPORTED_FILES = [AppJSPath, StylesCSSPath];

export type SandpackSnippetFile = SandpackFile & {
  visible?: boolean;
};

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

function collectCodeSnippets(children: ReactNode): ReactElement[] {
  const codeSnippets: ReactElement[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    if (getMDXName(child) === 'pre') {
      codeSnippets.push(child);
      return;
    }

    const props = child.props as {children?: ReactNode} | null;
    if (props?.children != null) {
      codeSnippets.push(...collectCodeSnippets(props.children));
    }
  });

  return codeSnippets;
}

type CodeElementProps = HTMLAttributes<HTMLDivElement> & {
  meta?: string;
  children?: ReactNode;
};

function findCodeElement(
  children: ReactNode
): ReactElement<CodeElementProps> | null {
  let codeElement: ReactElement<CodeElementProps> | null = null;

  Children.forEach(children, (child) => {
    if (codeElement || !isValidElement(child)) {
      return;
    }

    const props = child.props as CodeElementProps | null;
    if (
      getMDXName(child) === 'code' ||
      typeof props?.meta === 'string' ||
      (typeof props?.className === 'string' &&
        props.className.startsWith('language-'))
    ) {
      codeElement = child as ReactElement<CodeElementProps>;
      return;
    }

    if (props?.children != null) {
      codeElement = findCodeElement(props.children);
    }
  });

  return codeElement;
}

function getTextContent(node: ReactNode): string {
  let text = '';

  Children.forEach(node, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      text += child;
      return;
    }

    if (!isValidElement(child)) {
      return;
    }

    const props = child.props as {children?: ReactNode} | null;
    text += getTextContent(props?.children ?? null);
  });

  return text;
}

export const createFileMap = (codeSnippets: any) => {
  return collectCodeSnippets(codeSnippets).reduce(
    (
      result: Record<string, SandpackSnippetFile>,
      codeSnippet: React.ReactElement
    ) => {
      const codeElement = findCodeElement(
        (
          codeSnippet.props as PropsWithChildren<{
            children?: ReactNode;
          }>
        ).children
      );

      if (!codeElement) {
        throw new Error('Code block is missing a code element.');
      }

      const props = codeElement.props;
      let filePath; // path in the folder structure
      let fileHidden = false; // if the file is available as a tab
      let fileActive = false; // if the file tab is shown by default
      let fileVisible = false; // if the file tab should be forced visible

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
        if (tokens.includes('visible')) {
          fileVisible = true;
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
        code: getTextContent(props.children ?? null),
        hidden: fileHidden,
        active: fileActive,
        visible: fileVisible,
      };

      return result;
    },
    {}
  );
};
