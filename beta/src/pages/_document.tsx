/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import Document, {Html, Head, Main, NextScript} from 'next/document';

class MyDocument extends Document {
  render() {
    //  @todo specify language in HTML?
    return (
      <Html lang="en">
        <Head />
        <body className="font-sans antialiased text-lg bg-wash dark:bg-wash-dark text-secondary dark:text-secondary-dark leading-base">
          <script
            dangerouslySetInnerHTML={{
              __html: `(function () {
                window.__onThemeChange = function () {};
                function setTheme(newTheme) {
                  window.__theme = newTheme;
                  preferredTheme = newTheme;
              
                  document.documentElement.className = newTheme;
                  window.__onThemeChange();
                }
              
                var preferredTheme;
                try {
                  preferredTheme = localStorage.getItem("theme");
                } catch (err) {
                  console.error("Couldn't fetch theme from local storage")

                }
              
                window.__setPreferredTheme = function (newTheme) {
                  setTheme(newTheme);
                  try {
                    localStorage.setItem("theme", newTheme);
                  } catch (err) {
                    console.error("Couldn't set theme in local storage")
                  }
                };
              
                var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
                darkQuery.addListener(function (e) {
                  window.__setPreferredTheme(e.matches ? "dark" : "light");
                });
              
                setTheme(preferredTheme || (darkQuery.matches ? "dark" : "light"));
              })();
              `,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
