const fs = require('fs-extra');
const path = require('path');
const fm = require('gray-matter');
const globby = require('globby');

/**
 * This script ensures that every file in the docs folder is named corresponding
 * to its respective frontmatter permalink. In the old site, the path of the page was set by
 * the `permalink` in markdown frontmatter, and not the name of the file itself or it's id.
 * In the new Next.js site, with its filesystem router, the name of the file must
 * match exactly to its `permalink`.
 */
Promise.resolve()
  .then(async () => {
    const pages = await globby('src/pages/docs/**/*.{md,mdx}');
    for (let sourcePath of pages.sort()) {
      const rawStr = await fs.readFile(sourcePath, 'utf8');
      const {data, content} = fm(rawStr);
      const currentPath = sourcePath
        .replace('src/pages/', '')
        .replace('.md', '');
      const permalink = data.permalink.replace('.html', '');
      if (permalink !== currentPath) {
        const destPath = 'src/pages/' + permalink + '.md';
        try {
          await fs.move(sourcePath, destPath);
          console.log(`MOVED: ${sourcePath} --> ${destPath}`);
        } catch (error) {
          console.error(`ERROR: ${sourcePath} --> ${destPath}`);
          console.error(error);
        }
      }
    }
  })
  .catch(console.error);
