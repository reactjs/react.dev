import path from 'path';
import {fileURLToPath} from 'url';
import grayMatter from 'gray-matter';
import {valueToEstree} from 'estree-util-value-to-estree';
import {visit} from 'unist-util-visit';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import rehypeExternalLinks from 'rehype-external-links';
import remarkImages from 'remark-images';
import remarkUnwrapImages from 'remark-unwrap-images';
import remarkSmartyPants from '@silvenon/remark-smartypants';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

// This plugin adds layouts from frontmatter.
// It’s a bit like <https://github.com/remcohaszing/remark-mdx-frontmatter>.
// To do: TS should be picking this all up, but it doesn’t? Because of `.mjs`?
/** @type {import('unified').Plugin<void[], import('mdast').Root>} */
function turnFrontmatterIntoALayout() {
  return (tree, file) => {
    const head = tree.children[0]
    let data = {}
    let index = 0

    if (head && head.type === 'yaml') {
      const result = grayMatter('---\n' + head.value + '\n---')
      data = result.data
      index = 1
    }

    const layoutMap = {
      blog: 'Post',
      learn: 'Learn',
      reference: 'API',
    };
    const pages = fileURLToPath(new URL('../src/pages', import.meta.url));
    const paths = path.relative(pages, file.path).split(path.sep);
    const mainFolder = paths.length > 1 ? paths[0] : undefined;
    const layout = mainFolder && mainFolder in layoutMap ? layoutMap[mainFolder] : 'Home';

    // Add import/exports for the layout.
    tree.children.splice(index, 0, {
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
            // export default withLayout(data)'
            {
              type: 'ExportDefaultDeclaration',
              declaration: {
                type: 'CallExpression',
                callee: {type: 'Identifier', name: 'withLayout'},
                arguments: [valueToEstree(data)],
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
  // Custom plugin to turn YAML frontmatter into a layout.
  turnFrontmatterIntoALayout,
  // Turn pasted links to images into actual images.
  remarkImages,
  // Remove `<p>` wrapper around images on their own.
  remarkUnwrapImages,
  // Clean up typography. To do: is this still needed?
  remarkSmartyPants
]

// These plugins work on HTML:
export const rehypePlugins = [
  // Add `_target` and `rel` to full `http:` links.
  rehypeExternalLinks,
  addCustomHeadingIds
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
