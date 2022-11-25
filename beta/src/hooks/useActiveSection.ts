/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useRouter} from 'next/router';

export function useActiveSection(): 'learn' | 'apis' | 'home' {
  const {asPath} = useRouter();
  if (asPath.startsWith('/apis')) {
    return 'apis';
  } else if (asPath.startsWith('/learn')) {
    return 'learn';
  } else {
    return 'home';
  }
}
