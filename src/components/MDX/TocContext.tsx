/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {createContext} from 'react';
import type {ReactNode} from 'react';

export type TocItem = {
  url: string;
  text: ReactNode;
  depth: number;
};
export type Toc = Array<TocItem>;

export const TocContext = createContext<Toc>([]);
