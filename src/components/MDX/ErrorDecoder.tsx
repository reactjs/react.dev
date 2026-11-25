/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect, useState} from 'react';
import {useErrorDecoderParams} from '../ErrorDecoderContext';
import cn from 'classnames';
import {IconError} from '../Icon/IconError';

function replaceArgs(
  msg: string,
  argList: Array<string | undefined>,
  replacer = '[missing argument]'
): string {
  let argIdx = 0;
  return msg.replace(/%s/g, function () {
    const arg = argList[argIdx++];
    // arg can be an empty string: ?args[0]=&args[1]=count
    return arg === undefined ? replacer : arg;
  });
}

/**
 * Sindre Sorhus <https://sindresorhus.com>
 * Released under MIT license
 * https://github.com/sindresorhus/linkify-urls/blob/b2397096df152e2f799011f7a48e5f73b4bf1c7e/index.js#L5C1-L7C1
 *
 * The regex is used to extract URL from the string for linkify.
 */
const urlRegex = () =>
  /((?:https?(?::\/\/))(?:www\.)?(?:[a-zA-Z\d-_.]+(?:(?:\.|@)[a-zA-Z\d]{2,})|localhost)(?:(?:[-a-zA-Z\d:%_+.~#!?&//=@]*)(?:[,](?![\s]))*)*)/g;

// When the message contains a URL (like https://fb.me/react-refs-must-have-owner),
// make it a clickable link.
function urlify(str: string): React.ReactNode[] {
  const segments = str.split(urlRegex());

  return segments.map((message, i) => {
    if (i % 2 === 1) {
      return (
        <a
          key={i}
          target="_blank"
          className="underline"
          rel="noopener noreferrer"
          href={message}>
          {message}
        </a>
      );
    }
    return message;
  });
}

// `?args[]=foo&args[]=bar`
// or `// ?args[0]=foo&args[1]=bar`
function parseQueryString(search: string): Array<string | undefined> {
  const rawQueryString = search.substring(1);
  if (!rawQueryString) {
    return [];
  }

  const args: Array<string | undefined> = [];

  const queries = rawQueryString.split('&');
  for (let i = 0; i < queries.length; i++) {
    const query = decodeURIComponent(queries[i]);
    if (query.startsWith('args[')) {
      args.push(query.slice(query.indexOf(']=') + 2));
    }
  }

  return args;
}

export default function ErrorDecoder() {
  const {errorMessage, errorCode} = useErrorDecoderParams();
  /** error messages that contain %s require reading location.search */
  const hasParams = errorMessage?.includes('%s');
  const [message, setMessage] = useState<React.ReactNode | null>(() =>
    errorMessage ? urlify(errorMessage) : null
  );

  const [isReady, setIsReady] = useState(errorMessage == null || !hasParams);

  useEffect(() => {
    if (errorMessage == null || !hasParams) {
      return;
    }
    const args = parseQueryString(window.location.search);
    let message = errorMessage;
    if (errorCode === '418') {
      // Hydration errors have a %s for the diff, but we don't add that to the args for security reasons.
      message = message.replace(/%s$/, '');

      // Before React 19.1, the error message didn't have an arg, and was always HTML.
      if (args.length === 0) {
        args.push('HTML');
      } else if (args.length === 1 && args[0] === '') {
        args[0] = 'HTML';
      }
    }

    setMessage(urlify(replaceArgs(message, args, '[missing argument]')));
    setIsReady(true);
  }, [errorCode, hasParams, errorMessage]);

  return (
    <div
      className={cn(
        'console-block mb-4 text-secondary bg-wash dark:bg-wash-dark rounded-lg mt-5',
        isReady ? 'opacity-100' : 'opacity-0'
      )}
      translate="no"
      dir="ltr">
      <div className="flex w-full rounded-t-lg bg-gray-200 dark:bg-gray-80">
        <div className="px-4 py-2 border-gray-300 dark:border-gray-90 border-r">
          <div
            className="bg-gray-300 dark:bg-gray-70"
            style={{width: '15px', height: '17px'}}
          />
        </div>
        <div className="flex text-sm px-4">
          <div className="border-b-2 border-gray-300 dark:border-gray-90 text-tertiary dark:text-tertiary-dark">
            Console
          </div>
          <div className="px-4 py-2 flex">
            <div
              className="me-2 bg-gray-300 dark:bg-gray-70"
              style={{width: '60px', height: '17px'}}
            />
            <div
              className="me-2 hidden md:block bg-gray-300 dark:bg-gray-70"
              style={{width: '60px', height: '17px'}}
            />
            <div
              className="hidden md:block bg-gray-300 dark:bg-gray-70"
              style={{width: '60px', height: '17px'}}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 divide-y divide-gray-300 dark:divide-gray-70 text-base">
        <div className="ps-4 pe-2 pt-1 pb-2 grid grid-cols-[18px_auto] font-mono rounded-b-md bg-red-30 text-red-50 dark:text-red-30 bg-opacity-5">
          <IconError className="self-start mt-1.5 text-[.7rem] w-6" />
          <div className="px-2 pt-1 whitespace-break-spaces text-code leading-tight">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}
