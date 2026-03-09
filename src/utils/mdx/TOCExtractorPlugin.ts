// @ts-nocheck

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Heading, Root} from 'mdast';
import toString from 'mdast-util-to-string';
import visit from 'unist-util-visit';

export interface ExtractedTOC {
  url: string;
  node: string | React.ReactNode;
  depth: number;
}

interface PluginOptions {
  maxDepth?: number;
}

type MDXAttribute = {
  name: string;
  value?: string | null;
};

type MDXJsxFlowElement = Root['children'][number] & {
  name?: string;
  attributes?: MDXAttribute[];
};

function getAttributeValue(
  attributes: MDXAttribute[] | undefined,
  name: string,
  fallback: string
) {
  const attribute = attributes?.find((candidate) => candidate.name === name);
  return typeof attribute?.value === 'string' ? attribute.value : fallback;
}

export function TOCExtractorPlugin({maxDepth = 3}: PluginOptions = {}) {
  return (tree: Root, file: {data: Record<string, unknown>; value: string}) => {
    const toc: ExtractedTOC[] = [];

    visit(tree, (node) => {
      if (node.type === 'heading') {
        const heading = node as Heading;
        if (heading.depth > maxDepth) {
          return;
        }

        const firstChild = heading.children[0];
        const lastChild = heading.children[heading.children.length - 1];
        const start = firstChild?.position?.start.offset;
        const end = lastChild?.position?.end.offset;
        const rawHeading =
          typeof start === 'number' && typeof end === 'number'
            ? file.value.slice(start, end).trim()
            : toString(heading);
        const text = toString(heading);
        const id =
          heading.data?.hProperties?.id ||
          text.toLowerCase().trim().replace(/\s+/g, '-');

        toc.push({
          depth: heading.depth,
          node: rawHeading,
          url: `#${id}`,
        });
        return;
      }

      if (node.type !== 'mdxJsxFlowElement') {
        return;
      }

      const mdxNode = node as MDXJsxFlowElement;
      switch (mdxNode.name) {
        case 'Challenges':
          toc.push({
            url: '#challenges',
            depth: 2,
            node: 'Challenges',
          });
          break;
        case 'Recap':
          toc.push({
            url: '#recap',
            depth: 2,
            node: 'Recap',
          });
          break;
        case 'TeamMember':
          toc.push({
            url: `#${getAttributeValue(
              mdxNode.attributes,
              'permalink',
              'team-member'
            )}`,
            depth: 3,
            node: getAttributeValue(mdxNode.attributes, 'name', 'Team Member'),
          });
          break;
        default:
          break;
      }
    });

    if (toc.length > 0) {
      toc.unshift({
        url: '#',
        node: 'Overview',
        depth: 2,
      });
    }

    file.data.toc = toc;
  };
}
