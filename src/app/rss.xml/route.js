import Feed from 'rss';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const getAllFiles = (dirPath, arrayOfFiles = []) => {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
};

export async function GET() {
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

  const dirPath = path.join(process.cwd(), 'src/content/blog');
  const filesByOldest = getAllFiles(dirPath);
  const files = filesByOldest.reverse();

  for (const filePath of files) {
    const id = path.basename(filePath);
    if (id !== 'index.md') {
      const content = fs.readFileSync(filePath, 'utf-8');
      const {data} = matter(content);
      const slug = filePath.split('/').slice(-4).join('/').replace('.md', '');

      if (!data.title || !data.author || !data.date || !data.description) {
        throw new Error(
          `${id}: Blog posts must include title, author, date, and description in metadata.`
        );
      }

      feed.item({
        id,
        title: data.title,
        author: data.author,
        date: new Date(data.date),
        url: `https://react.dev/blog/${slug}`,
        description: data.description,
      });
    }
  }

  return new Response(feed.xml({indent: true}), {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  });
}

export const dynamic = 'force-static';
