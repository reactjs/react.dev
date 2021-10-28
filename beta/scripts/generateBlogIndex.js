const fs = require('fs-extra');
const path = require('path');
const fm = require('gray-matter');
const globby = require('globby');
const parseISO = require('date-fns/parseISO');
const readingTime = require('reading-time');
const {markdownToHtml} = require('../plugins/markdownToHtml');

/**
 * This looks at the ./src/pages/blog directory and creates a route manifest that can be used
 * in the sidebar and footers, and (in theory) category and author pages.
 *
 * For now, the blog manifest is a big array in reverse chronological order.
 */
Promise.resolve()
  .then(async () => {
    const routes = [];
    const blogPosts = await globby('src/pages/blog/**/*.md');

    for (let postpath of blogPosts) {
      const [year, month, day, title] = postpath
        .replace('src/pages/blog/', '')
        .split('/');

      const rawStr = await fs.readFile(postpath, 'utf8');
      const {data, excerpt, content} = fm(rawStr, {
        excerpt: function firstLine(file, options) {
          file.excerpt = file.content.split('\n').slice(0, 2).join(' ');
        },
      });
      const rendered = await markdownToHtml(excerpt.trimLeft().trim());

      routes.unshift({
        path: postpath.replace('src/pages', ''),
        date: [year, month, day].join('-'),
        title: data.title,
        author: data.author,
        excerpt: rendered,
        readingTime: readingTime(content).text,
      });
    }

    const sorted = routes.sort((post1, post2) =>
      parseISO(post1.date) > parseISO(post2.date) ? -1 : 1
    );
    const blogManifest = {
      routes: sorted,
    };
    const blogRecentSidebar = {
      routes: [
        {
          title: 'Recent Posts',
          path: '/blog',
          heading: true,
          routes: sorted.slice(0, 25),
        },
      ],
    };

    await fs.writeFile(
      path.resolve('./src/blogIndex.json'),
      JSON.stringify(blogManifest, null, 2)
    );
    await fs.writeFile(
      path.resolve('./src/blogIndexRecent.json'),
      JSON.stringify(blogRecentSidebar, null, 2)
    );
  })
  .catch(console.error);
