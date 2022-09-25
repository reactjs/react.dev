/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {Children, isValidElement, cloneElement} from 'react';
import cn from 'classnames';
import {highlightTree} from '@codemirror/highlight';
import {javascript} from '@codemirror/lang-javascript';
import {HighlightStyle, tags} from '@codemirror/highlight';
import rangeParser from 'parse-numeric-range';
import {CustomTheme} from 'components/MDX/Sandpack/Themes';

if (typeof window !== 'undefined') {
  document.body.innerHTML = '';
  throw Error('This should never run on the client.');
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export const PREPARE_MDX_CACHE_BREAKER = 3;
// !!! IMPORTANT !!! Bump this if you change any logic.
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export function prepareMDX(rawChildren: any): {
  toc: Array<{
    url: string;
    text: string;
    depth: number;
  }>;
  children: any;
} {
  const toc = getTableOfContents(rawChildren);
  const children = processAndWrapInMaxWidthContainers(rawChildren);
  return {toc, children};
}

function processAndWrapInMaxWidthContainers(children: any): any {
  // Auto-wrap everything except a few types into
  // <MaxWidth> wrappers. Keep reusing the same
  // wrapper as long as we can until we meet
  // a full-width section which interrupts it.
  let fullWidthTypes = [
    'Sandpack',
    'FullWidth',
    'Illustration',
    'IllustrationBlock',
    'Challenges',
    'Recipes',
  ];
  let wrapQueue: any[] = [];
  let finalChildren: any[] = [];
  function flushWrapper(key: number | string) {
    if (wrapQueue.length > 0) {
      const Wrapper = 'MaxWidth';
      // @ts-ignore
      finalChildren.push(<Wrapper key={key}>{wrapQueue}</Wrapper>);
      wrapQueue = [];
    }
  }
  function handleChild(child: any, key: number | string) {
    if (child == null) {
      return;
    }
    if (typeof child !== 'object') {
      wrapQueue.push(child);
      return;
    }
    if (fullWidthTypes.includes((child as any).type)) {
      flushWrapper(key);
      finalChildren.push(highlightCodeBlocksRecursively(child, []));
    } else {
      wrapQueue.push(highlightCodeBlocksRecursively(child, []));
    }
  }
  Children.forEach(children, handleChild);
  flushWrapper('last');
  return finalChildren;
}

function highlightCodeBlocksRecursively(
  child: any,
  parentPath: Array<string>
): any {
  if (!isValidElement(child)) {
    return child;
  }
  const props: any = child.props;
  const newParentPath = [...parentPath, child.type as string];
  const overrideProps: any = {
    children: Array.isArray(props.children)
      ? Children.map(props.children, (grandchild: any) =>
          highlightCodeBlocksRecursively(grandchild, newParentPath)
        )
      : highlightCodeBlocksRecursively(props.children, newParentPath),
  };
  if (
    child.type === 'code' &&
    // @ts-ignore
    parentPath.at(-1) === 'pre' && // Don't highlight inline text
    // @ts-ignore
    parentPath.at(-2) !== 'Sandpack' // Interactive snippets highlight on the client
  ) {
    overrideProps.highlightedCode = prepareCodeBlockChildren(
      props.children,
      props.meta
    );
  }
  return cloneElement(child, overrideProps);
}

// --------------------------------------------------------
// TOC
// --------------------------------------------------------

function getTableOfContents(children: any): Array<{
  url: string;
  text: string;
  depth: number;
}> {
  const anchors = Children.toArray(children)
    .filter((child: any) => {
      if (child.type) {
        return ['h1', 'h2', 'h3', 'Challenges', 'Recap'].includes(child.type);
      }
      return false;
    })
    .map((child: any) => {
      if (child.type === 'Challenges') {
        return {
          url: '#challenges',
          depth: 2,
          text: 'Challenges',
        };
      }
      if (child.type === 'Recap') {
        return {
          url: '#recap',
          depth: 2,
          text: 'Recap',
        };
      }
      return {
        url: '#' + child.props.id,
        depth: (child.type && parseInt(child.type.replace('h', ''), 0)) ?? 0,
        text: child.props.children,
      };
    });
  if (anchors.length > 0) {
    anchors.unshift({
      url: '#',
      text: 'Overview',
      depth: 2,
    });
  }
  return anchors;
}

// --------------------------------------------------------
// CodeBlock
// --------------------------------------------------------

interface InlineHiglight {
  step: number;
  line: number;
  startColumn: number;
  endColumn: number;
}

function prepareCodeBlockChildren(
  rawChildren: string = '',
  meta: string
): React.ReactNode {
  const code = rawChildren.trimEnd();
  const tree = language.language.parser.parse(code);
  let tokenStarts = new Map();
  let tokenEnds = new Map();
  const highlightTheme = getSyntaxHighlight(CustomTheme);
  highlightTree(tree, highlightTheme.match, (from, to, className) => {
    tokenStarts.set(from, className);
    tokenEnds.set(to, className);
  });

  const highlightedLines = new Map();
  const lines = code.split('\n');
  const lineDecorators = getLineDecorators(code, meta);
  for (let decorator of lineDecorators) {
    highlightedLines.set(decorator.line - 1, decorator.className);
  }

  const inlineDecorators = getInlineDecorators(code, meta);
  const decoratorStarts = new Map();
  const decoratorEnds = new Map();
  for (let decorator of inlineDecorators) {
    // Find where inline highlight starts and ends.
    let decoratorStart = 0;
    for (let i = 0; i < decorator.line - 1; i++) {
      decoratorStart += lines[i].length + 1;
    }
    decoratorStart += decorator.startColumn;
    const decoratorEnd =
      decoratorStart + (decorator.endColumn - decorator.startColumn);
    if (decoratorStarts.has(decoratorStart)) {
      throw Error('Already opened decorator at ' + decoratorStart);
    }
    decoratorStarts.set(decoratorStart, decorator.className);
    if (decoratorEnds.has(decoratorEnd)) {
      throw Error('Already closed decorator at ' + decoratorEnd);
    }
    decoratorEnds.set(decoratorEnd, decorator.className);
  }

  // Produce output based on tokens and decorators.
  // We assume tokens never overlap other tokens, and
  // decorators never overlap with other decorators.
  // However, tokens and decorators may mutually overlap.
  // In that case, decorators always take precedence.
  let currentDecorator = null;
  let currentToken = null;
  let buffer = '';
  let lineIndex = 0;
  let lineOutput = [];
  let finalOutput = [];
  for (let i = 0; i < code.length; i++) {
    if (tokenEnds.has(i)) {
      if (!currentToken) {
        throw Error('Cannot close token at ' + i + ' because it was not open.');
      }
      if (!currentDecorator) {
        lineOutput.push(
          <span key={i + '/t'} className={currentToken}>
            {buffer}
          </span>
        );
        buffer = '';
      }
      currentToken = null;
    }
    if (decoratorEnds.has(i)) {
      if (!currentDecorator) {
        throw Error(
          'Cannot close decorator at ' + i + ' because it was not open.'
        );
      }
      lineOutput.push(
        <span key={i + '/d'} className={currentDecorator}>
          {buffer}
        </span>
      );
      buffer = '';
      currentDecorator = null;
    }
    if (decoratorStarts.has(i)) {
      if (currentDecorator) {
        throw Error(
          'Cannot open decorator at ' + i + ' before closing last one.'
        );
      }
      if (currentToken) {
        lineOutput.push(
          <span key={i + 'd'} className={currentToken}>
            {buffer}
          </span>
        );
        buffer = '';
      } else {
        lineOutput.push(buffer);
        buffer = '';
      }
      currentDecorator = decoratorStarts.get(i);
    }
    if (tokenStarts.has(i)) {
      if (currentToken) {
        throw Error('Cannot open token at ' + i + ' before closing last one.');
      }
      currentToken = tokenStarts.get(i);
      if (!currentDecorator) {
        lineOutput.push(buffer);
        buffer = '';
      }
    }
    if (code[i] === '\n') {
      lineOutput.push(buffer);
      buffer = '';
      finalOutput.push(
        <div
          key={lineIndex}
          className={'cm-line ' + (highlightedLines.get(lineIndex) ?? '')}>
          {lineOutput}
          <br />
        </div>
      );
      lineOutput = [];
      lineIndex++;
    } else {
      buffer += code[i];
    }
  }
  lineOutput.push(buffer);
  finalOutput.push(
    <div
      key={lineIndex}
      className={'cm-line ' + (highlightedLines.get(lineIndex) ?? '')}>
      {lineOutput}
    </div>
  );
  return finalOutput;
}

const language = javascript({jsx: true, typescript: false});

function classNameToken(name: string): string {
  return `sp-syntax-${name}`;
}

function getSyntaxHighlight(theme: any): HighlightStyle {
  return HighlightStyle.define([
    {tag: tags.link, textdecorator: 'underline'},
    {tag: tags.emphasis, fontStyle: 'italic'},
    {tag: tags.strong, fontWeight: 'bold'},

    {
      tag: tags.keyword,
      class: classNameToken('keyword'),
    },
    {
      tag: [tags.atom, tags.number, tags.bool],
      class: classNameToken('static'),
    },
    {
      tag: tags.tagName,
      class: classNameToken('tag'),
    },
    {tag: tags.variableName, class: classNameToken('plain')},
    {
      // Highlight function call
      tag: tags.function(tags.variableName),
      class: classNameToken('definition'),
    },
    {
      // Highlight function definition differently (eg: functional component def in React)
      tag: tags.definition(tags.function(tags.variableName)),
      class: classNameToken('definition'),
    },
    {
      tag: tags.propertyName,
      class: classNameToken('property'),
    },
    {
      tag: [tags.literal, tags.inserted],
      class: classNameToken(theme.syntax.string ? 'string' : 'static'),
    },
    {
      tag: tags.punctuation,
      class: classNameToken('punctuation'),
    },
    {
      tag: [tags.comment, tags.quote],
      class: classNameToken('comment'),
    },
  ]);
}

function getLineDecorators(
  code: string,
  meta: string
): Array<{
  line: number;
  className: string;
}> {
  if (!meta) {
    return [];
  }
  const linesToHighlight = getHighlightLines(meta);
  const highlightedLineConfig = linesToHighlight.map((line) => {
    return {
      className: 'bg-github-highlight dark:bg-opacity-10',
      line,
    };
  });
  return highlightedLineConfig;
}

function getInlineDecorators(
  code: string,
  meta: string
): Array<{
  step: number;
  line: number;
  startColumn: number;
  endColumn: number;
  className: string;
}> {
  if (!meta) {
    return [];
  }
  const inlineHighlightLines = getInlineHighlights(meta, code);
  const inlineHighlightConfig = inlineHighlightLines.map(
    (line: InlineHiglight) => ({
      ...line,
      elementAttributes: {'data-step': `${line.step}`},
      className: cn(
        'code-step bg-opacity-10 dark:bg-opacity-20 relative rounded px-1 py-[1.5px] border-b-[2px] border-opacity-60',
        {
          'bg-blue-40 border-blue-40 text-blue-60 dark:text-blue-30 font-bold':
            line.step === 1,
          'bg-yellow-40 border-yellow-40 text-yellow-60 dark:text-yellow-30 font-bold':
            line.step === 2,
          'bg-purple-40 border-purple-40 text-purple-60 dark:text-purple-30 font-bold':
            line.step === 3,
          'bg-green-40 border-green-40 text-green-60 dark:text-green-30 font-bold':
            line.step === 4,
        }
      ),
    })
  );
  return inlineHighlightConfig;
}

/**
 *
 * @param meta string provided after the language in a markdown block
 * @returns array of lines to highlight
 * @example
 * ```js {1-3,7} [[1, 1, 20, 33], [2, 4, 4, 8]] App.js active
 * ...
 * ```
 *
 * -> The meta is `{1-3,7} [[1, 1, 20, 33], [2, 4, 4, 8]] App.js active`
 */
function getHighlightLines(meta: string): number[] {
  const HIGHLIGHT_REGEX = /{([\d,-]+)}/;
  const parsedMeta = HIGHLIGHT_REGEX.exec(meta);
  if (!parsedMeta) {
    return [];
  }
  return rangeParser(parsedMeta[1]);
}

/**
 *
 * @param meta string provided after the language in a markdown block
 * @returns InlineHighlight[]
 * @example
 * ```js {1-3,7} [[1, 1, 'count'], [2, 4, 'setCount']] App.js active
 * ...
 * ```
 *
 * -> The meta is `{1-3,7} [[1, 1, 'count', [2, 4, 'setCount']] App.js active`
 */
function getInlineHighlights(meta: string, code: string) {
  const INLINE_HIGHT_REGEX = /(\[\[.*\]\])/;
  const parsedMeta = INLINE_HIGHT_REGEX.exec(meta);
  if (!parsedMeta) {
    return [];
  }

  const lines = code.split('\n');
  const encodedHiglights = JSON.parse(parsedMeta[1]);
  return encodedHiglights.map(([step, lineNo, substr, fromIndex]: any[]) => {
    const line = lines[lineNo - 1];
    let index = line.indexOf(substr);
    const lastIndex = line.lastIndexOf(substr);
    if (index !== lastIndex) {
      if (fromIndex === undefined) {
        throw Error(
          "Found '" +
            substr +
            "' twice. Specify fromIndex as the fourth value in the tuple."
        );
      }
      index = line.indexOf(substr, fromIndex);
    }
    if (index === -1) {
      throw Error("Could not find: '" + substr + "'");
    }
    return {
      step,
      line: lineNo,
      startColumn: index,
      endColumn: index + substr.length,
    };
  });
}
