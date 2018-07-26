/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import {css} from 'glamor';
import {colors} from 'theme';

const prismColors = {
  char: '#D8DEE9',
  comment: '#889dd0',
  keyword: '#c8afff',
  lineHighlight: '#2f354c',
  primitive: '#f99e65',
  string: '#84eabd',
  variable: '#d7deea',
  boolean: '#ffa3d4',
  punctuation: '#8bd7f0',
  tag: '#ff94be',
  function: '#82bdff',
  className: '#ffe198',
  attrName: '#ffdbaa',
  method: '#6699CC',
  operator: '#fc929e',
};

css.global('.gatsby-highlight', {
  background: colors.dark,
  color: colors.white,
  borderRadius: 10,
  overflow: 'auto',
  tabSize: '1.5em',
});

css.global('.token.script.language-javascript', {
  color: colors.white,
});

css.global(
  `
.gatsby-highlight > code[class*="gatsby-code-"],
.gatsby-highlight > pre[class*="gatsby-code-"],
.gatsby-highlight > pre.prism-code`,
  {
    height: 'auto !important',
    margin: '1rem',
    fontSize: 14,
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
);

css.global('.gatsby-highlight + .gatsby-highlight', {
  marginTop: 20,
});

css.global('.gatsby-highlight-code-line', {
  backgroundColor: prismColors.lineHighlight,
  display: 'block',
  margin: '-0.125rem calc(-1rem - 15px)',
  padding: '0.125rem calc(1rem + 15px)',
});

css.global('.token.attr-name', {
  color: prismColors.attrName,
});

css.global(
  `
.token.comment,
.token.block-comment,
.token.prolog,
.token.doctype,
.token.cdata`,
  {
    color: prismColors.comment,
  },
);

css.global(
  `
.token.property,
.token.number,
.token.function-name,
.token.constant,
.token.symbol,
.token.deleted`,
  {
    color: prismColors.primitive,
  },
);

css.global(`.token.boolean`, {
  color: prismColors.boolean,
});

css.global(`.token.tag`, {
  color: prismColors.tag,
});

css.global(`.token.string`, {
  color: prismColors.string,
});

css.global(
  `
.token.punctuation,
.token.operator`,
  {
    color: prismColors.punctuation,
  },
);

css.global(
  `
.token.selector,
.token.char,
.token.builtin,
.token.inserted`,
  {
    color: prismColors.char,
  },
);

css.global(`.token.function`, {
  color: prismColors.function,
});

css.global(
  `
.token.entity,
.token.url,
.token.variable`,
  {
    color: prismColors.variable,
  },
);

css.global('.token.attr-value', {
  color: prismColors.string,
});

css.global('.token.keyword', {
  color: prismColors.keyword,
});

css.global(
  `
.token.atrule,
.token.class-name`,
  {
    color: prismColors.className,
  },
);

css.global('.token.important', {
  fontWeight: 400,
});

css.global('.token.bold', {
  fontWeight: 700,
});
css.global('.token.italic', {
  fontStyle: 'italic',
});

css.global('.token.entity', {
  cursor: 'help',
});

css.global('.namespace', {
  opacity: 0.7,
});
