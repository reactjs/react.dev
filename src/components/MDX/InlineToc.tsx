'use client';

import Link from 'next/link';
import {HTMLAttributes, useContext, useMemo} from 'react';
import {Toc, TocContext, TocItem} from './TocContext';

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

const LI = (p: HTMLAttributes<HTMLLIElement>) => (
  <li className="leading-relaxed mb-1" {...p} />
);
const UL = (p: HTMLAttributes<HTMLUListElement>) => (
  <ul className="ms-6 my-3 list-disc" {...p} />
);

function InlineTocItem({items}: {items: Array<NestedTocNode>}) {
  return (
    <UL>
      {items.map((node) => (
        <LI key={node.item.url}>
          <Link href={node.item.url}>{node.item.text}</Link>
          {node.children.length > 0 && <InlineTocItem items={node.children} />}
        </LI>
      ))}
    </UL>
  );
}
