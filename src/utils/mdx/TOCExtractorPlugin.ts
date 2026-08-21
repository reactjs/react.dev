import type {PhrasingContent, Root} from 'mdast';
import type {VFile} from 'vfile';

export interface ExtractedTocItem {
  url: string;
  depth: number;
  children?: PhrasingContent[];
  text?: string;
}

// Drops the trailing {/*custom-id*/} expression.
function headingContent(children: PhrasingContent[]): PhrasingContent[] {
  const content = [...children];
  const last = content[content.length - 1] as {type: string} | undefined;
  if (last?.type === 'mdxTextExpression') {
    content.pop();
  }
  const lastText = content[content.length - 1];
  if (lastText?.type === 'text') {
    content[content.length - 1] = {
      ...lastText,
      value: lastText.value.replace(/\s+$/, ''),
    };
  }
  return content;
}

// Only top-level headings go into the TOC, so this must run before
// MaxWidthWrapperPlugin moves them into <MaxWidth> wrappers.
export function TOCExtractorPlugin({maxDepth = 3} = {}) {
  return (tree: Root, file: VFile) => {
    const toc: ExtractedTocItem[] = [];

    for (const node of tree.children as any[]) {
      if (node.type === 'heading') {
        const id = node.data?.hProperties?.id;
        if (node.depth <= maxDepth && id) {
          toc.push({
            url: `#${id}`,
            depth: node.depth,
            children: headingContent(node.children),
          });
        }
        continue;
      }

      if (node.type !== 'mdxJsxFlowElement') {
        continue;
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
    }

    if (toc.length > 0) {
      toc.unshift({url: '#', depth: 2, text: 'Overview'});
    }
    file.data.toc = toc;
  };
}
