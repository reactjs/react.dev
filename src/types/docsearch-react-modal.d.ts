/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

// This module must be declared and because the dynamic import in
// "src/components/Search.tsx" is not able to resolve the types from
// the package.
declare module '@docsearch/react/modal' {
  // re-exports the types from @docsearch/react/dist/esm/index.d.ts
  export * from '@docsearch/react/dist/esm/index';
}
