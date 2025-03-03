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
