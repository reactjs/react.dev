// @ts-ignore
import compile from '@mdx-js/mdx';
import {transformSync} from '@babel/core';

export default function MDXRenderer({mdx}) {
  let src = compile.sync(mdx);
  let compiled =
    `let mdx = require('react').createElement; ` +
    transformSync(src, {
      presets: ['@babel/preset-react'],
    }).code.replace(
      `const layoutProps = {};
const MDXLayout = "wrapper";
export default `,
      `const layoutProps = {};
const MDXLayout = "wrapper";
    `
    ) +
    ' global.MDXContent = MDXContent;';
  eval(compiled);
  let MDXContent = global.MDXContent;
  return <MDXContent />;
}
