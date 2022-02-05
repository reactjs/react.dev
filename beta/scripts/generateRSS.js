const RSS = require('rss');
const fs = require('fs-extra');
const authorsJson = require('../src/authors.json');
const blogIndexJson = require('../src/blogIndex.json');
const parse = require('date-fns/parse');

function removeFromLast(path, key) {
  const i = path.lastIndexOf(key);
  return i === -1 ? path : path.substring(0, i);
}

const SITE_URL = 'https://reactjs.org';

function generate() {
  const feed = new RSS({
    title: 'React.js Blog',
    site_url: SITE_URL,
    feed_url: SITE_URL + '/feed.xml',
  });

  blogIndexJson.routes.map((meta) => {
    feed.item({
      title: meta.title,
      guid: removeFromLast(meta.path, '.'),
      url: SITE_URL + removeFromLast(meta.path, '.'),
      date: parse(meta.date, 'yyyy-MM-dd', new Date()),
      description: meta.description,
      custom_elements: [].concat(
        meta.author.map((author) => ({
          author: [{ name: authorsJson[author].name }],
        }))
      ),
    });
  });

  const rss = feed.xml({ indent: true });

  fs.writeFileSync('./.next/static/feed.xml', rss);
}

try {
  generate();
} catch (error) {
  console.error('Error generating rss feed');
  throw error;
}
