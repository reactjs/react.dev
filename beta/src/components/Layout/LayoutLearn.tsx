/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';

export default function LayoutLearn({children}) {
  return (
    <>
      <h1>you're in learn</h1>
      <input placeholder="Search" />
      <hr />
      {children}
    </>
  );
}
