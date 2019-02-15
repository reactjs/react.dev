/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import {injectGlobal} from 'emotion';
import {colors} from 'theme';

const prismColors = {
  char: '#D8DEE9',
  comment: '#B2B2B2',
  keyword: '#c5a5c5',
  lineHighlight: '#353b45', // colors.dark + extra lightness
  primitive: '#5a9bcf',
  string: '#8dc891',
  variable: '#d7deea',
  boolean: '#ff8b50',
  punctuation: '#88C6BE',
  tag: '#fc929e',
  function: '#79b6f2',
  className: '#FAC863',
  method: '#6699CC',
  operator: '#fc929e',
};

injectGlobal`.gatsby-highlight {
  background: ${colors.dark};
  color: ${colors.white};
  border-radius: 10px;
  overflow: auto;
  tab-size: 1.5em;
  -webkit-overflow-scrolling: touch;
}`;

injectGlobal`
.gatsby-highlight > code[class*="gatsby-code-"],
.gatsby-highlight > pre[class*="gatsby-code-"],
.gatsby-highlight > pre.prism-code {
  height: auto !important;
  margin: 1rem;
  font-size: 14px;
  line-height: 20px;
  white-space: pre-wrap;
  word-break: break-word;
}`;

injectGlobal`.gatsby-highlight + .gatsby-highlight {
  margin-top: 20px
}`;

injectGlobal`.gatsby-highlight-code-line {
  background-color: ${prismColors.lineHighlight};
  display: block;
  margin: -0.125rem calc(-1rem - 15px);
  padding: 0.125rem calc(1rem + 15px);
}`;

injectGlobal`.token.attr-name {
  color: ${prismColors.keyword};
}`;

injectGlobal`
.token.comment,
.token.block-comment,
.token.prolog,
.token.doctype,
.token.cdata {
  color: ${prismColors.comment}
}`;

injectGlobal`
.token.property,
.token.number,
.token.function-name,
.token.constant,
.token.symbol,
.token.deleted {
  color: ${prismColors.primitive}
}`;

injectGlobal`.token.boolean {
  color: ${prismColors.boolean}
}`;

injectGlobal`.token.tag {
  color: ${prismColors.tag}
}`;

injectGlobal`.token.string {
  color: ${prismColors.string}
}`;

injectGlobal`.token.punctuation {
  color: ${prismColors.punctuation}
}`;

injectGlobal`
.token.selector,
.token.char,
.token.builtin,
.token.inserted {
  color: ${prismColors.char}
}`;

injectGlobal`.token.function {
  color: ${prismColors.function}
}`;

injectGlobal`
.token.operator,
.token.entity,
.token.url,
.token.variable {
  color: ${prismColors.variable}
}`;

injectGlobal`.token.attr-value {
  color: ${prismColors.string}
}`;

injectGlobal`.token.keyword {
  color: ${prismColors.keyword}
}`;

injectGlobal`
.token.atrule,
.token.class-name{
  color: ${prismColors.className}
}`;

injectGlobal`.token.important {
  font-weight: 400
}`;

injectGlobal`.token.bold {
  font-weight: 700
}`;

injectGlobal`.token.italic {
  font-style: italic
}`;

injectGlobal`.token.entity {
  cursor: help
}`;

injectGlobal`.namespace {
  opacity: 0.7
}`;
