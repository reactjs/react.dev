'use client';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useContext, useMemo} from 'react';
import type {ContextType, HTMLAttributes} from 'react';
import Link from './Link';
import {TocContext} from './TocContext';

type NestedTocRoot = {
  children: NestedTocNode[];
  item: null;
};

type NestedTocNode = {
  children: NestedTocNode[];
  item: ContextType<typeof TocContext>[number];
};

function UL(props: HTMLAttributes<HTMLUListElement>) {
  return <ul className="ms-6 my-3 list-disc" {...props} />;
}

function LI(props: HTMLAttributes<HTMLLIElement>) {
  return <li className="leading-relaxed mb-1" {...props} />;
}

function calculateNestedToc(toc: ContextType<typeof TocContext>) {
  const currentAncestors = new Map<number, NestedTocNode | NestedTocRoot>();
  const root: NestedTocRoot = {
    children: [],
    item: null,
  };

  for (let index = 1; index < toc.length; index++) {
    const item = toc[index];
    const currentParent = currentAncestors.get(item.depth - 1) ?? root;
    const node: NestedTocNode = {
      children: [],
      item,
    };

    currentParent.children.push(node);
    currentAncestors.set(item.depth, node);
  }

  return root;
}

function InlineTocItems({items}: {items: NestedTocNode[]}) {
  return (
    <UL>
      {items.map((node) => (
        <LI key={node.item.url}>
          <Link href={node.item.url}>{node.item.text}</Link>
          {node.children.length > 0 ? (
            <InlineTocItems items={node.children} />
          ) : null}
        </LI>
      ))}
    </UL>
  );
}

export default function InlineToc() {
  const toc = useContext(TocContext);
  const nestedToc = useMemo(() => calculateNestedToc(toc), [toc]);

  if (nestedToc.children.length < 2) {
    return null;
  }

  return <InlineTocItems items={nestedToc.children} />;
}
