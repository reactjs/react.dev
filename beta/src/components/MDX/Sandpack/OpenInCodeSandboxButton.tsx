/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {useCodeSandboxLink} from '@codesandbox/sandpack-react';
import cn from 'classnames';
import {IconNewPage} from '../../Icon/IconNewPage';

export const OpenInCodeSandboxButton = ({className}: {className?: string}) => {
  const url = useCodeSandboxLink();

  return (
    <a
      className={cn(
        'text-sm text-primary dark:text-primary-dark inline-flex items-center hover:text-link duration-100 ease-in transition mx-1',
        className
      )}
      href={url}
      rel="noreferrer noopener"
      target="_blank"
      title="Open in CodeSandbox">
      <span className="hidden md:inline">
        <IconNewPage className="inline mb-0.5 text-base" /> Fork
      </span>
      <span className="inline md:hidden">
        <IconNewPage className="inline mb-0.5 text-base" /> Fork
      </span>
    </a>
  );
};
