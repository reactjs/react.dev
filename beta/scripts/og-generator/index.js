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

const getDescription = async (path) => {
  mdxContents = fs.readFileSync(path, 'utf8');
  const compileMdx = require('@mdx-js/mdx');
  const {remarkPlugins} = require('../../plugins/markdownToHtml');
  const jsxCode = await compileMdx(mdxContents, {
    remarkPlugins,
  });
  const {transform} = require('@babel/core');

  const jsCode = await transform(jsxCode, {
    plugins: ['@babel/plugin-transform-modules-commonjs'],
    presets: ['@babel/preset-react'],
  }).code;

  let fakeExports = {};
  // For each fake MDX import, give back the string component name.
  // It will get serialized later.
  const fakeRequire = (key) => key;
  const evalJSCode = new Function('require', 'exports', 'mdx', jsCode);
  const createElement = require('react').createElement;
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // THIS IS A BUILD-TIME EVAL. NEVER DO THIS WITH UNTRUSTED MDX (LIKE FROM CMS)!!!
  // In this case it's okay because anyone who can edit our MDX can also edit this file.
  evalJSCode(fakeRequire, fakeExports, createElement);
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const reactTree = fakeExports.default({});

  const {Children} = require('react');

  const ReactServerDOM = require('react-dom/server');
  const introContent = Children.toArray(reactTree.props.children)
    .filter((child) => {
      return child.props?.mdxType === 'Intro';
    })
    .map((child) => child.props)
    .map(({children}) => ReactServerDOM.renderToString(children))[0];

  return introContent;
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

    await page.setContent(
      getHTML(
        title,
        description ? description : (await getDescription(filepath)) ?? ''
      )
    );
    await page.screenshot({
      type: 'png',
      path: `./public/images/ogassets/${slugs.slug(title, false)}.png`,
    });
  }
  // Terminate browser once screenshots are generated
  await browser.close();
})();
