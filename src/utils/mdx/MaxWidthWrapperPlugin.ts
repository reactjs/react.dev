import {Root, RootContent} from 'mdast';
import {u} from 'unist-builder';

export function MaxWidthWrapperPlugin() {
  const fullWidthTypes = [
    'Sandpack',
    'FullWidth',
    'Illustration',
    'IllustrationBlock',
    'Challenges',
    'Recipes',
  ];

  return (tree: Root) => {
    const newChildren: RootContent[] = [];
    let wrapQueue: RootContent[] = [];

    function flushWrapper() {
      if (wrapQueue.length > 0) {
        newChildren.push(
          u('mdxJsxFlowElement', {
            name: 'MaxWidth',
            attributes: [],
            children: wrapQueue,
          } as any)
        );
        wrapQueue = [];
      }
    }

    for (const node of tree.children) {
      if (
        // @ts-expect-error
        fullWidthTypes.includes(node.name) &&
        // @ts-expect-error: mdxJsxFlowElement
        node.type === 'mdxJsxFlowElement'
      ) {
        flushWrapper();
        newChildren.push(node);
      } else {
        wrapQueue.push(node);
      }
    }
    flushWrapper();

    tree.children = newChildren;
  };
}
