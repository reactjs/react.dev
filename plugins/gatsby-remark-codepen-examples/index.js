const {existsSync} = require('fs');
const {join} = require('path');
const map = require('unist-util-map');

const CODEPEN_PROTOCOL = 'codepen://';
const DEFAULT_LINK_TEXT = 'Try it on CodePen';

// TODO target="_blank"
module.exports = ({markdownAST}, {directory}) => {
  map(markdownAST, (node, index, parent) => {
    if (!directory.startsWith('/')) {
      directory = `/${directory}`;
    }

    if (!directory.endsWith('/')) {
      directory = `${directory}/`;
    }

    // eg convert
    // from: [](codepen:introducing-jsx)
    // to: <a href="/<directory>/introducing-jsx" target="_blank">Try it on CodePen</a>
    // from: [Try the Hello World example on CodePen](codepen:hello-world)
    // to: <a href="/<directory>/hello-world" target="_blank">Try the Hello World example on CodePen</a>
    if (node.type === 'link' && node.url.startsWith(CODEPEN_PROTOCOL)) {
      const href = node.url.replace(CODEPEN_PROTOCOL, `${directory}`);
      const text =
        node.children.length === 0 ? DEFAULT_LINK_TEXT : node.children[0].value;

      // Verify that the specified example file exists.
      const filePath = join(__dirname, `../../${href}.js`);
      if (!existsSync(filePath)) {
        console.error(
          `Invalid Codepen link specified; no such file "${filePath}"`,
        );
        process.exit(1);
      }

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
