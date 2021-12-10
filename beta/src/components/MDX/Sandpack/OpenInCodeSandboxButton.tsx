/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {UnstyledOpenInCodeSandboxButton} from '@codesandbox/sandpack-react';
import cn from 'classnames';
import {IconNewPage} from '../../Icon/IconNewPage';

export const OpenInCodeSandboxButton = ({className}: {className?: string}) => {
  return (
    <UnstyledOpenInCodeSandboxButton
      className={cn(
        'text-sm text-primary dark:text-primary-dark inline-flex items-center hover:text-link duration-100 ease-in transition mx-1',
        className
      )}
      title="Open in CodeSandbox">
      <span className="inline">
        <IconNewPage className="inline mb-0.5 text-base" /> Fork
      </span>
    </UnstyledOpenInCodeSandboxButton>
  );
};
