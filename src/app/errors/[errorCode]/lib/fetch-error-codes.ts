import {unstable_cache} from 'next/cache';

export const fetchReactErrorCodes = unstable_cache(async () => {
  return (
    await fetch(
      'https://raw.githubusercontent.com/facebook/react/main/scripts/error-codes/codes.json'
    )
  ).json() as Promise<{[key: string]: string}>;
}, ['react-error-codes']);
