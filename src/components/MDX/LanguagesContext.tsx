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
