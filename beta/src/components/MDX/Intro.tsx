/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import React from 'react';

export interface IntroProps {
  children?: React.ReactNode;
}

function Intro({children}: IntroProps) {
  return (
    <div className="text-xl text-primary dark:text-primary-dark leading-relaxed">
      {children}
    </div>
  );
}

Intro.displayName = 'Intro';

export default Intro;
