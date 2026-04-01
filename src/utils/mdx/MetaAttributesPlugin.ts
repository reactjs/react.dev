// @ts-nocheck

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import visit from 'unist-util-visit';

export function MetaAttributesPlugin() {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      if (node.tagName === 'code' && node.data?.meta) {
        node.properties = node.properties ?? {};
        node.properties.meta = node.data.meta;
      }
    });
  };
}
