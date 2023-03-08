/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Html, Head, Main, NextScript} from 'next/document';

const MyDocument = () => {
  //  @todo specify language in HTML?
  return (
    <Html lang="en">
      <Head />
      <body className="font-sans antialiased text-lg bg-wash dark:bg-wash-dark text-secondary dark:text-secondary-dark leading-base">
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
    var reacjsThemeColorMeta = document.querySelector('meta[name="theme-color"]');
    function setTheme(newTheme) {
        window.__theme = newTheme;
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            reacjsThemeColorMeta === null || reacjsThemeColorMeta === void 0 ? void 0 : reacjsThemeColorMeta.setAttribute('content', '#23272F');
        }
        else if (newTheme === 'light') {
            document.documentElement.classList.remove('dark');
            reacjsThemeColorMeta === null || reacjsThemeColorMeta === void 0 ? void 0 : reacjsThemeColorMeta.setAttribute('content', '#F5F5F5');
        }
    }
    var preferredTheme;
    try {
        preferredTheme = localStorage.getItem('theme');
    }
    catch (err) { }
    window.__setPreferredTheme = function (newTheme) {
        preferredTheme = newTheme;
        setTheme(newTheme);
        try {
            localStorage.setItem('theme', newTheme);
        }
        catch (err) { }
    };
    var initialTheme = preferredTheme;
    var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (!initialTheme) {
        initialTheme = darkQuery.matches ? 'dark' : 'light';
    }
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
        reacjsThemeColorMeta === null || reacjsThemeColorMeta === void 0 ? void 0 : reacjsThemeColorMeta.setAttribute('content', '#23272F');
    }
    else {
        reacjsThemeColorMeta === null || reacjsThemeColorMeta === void 0 ? void 0 : reacjsThemeColorMeta.setAttribute('content', '#F5F5F5');
    }
    darkQuery.addEventListener('change', function (e) {
        if (!preferredTheme) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
})();       
              `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default MyDocument;
