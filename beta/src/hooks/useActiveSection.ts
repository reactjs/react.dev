/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useRouter} from 'next/router';

export function useActiveSection(): 'learn' | 'apis' | 'hooks' | 'home' {
  const {asPath} = useRouter();
  if (asPath.startsWith('/hooks')) {
    return 'hooks';
  } else if (asPath.startsWith('/apis')) {
    return 'apis';
  } else if (asPath.startsWith('/learn')) {
    return 'learn';
  } else {
    return 'home';
  }
}
