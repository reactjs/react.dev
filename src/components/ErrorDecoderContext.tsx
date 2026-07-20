/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Error Decoder needs the resolved error message in the MDX subtree but MDX
// components can't receive props. We use a React Context populated by the
// route's server component to avoid prop-drilling through the MDX renderer.

import {createContext, useContext} from 'react';

const notInErrorDecoderContext = Symbol('not in error decoder context');

export const ErrorDecoderContext = createContext<
  | {errorMessage: string | null; errorCode: string | null}
  | typeof notInErrorDecoderContext
>(notInErrorDecoderContext);

export const useErrorDecoderParams = () => {
  const params = useContext(ErrorDecoderContext);

  if (params === notInErrorDecoderContext) {
    throw new Error('useErrorDecoder must be used in error decoder pages only');
  }

  return params;
};
