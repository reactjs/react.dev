/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {memo} from 'react';
import type {SVGProps} from 'react';

export const IconBolt = memo<SVGProps<SVGSVGElement>>(function IconBolt(props) {
  return (
    <svg
      aria-label="StackBlitz"
      viewBox="0 0 32 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path d="M5.853 18.647h8.735L9.45 31l16.697-17.647h-8.735L22.55 1 5.853 18.647z" />
    </svg>
  );
});
