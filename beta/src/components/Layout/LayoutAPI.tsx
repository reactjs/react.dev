/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';

// @ts-ignore
export default function LayoutAPI({children}: {children: any}) {
  return (
    <>
      <h1>your in api</h1>
      <input placeholder="Search" />
      <hr />
      {children}
    </>
  );
}
