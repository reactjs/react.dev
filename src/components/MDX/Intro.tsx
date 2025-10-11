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

export interface IntroProps {
  children?: React.ReactNode;
}

function Intro({children}: IntroProps) {
  return (
    <div className="font-display text-xl text-primary dark:text-primary-dark leading-relaxed">
      {children}
    </div>
  );
}

export default Intro;
