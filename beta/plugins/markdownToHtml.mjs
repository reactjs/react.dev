import path from 'path';
import {URL, fileURLToPath} from 'url';
import {valueToEstree} from 'estree-util-value-to-estree';
import {toText} from 'hast-util-to-text';
import {visit} from 'unist-util-visit';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import {remarkMdxFrontmatter} from 'remark-mdx-frontmatter';
import rehypeExternalLinks from 'rehype-external-links';
import remarkImages from 'remark-images';
import remarkUnwrapImages from 'remark-unwrap-images';
import remarkSmartyPants from '@silvenon/remark-smartypants';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

// This plugin autoregisters layouts from file paths.
// It assumes `remark-mdx-frontmatter` adds a `export const frontmatter = {…}` already.
// And generates a table of contents structure from the file.
// It’s a bit like <https://github.com/remcohaszing/remark-mdx-frontmatter>.
// To do: TS should be picking this all up, but it doesn’t? Because of `.mjs`?
/** @type {import('unified').Plugin<void[], import('mdast').Root>} */
function addLayout() {
  return (tree, file) => {
    const data = {toc: []}
    const layoutMap = {
      blog: 'Post',
      learn: 'Learn',
      reference: 'API',
    };
    const pages = fileURLToPath(new URL('../src/pages', import.meta.url));
    const paths = path.relative(pages, file.path).split(path.sep);
    const mainFolder = paths.length > 1 ? paths[0] : undefined;
    const layout = mainFolder && mainFolder in layoutMap ? layoutMap[mainFolder] : 'Home';

    visit(tree, 'element', (node) => {
      if (node.tagName === 'h2' || node.tagName === 'h3') {
        const id = node.properties?.id
        const depth = parseInt(node.tagName.charAt(1), 10)
        data.toc.push({url: '#' + id, depth, text: toText(node)})
      }
    })

    // Add import/exports for the layout.
    tree.children.push({
      type: 'mdxjsEsm',
      value: '',
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            // import withLayout from 'place/$layout'
            {
              type: 'ImportDeclaration',
              specifiers: [{type: 'ImportDefaultSpecifier', local: {type: 'Identifier', name: 'withLayout'}}],
              source: {type: 'Literal', value: 'components/Layout/Layout' + layout}
            },
            // export default withLayout({...data, ...frontmatter})'
            {
              type: 'ExportDefaultDeclaration',
              declaration: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'withLayout'},
                arguments: [
                  {
                    type: 'ObjectExpression',
                    properties: [
                      {type: 'SpreadElement', argument: valueToEstree(data)},
                      {
                        // To do: fix for <https://github.com/remcohaszing/remark-mdx-frontmatter/issues/5>.
                        type: 'SpreadElement',
                        argument: {
                          type: 'ConditionalExpression',
                          test: {
                            type: 'BinaryExpression',
                            left: {
                              type: 'UnaryExpression',
                              operator: 'typeof',
                              prefix: true,
                              argument: {type: 'Identifier', name: 'frontmatter'}
                            },
                            operator: '===',
                            right: {type: 'Identifier', name: 'undefined'}
                          },
                          consequent: {type: 'Identifier', name: 'undefined'},
                          alternate: {type: 'Identifier', name: 'frontmatter'}
                        }
                      }
                    ]
                  }
                ],
                optional: false
              }
            }
          ]
        }
      }
    })
  }
}

// This plugin takes `# Heading {/*id*/}` (in HTML form) and adds those `id`s
// as actual IDs.
// It’s a bit like <https://github.com/remcohaszing/remark-mdx-frontmatter>.
// To do: TS should be picking this all up, but it doesn’t? Because of `.mjs`?
/** @type {import('unified').Plugin<void[], import('hast').Root>} */
function addCustomHeadingIds() {
  const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
  return (tree) => {
    visit(tree, (node) => {
      // Exit if this isn’t a h1, h2, ...
      if (node.type !== 'element' || !headings.includes(node.tagName)) {
        return
      }

      const tail = node.children[node.children.length - 1]

      // Exit if the last child isn’t an empty expression
      if (!tail || tail.type !== 'mdxTextExpression' || !tail.data || !tail.data.estree || tail.data.estree.body.length !== 0) {
        return
      }

      const comment = tail.data.estree.comments[0]

      // Add it as the heading ID:
      if (comment) {
        node.properties.id = comment.value
      }
    })
  }
}

// These plugins work on markdown:
export const remarkPlugins = [
  // Enable GitHub flavored markdown features (tables, footnotes, literal URLs, etc).
  remarkGfm,
  // Enable YAML frontmatter.
  remarkFrontmatter,
  [remarkMdxFrontmatter, {name: 'frontmatter'}],
  // Turn pasted links to images into actual images.
  remarkImages,
  // Remove `<p>` wrapper around images on their own.
  remarkUnwrapImages,
  // Clean up typography. To do: is this still needed?
  remarkSmartyPants,
]

// These plugins work on HTML:
export const rehypePlugins = [
  // Add `_target` and `rel` to full `http:` links.
  rehypeExternalLinks,
  // Find `# heading {/*id*/}`, and use those `id`s as IDs on headings.
  addCustomHeadingIds,
  // Custom plugin to auto-register a layout.
  addLayout
]

// .use(customHeaders)
// .use(smartyPants)

export async function markdownToHtml(markdown) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkPlugins)
    .use(remarkRehype)
    .use(rehypePlugins)
    .use(rehypeStringify)
    .process(markdown);
  return result.toString();
}
