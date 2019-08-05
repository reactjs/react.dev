/**
 * Copyright (c) 2013-present, Facebook, Inc.
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
  body: string,
  id: string,
};

export type Edge = {
  node: Node,
};

export type allMdxData = {
  allMdx: {
    edges: Array<Edge>,
  },
};

export type mdxData = Node;
