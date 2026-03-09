/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare global {
  interface Window {
    __setUwu?: (isUwu: boolean) => void;
  }
}

function uwuScript() {
  try {
    let logShown = false;
    const setUwu = (isUwu: boolean) => {
      try {
        if (isUwu) {
          localStorage.setItem('uwu', 'true');
          document.documentElement.classList.add('uwu');
          if (!logShown) {
            console.log('uwu mode! turn off with ?uwu=0');
            console.log(
              'logo credit to @sawaratsuki1004 via https://github.com/SAWARATSUKI/KawaiiLogos'
            );
            logShown = true;
          }
        } else {
          localStorage.removeItem('uwu');
          document.documentElement.classList.remove('uwu');
          console.log('uwu mode off. turn on with ?uwu');
        }
      } catch {}
    };

    window.__setUwu = setUwu;

    const checkQueryParam = () => {
      const params = new URLSearchParams(window.location.search);
      const value = params.get('uwu');
      switch (value) {
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
    };

    const checkLocalStorage = () => {
      try {
        return localStorage.getItem('uwu') === 'true';
      } catch {
        return false;
      }
    };

    const uwuQueryParam = checkQueryParam();
    if (uwuQueryParam != null) {
      setUwu(uwuQueryParam);
    } else if (checkLocalStorage()) {
      document.documentElement.classList.add('uwu');
    }
  } catch {}
}

export function UwuScript() {
  return (
    <script
      id="uwu-script"
      dangerouslySetInnerHTML={{__html: `(${uwuScript.toString()})()`}}
    />
  );
}
