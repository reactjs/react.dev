/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';

export default function LayoutAPI({children}) {
  return (
    <>
      <h1>you're in api</h1>
      <input placeholder="Search" />
      <hr />
      {children}
    </>
  );
}
