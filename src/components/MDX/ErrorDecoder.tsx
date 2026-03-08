'use client';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useErrorDecoderParams} from '../ErrorDecoderContext';
import cn from 'classnames';
import {useMemo, useSyncExternalStore} from 'react';

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

function subscribeToLocationSearch(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  window.addEventListener('popstate', onStoreChange);
  window.addEventListener('hashchange', onStoreChange);

  return () => {
    window.removeEventListener('popstate', onStoreChange);
    window.removeEventListener('hashchange', onStoreChange);
  };
}

function getLocationSearch() {
  return window.location.search;
}

function getServerLocationSearch() {
  return null;
}

export default function ErrorDecoder() {
  const {errorMessage, errorCode} = useErrorDecoderParams();
  /** error messages that contain %s require reading location.search */
  const hasParams = errorMessage?.includes('%s');
  const search = useSyncExternalStore(
    subscribeToLocationSearch,
    getLocationSearch,
    getServerLocationSearch
  );
  const message = useMemo(() => {
    if (errorMessage == null) {
      return null;
    }

    if (!hasParams) {
      return urlify(errorMessage);
    }

    if (search == null) {
      return null;
    }

    const args = parseQueryString(search);
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

    return urlify(replaceArgs(message, args, '[missing argument]'));
  }, [errorCode, errorMessage, hasParams, search]);
  const isReady = errorMessage == null || !hasParams || search != null;

  return (
    <code
      className={cn(
        'whitespace-pre-line block bg-red-100 text-red-600 py-4 px-6 mt-5 rounded-lg',
        isReady ? 'opacity-100' : 'opacity-0'
      )}>
      <b>{message}</b>
    </code>
  );
}
