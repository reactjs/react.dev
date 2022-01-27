/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';

import {APIAnatomy, AnatomyStep} from './APIAnatomy';
import CodeBlock from './CodeBlock';
import {CodeDiagram} from './CodeDiagram';
import ConsoleBlock from './ConsoleBlock';
import Convention from './Convention';
import ExpandableCallout from './ExpandableCallout';
import ExpandableExample from './ExpandableExample';
import {H1, H2, H3, H4} from './Heading';
import HomepageHero from './HomepageHero';
import InlineCode from './InlineCode';
import Intro from './Intro';
import Link from './Link';
import {PackageImport} from './PackageImport';
import Recap from './Recap';
import Sandpack from './Sandpack';
import SimpleCallout from './SimpleCallout';
import TerminalBlock from './TerminalBlock';
import YouWillLearnCard from './YouWillLearnCard';
import {Challenges, Hint, Solution} from './Challenges';
import {IconNavArrow} from '../Icon/IconNavArrow';
import ButtonLink from 'components/ButtonLink';

const P = (p: JSX.IntrinsicElements['p']) => (
  <p className="whitespace-pre-wrap my-4" {...p} />
);

const Strong = (strong: JSX.IntrinsicElements['strong']) => (
  <strong className="font-bold" {...strong} />
);

const OL = (p: JSX.IntrinsicElements['ol']) => (
  <ol className="ml-6 my-3 list-decimal" {...p} />
);
const LI = (p: JSX.IntrinsicElements['li']) => (
  <li className="leading-relaxed mb-1" {...p} />
);
const UL = (p: JSX.IntrinsicElements['ul']) => (
  <ul className="ml-6 my-3 list-disc" {...p} />
);

const Divider = () => (
  <hr className="my-6 block border-b border-border dark:border-border-dark" />
);

const Gotcha = ({children}: {children: React.ReactNode}) => (
  <ExpandableCallout type="gotcha">{children}</ExpandableCallout>
);
const Note = ({children}: {children: React.ReactNode}) => (
  <ExpandableCallout type="note">{children}</ExpandableCallout>
);

const Blockquote = ({
  children,
  ...props
}: JSX.IntrinsicElements['blockquote']) => {
  return (
    <>
      <blockquote
        className="mdx-blockquote py-4 px-8 my-8 shadow-inner bg-highlight dark:bg-highlight-dark bg-opacity-50 rounded-lg leading-6 flex relative"
        {...props}>
        <span className="block relative">{children}</span>
      </blockquote>
      <style jsx global>{`
        .mdx-blockquote > span > p:first-of-type {
          margin-bottom: 0;
        }
        .mdx-blockquote > span > p:last-of-type {
          margin-bottom: 1rem;
        }
      `}</style>
    </>
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
      <section className="p-8 mt-16 mb-16 flex flex-row shadow-inner justify-between items-center bg-card dark:bg-card-dark rounded-lg">
        <div className="flex-col">
          <h2 className="text-primary dark:text-primary-dark font-bold text-2xl leading-tight">
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
              <IconNavArrow displayDirection="right" className="inline ml-1" />
            </ButtonLink>
          ) : null}
        </div>
      </section>
      <hr className="border-border dark:border-border-dark mb-14" />
    </>
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

function YouWillLearn({children}: {children: any}) {
  return <SimpleCallout title="You will learn">{children}</SimpleCallout>;
}

// TODO: typing.
function Recipes(props: any) {
  return <Challenges {...props} isRecipes={true} />;
}

function AuthorCredit({
  author,
  authorLink,
}: {
  author: string;
  authorLink: string;
}) {
  return (
    <p className="text-center text-secondary dark:text-secondary-dark text-base mt-2">
      <cite>
        Illustrated by{' '}
        {authorLink ? (
          <a className="text-link dark:text-link-dark" href={authorLink}>
            {author}
          </a>
        ) : (
          author
        )}
      </cite>
    </p>
  );
}

function Illustration({
  caption,
  src,
  alt,
  author,
  authorLink,
  children,
}: {
  caption: string;
  src: string;
  alt: string;
  author: string;
  authorLink: string;
  children: any;
}) {
  return (
    <div className="my-16 mx-0 2xl:mx-auto max-w-4xl 2xl:max-w-6xl">
      <figure className="my-8 flex justify-center">
        <img
          src={src}
          alt={alt}
          style={{maxHeight: 300}}
          className="bg-white rounded-lg"
        />
        {caption ? (
          <figcaption className="text-center leading-tight mt-4">
            {caption}
          </figcaption>
        ) : null}
      </figure>
      {author ? <AuthorCredit author={author} authorLink={authorLink} /> : null}
    </div>
  );
}

function IllustrationBlock({
  title,
  sequential,
  author,
  authorLink,
  children,
}: {
  title: string;
  author: string;
  authorLink: string;
  sequential: boolean;
  children: any;
}) {
  const imageInfos = React.Children.toArray(children).map(
    (child: any) => child.props
  );
  const images = imageInfos.map((info, index) => (
    <figure key={index}>
      <div className="bg-white rounded-lg p-4 flex-1 flex xl:p-6 justify-center items-center my-4">
        <img src={info.src} alt={info.alt} height={info.height} />
      </div>
      {info.caption ? (
        <figcaption className="text-secondary dark:text-secondary-dark text-center leading-tight mt-4">
          {info.caption}
        </figcaption>
      ) : null}
    </figure>
  ));
  return (
    <div className="my-16 mx-0 2xl:mx-auto max-w-4xl 2xl:max-w-6xl">
      {title ? (
        <h3 className="text-center text-xl font-bold leading-9 mb-4">
          {title}
        </h3>
      ) : null}
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
      {author ? <AuthorCredit author={author} authorLink={authorLink} /> : null}
      <style jsx global>{`
        .mdx-illustration-block {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          justify-content: center;
          align-content: stretch;
          align-items: stretch;
          gap: 42px;
        }
        ol.mdx-illustration-block {
          gap: 60px;
        }
        .mdx-illustration-block li {
          display: flex;
          align-items: flex-start;
          align-content: stretch;
          justify-content: space-around;
          position: relative;
          padding: 1rem;
        }
        .mdx-illustration-block figure {
          display: flex;
          flex-direction: column;
          align-content: center;
          align-items: center;

          justify-content: space-between;
          position: relative;
          height: 100%;
        }
        .mdx-illustration-block li:after {
          content: ' ';
          display: block;
          position: absolute;
          top: 50%;
          right: 100%;
          transform: translateY(-50%);
          width: 60px;
          height: 49px;
          background: center / contain no-repeat url('/images/g_arrow.png');
        }
        .mdx-illustration-block li:first-child:after {
          content: ' ';
          display: none;
        }
        .mdx-illustration-block img {
          max-height: 250px;
          width: 100%;
        }
        @media (max-width: 680px) {
          .mdx-illustration-block {
            flex-direction: column;
          }
          .mdx-illustration-block img {
            max-height: 200px;
            width: auto;
          }
          .mdx-illustration-block li:after {
            top: 0;
            left: 50%;
            right: auto;
            transform: translateX(-50%) translateY(-100%) rotate(90deg);
          }
        }
      `}</style>
    </div>
  );
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
  inlineCode: InlineCode,
  hr: Divider,
  a: Link,
  code: CodeBlock,
  // The code block renders <pre> so we just want a div here.
  pre: (p: JSX.IntrinsicElements['div']) => <div {...p} />,
  // Scary: dynamic(() => import('./Scary')),
  APIAnatomy,
  AnatomyStep,
  CodeDiagram,
  ConsoleBlock,
  Convention,
  DeepDive: (props: {
    children: React.ReactNode;
    title: string;
    excerpt: string;
  }) => <ExpandableExample {...props} type="DeepDive" />,
  Gotcha,
  HomepageHero,
  Illustration,
  IllustrationBlock,
  Intro,
  LearnMore,
  Math,
  MathI,
  Note,
  PackageImport,
  Recap,
  Recipes,
  Sandpack,
  TerminalBlock,
  YouWillLearn,
  YouWillLearnCard,
  Challenges,
  Hint,
  Solution,
};
