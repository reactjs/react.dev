/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Children, isValidElement} from 'react';
import {H4} from './Heading';
import {ExpandableExampleClient} from './ExpandableExampleClient';

interface ExpandableExampleProps {
  children: React.ReactNode;
  excerpt?: string;
  type: 'DeepDive' | 'Example';
}

export default function ExpandableExample({
  children,
  excerpt,
  type,
}: ExpandableExampleProps) {
  const items = Children.toArray(children);
  const heading = items[0];
  if (!isValidElement(heading) || heading.type !== H4) {
    throw new Error(
      `Expandable content ${type} is missing a corresponding title at the beginning`
    );
  }
  const {id, children: title} = heading.props as {
    id: string;
    children: React.ReactNode;
  };
  return (
    <ExpandableExampleClient
      id={id}
      title={title}
      excerpt={excerpt}
      type={type}>
      {items.slice(1)}
    </ExpandableExampleClient>
  );
}
