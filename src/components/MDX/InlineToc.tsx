'use client';

// import Link from 'next/link';
import Link from './Link';
import {useContext, useMemo} from 'react';
import {Toc, TocContext, TocItem} from './TocContext';
import {UL, LI} from './Primitives';

type NestedTocRoot = {
  item: null;
  children: Array<NestedTocNode>;
};

type NestedTocNode = {
  item: TocItem;
  children: Array<NestedTocNode>;
};

function calculateNestedToc(toc: Toc): NestedTocRoot {
  const currentAncestors = new Map<number, NestedTocNode | NestedTocRoot>();
  const root: NestedTocRoot = {
    item: null,
    children: [],
  };
  const startIndex = 1; // Skip "Overview"
  for (let i = startIndex; i < toc.length; i++) {
    const item = toc[i];
    const currentParent: NestedTocNode | NestedTocRoot =
      currentAncestors.get(item.depth - 1) || root;
    const node: NestedTocNode = {
      item,
      children: [],
    };
    currentParent.children.push(node);
    currentAncestors.set(item.depth, node);
  }
  return root;
}

export function InlineToc() {
  const toc = useContext(TocContext);
  const root = useMemo(() => calculateNestedToc(toc), [toc]);
  if (root.children.length < 2) {
    return null;
  }
  return <InlineTocItem items={root.children} />;
}

function InlineTocItem({items}: {items: Array<NestedTocNode>}) {
  return (
    <UL>
      {items.map((node) => (
        <LI key={node.item.url}>
          <Link href={node.item.url}>{node.item.node}</Link>
          {node.children.length > 0 && <InlineTocItem items={node.children} />}
        </LI>
      ))}
    </UL>
  );
}
