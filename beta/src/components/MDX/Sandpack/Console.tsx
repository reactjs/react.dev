import cn from 'classnames';
import * as React from 'react';

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
      // there is no such type as console in Sandpack
      console.log(message.type, 'message');
      if (message.type === 'console' && message.codesandbox) {
        console.log(message, 'message');

        console.log(message);
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
    <div className={cn('console')}>
      <div className={cn('console-scroll')} ref={wrapperRef}>
        {logs.map(({data, id, method}) => {
          return (
            <p
              key={id}
              className={cn('console-item', `console-${getType(method)}`)}>
              <span />
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

      <button className={cn('console-clean')} onClick={() => setLogs([])}>
        {/* <RefreshIcon /> */}
      </button>
    </div>
  );
};
