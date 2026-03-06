/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {isValidElement} from 'react';
import type {ReactNode} from 'react';

export function getMDXName(node: ReactNode) {
  if (!isValidElement(node)) {
    return null;
  }

  const props = node.props as Record<string, unknown> | null;
  const mdxName = props?.['data-mdx-name'];
  if (typeof mdxName === 'string') {
    return mdxName;
  }

  const typeMdxName = (node.type as {mdxName?: unknown})?.mdxName;
  if (typeof typeMdxName === 'string') {
    return typeMdxName;
  }

  return typeof node.type === 'string' ? node.type : null;
}
