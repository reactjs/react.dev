/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

'use strict';

import React from 'react';
import qs from 'qs';

import type {Node} from 'react';

function replaceArgs(msg: string, argList: Array<string>): string {
  let argIdx = 0;
  return msg.replace(/%s/g, function() {
    const arg = argList[argIdx++];
    return arg === undefined ? '[missing argument]' : arg;
  });
}

// When the message contains a URL (like https://fb.me/react-refs-must-have-owner),
// make it a clickable link.
function urlify(str: string): Node {
  const urlRegex = /(https:\/\/fb\.me\/[a-z\-]+)/g;

  const segments = str.split(urlRegex);

  return segments.map((message, i) => {
    if (i % 2 === 1) {
      return (
        <a key={i} target="_blank" rel="noopener" href={message}>
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
  search: string,
): ?{|code: string, args: Array<string>|} {
  const qsResult = qs.parse(search, {ignoreQueryPrefix: true});
  if (!qsResult.invariant) {
    return null;
  }
  return {
    code: qsResult.invariant,
    args: qsResult.args || [],
  };
}

function ErrorResult(props: {|code: ?string, msg: string|}) {
  const code = props.code;
  const errorMsg = props.msg;

  if (!code) {
    return (
      <p>
        When you encounter an error, you'll receive a link to this page for that
        specific error and we'll show you the full error text.
      </p>
    );
  }

  return (
    <div>
      <p>The full text of the error you just encountered is:</p>
      <code>{urlify(errorMsg)}</code>
    </div>
  );
}

function ErrorDecoder(props: {|
  errorCodesString: string,
  location: {search: string},
|}) {
  let code = null;
  let msg = '';

  const errorCodes = JSON.parse(props.errorCodesString);
  const parseResult = parseQueryString(props.location.search);
  if (parseResult != null) {
    code = parseResult.code;
    msg = replaceArgs(errorCodes[code], parseResult.args);
  }

  return <ErrorResult code={code} msg={msg} />;
}

export default ErrorDecoder;
