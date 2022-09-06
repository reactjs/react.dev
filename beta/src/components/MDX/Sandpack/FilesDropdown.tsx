/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import cn from 'classnames';
import {IconChevron} from '../../Icon/IconChevron';
import {useSandpack} from '@codesandbox/sandpack-react';
import {Listbox} from '@headlessui/react';

const getFileName = (filePath: string): string => {
  const lastIndexOfSlash = filePath.lastIndexOf('/');
  return filePath.slice(lastIndexOfSlash + 1);
};

export function FilesDropdown() {
  const {sandpack} = useSandpack();
  const {openPaths, setActiveFile, activePath} = sandpack;
  return (
    <Listbox value={activePath} onChange={setActiveFile}>
      <Listbox.Button>
        {({open}) => (
          <span
            className={cn(
              'h-full py-2 px-1 mt-px -mb-px flex border-b-2 text-link dark:text-link-dark border-link dark:border-link-dark items-center text-md leading-tight truncate'
            )}
            style={{maxWidth: '160px'}}>
            {getFileName(activePath)}
            <span className="ml-2">
              <IconChevron displayDirection={open ? 'up' : 'down'} />
            </span>
          </span>
        )}
      </Listbox.Button>
      <Listbox.Options className="absolute mt-0.5 bg-card dark:bg-card-dark px-2 left-0 right-0 mx-0 rounded-b-lg border-1 border-border dark:border-border-dark rounded-sm shadow-md">
        {openPaths.map((filePath: string) => (
          <Listbox.Option
            key={filePath}
            value={filePath}
            className={cn(
              'text-md mx-2 my-4 cursor-pointer',
              filePath === activePath && 'text-link dark:text-link-dark'
            )}>
            {getFileName(filePath)}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
}
