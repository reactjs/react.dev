import {useMemo} from 'react';
import {useRouter} from 'next/router';

function replaceArgs(
  msg: string,
  argList: Array<string | undefined>,
  replacer = '[missing argument]'
): string {
  let argIdx = 0;
  return msg.replace(/%s/g, function () {
    const arg = argList[argIdx++];
    // arg can be an empty string: ?invariant=377&args[0]=&args[1]=count
    return arg === undefined || arg === '' ? replacer : arg;
  });
}

// When the message contains a URL (like https://fb.me/react-refs-must-have-owner),
// make it a clickable link.
function urlify(str: string): React.ReactNode {
  const urlRegex = /(https:\/\/fb\.me\/[a-z\-]+)/g;

  const segments = str.split(urlRegex);

  return segments.map((message, i) => {
    if (i % 2 === 1) {
      return (
        <a key={i} target="_blank" rel="noopener noreferrer" href={message}>
          {message}
        </a>
      );
    }
    return message;
  });
}

// `?invariant=123&args[]=foo&args[]=bar`
// or `// ?invariant=123&args[0]=foo&args[1]=bar`
function parseQueryString(
  query: ReturnType<typeof useRouter>['query']
): Array<string | undefined> {
  const args: Array<string | undefined> = [];

  Object.entries(query).forEach(([key, value]) => {
    if (key.startsWith('args[')) {
      args.push(Array.isArray(value) ? value[0] : value);
    }
  });

  return args;
}

interface ErrorDecoderProps {
  errorMessages: string | null;
}

export default function ErrorDecoder({errorMessages}: ErrorDecoderProps) {
  const {isReady, query} = useRouter();

  const msg = useMemo(() => {
    if (!errorMessages?.includes('%s')) {
      return errorMessages;
    }

    if (typeof window !== 'undefined' && isReady) {
      return replaceArgs(
        errorMessages,
        parseQueryString(query),
        '[missing argument]'
      );
    }

    return replaceArgs(errorMessages, [], '[parsing argument]');
  }, [errorMessages, isReady, query]);

  if (!msg) {
    return (
      <p>
        When you encounter an error, you{"'"}ll receive a link to this page for
        that specific error and we{"'"}ll show you the full error text.
      </p>
    );
  }

  return (
    <div>
      <p>
        <b>The full text of the error you just encountered is:</b>
      </p>
      <code className="block bg-red-100 text-red-600 py-4 px-6 mt-5 rounded-lg">
        <b>{urlify(msg)}</b>
      </code>
    </div>
  );
}
