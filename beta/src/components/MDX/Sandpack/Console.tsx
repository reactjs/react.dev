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

export const SandpackConsole: React.FC = () => {
  const {listen} = useSandpack();
  const [logs, setLogs] = React.useState<ConsoleData>([]);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const unsubscribe = listen((message) => {
      if (message.type === 'start') {
        setLogs([]);
      }

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

  const [showConsole, toggleConsole] = React.useState(false);

  React.useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = wrapperRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      className={cn(
        'absolute dark:border-gray-700 dark:bg-gray-95 border-t  bottom-0 w-full',
        !!!logs.length && 'cursor-not-allowed'
      )}>
      <div className="flex justify-between h-8 items-center">
        <div onClick={() => !!logs.length && toggleConsole(!showConsole)}>
          <IconChevron displayDirection={showConsole ? 'down' : 'right'} />
        </div>
        <p className="p-1 text-md">console ({logs.length})</p>
        <button
          className={cn('p-1', !!!logs.length && 'cursor-not-allowed')}
          onClick={() => {
            setLogs([]);
            toggleConsole(false);
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
      {showConsole && (
        <div className="w-full h-full border-y dark:border-gray-700 dark:bg-gray-95 dark:text-white">
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
      )}
    </div>
  );
};
