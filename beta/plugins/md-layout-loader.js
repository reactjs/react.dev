const fm = require('gray-matter');
const path = require('path');
const compile = require('@mdx-js/mdx');
const {transformSync} = require('@babel/core');

module.exports = async function (src) {
  const callback = this.async();
  const {content, data} = fm(src);
  const code =
    'let mdx = require("react").createElement;' +
    compile.sync(content).replace(
      `/* @jsxRuntime classic */
/* @jsx mdx */`,
      ''
    );
  return callback(null, code);
};
