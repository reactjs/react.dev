// 'use client';

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

// import {Children, useContext, useMemo} from 'react';
import * as React from 'react';
import cn from 'classnames';
import type {HTMLAttributes} from 'react';

import CodeBlock from './CodeBlock';
import {CodeDiagram} from './CodeDiagram';
import {ConsoleBlock, ConsoleLogLine, ConsoleBlockMulti} from './ConsoleBlock';
import ExpandableCallout from './ExpandableCallout';
import ExpandableExample from './ExpandableExample';
import {H1, H2, H3, H4, H5} from './Heading';
import InlineCode from './InlineCode';
import Intro from './Intro';
import BlogCard from './BlogCard';
import Link from './Link';
import {PackageImport} from './PackageImport';
import Recap from './Recap';
import Sandpack from './Sandpack';
import SandpackWithHTMLOutput from './SandpackWithHTMLOutput';
import Diagram from './Diagram';
import DiagramGroup from './DiagramGroup';
import SimpleCallout from './SimpleCallout';
import TerminalBlock from './TerminalBlock';
import YouWillLearnCard from './YouWillLearnCard';
import {Challenges, Hint, Solution} from './Challenges';
import {IconNavArrow} from '../Icon/IconNavArrow';
import ButtonLink from 'components/ButtonLink';
import {TeamMember} from './TeamMember';
import ErrorDecoder from './ErrorDecoder';
import {IconCanary} from '../Icon/IconCanary';
import {InlineToc} from './InlineToc';
import {Illustration, IllustrationBlock} from './Illustration';
import {LanguageList} from './LanguageList';
import {Divider, LI, OL, P, Strong, UL} from './Primitives';

function CodeStep({children, step}: {children: any; step: number}) {
  return (
    <span
      data-step={step}
      className={cn(
        'code-step bg-opacity-10 dark:bg-opacity-20 relative rounded px-[6px] py-[1.5px] border-b-[2px] border-opacity-60',
        {
          'bg-blue-40 border-blue-40 text-blue-60 dark:text-blue-30':
            step === 1,
          'bg-yellow-40 border-yellow-40 text-yellow-60 dark:text-yellow-30':
            step === 2,
          'bg-purple-40 border-purple-40 text-purple-60 dark:text-purple-30':
            step === 3,
          'bg-green-40 border-green-40 text-green-60 dark:text-green-30':
            step === 4,
        }
      )}>
      {children}
    </span>
  );
}

const Wip = ({children}: {children: React.ReactNode}) => (
  <ExpandableCallout type="wip">{children}</ExpandableCallout>
);
const Pitfall = ({children}: {children: React.ReactNode}) => (
  <ExpandableCallout type="pitfall">{children}</ExpandableCallout>
);
const Deprecated = ({children}: {children: React.ReactNode}) => (
  <ExpandableCallout type="deprecated">{children}</ExpandableCallout>
);
const Note = ({children}: {children: React.ReactNode}) => (
  <ExpandableCallout type="note">{children}</ExpandableCallout>
);

const Canary = ({children}: {children: React.ReactNode}) => (
  <ExpandableCallout type="canary">{children}</ExpandableCallout>
);

const NextMajor = ({children}: {children: React.ReactNode}) => (
  <ExpandableCallout type="major">{children}</ExpandableCallout>
);

const RSC = ({children}: {children: React.ReactNode}) => (
  <ExpandableCallout type="rsc">{children}</ExpandableCallout>
);

const CanaryBadge = ({title}: {title: string}) => (
  <span
    title={title}
    className={
      'text-base font-display px-1 py-0.5 font-bold bg-gray-10 dark:bg-gray-60 text-gray-60 dark:text-gray-10 rounded'
    }>
    <IconCanary
      size="s"
      className={'inline me-1 mb-0.5 text-sm text-gray-60 dark:text-gray-10'}
    />
    Canary only
  </span>
);

const NextMajorBadge = ({title}: {title: string}) => (
  <span
    title={title}
    className={
      'text-base font-display px-2 py-0.5 font-bold bg-blue-10 dark:bg-blue-60 text-gray-60 dark:text-gray-10 rounded'
    }>
    React 19
  </span>
);

const RSCBadge = ({title}: {title: string}) => (
  <span
    title={title}
    className={
      'text-base font-display px-2 py-0.5 font-bold bg-blue-10 dark:bg-blue-50 text-gray-60 dark:text-gray-10 rounded'
    }>
    RSC
  </span>
);

const Blockquote = ({children, ...props}: HTMLAttributes<HTMLQuoteElement>) => {
  return (
    <blockquote
      className="mdx-blockquote py-4 px-8 my-8 shadow-inner-border dark:shadow-inner-border-dark bg-highlight dark:bg-highlight-dark bg-opacity-50 rounded-2xl leading-6 flex relative"
      {...props}>
      <span className="block relative">{children}</span>
    </blockquote>
  );
};

function LearnMore({
  children,
  path,
}: {
  title: string;
  path?: string;
  children: any;
}) {
  return (
    <>
      <section className="p-8 mt-16 mb-16 flex flex-row shadow-inner-border dark:shadow-inner-border-dark justify-between items-center bg-card dark:bg-card-dark rounded-2xl">
        <div className="flex-col">
          <h2 className="text-primary font-display dark:text-primary-dark font-bold text-2xl leading-tight">
            Ready to learn this topic?
          </h2>
          {children}
          {path ? (
            <ButtonLink
              className="mt-1"
              label="Read More"
              href={path}
              type="primary">
              Read More
              <IconNavArrow displayDirection="end" className="inline ms-1" />
            </ButtonLink>
          ) : null}
        </div>
      </section>
      <hr className="border-border dark:border-border-dark mb-14" />
    </>
  );
}

function ReadBlogPost({path}: {path: string}) {
  return (
    <ButtonLink className="mt-1" label="Read Post" href={path} type="primary">
      Read Post
      <IconNavArrow displayDirection="end" className="inline ms-1" />
    </ButtonLink>
  );
}

function Math({children}: {children: any}) {
  return (
    <span
      style={{
        fontFamily: 'STIXGeneral-Regular, Georgia, serif',
        fontSize: '1.2rem',
      }}>
      {children}
    </span>
  );
}

function MathI({children}: {children: any}) {
  return (
    <span
      style={{
        fontFamily: 'STIXGeneral-Italic, Georgia, serif',
        fontSize: '1.2rem',
      }}>
      {children}
    </span>
  );
}

function YouWillLearn({
  children,
  isChapter,
}: {
  children: any;
  isChapter?: boolean;
}) {
  let title = isChapter ? 'In this chapter' : 'You will learn';
  return <SimpleCallout title={title}>{children}</SimpleCallout>;
}

// TODO: typing.
function Recipes(props: any) {
  return <Challenges {...props} isRecipes={true} />;
}

function YouTubeIframe(props: any) {
  return (
    <div className="relative h-0 overflow-hidden pt-[56.25%]">
      <iframe
        className="absolute inset-0 w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        title="YouTube video player"
        {...props}
      />
    </div>
  );
}

function Image(props: any) {
  const {alt, ...rest} = props;
  return <img alt={alt} className="max-w-[calc(min(700px,100%))]" {...rest} />;
}

function annotateMDXComponents(
  components: Record<string, React.ElementType>
): Record<string, React.ElementType> {
  return Object.entries(components).reduce((acc, [key, Component]) => {
    acc[key] = (props) => <Component {...props} data-mdx-name={key} />;
    acc[key].displayName = `Annotated(${key})`; // Optional, for debugging
    return acc;
  }, {} as Record<string, React.ElementType>);
}

export const MDXComponentsToc = annotateMDXComponents({
  a: Link,
  code: InlineCode,
});

export const MDXComponents = annotateMDXComponents({
  p: P,
  strong: Strong,
  blockquote: Blockquote,
  ol: OL,
  ul: UL,
  li: LI,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  hr: Divider,
  a: Link,
  img: Image,
  BlogCard,
  code: InlineCode,
  pre: CodeBlock,
  CodeDiagram,
  ConsoleBlock,
  ConsoleBlockMulti,
  ConsoleLogLine,
  DeepDive: (props: {
    children: React.ReactNode;
    title: string;
    excerpt: string;
  }) => <ExpandableExample {...props} type="DeepDive" />,
  Diagram,
  DiagramGroup,
  FullWidth({children}: {children: any}) {
    return children;
  },
  MaxWidth({children}: {children: any}) {
    return <div className="max-w-4xl ms-0 2xl:mx-auto">{children}</div>;
  },
  Pitfall,
  Deprecated,
  Wip,
  Illustration,
  IllustrationBlock,
  Intro,
  InlineToc,
  LanguageList,
  LearnMore,
  Math,
  MathI,
  Note,
  Canary,
  CanaryBadge,
  NextMajor,
  NextMajorBadge,
  RSC,
  RSCBadge,
  PackageImport,
  ReadBlogPost,
  Recap,
  Recipes,
  Sandpack,
  SandpackWithHTMLOutput,
  TeamMember,
  TerminalBlock,
  YouWillLearn,
  YouWillLearnCard,
  Challenges,
  Hint,
  Solution,
  CodeStep,
  YouTubeIframe,
  ErrorDecoder,
});
