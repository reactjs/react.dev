/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
// @ts-ignore
import {MDXContext} from '@mdx-js/react';
import {MDXComponents} from 'components/MDX/MDXComponents';

export default function MarkdownContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MDXContext.Provider value={MDXComponents}>{children}</MDXContext.Provider>
  );
}
