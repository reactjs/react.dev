/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useRouter} from 'next/router';

export function useActiveSection(): 'learn' | 'apis' | 'home' {
  const {asPath} = useRouter();
  if (asPath.startsWith('/learn')) {
    return 'learn';
  } else if (asPath.startsWith('/apis')) {
    return 'apis';
  } else {
    return 'home';
  }
}
