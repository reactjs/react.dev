// @ts-nocheck

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Root, RootContent} from 'mdast';
import u from 'unist-builder';

const FULL_WIDTH_TYPES = new Set([
  'Sandpack',
  'FullWidth',
  'Illustration',
  'IllustrationBlock',
  'Challenges',
  'Recipes',
]);

export function MaxWidthWrapperPlugin() {
  return (tree: Root) => {
    const nextChildren: RootContent[] = [];
    let wrapQueue: RootContent[] = [];

    const flushWrapper = () => {
      if (wrapQueue.length === 0) {
        return;
      }

      nextChildren.push(
        u('mdxJsxFlowElement', {
          name: 'MaxWidth',
          attributes: [],
          children: wrapQueue,
        } as never)
      );
      wrapQueue = [];
    };

    for (const child of tree.children) {
      if (
        child.type === 'mdxJsxFlowElement' &&
        typeof child.name === 'string' &&
        FULL_WIDTH_TYPES.has(child.name)
      ) {
        flushWrapper();
        nextChildren.push(child);
        continue;
      }

      wrapQueue.push(child);
    }

    flushWrapper();
    tree.children = nextChildren;
  };
}
