import cn from 'classnames';
import * as React from 'react';
import {IconChevron} from 'components/Icon/IconChevron';

import {SandpackCodeViewer, useSandpack} from '@codesandbox/sandpack-react';
import type {SandpackMessage} from '@codesandbox/sandpack-client';

const getType = (message: Methods): 'info' | 'warning' | 'error' => {
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
  method: Methods;
}>;

type Methods =
  | 'log'
  | 'debug'
  | 'info'
  | 'warn'
  | 'error'
  | 'table'
  | 'clear'
  | 'time'
  | 'timeEnd'
  | 'count'
  | 'assert';

const MAX_MESSAGE_COUNT = 100;

export const SandpackConsole: React.FC<{clientId?: string}> = ({clientId}) => {
  const {listen} = useSandpack();
  const [logs, setLogs] = React.useState<ConsoleData>([]);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const unsubscribe = listen((message) => {
      if (message.type === 'start') {
        setLogs([]);
      }
      // there is no such type as console in Sandpack
      if (message.type === 'console' && message.codesandbox) {
        setLogs((prev) => {
          const messages = [...prev, ...message.log];
          messages.slice(Math.max(0, messages.length - MAX_MESSAGE_COUNT));

          return messages;
        });
      }
    });

    return unsubscribe;
  }, [listen]);

  React.useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = wrapperRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full h-full border-y dark:border-gray-700 dark:bg-gray-95 dark:text-white">
      {!!logs.length && (
        <div className="flex justify-between">
          <p className="p-2 text-md">console</p>
          <button className="p-2" onClick={() => setLogs([])}>
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="css-i6dzq1">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
            </svg>
          </button>
        </div>
      )}
      <div className={cn('console-scroll')} ref={wrapperRef}>
        {logs.map(({data, id, method}) => {
          return (
            <p
              key={id}
              className={cn(
                'border-y border dark:border-gray-700 text-md p-1 pl-2',
                `console-${getType(method)}`
              )}>
              <span className={cn('console-message')}>
                {data.map((msg, index) => {
                  if (typeof msg === 'string') {
                    return <span key={`${msg}-${index}`}>{msg}</span>;
                  }

                  console.log('console', console);

                  const children = JSON.stringify(msg);

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
            </p>
          );
        })}
      </div>
    </div>
  );
};
