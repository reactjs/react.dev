/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

import {createElement} from 'glamor/react';

import type {Node} from 'react';

type Props = {
  basis: string,
  children: Node,
  direction: string,
  grow: number,
  halign: string,
  shrink: number,
  type: string,
  valign: string,
  rest: Array<any>,
};

/**
 * Convenience component for declaring a flexbox layout.
 */
const Flex = ({
  basis = 'auto',
  children,
  direction = 'row',
  grow = 0,
  halign = 'flex-start',
  shrink = 1,
  type = 'div',
  valign = 'flex-start',
  ...rest
}: Props) =>
  createElement(
    type,
    {
      css: {
        display: 'flex',
        flexDirection: direction,
        flexGrow: grow,
        flexShrink: shrink,
        flexBasis: basis,
        justifyContent: direction === 'row' ? halign : valign,
        alignItems: direction === 'row' ? valign : halign,
      },
      ...rest,
    },
    children,
  );

export default Flex;
