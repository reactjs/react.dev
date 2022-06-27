import type {SandpackFiles} from '@codesandbox/sandpack-react';

export function ensurePathStartsWithSlash(path: string): string;
export function ensurePathStartsWithSlash(path: undefined): undefined;
export function ensurePathStartsWithSlash(path?: string) {
  if (path === undefined || path[0] === '/') {
    return path;
  }
  return `/${path}`;
}

export function ensureAllPathsStartWithSlash(fs: SandpackFiles): SandpackFiles {
  return Object.fromEntries(
    Object.entries(fs).map(([key, value]) => [
      ensurePathStartsWithSlash(key),
      value,
    ])
  );
}
