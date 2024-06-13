import {useEffect, useState} from 'react';
import {useErrorDecoderParams} from '../ErrorDecoderContext';
import cn from 'classnames';

function replaceArgs(
  msg: string,
  argList: Array<string | undefined>,
  replacer = '[missing argument]'
): string {
  let argIdx = 0;
  return msg.replace(/%s/g, function () {
    const arg = argList[argIdx++];
    // arg can be an empty string: ?args[0]=&args[1]=count
    return arg === undefined || arg === '' ? replacer : arg;
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
  const {errorMessage} = useErrorDecoderParams();
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

    setMessage(
      urlify(
        replaceArgs(
          errorMessage,
          parseQueryString(window.location.search),
          '[missing argument]'
        )
      )
    );
    setIsReady(true);
  }, [hasParams, errorMessage]);

  return (
    <code
      className={cn(
        'block bg-red-100 text-red-600 py-4 px-6 mt-5 rounded-lg',
        isReady ? 'opacity-100' : 'opacity-0'
      )}>
      <b>{message}</b>
    </code>
  );
}
