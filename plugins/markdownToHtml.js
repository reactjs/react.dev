const remark = import('remark');
const externalLinks = import('rehype-external-links'); // Add _target and rel to external links
const customHeaders = import('./remark-header-custom-ids'); // Custom header id's for i18n
const images = import('remark-images'); // Improved image syntax
const unrwapImages = import('rehype-unwrap-images'); // Removes <p> wrapper around images
const smartyPants = import('./remark-smartypants'); // Cleans up typography
const html = import('remark-html');

module.exports = {
  remarkPlugins: [
    externalLinks,
    customHeaders,
    images,
    unrwapImages,
    smartyPants,
  ],
  markdownToHtml,
};

async function markdownToHtml(markdown) {
  const result = await remark()
    .use(externalLinks)
    .use(customHeaders)
    .use(images)
    .use(unrwapImages)
    .use(smartyPants)
    .use(html)
    .process(markdown);
  return result.toString();
}
