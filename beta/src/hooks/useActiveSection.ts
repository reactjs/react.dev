/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useRouter} from 'next/router';

export function useActiveSection(): 'learn' | 'reference' | 'home' {
  const {asPath} = useRouter();
  if (asPath.startsWith('/reference')) {
    return 'reference';
  } else if (asPath.startsWith('/learn')) {
    return 'learn';
  } else {
    return 'home';
  }
}
