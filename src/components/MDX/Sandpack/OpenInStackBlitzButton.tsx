/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {OpenInStackBlitzButton as UnstyledOpenInStackBlitzButton} from '@webcontainer/react';
import {IconBolt} from '../../Icon/IconBolt';

export const OpenInStackBlitzButton = () => {
  return (
    <UnstyledOpenInStackBlitzButton
      className="text-sm text-primary dark:text-primary-dark inline-flex items-center hover:text-link duration-100 ease-in transition mx-1 ms-2 md:ms-1"
      title="Open in StackBlitz">
      <IconBolt
        className="inline mx-1 relative top-[1px]"
        width="1.2em"
        height="1.3em"
      />
      <span className="hidden md:block">StackBlitz</span>
    </UnstyledOpenInStackBlitzButton>
  );
};
