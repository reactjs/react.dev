/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use client';

import {Fragment, useMemo} from 'react';
import {MDXComponents} from 'components/MDX/MDXComponents';

export interface SerializedMDX {
  content: string;
  toc: string;
}

export function useDeserializedMDX(content: string, toc: string) {
  const parsedContent = useMemo<React.ReactNode>(
    () => JSON.parse(content, reviveNodeOnClient),
    [content]
  );
  const parsedToc = useMemo(() => JSON.parse(toc, reviveNodeOnClient), [toc]);
  return {parsedContent, parsedToc};
}

function reviveNodeOnClient(parentPropertyName: unknown, val: any) {
  if (Array.isArray(val) && val[0] === '$r') {
    let Type = val[1];
    let key = val[2];
    if (key == null) {
      key = parentPropertyName as React.Key;
    }
    let props = val[3];
    if (Type === 'wrapper') {
      Type = Fragment;
      props = {children: props.children};
    }
    if (Type in MDXComponents) {
      Type = MDXComponents[Type as keyof typeof MDXComponents];
    }
    if (!Type) {
      console.error('Unknown type: ' + Type);
      Type = Fragment;
    }
    return <Type key={key} {...props} />;
  }
  return val;
}
