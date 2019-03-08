/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import {css} from 'glamor';
import {colors} from 'theme';

const prismColors = {
  background: '#252932',
  char: '#D8DEE9',
  comment: '#9999c5',
  keyword: '#dfa9f9',
  lineHighlight: '#313949',
  primitive: '#ff8d5b',
  string: '#ffd48f',
  variable: '#eaf0fb',
  boolean: '#ff7c8b',
  punctuation: '#90deff',
  tag: '#3ce6da',
  tagClass: '#fc9464',
  function: '#80b6ff',
  className: '#ffdb7f',
  attrName: '#d6f78f',
  method: '#6699CC',
};

css.global('.gatsby-highlight', {
  background: prismColors.background,
  color: prismColors.variable,
  borderRadius: 10,
  overflow: 'auto',
  tabSize: '1.5em',
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
    lineHeight: '20px',
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

css.global('.token.tag.class-name', {
  color: prismColors.tagClass,
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

css.global('.token.language-javascript', {
  color: prismColors.variable,
});
