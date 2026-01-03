import {useSyncExternalStore} from 'react';

export function useHash() {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener('hashchange', onChange);
      return () => {
        window.removeEventListener('hashchange', onChange);
      };
    },
    () => window.location.hash,
    () => null
  );
}
