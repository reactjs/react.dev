import type {Root} from 'mdast';

const fullWidthTypes = new Set([
  'Sandpack',
  'SandpackRSC',
  'FullWidth',
  'Illustration',
  'IllustrationBlock',
  'Challenges',
  'Recipes',
]);

export function MaxWidthWrapperPlugin() {
  return (tree: Root) => {
    const children: any[] = [];
    let pending: any[] = [];

    function flush() {
      if (pending.length === 0) {
        return;
      }
      children.push({
        type: 'mdxJsxFlowElement',
        name: 'MaxWidth',
        attributes: [],
        children: pending,
      });
      pending = [];
    }

    for (const node of tree.children as any[]) {
      if (
        node.type === 'mdxJsxFlowElement' &&
        fullWidthTypes.has(node.name ?? '')
      ) {
        flush();
        children.push(node);
      } else {
        pending.push(node);
      }
    }
    flush();
    tree.children = children;
  };
}
