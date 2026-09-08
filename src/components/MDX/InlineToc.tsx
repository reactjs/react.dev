import Link from './Link';
import {LI, UL} from './Primitives';
import type {Toc, TocItem} from './TocContext';

type NestedTocNode = {item: TocItem; children: NestedTocNode[]};

function calculateNestedToc(toc: Toc) {
  const ancestors = new Map<
    number,
    NestedTocNode | {children: NestedTocNode[]}
  >();
  const root: {children: NestedTocNode[]} = {children: []};
  for (let index = 1; index < toc.length; index++) {
    const item = toc[index];
    const parent = ancestors.get(item.depth - 1) ?? root;
    const node = {item, children: []};
    parent.children.push(node);
    ancestors.set(item.depth, node);
  }
  return root;
}

export function InlineToc({toc}: {toc: Toc}) {
  const root = calculateNestedToc(toc);
  if (root.children.length < 2) {
    return null;
  }
  return <InlineTocItems items={root.children} />;
}

function InlineTocItems({items}: {items: NestedTocNode[]}) {
  return (
    <UL>
      {items.map((node) => (
        <LI key={node.item.url}>
          <Link href={node.item.url}>{node.item.text}</Link>
          {node.children.length > 0 && <InlineTocItems items={node.children} />}
        </LI>
      ))}
    </UL>
  );
}
