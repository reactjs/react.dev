import {useContext, useMemo} from 'react';
import {useRouter} from 'next/router';
import {ErrorCodesContext} from './ErrorCodesContext';

function replaceArgs(msg: string, argList: Array<string | undefined>): string {
  let argIdx = 0;
  return msg.replace(/%s/g, function () {
    const arg = argList[argIdx++];
    return arg === undefined ? '[missing argument]' : arg;
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
): {code: string; args: Array<string | undefined>} | null {
  let code = '';
  let args: Array<string | undefined> = [];

  if ('invariant' in query && typeof query.invariant === 'string') {
    code = query.invariant;
  }
  Object.entries(query).forEach(([key, value]) => {
    if (key.startsWith('args[')) {
      args.push(Array.isArray(value) ? value[0] : value);
    }
  });

  return {args, code};
}

function ErrorResult(props: {code?: string | null; msg: string}) {
  if (!props.code) {
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
        <b>{urlify(props.msg)}</b>
      </code>
    </div>
  );
}

export default function ErrorDecoder() {
  const {isReady, query} = useRouter();
  const errorCodes = useContext(ErrorCodesContext);

  const [code, msg] = useMemo(() => {
    let code = null;
    let msg = '';

    // The `query` object is only populated after the initial hydration, so
    // we need to wait for the `isReady` becomes `true`
    if (typeof window !== 'undefined' && isReady) {
      const parseResult = parseQueryString(query);
      if (
        parseResult != null &&
        errorCodes != null &&
        parseResult.code in errorCodes
      ) {
        code = parseResult.code;
        msg = replaceArgs(errorCodes[code], parseResult.args);
      }
    }

    return [code, msg];
  }, [errorCodes, isReady, query]);

  return <ErrorResult code={code} msg={msg} />;
}
