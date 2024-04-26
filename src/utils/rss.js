/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */
const Feed = require('rss');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Recursively get all .md files
const getAllFiles = function (dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, '/', file));
    }
  });

  return arrayOfFiles;
};

// Put MDX output into JSON for client.
exports.generateRssFeed = function () {
  const feed = new Feed({
    title: 'React Blog',
    description:
      'This blog is the official source for the updates from the React team. Anything important, including release notes or deprecation notices, will be posted here first.',
    feed_url: 'https://react.dev/rss.xml',
    site_url: 'https://react.dev/',
    language: 'en', // your target language
    // image: "https://yourdomain.com/image.png",
    favicon: 'https://react.dev/favicon.ico',
    pubDate: new Date(),
    generator: 'react.dev rss module',
  });

  // Define blog posts directory
  const dirPath = path.join(process.cwd(), 'src/content/blog');
  const filesByOldest = getAllFiles(dirPath);
  const files = filesByOldest.reverse();

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const {data} = matter(content);

    const slug = filePath.split('/').slice(-4).join('/').replace('.md', '');
    const id = filePath.split('/').slice(-1).join('');
    if (id !== 'index.md') {
      feed.item({
        id,
        title: data.title,
        author: data.author || '',
        date: new Date(data.date),
        url: `https://react.dev/blog/${slug}`,
        description: data.description,
      });
    }
  }

  fs.writeFileSync('./public/rss.xml', feed.xml({indent: true}));
};
