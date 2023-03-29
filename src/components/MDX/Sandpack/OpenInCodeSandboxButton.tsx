/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {UnstyledOpenInCodeSandboxButton} from '@codesandbox/sandpack-react';
import {IconNewPage} from '../../Icon/IconNewPage';

export const OpenInCodeSandboxButton = () => {
  return (
    <UnstyledOpenInCodeSandboxButton
      className="mx-1 ml-2 inline-flex items-center text-sm text-primary transition duration-100 ease-in hover:text-link dark:text-primary-dark md:ml-1"
      title="Open in CodeSandbox">
      <IconNewPage
        className="relative top-[1px] ml-1 mr-1 inline"
        width="1em"
        height="1em"
      />
      <span className="hidden md:block">Fork</span>
    </UnstyledOpenInCodeSandboxButton>
  );
};
