/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import cn from 'classnames';
import {highlightTree} from '@codemirror/highlight';
import {javascript} from '@codemirror/lang-javascript';
import {HighlightStyle, tags} from '@codemirror/highlight';
import rangeParser from 'parse-numeric-range';
import {CustomTheme} from '../Sandpack/Themes';

interface InlineHiglight {
  step: number;
  line: number;
  startColumn: number;
  endColumn: number;
}

const CodeBlock = function CodeBlock({
  children: {
    props: {className = 'language-js', children: code = '', meta},
  },
  noMargin,
}: {
  children: React.ReactNode & {
    props: {
      className: string;
      children?: string;
      meta?: string;
    };
  };
  className?: string;
  noMargin?: boolean;
}) {
  code = code.trimEnd();
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

  return (
    <div
      className={cn(
        'sandpack sandpack--codeblock',
        'rounded-lg h-full w-full overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg',
        !noMargin && 'my-8'
      )}>
      <div className="sp-wrapper">
        <div className="sp-stack">
          <div className="sp-code-editor">
            <pre className="sp-cm sp-pristine sp-javascript flex align-start">
              <code className="sp-pre-placeholder grow-[2]">{finalOutput}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;

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
