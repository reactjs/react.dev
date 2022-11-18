/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useRouter} from 'next/router';

export function useActiveSection(): 'learn' | 'apis' | 'home' {
  const {asPath} = useRouter();
  if (asPath.startsWith('/hooks')) {
    return 'hooks';
  } else if (asPath.startsWith('/components')) {
    return 'components';
  } else if (asPath.startsWith('/apis')) {
    return 'apis';
  } else {
    return 'learn';
  }
}
