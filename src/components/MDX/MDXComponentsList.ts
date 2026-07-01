/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * The list of MDX component names. Lives in a server-safe module so that
 * `compileMDX` can enumerate them without crossing the client boundary
 * (the actual components live in `MDXComponents.tsx`, which is marked
 * `'use client'`).
 *
 * Keep this list in sync with the keys of `MDXComponents`.
 */
export const MDX_COMPONENT_NAMES = [
  'p',
  'strong',
  'blockquote',
  'ol',
  'ul',
  'li',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'hr',
  'a',
  'img',
  'BlogCard',
  'code',
  'pre',
  'CodeDiagram',
  'ConsoleBlock',
  'ConsoleBlockMulti',
  'ConsoleLogLine',
  'DeepDive',
  'Diagram',
  'DiagramGroup',
  'FullWidth',
  'MaxWidth',
  'Pitfall',
  'Deprecated',
  'Wip',
  'Illustration',
  'IllustrationBlock',
  'Intro',
  'InlineToc',
  'LanguageList',
  'LearnMore',
  'Math',
  'MathI',
  'Note',
  'RC',
  'Canary',
  'Experimental',
  'ExperimentalBadge',
  'CanaryBadge',
  'NextMajor',
  'NextMajorBadge',
  'RSC',
  'RSCBadge',
  'PackageImport',
  'ReadBlogPost',
  'Recap',
  'Recipes',
  'Sandpack',
  'SandpackRSC',
  'SandpackWithHTMLOutput',
  'TeamMember',
  'TerminalBlock',
  'YouWillLearn',
  'YouWillLearnCard',
  'Challenges',
  'Hint',
  'Solution',
  'CodeStep',
  'YouTubeIframe',
  'ErrorDecoder',
] as const;

export type MDXComponentName = typeof MDX_COMPONENT_NAMES[number];
