import type {Root} from 'mdast';
import type {VFile} from 'vfile';
import visit from 'unist-util-visit';

export interface ExtractedTocItem {
  url: string;
  depth: number;
  source?: string;
  text?: string;
}

function sourceForChildren(
  source: string,
  children: Array<{
    position?: {start: {offset?: number}; end: {offset?: number}};
  }>
) {
  const start = children[0]?.position?.start.offset;
  const end = children.at(-1)?.position?.end.offset;
  return start == null || end == null ? '' : source.slice(start, end).trim();
}

export function TOCExtractorPlugin({maxDepth = 3} = {}) {
  return (tree: Root, file: VFile) => {
    const toc: ExtractedTocItem[] = [];
    const source = String(file.value);

    visit(tree, (node: any) => {
      if (node.type === 'heading' && node.depth <= maxDepth) {
        const id = node.data?.hProperties?.id;
        if (id) {
          toc.push({
            url: `#${id}`,
            depth: node.depth,
            source: sourceForChildren(source, node.children),
          });
        }
        return;
      }

      if (node.type !== 'mdxJsxFlowElement') {
        return;
      }

      if (node.name === 'Challenges' || node.name === 'Recap') {
        toc.push({
          url: node.name === 'Challenges' ? '#challenges' : '#recap',
          depth: 2,
          text: node.name,
        });
      } else if (node.name === 'TeamMember') {
        const attributes = new Map(
          (node.attributes ?? []).map((attribute: any) => [
            attribute.name,
            attribute.value,
          ])
        );
        const name = String(attributes.get('name') ?? 'Team Member');
        const permalink = String(attributes.get('permalink') ?? 'team-member');
        toc.push({url: `#${permalink}`, depth: 3, text: name});
      }
    });

    if (toc.length > 0) {
      toc.unshift({url: '#', depth: 2, text: 'Overview'});
    }
    file.data.toc = toc;
  };
}
