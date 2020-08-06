/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @flow
 */

import React from 'react';

type Props = {|
  htmlAttributes: any,
  headComponents: React$Node,
  bodyAttributes: any,
  body: string,
  postBodyComponents: React$Node,
|};

export default class HTML extends React.Component<Props> {
  render() {
    return (
      <html lang="en" {...this.props.htmlAttributes}>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link rel="icon" href="/favicon.ico" />

          <meta name="apple-mobile-web-app-capable" content="yes" />
          <link rel="apple-touch-icon" href="/logo-180x180.png" />
          <meta name="apple-mobile-web-app-title" content="React" />

          {this.props.headComponents}
        </head>
        <body {...this.props.bodyAttributes}>
          <div
            id="___gatsby"
            dangerouslySetInnerHTML={{__html: this.props.body}}
          />
          {this.props.postBodyComponents}
        </body>
      </html>
    );
  }
}
