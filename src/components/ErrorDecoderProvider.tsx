'use client';

import {ErrorDecoderContext} from './ErrorDecoderContext';

export function ErrorDecoderProvider({
  children,
  errorMessage,
  errorCode,
}: {
  children: React.ReactNode;
  errorMessage: string;
  errorCode: string;
}) {
  return (
    <ErrorDecoderContext.Provider value={{errorMessage, errorCode}}>
      {children}
    </ErrorDecoderContext.Provider>
  );
}
