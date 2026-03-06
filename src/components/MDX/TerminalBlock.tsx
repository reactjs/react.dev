'use client';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Children, isValidElement, useState, useEffect} from 'react';
import * as React from 'react';
import {IconTerminal} from '../Icon/IconTerminal';
import {IconCopy} from 'components/Icon/IconCopy';

type LogLevel = 'info' | 'warning' | 'error';

interface TerminalBlockProps {
  level?: LogLevel;
  children: React.ReactNode;
}

function getTerminalText(node: React.ReactNode): string {
  let text = '';

  Children.forEach(node, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      text += child;
      return;
    }

    if (!isValidElement(child)) {
      return;
    }

    const props = child.props as {children?: React.ReactNode} | null;
    text += getTerminalText(props?.children ?? null);
  });

  return text;
}

function LevelText({type}: {type: LogLevel}) {
  switch (type) {
    case 'warning':
      return <span className="text-yellow-50 bg-none me-1">Warning: </span>;
    case 'error':
      return <span className="text-red-40 me-1">Error: </span>;
    default:
      return null;
  }
}

function TerminalBlock({level = 'info', children}: TerminalBlockProps) {
  const message = getTerminalText(children).trim();
  if (message.length === 0) {
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
    <div className="rounded-lg bg-secondary dark:bg-gray-50 h-full">
      <div className="bg-gray-90 dark:bg-gray-60 w-full rounded-t-lg">
        <div className="text-primary-dark dark:text-primary-dark flex text-sm px-4 py-0.5 relative justify-between">
          <div>
            <IconTerminal className="inline-flex me-2 self-center" /> Terminal
          </div>
          <div>
            <button
              className="w-full text-start text-primary-dark dark:text-primary-dark "
              onClick={() => {
                window.navigator.clipboard.writeText(message);
                setCopied(true);
              }}>
              <IconCopy className="inline-flex me-2 self-center" />{' '}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
      <pre
        className="px-8 pt-4 pb-6 text-primary-dark dark:text-primary-dark font-mono text-code whitespace-pre overflow-x-auto"
        translate="no"
        dir="ltr">
        <code>
          <LevelText type={level} />
          {message}
        </code>
      </pre>
    </div>
  );
}

export default TerminalBlock;
