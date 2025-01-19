// app/layout.jsx
import {siteConfig} from '../siteConfig';
import Script from 'next/script';
import {Analytics} from 'components/Analytics';
import {ScrollHandler} from 'components/SafariScrollHandler';
import '@docsearch/css';
import '../styles/algolia.css';
import '../styles/index.css';
import '../styles/sandpack.css';

import {generateMetadata as generateSeoMetadata} from 'components/Seo';

export async function generateMetadata({params}) {
  const metadata = generateSeoMetadata({
    title: 'React',
    isHomePage: true,
    path: '/',
  });

  return {
    ...metadata,
    icons: {
      icon: [
        {url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png'},
        {url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png'},
      ],
      apple: [
        {url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png'},
      ],
      other: [
        {rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#404756'},
      ],
    },
    manifest: '/site.webmanifest',
    themeColor: [
      {media: '(prefers-color-scheme: light)', color: '#23272f'},
      {media: '(prefers-color-scheme: dark)', color: '#23272f'},
    ],
    other: {
      'msapplication-TileColor': '#2b5797',
    },
  };
}

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

export default function RootLayout({children}) {
  return (
    <html
      lang={siteConfig.languageCode}
      dir={siteConfig.isRTL ? 'rtl' : 'ltr'}
      suppressHydrationWarning>
      <head />
      <body className="font-text font-medium antialiased text-lg bg-wash dark:bg-wash-dark text-secondary dark:text-secondary-dark leading-base">
        <Analytics />
        <ScrollHandler />
        <ThemeScript />
        <UwuScript />

        {children}
      </body>
    </html>
  );
}
