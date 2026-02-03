/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {H2} from './Heading';

interface RecapProps {
  children: React.ReactNode;
}

function Recap({children}: RecapProps) {
  return (
    <section>
      <H2 isPageAnchor id="recap">
        Recap
      </H2>
      {children}
    </section>
  );
}

export default Recap;
