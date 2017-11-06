const {readdirSync, readFileSync} = require('fs');
const {join, resolve} = require('path');

// Store code snippets in GraphQL for the home page examples.
// Snippets will be matched with markdown templates of the same name.
exports.sourceNodes = ({graphql, boundActionCreators}) => {
  const {createNode} = boundActionCreators;

  const path = resolve(__dirname, '../../content/home/examples');
  const files = readdirSync(path);

  files.forEach(file => {
    if (file.match(/\.js$/)) {
      const code = readFileSync(join(path, file), 'utf8');
      const id = file.replace(/\.js$/, '');

      createNode({
        id,
        children: [],
        parent: 'EXAMPLES',
        internal: {
          type: 'ExampleCode',
          contentDigest: JSON.stringify(code),
        },
      });
    }
  });
};
