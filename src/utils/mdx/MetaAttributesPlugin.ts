import {Root} from 'mdast';
import visit from 'unist-util-visit';

// Support stuff like ```js App.js {1-5} active by passing it through.
export function MetaAttributesPlugin() {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (
        // @ts-expect-error -- tagName is a valid property
        node.tagName === 'code' &&
        node.data &&
        node.data.meta
      ) {
        // @ts-expect-error -- properties is a valid property
        node.properties.meta = node.data.meta;
      }
    });
  };
}
