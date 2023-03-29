/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {isValidElement, useState, useEffect} from 'react';
import * as React from 'react';
import {IconTerminal} from '../Icon/IconTerminal';
import {IconCopy} from 'components/Icon/IconCopy';

type LogLevel = 'info' | 'warning' | 'error';

interface TerminalBlockProps {
  level?: LogLevel;
  children: React.ReactNode;
}

function LevelText({type}: {type: LogLevel}) {
  switch (type) {
    case 'warning':
      return <span className="mr-1 bg-none text-yellow-50">Warning: </span>;
    case 'error':
      return <span className="mr-1 text-red-40">Error: </span>;
    default:
      return null;
  }
}

function TerminalBlock({level = 'info', children}: TerminalBlockProps) {
  let message: string | undefined;
  if (typeof children === 'string') {
    message = children;
  } else if (
    isValidElement(children) &&
    typeof children.props.children === 'string'
  ) {
    message = children.props.children;
  } else {
    throw Error('Expected TerminalBlock children to be a plain string.');
  }

  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) {
      return;
    } else {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <div className="h-full rounded-lg bg-secondary dark:bg-gray-50">
      <div className="w-full rounded-t-lg bg-gray-90 dark:bg-gray-60">
        <div className="relative flex justify-between px-4 py-0.5 text-sm text-primary-dark dark:text-primary-dark">
          <div>
            <IconTerminal className="mr-2 inline-flex self-center" /> Terminal
          </div>
          <div>
            <button
              className="w-full text-left text-primary-dark dark:text-primary-dark "
              onClick={() => {
                window.navigator.clipboard.writeText(message ?? '');
                setCopied(true);
              }}>
              <IconCopy className="mr-2 inline-flex self-center" />{' '}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
      <div className="whitespace-pre px-8 pt-4 pb-6 font-mono text-code text-primary-dark dark:text-primary-dark">
        <LevelText type={level} />
        {message}
      </div>
    </div>
  );
}

export default TerminalBlock;
