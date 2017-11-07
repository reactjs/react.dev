const {existsSync, readFileSync} = require('fs');
const LZString = require('lz-string');
const {join} = require('path');
const map = require('unist-util-map');

const PROTOCOL = 'babel-repl://';

// Matches compression used in Babel REPL
// https://github.com/babel/website/blob/master/js/repl/UriUtils.js
const compress = string =>
  LZString.compressToBase64(string)
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, ''); // Remove ending '='

module.exports = ({markdownAST}, {directory}) => {
  map(markdownAST, (node, index, parent) => {
    if (!directory.endsWith('/')) {
      directory += '/';
    }

    if (node.type === 'link' && node.url.startsWith(PROTOCOL)) {
      let filePath = node.url.replace(PROTOCOL, directory);
      if (!filePath.endsWith('.js')) {
        filePath += '.js';
      }
      filePath = join(__dirname, '../..', filePath);

      // Verify that the specified example file exists.
      if (!existsSync(filePath)) {
        console.error(
          `Invalid Babel REPL link specified; no such file "${filePath}"`,
        );
        process.exit(1);
      }

      const code = compress(readFileSync(filePath, 'utf8'));
      const href = `https://babeljs.io/repl/#?presets=react&code_lz=${code}`;
      const text = node.children[0].value;

      const anchorOpenNode = {
        type: 'html',
        value: `<a href="${href}" target="_blank">`,
      };

      const textNode = {
        type: 'text',
        value: text,
      };

      const anchorCloseNode = {
        type: 'html',
        value: '</a>',
      };

      parent.children.splice(
        index,
        1,
        anchorOpenNode,
        textNode,
        anchorCloseNode,
      );
    }

    // No change
    return node;
  });
};
