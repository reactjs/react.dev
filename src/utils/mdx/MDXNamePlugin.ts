// @ts-nocheck

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import visit from 'unist-util-visit';

type MdxNode = {
  attributes?: Array<{name: string; value?: string | null}>;
  data?: {
    hProperties?: Record<string, unknown>;
  };
  depth?: number;
  name?: string;
  type: string;
};

function upsertAttribute(
  attributes: Array<{name: string; value?: string | null}> = [],
  name: string,
  value: string
) {
  if (attributes.some((attribute) => attribute.name === name)) {
    return attributes;
  }

  return [
    ...attributes,
    {
      name,
      value,
    },
  ];
}

export function RemarkMDXNamePlugin() {
  return (tree: any) => {
    visit(tree, (node: MdxNode) => {
      if (node.type === 'heading' && typeof node.depth === 'number') {
        node.data = node.data ?? {};
        node.data.hProperties = node.data.hProperties ?? {};
        node.data.hProperties['data-mdx-name'] = `h${node.depth}`;
        return;
      }

      if (
        node.type === 'mdxJsxFlowElement' ||
        node.type === 'mdxJsxTextElement'
      ) {
        if (typeof node.name !== 'string') {
          return;
        }

        node.attributes = upsertAttribute(
          node.attributes,
          'data-mdx-name',
          node.name
        );
      }
    });
  };
}

export function RehypeMDXNamePlugin() {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      if (typeof node.tagName !== 'string') {
        return;
      }

      node.properties = node.properties ?? {};
      node.properties['data-mdx-name'] = node.tagName;
    });
  };
}
