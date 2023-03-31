/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {H2} from './Heading';
import Trans from './Trans';

interface RecapProps {
  children: React.ReactNode;
}

function Recap({children}: RecapProps) {
  return (
    <section>
      <H2 isPageAnchor id="recap">
        Recap
        <Trans>요약</Trans>
      </H2>
      {children}
    </section>
  );
}

export default Recap;
