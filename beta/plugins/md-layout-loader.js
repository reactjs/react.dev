const fm = require('gray-matter');
const path = require('path');
const compile = require('@mdx-js/mdx');
const {transformSync} = require('@babel/core');

const layouts = {
  apis: 'LayoutAPI',
  learn: 'LayoutLearn',
};

module.exports = async function (src) {
  const callback = this.async();
  const {content, data} = fm(src);
  const compiled = compile.sync(content);
  const pageParentDir = path
    .dirname(path.relative('./src/pages', this.resourcePath))
    .split(path.sep)
    .shift();
  const returnCode = compiled.slice(
    compiled.indexOf('return ') + 'return '.length,
    compiled.indexOf('</MDXLayout>') + '</MDXLayout>'.length
  );
  const code = `
import MDXLayout from 'components/Layout/${
    layouts[pageParentDir] || 'LayoutLearn'
  }';
import A from 'components/MDX/Link.client'
const layoutProps = {};

export default function MDXContent({
  components,
  ...props
}) {
  return ${returnCode}
}
  `
    .replace(/<a/g, '<A')
    .replace(/<\/a>/g, '</A>');
  return callback(null, code);
};
