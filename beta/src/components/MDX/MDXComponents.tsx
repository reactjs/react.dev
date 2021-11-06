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

const P: React.FC<{p: JSX.IntrinsicElements['p']}> = (p) => (
  <p className="whitespace-pre-wrap my-4" {...p} />
);

const Strong: React.FC<{strong: JSX.IntrinsicElements['strong']}> = (strong) => (
  <strong className="font-bold" {...strong} />
);

const OL: React.FC<{ol: JSX.IntrinsicElements['ol']}> = (ol) => (
  <ol className="ml-6 my-3 list-decimal" {...ol} />
);
const LI: React.FC<{li: JSX.IntrinsicElements['li']}> = (li) => (
  <li className="leading-relaxed mb-1" {...li} />
);
const UL: React.FC<{ul: JSX.IntrinsicElements['ul']}> = (ul) => (
  <ul className="ml-6 my-3 list-disc" {...ul} />
);

const Divider: React.FC = () => (
  <hr className="my-6 block border-b border-border dark:border-border-dark" />
);

const Gotcha: React.FC = ({children}) => (
  <ExpandableCallout type="gotcha">{children}</ExpandableCallout>
);
const Note: React.FC = ({children}) => (
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

const LearnMore: React.FC<{
  title: string;
  path?: string;
}> = ({
  children,
  path,
}) => {
  return (
    <>
      <section className="p-8 mt-16 mb-16 flex flex-row shadow-inner justify-between items-center bg-card dark:bg-card-dark rounded-lg">
        <div className="flex-col">
          <h2 className="text-primary dark:text-primary-dark font-bold text-2xl leading-tight">
            Ready to learn this topic?
          </h2>
          {children}
          {path && (
            <ButtonLink
              className="mt-1"
              label="Read More"
              href={path}
              type="primary">
              Read More
              <IconNavArrow displayDirection="right" className="inline ml-1" />
            </ButtonLink>
          )}
        </div>
      </section>
      <hr className="border-border dark:border-border-dark mb-14" />
    </>
  );
}

const Math: React.FC = ({children}) => {
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

const MathI: React.FC = ({children}) => {
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

const YouWillLearn: React.FC = ({children}) => {
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

const Illustration: React.FC<{
  caption: string;
  src: string;
  alt: string;
  author: string;
  authorLink: string;
  children: any;
}> = ({
  caption,
  src,
  alt,
  author,
  authorLink,
}) => {
  return (
    <div className="my-16 mx-0 2xl:mx-auto max-w-4xl 2xl:max-w-6xl">
      <figure className="my-8 flex justify-center">
        <img src={src} alt={alt} style={{maxHeight: 300}} />
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

interface ImageInfo {
  title:string; 
  caption: string; 
  alt:string; 
  src:string; 
  height: string
}

const IllustrationBlock: React.FC<{
  title: string;
  author: string;
  authorLink: string;
  sequential: boolean;
}> = ({
  title,
  sequential,
  author,
  authorLink,
  children,
}) => {
  const imageInfos: ImageInfo[] = React.Children.toArray(children).map(
    (child: any) => child.props
  );
  const images = imageInfos.map(({src, alt, height, caption}, index: number) => (
    <figure key={index}>
      <div className="flex-1 flex p-0 xl:px-6 justify-center items-center my-4">
        <img src={src} alt={alt} height={height} />
      </div>
      {caption && (
        <figcaption className="text-secondary dark:text-secondary-dark text-center leading-tight mt-4">
          {caption}
        </figcaption>
      )}
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
          {images.map((x: React.ReactNode) => (
            <li className="flex-1">{x}</li>
          ))}
        </ol>
      ) : (
        <div className="mdx-illustration-block">{images}</div>
      )}
      {author && <AuthorCredit author={author} authorLink={authorLink} />}
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
