const fm = require('gray-matter');
const path = require('path');
const compile = require('@mdx-js/mdx');
const {transformSync} = require('@babel/core');

module.exports = async function (src) {
  const callback = this.async();
  const {content, data} = fm(src);
  const compiled = compile.sync(content);
  console.log('-- orig --', compiled);
  const returnCode = compiled.slice(
    compiled.indexOf('return ') + 'return '.length,
    compiled.indexOf('</MDXLayout>') + '</MDXLayout>'.length
  );
  const code = `
const layoutProps = {};
const MDXLayout = "wrapper"

export default function MDXContent({
  components,
  ...props
}) {
  return ${returnCode}
}
  `;
  console.log(code);
  return callback(null, code);
};
