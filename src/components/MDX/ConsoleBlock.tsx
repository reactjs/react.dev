/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import cn from 'classnames';
import {IconWarning} from '../Icon/IconWarning';
import {IconError} from '../Icon/IconError';

type LogLevel = 'info' | 'warning' | 'error';

interface ConsoleBlockProps {
  level?: LogLevel;
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
  <div
    className={className}
    style={{width, height, backgroundColor: '#C4C4C4', ...customStyles}}></div>
);
Box.displayName = 'Box';

function ConsoleBlock({level = 'info', children}: ConsoleBlockProps) {
  let message: string | undefined;
  if (typeof children === 'string') {
    message = children;
  } else if (
    React.isValidElement(children) &&
    typeof children.props.children === 'string'
  ) {
    message = children.props.children;
  }

  return (
    <div className="mb-4" translate="no">
      <div
        className="flex w-full rounded-t-lg"
        style={{backgroundColor: '#DADEE0'}}>
        <div className="px-4 py-2" style={{borderRight: '1px solid #C4C4C4'}}>
          <Box width="15px" />
        </div>
        <div className="flex text-sm px-4">
          <div className="border-b-2" style={{borderColor: '#C4C4C4'}}>
            Console
          </div>
          <div className="px-4 py-2 flex">
            <Box className="mr-2" />
            <Box className="mr-2 hidden md:block" />
            <Box className="hidden md:block" />
          </div>
        </div>
      </div>
      <div
        className={cn(
          'flex px-4 pt-4 pb-6 items-center content-center font-mono text-code rounded-b-md',
          {
            'bg-red-30 text-red-40 bg-opacity-25': level === 'error',
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

export default ConsoleBlock;
