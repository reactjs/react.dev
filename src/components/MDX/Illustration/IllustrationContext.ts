'use client';

import {createContext} from 'react';

export const IllustrationContext = createContext<{
  isInBlock?: boolean;
}>({
  isInBlock: false,
});
