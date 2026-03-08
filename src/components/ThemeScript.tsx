/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare global {
  interface Window {
    __setPreferredTheme: (theme: string) => void;
    __theme: string;
  }
}

function themeScript() {
  function setTheme(newTheme: string) {
    window.__theme = newTheme;
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    }
  }

  let preferredTheme: string | null = null;
  try {
    preferredTheme = localStorage.getItem('theme');
  } catch {}

  window.__setPreferredTheme = function (newTheme: string) {
    preferredTheme = newTheme;
    setTheme(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
    } catch {}
  };

  let initialTheme = preferredTheme;
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  if (!initialTheme) {
    initialTheme = darkQuery.matches ? 'dark' : 'light';
  }
  setTheme(initialTheme);

  darkQuery.addEventListener('change', function (event) {
    if (!preferredTheme) {
      setTheme(event.matches ? 'dark' : 'light');
    }
  });

  document.documentElement.classList.add(
    window.navigator.platform.includes('Mac') ? 'platform-mac' : 'platform-win'
  );
}

export function ThemeScript() {
  return (
    <script
      id="theme-script"
      dangerouslySetInnerHTML={{__html: `(${themeScript.toString()})()`}}
    />
  );
}
