/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {isValidElement} from 'react';
import * as React from 'react';
import cn from 'classnames';
import {IconWarning} from '../Icon/IconWarning';
import {IconError} from '../Icon/IconError';

type LogLevel = 'warning' | 'error' | 'info';

interface ConsoleBlockProps {
  level?: LogLevel;
  children: React.ReactNode;
}

interface ConsoleBlockMultiProps {
  children: React.ReactNode;
}

const Box = ({
  width = '60px',
  height = '17px',
  className,
  customStyles,
}: {
  width?: string;
  height?: string;
  className?: string;
  customStyles?: Record<string, string>;
}) => (
  <div className={className} style={{width, height, ...customStyles}}></div>
);

export function ConsoleBlock({level = 'error', children}: ConsoleBlockProps) {
  let message: React.ReactNode | null;
  if (typeof children === 'string') {
    message = children;
  } else if (isValidElement(children)) {
    message = (children as React.ReactElement<{children?: React.ReactNode}>)
      .props.children;
  }

  return (
    <div
      className="console-block mb-4 text-secondary bg-wash dark:bg-wash-dark rounded-lg"
      translate="no"
      dir="ltr">
      <div className="flex w-full rounded-t-lg bg-gray-200 dark:bg-gray-80">
        <div className="px-4 py-2 border-gray-300 dark:border-gray-90 border-r">
          <Box className="bg-gray-300 dark:bg-gray-70" width="15px" />
        </div>
        <div className="flex text-sm px-4">
          <div className="border-b-2 border-gray-300 dark:border-gray-90 text-tertiary dark:text-tertiary-dark">
            Console
          </div>
          <div className="px-4 py-2 flex">
            <Box className="me-2 bg-gray-300 dark:bg-gray-70" />
            <Box className="me-2 hidden md:block bg-gray-300 dark:bg-gray-70" />
            <Box className="hidden md:block bg-gray-300 dark:bg-gray-70" />
          </div>
        </div>
      </div>
      <div
        className={cn(
          'flex px-4 pt-4 pb-6 items-center content-center font-mono text-code rounded-b-md',
          {
            'bg-red-30 text-red-50 dark:text-red-30 bg-opacity-5':
              level === 'error',
            'bg-yellow-5 text-yellow-50': level === 'warning',
            'bg-gray-5 text-secondary dark:text-secondary-dark':
              level === 'info',
          }
        )}>
        {level === 'error' && <IconError className="self-start mt-1.5" />}
        {level === 'warning' && <IconWarning className="self-start mt-1" />}
        <div className="px-3">{message}</div>
      </div>
    </div>
  );
}

export function ConsoleBlockMulti({children}: ConsoleBlockMultiProps) {
  return (
    <div
      className="console-block mb-4 text-secondary bg-wash dark:bg-wash-dark rounded-lg"
      translate="no"
      dir="ltr">
      <div className="flex w-full rounded-t-lg bg-gray-200 dark:bg-gray-80">
        <div className="px-4 py-2 border-gray-300 dark:border-gray-90 border-r">
          <Box className="bg-gray-300 dark:bg-gray-70" width="15px" />
        </div>
        <div className="flex text-sm px-4">
          <div className="border-b-2 border-gray-300 dark:border-gray-90 text-tertiary dark:text-tertiary-dark">
            Console
          </div>
          <div className="px-4 py-2 flex">
            <Box className="me-2 bg-gray-300 dark:bg-gray-70" />
            <Box className="me-2 hidden md:block bg-gray-300 dark:bg-gray-70" />
            <Box className="hidden md:block bg-gray-300 dark:bg-gray-70" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 divide-y divide-gray-300 dark:divide-gray-70 text-base">
        {children}
      </div>
    </div>
  );
}

export function ConsoleLogLine({children, level}: ConsoleBlockProps) {
  let message: React.ReactNode | null;
  if (typeof children === 'string') {
    message = children;
  } else if (isValidElement(children)) {
    message = (children as React.ReactElement<{children?: React.ReactNode}>)
      .props.children;
  } else if (Array.isArray(children)) {
    message = children.reduce((result, child) => {
      if (typeof child === 'string') {
        result += child;
      } else if (isValidElement(child)) {
        // @ts-ignore
        result += child.props.children;
      }
      return result;
    }, '');
  }

  return (
    <div
      className={cn(
        'ps-4 pe-2 pt-1 pb-2 grid grid-cols-[18px_auto] font-mono rounded-b-md',
        {
          'bg-red-30 text-red-50 dark:text-red-30 bg-opacity-5':
            level === 'error',
          'bg-yellow-5 text-yellow-50': level === 'warning',
          'bg-gray-5 text-secondary dark:text-secondary-dark': level === 'info',
        }
      )}>
      {level === 'error' && (
        <IconError className="self-start mt-1.5 text-[.7rem] w-6" />
      )}
      {level === 'warning' && (
        <IconWarning className="self-start mt-1 text-[.65rem] w-6" />
      )}
      <div className="px-2 pt-1 whitespace-break-spaces text-code leading-tight">
        {message}
      </div>
    </div>
  );
}
