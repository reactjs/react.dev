// Error Decoder requires reading pregenerated error message from getStaticProps,
// but MDX component doesn't support props. So we use React Context to populate
// the value without prop-drilling.
// TODO: Replace with React.cache + React.use when migrating to Next.js App Router

import {createContext, useContext} from 'react';

export const ErrorDecoderContext = createContext<string | null>(null);

export const useErrorDecoder = () => {
  const errorMessages = useContext(ErrorDecoderContext);

  if (errorMessages === null) {
    throw new Error('useErrorDecoder must be used in error decoder pages only');
  }

  return errorMessages;
};
