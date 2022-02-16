/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */
import type {SandpackFile} from '@codesandbox/sandpack-react';
export type ViewportSizePreset =
  | 'iPhone X'
  | 'Pixel 2'
  | 'iPad'
  | 'Moto G4'
  | 'Surface Duo';

export type ViewportSize =
  | ViewportSizePreset
  | 'auto'
  | {width: number; height: number};

export type ViewportOrientation = 'portrait' | 'landscape';

export const generateRandomId = (): string =>
  Math.floor(Math.random() * 10000).toString();

const VIEWPORT_SIZE_PRESET_MAP: Record<
  ViewportSizePreset,
  {x: number; y: number}
> = {
  'iPhone X': {x: 375, y: 812},
  iPad: {x: 768, y: 1024},
  'Pixel 2': {x: 411, y: 731},
  'Moto G4': {x: 360, y: 640},
  'Surface Duo': {x: 540, y: 720},
};

export const computeViewportSize = (
  viewport: ViewportSize,
  orientation: ViewportOrientation
): {width?: number; height?: number} => {
  if (viewport === 'auto') {
    return {};
  }

  if (typeof viewport === 'string') {
    const {x, y} = VIEWPORT_SIZE_PRESET_MAP[viewport];
    return orientation === 'portrait'
      ? {width: x, height: y}
      : {width: y, height: x};
  }

  return viewport;
};

export const createFileMap = (codeSnippets: any) => {
  let isSingleFile = true;

  return codeSnippets.reduce(
    (result: Record<string, SandpackFile>, codeSnippet: React.ReactElement) => {
      if (codeSnippet.props.mdxType !== 'pre') {
        return result;
      }
      const {props} = codeSnippet.props.children;
      let filePath; // path in the folder structure
      let fileHidden = false; // if the file is available as a tab
      let fileActive = false; // if the file tab is shown by default

      if (props.metastring) {
        const [name, ...params] = props.metastring.split(' ');
        filePath = '/' + name;
        if (params.includes('hidden')) {
          fileHidden = true;
        }
        if (params.includes('active')) {
          fileActive = true;
        }
        isSingleFile = false;
      } else {
        if (props.className === 'language-js') {
          filePath = '/App.js';
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
        code: props.children as string,
        hidden: fileHidden,
        active: fileActive,
      };

      return result;
    },
    {}
  );
};
