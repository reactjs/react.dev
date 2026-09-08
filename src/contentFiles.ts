/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import 'server-only';

// Must live next to content/: Turbopack's import.meta.glob doesn't match
// patterns starting with `../`. The *.md loader rule is in next.config.js.
const contentModules = import.meta.glob('./content/**/*.md', {
  import: 'default',
}) as Record<string, () => Promise<string>>;

const PREFIX = './content/';

const contentFiles = new Map<string, () => Promise<string>>();
for (const [key, load] of Object.entries(contentModules)) {
  contentFiles.set(key.slice(PREFIX.length), load);
}

export function listContentFiles(): string[] {
  return Array.from(contentFiles.keys());
}

export async function readContentFile(
  relativePath: string
): Promise<string | null> {
  const load = contentFiles.get(relativePath);
  return load ? load() : null;
}

export async function readContentPage(
  routePath: string
): Promise<string | null> {
  return (
    (await readContentFile(routePath + '.md')) ??
    (await readContentFile(routePath + '/index.md'))
  );
}
