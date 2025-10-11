/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {createContext} from 'react';

export type LanguageItem = {
  code: string;
  name: string;
  enName: string;
};
export type Languages = Array<LanguageItem>;

export const LanguagesContext = createContext<Languages | null>(null);
