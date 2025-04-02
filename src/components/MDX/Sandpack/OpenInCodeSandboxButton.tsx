/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {UnstyledOpenInCodeSandboxButton} from '@codesandbox/sandpack-react/unstyled';
import {IconNewPage} from '../../Icon/IconNewPage';

export const OpenInCodeSandboxButton = () => {
  return (
    <UnstyledOpenInCodeSandboxButton
      className="text-sm text-primary dark:text-primary-dark inline-flex items-center hover:text-link duration-100 ease-in transition mx-1 ms-2 md:ms-1"
      title="Open in CodeSandbox">
      <IconNewPage
        className="inline mx-1 relative top-[1px]"
        width="1em"
        height="1em"
      />
      <span className="hidden md:block">Fork</span>
    </UnstyledOpenInCodeSandboxButton>
  );
};
