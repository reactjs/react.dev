import {siteConfig} from '../siteConfig';
import Script from 'next/script';
import {Analytics} from 'components/Analytics';
import {ScrollHandler} from 'components/SafariScrollHandler';

import '@docsearch/css';
import '../styles/algolia.css';
import '../styles/index.css';
import '../styles/sandpack.css';

import {generateMetadata as generateSeoMetadata} from '../utils/generateMetadata';
import {Suspense} from 'react';

export async function generateMetadata() {
  const metadata = generateSeoMetadata({
    title: 'React',
    isHomePage: true,
    path: '/',
  });

  return {
    metadata,
  };
}

export const viewport = {
  themeColor: [
    {media: '(prefers-color-scheme: light)', color: '#23272f'},
    {media: '(prefers-color-scheme: dark)', color: '#23272f'},
  ],
};

function ThemeScript() {
  return (
    <Script
      id="theme-script"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
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
        `,
      }}
    />
  );
}

function UwuScript() {
  return (
    <Script
      id="uwu-script"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
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
                      console.log('logo credit to @sawaratsuki1004 via https://github.com/SAWARATSUKI/ServiceLogos');
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
        `,
      }}
    />
  );
}

function FontPreload() {
  return (
    <>
      <link
        rel="preload"
        href="/fonts/Source-Code-Pro-Regular.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Optimistic_Display_W_Md.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Optimistic_Display_W_SBd.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Optimistic_Display_W_Bd.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Optimistic_Text_W_Md.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Optimistic_Text_W_Bd.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Optimistic_Text_W_Rg.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Optimistic_Text_W_It.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
    </>
  );
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html
      lang={siteConfig.languageCode}
      dir={siteConfig.isRTL ? 'rtl' : 'ltr'}
      suppressHydrationWarning>
      <head>
        <FontPreload />
      </head>
      <body className="font-text font-medium antialiased text-lg bg-wash dark:bg-wash-dark text-secondary dark:text-secondary-dark leading-base">
        <ScrollHandler />
        <ThemeScript />
        <UwuScript />

        {children}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
