'use client';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {ErrorDecoderContext} from './ErrorDecoderContext';

export function ErrorDecoderProvider({
  children,
  errorCode,
  errorMessage,
}: {
  children: React.ReactNode;
  errorCode: string | null;
  errorMessage: string | null;
}) {
  return (
    <ErrorDecoderContext.Provider value={{errorCode, errorMessage}}>
      {children}
    </ErrorDecoderContext.Provider>
  );
}
