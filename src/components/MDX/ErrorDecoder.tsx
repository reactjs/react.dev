import {useContext, useMemo} from 'react';
import {useRouter} from 'next/router';
import {ErrorCodesContext} from './ErrorCodesContext';

function replaceArgs(msg: string, argList: string[]): string {
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
  search: string
): {code: string; args: string[]} | null {
  const rawQueryString = search.substring(1);
  if (!rawQueryString) {
    return null;
  }

  let code = '';
  let args = [];

  const queries = rawQueryString.split('&');
  for (let i = 0; i < queries.length; i++) {
    const query = decodeURIComponent(queries[i]);
    if (query.indexOf('invariant=') === 0) {
      code = query.slice(10);
    } else if (query.indexOf('args[') === 0) {
      args.push(query.slice(query.indexOf(']=') + 2));
    }
  }

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
  const {isReady} = useRouter();
  const errorCodes = useContext(ErrorCodesContext);

  const [code, msg] = useMemo(() => {
    let code = null;
    let msg = '';

    if (typeof window !== 'undefined' && isReady) {
      const parseResult = parseQueryString(window.location.search);
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
  }, [errorCodes, isReady]);

  return <ErrorResult code={code} msg={msg} />;
}
