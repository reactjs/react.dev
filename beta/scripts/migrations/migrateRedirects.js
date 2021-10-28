const fs = require('fs-extra');
const path = require('path');
const fm = require('gray-matter');
const globby = require('globby');

/**
 * This script takes a look at all the redirect frontmatter and converts it
 * into a Next.js compatible redirects list. It also merges it with netlify's
 * _redirects, which we moved by hand below.
 *
 * @remarks
 * In the old gatsby site, redirects were specified in docs and blog post
 * frontmatter that looks like:
 *
 * ---
 * redirect_from:
 *   - /docs/old-path.html#maybe-an-anchor
 * ---
 */

const netlifyRedirects = [
  {
    source: '/html-jsx.html',
    destination: 'https://magic.reactjs.net/htmltojsx.htm',
    permanent: true,
  },
  {
    source: '/tips/controlled-input-null-value.html',
    destination: '/docs/forms.html#controlled-input-null-value',
    permanent: false, // @todo why were these not permanent on netlify?
  },
  {
    source: '/concurrent',
    destination: '/docs/concurrent-mode-intro.html',
    permanent: false,
  },
  {
    source: '/hooks',
    destination: '/docs/hooks-intro.html',
    permanent: false,
  },
  {
    source: '/tutorial',
    destination: '/tutorial/tutorial.html',
    permanent: false,
  },
  {
    source: '/your-story',
    destination: 'https://www.surveymonkey.co.uk/r/MVQV2R9',
    permanent: true,
  },
  {
    source: '/stories',
    destination: 'https://medium.com/react-community-stories',
    permanent: true,
  },
];

Promise.resolve()
  .then(async () => {
    let contentRedirects = [];
    let redirectPageCount = 0;

    // Get all markdown pages
    const pages = await globby('src/pages/**/*.{md,mdx}');
    for (let filepath of pages) {
      // Read file as string
      const rawStr = await fs.readFile(filepath, 'utf8');
      // Extract frontmatter
      const {data, content} = fm(rawStr);
      // Look for redirect yaml
      if (data.redirect_from) {
        redirectPageCount++;

        let destinationPath = filepath
          .replace('src/pages', '')
          .replace('.md', '');

        // Fix /docs/index -> /docs
        if (destinationPath === '/docs/index') {
          destinationPath = '/docs';
        }

        if (destinationPath === '/index') {
          destinationPath = '/';
        }

        for (let sourcePath of data.redirect_from) {
          contentRedirects.push({
            source: '/' + sourcePath, // add slash
            destination: destinationPath,
            permanent: true,
          });
        }
      }
    }
    console.log(
      `Found ${redirectPageCount} pages with \`redirect_from\` frontmatter`
    );
    console.log(
      `Writing ${contentRedirects.length} redirects to redirects.json`
    );

    await fs.writeFile(
      path.resolve('./src/redirects.json'),
      JSON.stringify(
        {
          redirects: [...contentRedirects, ...netlifyRedirects],
        },
        null,
        2
      )
    );

    console.log('✅ Done writing redirects');
  })
  .catch(console.error);
