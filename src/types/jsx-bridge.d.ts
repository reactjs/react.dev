// Bridge for files using the legacy global `JSX` namespace.
// React 19's `@types/react` exposes JSX under `React.JSX` only.
import type * as React from 'react';

declare global {
  namespace JSX {
    type Element = React.JSX.Element;
    type ElementClass = React.JSX.ElementClass;
    type ElementType = React.JSX.ElementType;
    type IntrinsicAttributes = React.JSX.IntrinsicAttributes;
    type IntrinsicClassAttributes<T> = React.JSX.IntrinsicClassAttributes<T>;
    type IntrinsicElements = React.JSX.IntrinsicElements;
    type LibraryManagedAttributes<C, P> = React.JSX.LibraryManagedAttributes<
      C,
      P
    >;
  }
}
