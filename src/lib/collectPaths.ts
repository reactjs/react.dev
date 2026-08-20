/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import 'server-only';
import {listContentFiles} from 'contentFiles';

const DEV_ONLY_PAGES = new Set(['learn/rsc-sandbox-test']);

export function isContentPageAvailable(segments: string[]): boolean {
  return (
    process.env.NODE_ENV !== 'production' ||
    !DEV_ONLY_PAGES.has(segments.join('/'))
  );
}

// 'foo/bar/baz.md' -> ['foo', 'bar', 'baz']
// 'foo/bar/qux/index.md' -> ['foo', 'bar', 'qux']
function getSegments(file: string): string[] {
  const segments = file.slice(0, -3).split('/');
  if (segments[segments.length - 1] === 'index') {
    segments.pop();
  }
  return segments;
}

/**
 * Collect all content paths under a top-level section folder.
 * Returns each path as an array of segments, *without* the section prefix.
 *
 * Example: for section="learn", returns [['state'], ['state', 'managing-state'], ...]
 */
export async function collectSectionPaths(
  section: string
): Promise<string[][]> {
  return listContentFiles()
    .filter((file) => file.startsWith(section + '/'))
    .map((file) => getSegments(file).slice(1))
    .filter((segments) => isContentPageAvailable([section, ...segments]));
}

/**
 * Collect every content path under `src/content` as segment arrays, with
 * `index` collapsed the same way the `.md` route handler resolves them
 * (e.g. `learn/index.md` -> ['learn'], served at `/learn.md`). Used to
 * statically prerender the markdown route handler.
 */
export async function collectAllContentPaths(): Promise<string[][]> {
  return (
    listContentFiles()
      .map(getSegments)
      // Drop the root `index.md` (-> []); `/index.md` isn't a served URL and an
      // empty catch-all param can't be prerendered.
      .filter((segments) => segments.length > 0)
      .filter(isContentPageAvailable)
  );
}

/**
 * Collect a flat list of slugs (one segment) for a top-level section
 * that only contains direct `.md` files (no subdirectories), e.g. `warnings/`.
 */
export async function collectFlatSectionSlugs(
  section: string
): Promise<string[]> {
  return (await collectSectionPaths(section))
    .filter((segments) => segments.length === 1)
    .map(([slug]) => slug);
}
