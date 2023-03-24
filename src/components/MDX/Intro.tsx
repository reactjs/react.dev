/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';

export interface IntroProps {
  children?: React.ReactNode;
}

function Intro({children}: IntroProps) {
  return (
    <div className="font-display text-xl leading-relaxed text-primary dark:text-primary-dark">
      {children}
    </div>
  );
}

export default Intro;
