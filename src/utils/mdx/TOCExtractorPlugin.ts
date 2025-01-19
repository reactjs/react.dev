import visit from 'unist-util-visit';
import {Node} from 'unist';

interface HeadingNode extends Node {
  type: 'heading';
  depth: number;
  children: Array<{
    type: string;
    value?: string;
  }>;
  data?: {
    hProperties?: {
      id?: string;
    };
  };
}

interface MDXJsxFlowElementNode extends Node {
  type: 'mdxJsxFlowElement';
  name: string;
  attributes?: Array<{
    name: string;
    value?: string;
  }>;
}

export interface ExtractedTOC {
  url: string;
  text: string;
  depth: number;
}

interface PluginOptions {
  maxDepth?: number;
}

export function TOCExtractorPlugin({maxDepth = Infinity}: PluginOptions = {}) {
  return (tree: Node, file: any) => {
    const toc: ExtractedTOC[] = [];

    visit(tree, (node: Node) => {
      // Standard markdown headings
      if (node.type === 'heading') {
        const headingNode = node as HeadingNode;
        if (headingNode.depth > maxDepth) {
          return;
        }
        const text = headingNode.children
          .filter((child) => child.type === 'text' && child.value)
          .map((child) => child.value!)
          .join('');
        const id =
          headingNode.data?.hProperties?.id ||
          text.toLowerCase().replace(/\s+/g, '-');

        toc.push({
          depth: headingNode.depth,
          text,
          url: `#${id}`,
        });
      }

      // MDX custom components (e.g., <TeamMember>)
      else if (node.type === 'mdxJsxFlowElement') {
        const mdxNode = node as MDXJsxFlowElementNode;
        switch (mdxNode.name) {
          case 'TeamMember': {
            let name = 'Team Member';
            let permalink = 'team-member';

            if (Array.isArray(mdxNode.attributes)) {
              for (const attr of mdxNode.attributes) {
                if (attr.name === 'name' && attr.value) {
                  name = attr.value;
                } else if (attr.name === 'permalink' && attr.value) {
                  permalink = attr.value;
                }
              }
            }

            toc.push({
              url: `#${permalink}`,
              depth: 3,
              text: name,
            });
            break;
          }

          case 'Challenges':
            toc.push({
              url: '#challenges',
              depth: 2,
              text: 'Challenges',
            });
            break;
          case 'Recap':
            toc.push({
              url: '#recap',
              depth: 2,
              text: 'Recap',
            });
            break;
          default:
            break;
        }
      }
    });

    // Insert "Overview" at the top if there's at least one heading
    if (toc.length > 0) {
      toc.unshift({
        url: '#',
        text: 'Overview',
        depth: 2,
      });
    }

    file.data.toc = toc;
  };
}
