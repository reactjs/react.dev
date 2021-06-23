/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @flow
 */

import React from 'react';

const JS_NPM_URLS = [
  'https://unpkg.com/docsearch.js@2.4.1/dist/cdn/docsearch.min.js',
];

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
          {JS_NPM_URLS.map(url => (
            <link key={url} rel="preload" href={url} as="script" />
          ))}
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
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  /*
                    BE CAREFUL!
                    This code is not compiled by our transforms
                    so it needs to stay compatible with older browsers.
                  */

                  var activeBanner = null;
                  var snoozeStartDate = null;
                  var today = new Date();

                  function addTimes(date, days) {
                    var time = new Date(date);
                    time.setDate(time.getDate() + days);
                    return time;
                  }

                  activeBanner = {
                    storageId: 'reactjs_banner_2020survey',
                    normalHeight: 50,
                    smallHeight: 75,
                    campaignStartDate: '2020-10-05T00:00:00Z', // the Z is for UTC
                    campaignEndDate: '2020-10-19T00:00:00Z', // the Z is for UTC
                    snoozeForDays: 7,
                  };

                  if (activeBanner) {
                    try {
                      if (localStorage[activeBanner.storageId]) {
                        snoozeStartDate = new Date(
                          parseInt(localStorage.getItem(activeBanner.storageId), 10),
                        );
                      }
                    } catch (err) {
                      // Ignore.
                    }

                    try {
                      // If it's too early or long past the campaign, don't show the banner:
                      if (
                        today < new Date(activeBanner.campaignStartDate) ||
                        today > new Date(activeBanner.campaignEndDate)
                      ) {
                        activeBanner = null;
                        // If we're in the campaign window, but the snooze has been set and it hasn't expired:
                      } else if (
                        snoozeStartDate &&
                        addTimes(snoozeStartDate, activeBanner.snoozeForDays) >= today
                      ) {
                        activeBanner = null;
                      }
                    } catch (err) {
                      // Ignore.
                    }
                  }

                  function updateStyles() {
                    if (activeBanner) {
                      document.documentElement.style.setProperty('--banner-display', 'block');
                      document.documentElement.style.setProperty('--banner-height-normal', activeBanner.normalHeight + 'px');
                      document.documentElement.style.setProperty('--banner-height-small', activeBanner.smallHeight + 'px');
                    } else {
                      document.documentElement.style.setProperty('--banner-display', 'none');
                      document.documentElement.style.setProperty('--banner-height-normal', '0px');
                      document.documentElement.style.setProperty('--banner-height-small', '0px');
                    }
                  }

                  updateStyles();
                  window.__dismissBanner = function() {
                    if (activeBanner) {
                      try {
                        localStorage.setItem(activeBanner.storageId, Date.now().toString());
                      } catch (err) {
                        // Ignore.
                      }
                      // Don't show for next navigations within the session.
                      activeBanner = null;
                      updateStyles();
                    }
                  };
                })();
              `,
            }}
          />
          <div
            id="___gatsby"
            dangerouslySetInnerHTML={{__html: this.props.body}}
          />
          {this.props.postBodyComponents}
          {JS_NPM_URLS.map(url => (
            <script key={url} src={url} />
          ))}
        </body>
      </html>
    );
  }
}
