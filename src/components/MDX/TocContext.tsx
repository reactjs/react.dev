/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import type {ReactNode} from 'react';

export type TocItem = {
  url: string;
  text: ReactNode;
  depth: number;
};
export type Toc = Array<TocItem>;
