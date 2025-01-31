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
  node: string | React.ReactNode;
  depth: number;
}

interface PluginOptions {
  maxDepth?: number;
}

export function TOCExtractorPlugin({maxDepth = 3}: PluginOptions = {}) {
  return (tree: Node, file: any) => {
    const toc: ExtractedTOC[] = [];

    visit(tree, (node: Node) => {
      // Standard markdown headings
      if (node.type === 'heading') {
        const headingNode = node as HeadingNode;
        if (headingNode.depth > maxDepth) {
          return;
        }

        const mdxSource = file.value
          .slice(
            // @ts-ignore
            node.children[0].position!.start.offset,
            // @ts-ignore
            node.children[0].position!.end.offset
          )
          .trim();

        const text = headingNode.children
          .filter((child) => child.type === 'text' && child.value)
          .map((child) => child.value!)
          .join('');

        const id =
          headingNode.data?.hProperties?.id ||
          text.toLowerCase().replace(/\s+/g, '-');

        toc.push({
          depth: headingNode.depth,
          node: mdxSource,
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
              node: name,
            });
            break;
          }

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
          default:
            break;
        }
      }
    });

    // Insert "Overview" at the top if there's at least one heading
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
