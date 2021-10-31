/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {IconTerminal} from '../Icon/IconTerminal';

type LogLevel = 'info' | 'warning' | 'error';

interface TerminalBlockProps {
  level?: LogLevel;
  children: React.ReactNode;
}

function LevelText({type}: {type: LogLevel}) {
  switch (type) {
    case 'warning':
      return <span className="text-yellow-50 bg-none mr-1">Warning: </span>;
    case 'error':
      return <span className="text-red-40 mr-1">Error: </span>;
    default:
      return null;
  }
}

function TerminalBlock({level = 'info', children}: TerminalBlockProps) {
  let message: string | undefined;
  if (typeof children === 'string') {
    message = children;
  } else if (
    React.isValidElement(children) &&
    typeof children.props.children === 'string'
  ) {
    message = children.props.children;
  }

  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <div className="rounded-lg bg-secondary dark:bg-gray-50 h-full hover:bg-gray-50 dark:hover:bg-gray-500">
      <div className="bg-gray-90 dark:bg-gray-60 w-full rounded-t-lg">
        <div className="text-primary-dark dark:text-primary-dark flex text-sm px-4 py-0.5 relative justify-between">
          <div>
            <IconTerminal className="inline-flex mr-2 self-center" /> Terminal
          </div>
          <div
            className={`inline-flex ml-2 self-center opacity-1 ${
              !copied && 'opacity-0 duration-500 transition-opacity'
            }`}
          >
            Copied to clipboard!
          </div>
        </div>
      </div>
      <div className="px-8 pt-4 pb-6 text-primary-dark dark:text-primary-dark font-mono text-code whitespace-pre">
        <LevelText type={level} />
        {message}
      </div>
    </div>
  );
}

export default TerminalBlock;
