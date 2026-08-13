import type {Root} from 'hast';
import visit from 'unist-util-visit';

export function MetaAttributesPlugin() {
  return (tree: Root) => {
    visit(tree, 'element', (node: any) => {
      if (node.tagName === 'code' && node.data?.meta) {
        node.properties ??= {};
        node.properties.meta = node.data.meta;
      }
    });
  };
}
