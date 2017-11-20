/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

'use strict';

import React, {Component} from 'react';

function replaceArgs(msg: string, argList: Array<any>): string {
  let argIdx = 0;
  return msg.replace(/%s/g, function() {
    const arg = argList[argIdx++];
    return arg === undefined ? '[missing argument]' : arg;
  });
}

function urlify(str: string): Array<any> {
  const urlRegex = /(https:\/\/fb\.me\/[a-z\-]+)/g;

  const segments = str.split(urlRegex);

  for (let i = 0; i < segments.length; i++) {
    if (i % 2 === 1) {
      segments[i] = (
        // $FlowFixMe: We need to properly trace this error: React element 'a' inconsistent use of library definitions
        <a key={i} target="_blank" rel="noopener" href={segments[i]}>
          {segments[i]}
        </a>
      );
    }
  }

  return segments;
}

// ?invariant=123&args[]=foo&args[]=bar
function parseQueryString(location: Location): null | Array<any> {
  const rawQueryString = location.search.substring(1);
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
    } else if (query.indexOf('args[]=') === 0) {
      args.push(query.slice(7));
    }
  }

  return [code, args];
}

type ErrorResultProps = {
  code: mixed,
  msg: string,
};

function ErrorResult(props: ErrorResultProps) {
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

type ErrorDecoderProps = {
  errorCodesString: string,
  location: Location,
};

type State = {
  code: mixed,
  errorMsg: string,
};

class ErrorDecoder extends Component<ErrorDecoderProps, State> {
  constructor(...args: Array<any>) {
    super(...args);

    this.state = {
      code: null,
      errorMsg: '',
    };
  }

  componentWillMount() {
    const {errorCodesString} = this.props;
    const errorCodes = JSON.parse(errorCodesString);
    const parseResult = parseQueryString(this.props.location);
    if (parseResult != null) {
      const [code, args] = parseResult;
      if (errorCodes[code]) {
        this.setState({
          code: code,
          errorMsg: replaceArgs(errorCodes[code], args),
        });
      }
    }
  }

  render() {
    return <ErrorResult code={this.state.code} msg={this.state.errorMsg} />;
  }
}

export default ErrorDecoder;
