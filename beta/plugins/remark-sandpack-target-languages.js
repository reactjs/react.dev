const {transform} = require('@babel/core');
const path = require('path');
const prettier = require('prettier');
const visit = require('unist-util-visit');

/**
 * Adds an additional JS codeblock to <Sandpack> children which which is based on the corresponding TypeScript codeblock.
 * The resulting JS code is formatted with Prettier.
 */
module.exports = () => {
  return async function transformer(tree, file) {
    const prettierConfig = await prettier.resolveConfig(
      file.path ??
        // TODO: When testing, `file.path` was always undefined
        // Now the formatting of the TS codeblock might use a different formatting config than the resolved config here.
        // E.g. when `content/learn/.prettierrc` exists it would be ignored at this point.
        file.cwd
    );

    visit(tree, 'mdxJsxFlowElement', (node) => {
      if (node.name === 'Sandpack') {
        const childrenWithJSTargetLanguage = node.children.flatMap((child) => {
          if (
            child.type === 'code' &&
            (child.lang === 'tsx' || child.lang === 'ts')
          ) {
            const codeTSNode = child;
            // By default we assume `/App.tsx`
            // TODO: We should just require a filename i.e. `meta` so that we don't have an assumption that spreads throughout the codebase.
            const [tsFileName = '/App.tsx', ...rest] =
              codeTSNode.meta?.split(' ') ?? [];
            // Gallery.tsx -> Gallery.js
            // data.ts -> data.js
            const jsFileName = tsFileName.replace(/\.(ts|tsx)$/, '.js');
            const meta = [jsFileName, ...rest].join(' ');
            const codeTS = codeTSNode.value;
            let codeJS = codeTS;
            try {
              codeJS = transform(codeTS, {
                filename: tsFileName,
                presets: [
                  [
                    '@babel/preset-typescript',
                    {allExtensions: true, isTSX: tsFileName.endsWith('.tsx')},
                  ],
                ],
              }).code;
              codeJS = prettier.format(codeJS, {
                ...prettierConfig,
                filepath: jsFileName,
              });
            } catch (error) {
              throw new Error(
                `Failed to compile ${tsFileName}:\n${codeTS}\n${error}`
              );
            }
            const codeJSNode = {
              type: 'code',
              lang: 'js',
              meta,
              value: codeJS,
            };

            // We can't just append since this would result in a different order of snippets if some snippets are not TS and visible:
            // App.tsx, styles.css -> styles.css, App.js
            // So we splice the transpiled version in instead:
            // App.tsx, styles.css -> App.tsx, App.js, styles.css
            return [codeTSNode, codeJSNode];
          } else {
            return child;
          }
        });

        if (childrenWithJSTargetLanguage.length !== node.children) {
          node.children = childrenWithJSTargetLanguage;
        }
      }
    });
  };
};
