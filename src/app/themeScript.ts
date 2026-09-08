/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Inlined in the root layout's <head>. Also evaluated by ThemeInitFallback
// on client-rendered routes, where React doesn't execute inline scripts.
export const themeScript = `
(function () {
  try {
    let logShown = false;
    function setUwu(isUwu) {
      try {
        if (isUwu) {
          localStorage.setItem('uwu', true);
          document.documentElement.classList.add('uwu');
          if (!logShown) {
            console.log('uwu mode! turn off with ?uwu=0');
            console.log('logo credit to @sawaratsuki1004 via https://github.com/SAWARATSUKI/KawaiiLogos');
            logShown = true;
          }
        } else {
          localStorage.removeItem('uwu');
          document.documentElement.classList.remove('uwu');
          console.log('uwu mode off. turn on with ?uwu');
        }
      } catch (err) { }
    }
    window.__setUwu = setUwu;
    function checkQueryParam() {
      const params = new URLSearchParams(window.location.search);
      const value = params.get('uwu');
      switch(value) {
        case '':
        case 'true':
        case '1':
          return true;
        case 'false':
        case '0':
          return false;
        default:
          return null;
      }
    }
    function checkLocalStorage() {
      try {
        return localStorage.getItem('uwu') === 'true';
      } catch (err) {
        return false;
      }
    }
    const uwuQueryParam = checkQueryParam();
    if (uwuQueryParam != null) {
      setUwu(uwuQueryParam);
    } else if (checkLocalStorage()) {
      document.documentElement.classList.add('uwu');
    }
  } catch (err) { }
})();

(function () {
  function setTheme(newTheme) {
    window.__theme = newTheme;
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    }
  }

  var preferredTheme;
  try {
    preferredTheme = localStorage.getItem('theme');
  } catch (err) { }

  window.__setPreferredTheme = function(newTheme) {
    preferredTheme = newTheme;
    setTheme(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
    } catch (err) { }
  };

  var initialTheme = preferredTheme;
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  if (!initialTheme) {
    initialTheme = darkQuery.matches ? 'dark' : 'light';
  }
  setTheme(initialTheme);

  darkQuery.addEventListener('change', function (e) {
    if (!preferredTheme) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  document.documentElement.classList.add(
      window.navigator.platform.includes('Mac')
      ? "platform-mac"
      : "platform-win"
  );
})();
`;
