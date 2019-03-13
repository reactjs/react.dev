const puppeteer = require('puppeteer');
const {percySnapshot} = require('@percy/puppeteer');

const ROOT_URL = `http://0.0.0.0:8001`;
const pages = [
  {
    title: 'Home',
    path: '',
  },
  {
    title: 'Docs - Getting started',
    path: 'docs/getting-started.html',
  },
  {
    title: 'Tutorial - Intro to React',
    path: 'tutorial/tutorial.html',
  },
];

(async () => {
  let browser = await puppeteer.launch({headless: true});
  let page = await browser.newPage();

  let snapshots = pages.map(route => {
    return async () => {
      let url = `${ROOT_URL}/${route.path}`;
      console.log(`Taking snapshot of ${url} ...`);

      await page.goto(url);

      await percySnapshot(page, route.title);
      console.log('Snapshot complete.');
    };
  });

  // Snapshot these pages sequentially
  await snapshots.reduce((p, fn) => p.then(fn), Promise.resolve());
  await browser.close();
})();
