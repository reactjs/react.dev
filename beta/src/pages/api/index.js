import core from 'puppeteer-core';
let _page;
import chrome from 'chrome-aws-lambda';
const exePath =
  process.platform === 'win32'
    ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    : process.platform === 'linux'
    ? '/usr/bin/google-chrome'
    : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const getCss = () => {
  return `
  * {
margin:0;
padding:0;
  }
  .background-wrapper {
    display: flex;
    justify-content: start;
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .background {
    display: flex;
    position: absolute;
    top: 0;
  
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgb(35, 39, 47);
    display: flex;
    width: 100%;
  }
  
  .text-wrapper {
    display: flex;
    position: relative;
    padding: 0 2.5rem 2.5rem 2.5rem;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 100%;
  }
  
  .heading {
    font-size: 1.875rem;
    line-height: 2.25rem;
    font-weight: 900;
  }
  
  .content {
    margin-top: 0.75rem;
    font-size: 1.125rem;
    line-height: 1.75rem;
    opacity: 0.9;
  }
  
  .author-image {
    object-fit: cover;
    margin-right: 0.5rem;
    background-color: #f9fafb;
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
  }
  
  .margin-top {
    margin-top: 0.5rem;
  }
  .logo {
    height: 100px;
  }
  .px-1 {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }
  
  .author-wrapper {
    display: flex;
    margin-top: 1.25rem;
    color: white;
    white-space: nowrap;
    display: flex;
  }
  
  .flex {
    display: flex;
  }
  
  .og-image-wrapper {
    width: 800px;
     height: 400;

    overflow: hidden;
    background-color: #f3f4f6;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  `;
};

const getHTML = (title, description) => `
    <style>
${getCss()}
    </style>
    <div class="og-image-wrapper">
    <div class="background-wrapper">
      <div class="background"></div>
      <div class="text-wrapper">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 595.3" class='logo'>
            <g fill="#61DAFB">
              <path d="M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z" />
              <circle cx="420.9" cy="296.5" r="45.7" />
              <path d="M520.5 78.1z" />
            </g>
          </svg>

          <h2 class="heading">${title}</h2>
          <p class="content">${description}</p>
        </div>
        <div class="author-wrapper">
          <div class="flex">
            <img
              src="https://avatars.githubusercontent.com/u/32865581?v=4"
              class="author-image"
            />
            <div class="margin-top">Harish Kumar S S</div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

export async function getOptions(isDev) {
  let options;
  if (isDev) {
    options = {
      args: [],
      executablePath: exePath,
      headless: true,
    };
  } else {
    options = {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    };
  }
  return options;
}

async function getPage(isDev) {
  if (_page) {
    return _page;
  }
  const options = await getOptions(isDev);
  const browser = await core.launch(options);
  _page = await browser.newPage();
  return _page;
}

export async function getScreenshot(
  {title, description},
  type = 'png',
  isDev = false
) {
  const page = await getPage(isDev);
  await page.setViewport({width: 800, height: 400});
  await page.setContent(getHTML(title, description));
  const file = await page.screenshot({type});
  return file;
}

export default async function handler(req, res) {
  console.log(req.query);
  const file = await getScreenshot(req.query, 'png', false);

  res.setHeader('Content-Type', `image/png`);
  res.setHeader(
    'Cache-Control',
    `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
  );

  // res.status(200).json({name: 'john doe'});
  res.end(file);
}
