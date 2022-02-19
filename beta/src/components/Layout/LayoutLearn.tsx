/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';

if (typeof alert !== 'undefined') {
  alert('lalala');
}

// @ts-ignore
export default function LayoutLearn({children}: {children: any}) {
  return (
    <>
      <h1>your in learn</h1>
      <input placeholder="Search" />
      <hr />
      {children}
    </>
  );
}
