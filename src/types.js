/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the CC-BY-4.0 license found
 * in the LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 * @flow
 */

export type Author = {
  name: string,
  url: string,
};

export type Node = {
  excerpt: string,
  fields: {
    date?: string,
    path: string,
    redirect: string,
    slug: string,
  },
  frontmatter: {
    author?: Array<Author>,
    next?: string,
    prev?: string,
    title: string,
  },
  html: string,
  id: string,
};

export type Edge = {
  node: Node,
};

export type allMarkdownRemarkData = {
  allMarkdownRemark: {
    edges: Array<Edge>,
  },
};

export type markdownRemarkData = Node;
