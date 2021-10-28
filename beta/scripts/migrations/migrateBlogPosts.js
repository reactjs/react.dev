const fs = require('fs-extra');
const path = require('path');
const fm = require('gray-matter');
const globby = require('globby');
const parse = require('date-fns/parse');

/**
 * This script takes the gatsby blog posts directory and migrates it.
 *
 * In gatsby, blog posts were put in markdown files title YYYY-MM-DD-post-title.md.
 * This script looks at that directory and then moves posts into folders paths
 * that match the end URL structure of /blog/YYYY/MM/DD/postitle.md
 *
 * This allows us to use MDX in blog posts.
 */

// I dropped them into src/pages/oldblog
// @todo remove after migration
// I am not proud of this. Also, the blog posts needed to be cleaned up for MDX, don't run this again.
Promise.resolve()
  .then(async () => {
    const blogManifest = {};
    const blogPosts = await globby('src/pages/oldblog/*.md');
    // console.log(blogPosts);
    for (let postpath of blogPosts.sort()) {
      const rawStr = await fs.readFile(postpath, 'utf8');
      // console.log(rawStr);
      const {data, content} = fm(rawStr);
      const cleanPath = postpath.replace('src/pages/oldblog/', '');
      const yrStr = parseInt(cleanPath.substr(0, 4), 10); // 2013-06-02
      // console.log(yrStr);
      const dateStr = cleanPath.substr(0, 10); // 2013-06-02
      const postFileName = cleanPath.substr(11);
      // console.log(postFileName, dateStr);
      const datePath = dateStr.split('-').join('/');
      // console.log(datePath);
      const newPath = './src/pages/blog/' + datePath + '/' + postFileName;
      // console.log(newPath);
      await fs.ensureFile(path.resolve(newPath));
      await fs.writeFile(
        path.resolve(newPath),
        rawStr
          .replace('<br>', '<br/>')
          .replace('<hr>', '<hr/>')
          .replace('layout: post', '')
          .replace('\nauthor', '\nlayout: Post\nauthor')
      );
    }
  })
  .catch(console.error);
