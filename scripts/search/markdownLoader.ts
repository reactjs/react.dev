import { readFile } from 'fs/promises'
import { createHash } from 'crypto'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toMarkdown } from 'mdast-util-to-markdown'
import { Content, Root } from 'mdast'
import { u } from 'unist-builder'
import { mdxjs } from 'micromark-extension-mdxjs'
import {mdxFromMarkdown, mdxToMarkdown } from 'mdast-util-mdx'
import { filter } from 'unist-util-filter'
import { readdir, stat } from 'fs/promises'



export interface Section {
    heading?: string;
    content: string;
}


export interface Page {
    checksum: string;
    sections: Section[];
}


export interface PageSource {
    load: () => Promise<Page>;
    path: string;
    source: "react.dev"
}

const ignoredFiles = ['']


export async function fetchSources() {
    const pageSources = (await walk('src/content'))
      .filter(({ path }) => /\.md?$/.test(path))
      .filter(({ path }) => !ignoredFiles.includes(path))
      .map((entry) => genLoader(entry.path))
  
   return pageSources;
}


function genLoader(filePath: string) : PageSource {
    const path = filePath.replace(/\.md?$/, '')
    const load = () : Promise<Page> => {
        return loadPage(filePath);
    };
    return {load: load, path: path, source: "react.dev"}
}

export function splitTreeBy(tree: Root, predicate: (node: Content) => boolean) {
    return tree.children.reduce<Root[]>((trees, node) => {
      const [lastTree] = trees.slice(-1)
  
      if (!lastTree || predicate(node)) {
        const tree: Root = u('root', [node])
        return trees.concat(tree)
      }
  
      lastTree.children.push(node)
      return trees
    }, [])
}

export function parseHeading(heading: string): { heading: string; customAnchor?: string } {
    const match = heading.match(/(.*) *\[#(.*)\]/)
    if (match) {
      const [, heading, customAnchor] = match
      return { heading, customAnchor }
    }
    return { heading }
  }
  

async function loadPage(filePath: string): Promise<Page> {
    const content = await readFile(filePath, 'utf8')
    const checksum = createHash('sha256').update(content).digest('base64')
    const mdxTree = fromMarkdown(content, {
        extensions: [mdxjs()],
        mdastExtensions: [mdxFromMarkdown()],
      });
    
    const mdTree = filter(
        mdxTree,
        (node) =>
        ![
            'mdxjsEsm',
            'mdxJsxFlowElement',
            'mdxJsxTextElement',
            'mdxFlowExpression',
            'mdxTextExpression',
          ].includes(node.type)
    )

    if (!mdTree) {
        return {
          checksum,
          sections: [],
        }
    }
    const sectionTrees = splitTreeBy(mdTree, (node) => node.type === 'heading')
    const sections = sectionTrees.map((tree) => {
        const [firstNode] = tree.children
        const content = toMarkdown(tree)
    
        const rawHeading: string | undefined = firstNode.type === 'heading' ? toString(firstNode) : undefined
    
        if (!rawHeading) {
          return { content }
        }
        const { heading } = parseHeading(rawHeading)
    
        return {
          content,
          heading,
        }
      })
    return {
        checksum,
        sections,
    }
}


function toString(node) {
    return (
      (node &&
        (node.value ||
          node.alt ||
          node.title ||
          ('children' in node && all(node.children)) ||
          ('length' in node && all(node)))) ||
      ''
    )
  }
  
  function all(values) {
    const result : any[] = []
    const length = values.length
    let index = -1
  
    while (++index < length) {
      result[index] = toString(values[index])
    }
  
    return result.join('')
  }
  


import { basename, dirname, join } from 'path'

type WalkEntry = {
  path: string
  parentPath?: string
}
 
async function walk(dir: string, parentPath?: string): Promise<WalkEntry[]> {
  const immediateFiles = await readdir(dir)

  const recursiveFiles = await Promise.all(
    immediateFiles.map(async (file) => {
      const path = join(dir, file)
      const stats = await stat(path)
      if (stats.isDirectory()) {
        // Keep track of document hierarchy (if this dir has corresponding doc file)
        const docPath = `${basename(path)}.mdx`

        return walk(
          path,
          immediateFiles.includes(docPath) ? join(dirname(path), docPath) : parentPath
        )
      } else if (stats.isFile()) {
        return [
          {
            path: path,
            parentPath,
          },
        ]
      } else {
        return []
      }
    })
  )

  const flattenedFiles = recursiveFiles.reduce(
    (all, folderContents) => all.concat(folderContents),
    []
  )

  return flattenedFiles.sort((a, b) => a.path.localeCompare(b.path))
}