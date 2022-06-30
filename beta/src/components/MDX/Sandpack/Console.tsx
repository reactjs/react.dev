/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */
import cn from 'classnames';
import * as React from 'react';
import {IconChevron} from 'components/Icon/IconChevron';

import {SandpackCodeViewer, useSandpack} from '@codesandbox/sandpack-react';
import type {SandpackMessageConsoleMethods} from '@codesandbox/sandpack-client';

const getType = (
  message: SandpackMessageConsoleMethods
): 'info' | 'warning' | 'error' => {
  if (message === 'log' || message === 'info') {
    return 'info';
  }

  if (message === 'warn') {
    return 'warning';
  }

  return 'error';
};

type ConsoleData = Array<{
  data: Array<string | Record<string, string>>;
  id: string;
  method: SandpackMessageConsoleMethods;
}>;

const MAX_MESSAGE_COUNT = 100;

export const SandpackConsole = () => {
  const {listen} = useSandpack();
  const [logs, setLogs] = React.useState<ConsoleData>([]);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const unsubscribe = listen((message) => {
      if (
        (message.type === 'start' && message.firstLoad) ||
        message.type === 'refresh'
      ) {
        setLogs([]);
      }
      if (message.type === 'console' && message.codesandbox) {
        setLogs((prev) => {
          const newLogs = message.log.filter(({method}) => method === 'log');
          let messages = [...prev, ...newLogs];
          while (messages.length > MAX_MESSAGE_COUNT) {
            messages.shift();
          }
          return messages;
        });
      }
    });

    return unsubscribe;
  }, [listen]);

  const [isExpanded, setIsExpanded] = React.useState(true);

  React.useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = wrapperRef.current.scrollHeight;
    }
  }, [logs]);

  if (logs.length === 0) {
    return null;
  }

  return (
    <div className="absolute dark:border-gray-700 bg-white dark:bg-gray-95 border-t bottom-0 w-full dark:text-white">
      <div className="flex justify-between">
        <button
          className="flex items-center p-1"
          onClick={() => setIsExpanded(!isExpanded)}>
          <IconChevron displayDirection={isExpanded ? 'down' : 'right'} />
          <span className="pl-1 text-sm">Console ({logs.length})</span>
        </button>
        <button
          className="p-1"
          onClick={() => {
            setLogs([]);
          }}>
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
          </svg>
        </button>
      </div>
      {isExpanded && (
        <div className="w-full h-full border-y bg-white dark:border-gray-700 dark:bg-gray-95 min-h-[28px] console">
          <div className="max-h-40 h-auto overflow-auto" ref={wrapperRef}>
            {logs.map(({data, id, method}) => {
              return (
                <div
                  key={id}
                  className={cn(
                    'last:border-none border-b dark:border-gray-700 text-md p-1 pl-2 leading-6 font-mono min-h-[32px]',
                    `console-${getType(method)}`
                  )}>
                  <span className="console-message">
                    {data.map((msg, index) => {
                      if (typeof msg === 'string') {
                        return <span key={`${msg}-${index}`}>{msg}</span>;
                      }

                      let children;
                      if (msg != null && typeof msg['@t'] === 'string') {
                        // CodeSandbox wraps custom types
                        children = msg['@t'];
                      } else {
                        try {
                          children = JSON.stringify(msg, null, 2);
                        } catch (error) {
                          try {
                            children = Object.prototype.toString.call(msg);
                          } catch (err) {
                            children = '[' + typeof msg + ']';
                          }
                        }
                      }

                      return (
                        <span
                          className={cn('console-span')}
                          key={`${msg}-${index}`}>
                          <SandpackCodeViewer
                            initMode="user-visible"
                            // fileType="js"
                            code={children}
                          />
                        </span>
                      );
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
