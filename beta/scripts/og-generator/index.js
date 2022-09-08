const fm = require('gray-matter');
const {getCss, getHTML} = require('./util');
const globby = require('globby');
const fs = require('fs-extra');
const slugs = require('github-slugger');
const core = require('puppeteer-core');
const chrome = require('chrome-aws-lambda');
let _page;

const getPage = async (isDev) => {
  if (_page) {
    return _page;
  }
  const options = {
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  };
  const browser = await core.launch(options);
  _page = await browser.newPage();
  return {page: _page, browser};
};

(async () => {
  const markdownPages = await globby('src/content/**/*.{md,mdx}');
  //   launch browser
  const {page, browser} = await getPage(false);
  await page.setViewport({width: 800, height: 400});
  for (let filepath of markdownPages) {
    const rawStr = await fs.readFile(filepath, 'utf8');
    // Extract frontmatter
    const {
      data: {title, description},
    } = fm(rawStr);
    await page.setContent(getHTML(title, description ? description : ''));
    await page.screenshot({
      type: 'png',
      path: `./public/images/ogassets/${slugs.slug(title, false)}.png`,
    });
  }
  // Terminate browser once screenshots are generated
  await browser.close();
})();
