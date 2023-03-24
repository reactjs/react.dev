/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Children, useContext, useMemo} from 'react';
import * as React from 'react';
import cn from 'classnames';

import CodeBlock from './CodeBlock';
import {CodeDiagram} from './CodeDiagram';
import ConsoleBlock from './ConsoleBlock';
import ExpandableCallout from './ExpandableCallout';
import ExpandableExample from './ExpandableExample';
import {H1, H2, H3, H4} from './Heading';
import InlineCode from './InlineCode';
import Intro from './Intro';
import BlogCard from './BlogCard';
import Link from './Link';
import {PackageImport} from './PackageImport';
import Recap from './Recap';
import Sandpack from './Sandpack';
import Diagram from './Diagram';
import DiagramGroup from './DiagramGroup';
import SimpleCallout from './SimpleCallout';
import TerminalBlock from './TerminalBlock';
import YouWillLearnCard from './YouWillLearnCard';
import {Challenges, Hint, Solution} from './Challenges';
import {IconNavArrow} from '../Icon/IconNavArrow';
import ButtonLink from 'components/ButtonLink';
import {TocContext} from './TocContext';
import type {Toc, TocItem} from './TocContext';
import {TeamMember} from './TeamMember';

function CodeStep({children, step}: {children: any; step: number}) {
  return (
    <span
      data-step={step}
      className={cn(
        'code-step relative rounded border-b-[2px] border-opacity-60 bg-opacity-10 px-[6px] py-[1.5px] dark:bg-opacity-20',
        {
          'border-blue-40 bg-blue-40 text-blue-60 dark:text-blue-30':
            step === 1,
          'border-yellow-40 bg-yellow-40 text-yellow-60 dark:text-yellow-30':
            step === 2,
          'border-purple-40 bg-purple-40 text-purple-60 dark:text-purple-30':
            step === 3,
          'border-green-40 bg-green-40 text-green-60 dark:text-green-30':
            step === 4,
        }
      )}>
      {children}
    </span>
  );
}

const P = (p: JSX.IntrinsicElements['p']) => (
  <p className="my-4 whitespace-pre-wrap" {...p} />
);

const Strong = (strong: JSX.IntrinsicElements['strong']) => (
  <strong className="font-bold" {...strong} />
);

const OL = (p: JSX.IntrinsicElements['ol']) => (
  <ol className="my-3 ml-6 list-decimal" {...p} />
);
const LI = (p: JSX.IntrinsicElements['li']) => (
  <li className="mb-1 leading-relaxed" {...p} />
);
const UL = (p: JSX.IntrinsicElements['ul']) => (
  <ul className="my-3 ml-6 list-disc" {...p} />
);

const Divider = () => (
  <hr className="my-6 block border-b border-t-0 border-border dark:border-border-dark" />
);
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

const Blockquote = ({
  children,
  ...props
}: JSX.IntrinsicElements['blockquote']) => {
  return (
    <blockquote
      className="mdx-blockquote relative my-8 flex rounded-2xl bg-highlight bg-opacity-50 py-4 px-8 leading-6 shadow-inner-border dark:bg-highlight-dark dark:shadow-inner-border-dark"
      {...props}>
      <span className="relative block">{children}</span>
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
      <section className="mt-16 mb-16 flex flex-row items-center justify-between rounded-2xl bg-card p-8 shadow-inner-border dark:bg-card-dark dark:shadow-inner-border-dark">
        <div className="flex-col">
          <h2 className="font-display text-2xl font-bold leading-tight text-primary dark:text-primary-dark">
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
              <IconNavArrow displayDirection="right" className="ml-1 inline" />
            </ButtonLink>
          ) : null}
        </div>
      </section>
      <hr className="mb-14 border-border dark:border-border-dark" />
    </>
  );
}

function ReadBlogPost({path}: {path: string}) {
  return (
    <ButtonLink className="mt-1" label="Read Post" href={path} type="primary">
      Read Post
      <IconNavArrow displayDirection="right" className="ml-1 inline" />
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

function AuthorCredit({
  author = 'Rachel Lee Nabors',
  authorLink = 'http://rachelnabors.com/',
}: {
  author: string;
  authorLink: string;
}) {
  return (
    <div className="sr-only hover:sr-only group-focus-within:not-sr-only group-hover:not-sr-only">
      <p className="absolute left-1/2 -top-4 -translate-x-1/2 -translate-y-full rounded-lg bg-card p-2 text-center text-sm leading-tight text-secondary opacity-0 transition-opacity duration-300 after:absolute after:left-1/2 after:top-[95%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-card after:content-[''] group-hover:flex group-hover:opacity-100 dark:bg-card-dark dark:text-secondary-dark dark:text-secondary-dark after:dark:border-t-card-dark">
        <cite>
          Illustrated by{' '}
          {authorLink ? (
            <a
              target="_blank"
              rel="noreferrer"
              className="text-link dark:text-link-dark"
              href={authorLink}>
              {author}
            </a>
          ) : (
            author
          )}
        </cite>
      </p>
    </div>
  );
}

const IllustrationContext = React.createContext<{
  isInBlock?: boolean;
}>({
  isInBlock: false,
});

function Illustration({
  caption,
  src,
  alt,
  author,
  authorLink,
}: {
  caption: string;
  src: string;
  alt: string;
  author: string;
  authorLink: string;
}) {
  const {isInBlock} = React.useContext(IllustrationContext);

  return (
    <div className="group relative my-16 mx-0 max-w-4xl before:absolute before:-inset-y-16 before:inset-x-0 2xl:mx-auto 2xl:max-w-6xl">
      <figure className="my-8 flex justify-center">
        <img
          src={src}
          alt={alt}
          style={{maxHeight: 300}}
          className="rounded-lg bg-white"
        />
        {caption ? (
          <figcaption className="mt-4 text-center leading-tight">
            {caption}
          </figcaption>
        ) : null}
      </figure>
      {!isInBlock && <AuthorCredit author={author} authorLink={authorLink} />}
    </div>
  );
}

const isInBlockTrue = {isInBlock: true};

function IllustrationBlock({
  sequential,
  author,
  authorLink,
  children,
}: {
  author: string;
  authorLink: string;
  sequential: boolean;
  children: any;
}) {
  const imageInfos = Children.toArray(children).map(
    (child: any) => child.props
  );
  const images = imageInfos.map((info, index) => (
    <figure key={index}>
      <div className="my-4 flex flex-1 items-center justify-center rounded-lg bg-white p-4 xl:p-6">
        <img src={info.src} alt={info.alt} height={info.height} />
      </div>
      {info.caption ? (
        <figcaption className="mt-4 text-center leading-tight text-secondary dark:text-secondary-dark">
          {info.caption}
        </figcaption>
      ) : null}
    </figure>
  ));
  return (
    <IllustrationContext.Provider value={isInBlockTrue}>
      <div className="group relative my-16 mx-0 max-w-4xl before:absolute before:-inset-y-16 before:inset-x-0 2xl:mx-auto 2xl:max-w-6xl">
        {sequential ? (
          <ol className="mdx-illustration-block flex">
            {images.map((x: any, i: number) => (
              <li className="flex-1" key={i}>
                {x}
              </li>
            ))}
          </ol>
        ) : (
          <div className="mdx-illustration-block">{images}</div>
        )}
        <AuthorCredit author={author} authorLink={authorLink} />
      </div>
    </IllustrationContext.Provider>
  );
}

type NestedTocRoot = {
  item: null;
  children: Array<NestedTocNode>;
};

type NestedTocNode = {
  item: TocItem;
  children: Array<NestedTocNode>;
};

function calculateNestedToc(toc: Toc): NestedTocRoot {
  const currentAncestors = new Map<number, NestedTocNode | NestedTocRoot>();
  const root: NestedTocRoot = {
    item: null,
    children: [],
  };
  const startIndex = 1; // Skip "Overview"
  for (let i = startIndex; i < toc.length; i++) {
    const item = toc[i];
    const currentParent: NestedTocNode | NestedTocRoot =
      currentAncestors.get(item.depth - 1) || root;
    const node: NestedTocNode = {
      item,
      children: [],
    };
    currentParent.children.push(node);
    currentAncestors.set(item.depth, node);
  }
  return root;
}

function InlineToc() {
  const toc = useContext(TocContext);
  const root = useMemo(() => calculateNestedToc(toc), [toc]);
  if (root.children.length < 2) {
    return null;
  }
  return <InlineTocItem items={root.children} />;
}

function InlineTocItem({items}: {items: Array<NestedTocNode>}) {
  return (
    <UL>
      {items.map((node) => (
        <LI key={node.item.url}>
          <Link href={node.item.url}>{node.item.text}</Link>
          {node.children.length > 0 && <InlineTocItem items={node.children} />}
        </LI>
      ))}
    </UL>
  );
}

function YouTubeIframe(props: any) {
  return (
    <div className="relative h-0 overflow-hidden pt-[56.25%]">
      <iframe
        className="absolute inset-0 h-full w-full"
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
  return <img className="max-w-[calc(min(700px,100%))]" {...props} />;
}

export const MDXComponents = {
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
  hr: Divider,
  a: Link,
  img: Image,
  BlogCard,
  code: InlineCode,
  pre: CodeBlock,
  CodeDiagram,
  ConsoleBlock,
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
    return <div className="ml-0 max-w-4xl 2xl:mx-auto">{children}</div>;
  },
  Pitfall,
  Deprecated,
  Wip,
  Illustration,
  IllustrationBlock,
  Intro,
  InlineToc,
  LearnMore,
  Math,
  MathI,
  Note,
  PackageImport,
  ReadBlogPost,
  Recap,
  Recipes,
  Sandpack,
  TeamMember,
  TerminalBlock,
  YouWillLearn,
  YouWillLearnCard,
  Challenges,
  Hint,
  Solution,
  CodeStep,
  YouTubeIframe,
};

for (let key in MDXComponents) {
  if (MDXComponents.hasOwnProperty(key)) {
    const MDXComponent: any = (MDXComponents as any)[key];
    MDXComponent.mdxName = key;
  }
}
