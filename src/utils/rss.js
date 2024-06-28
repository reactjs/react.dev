/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */
const Feed = require('rss');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const { platform } = process;
const locale = path[platform === `posix` ? `posix` : `win32`];

const getAllFiles = function (dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + locale.sep + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + locale.sep + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, locale.sep, file));
      const pushedFile = path.join(dirPath, locale.sep, file);
    }
  });

  return arrayOfFiles;
};

exports.generateRssFeed = function () {
  const feed = new Feed({
    title: 'React Blog',
    description:
      'This blog is the official source for the updates from the React team. Anything important, including release notes or deprecation notices, will be posted here first.',
    feed_url: 'https://react.dev/rss.xml',
    site_url: 'https://react.dev/',
    language: 'en',
    favicon: 'https://react.dev/favicon.ico',
    pubDate: new Date(),
    generator: 'react.dev rss module',
  });

  const blogPath = `src${locale.sep}content${locale.sep}blog`;
  const dirPath = path.join(process.cwd(), blogPath);
  const filesByOldest = getAllFiles(dirPath);
  const files = filesByOldest.reverse();

  for (const filePath of files) {
    const id = filePath.split(locale.sep).slice(-1).join('');
    if (id !== 'index.md') {
      const content = fs.readFileSync(filePath, 'utf-8');
      const {data} = matter(content);
      const slug = filePath.split(locale.sep).slice(-4).join(locale.sep).replace('.md', '');

      if (data.title == null || data.title.trim() === '') {
        throw new Error(
          `${id}: Blog posts must include a title in the metadata, for RSS feeds`
        );
      }
      if (data.author == null || data.author.trim() === '') {
        throw new Error(
          `${id}: Blog posts must include an author in the metadata, for RSS feeds`
        );
      }
      if (data.date == null || data.date.trim() === '') {
        throw new Error(
          `${id}: Blog posts must include a date in the metadata, for RSS feeds`
        );
      }
      if (data.description == null || data.description.trim() === '') {
        throw new Error(
          `${id}: Blog posts must include a description in the metadata, for RSS feeds`
        );
      }

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
