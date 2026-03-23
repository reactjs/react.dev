import type {SandpackFile, SandpackFiles} from '@webcontainer/react';

export function hideFiles(
  files: Record<string, string | SandpackFile>
): SandpackFiles {
  return Object.fromEntries(
    Object.entries(files).map(([name, code]) => [
      name,
      typeof code === 'string' ? {code, hidden: true} : {...code, hidden: true},
    ])
  );
}
