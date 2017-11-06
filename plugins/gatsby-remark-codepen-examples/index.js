const map = require('unist-util-map');

const DEFAULT_LINK_TEXT = 'Try it on CodePen';

// TODO target="_blank"
module.exports = ({markdownAST}) => {
  map(markdownAST, (node, index, parent) => {
    // eg convert
    // from: [](codepen:introducing-jsx)
    // to: <a href="/codepen/introducing-jsx" target="_blank">Try it on CodePen</a>
    // from: [Try the Hello World example on CodePen](codepen:hello-world)
    // to: <a href="/codepen/hello-world" target="_blank">Try the Hello World example on CodePen</a>
    if (node.type === 'link' && node.url.startsWith('codepen:')) {
      const href = node.url.replace('codepen:', '/codepen/');
      const text =
        node.children.length === 0 ? DEFAULT_LINK_TEXT : node.children[0].value;

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
