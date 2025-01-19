'use client';

import React, {Children} from 'react';

const IllustrationContext = React.createContext<{
  isInBlock?: boolean;
}>({
  isInBlock: false,
});

function AuthorCredit({
  author = 'Rachel Lee Nabors',
  authorLink = 'https://nearestnabors.com/',
}: {
  author: string;
  authorLink: string;
}) {
  return (
    <div className="sr-only group-hover:not-sr-only group-focus-within:not-sr-only hover:sr-only">
      <p className="bg-card dark:bg-card-dark text-center text-sm text-secondary dark:text-secondary-dark leading-tight p-2 rounded-lg absolute start-1/2 -top-4 -translate-x-1/2 -translate-y-full group-hover:flex group-hover:opacity-100 after:content-[''] after:absolute after:start-1/2 after:top-[95%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-card after:dark:border-t-card-dark opacity-0 transition-opacity duration-300">
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

export function Illustration({
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
    <div className="relative group before:absolute before:-inset-y-16 before:inset-x-0 my-16 mx-0 2xl:mx-auto max-w-4xl 2xl:max-w-6xl">
      <figure className="my-8 flex justify-center">
        <img
          src={src}
          alt={alt}
          style={{maxHeight: 300}}
          className="rounded-lg"
        />
        {caption ? (
          <figcaption className="text-center leading-tight mt-4">
            {caption}
          </figcaption>
        ) : null}
      </figure>
      {!isInBlock && <AuthorCredit author={author} authorLink={authorLink} />}
    </div>
  );
}

const isInBlockTrue = {isInBlock: true};

export function IllustrationBlock({
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
      <div className="bg-white rounded-lg p-4 flex-1 flex xl:p-6 justify-center items-center my-4">
        <img
          className="text-primary"
          src={info.src}
          alt={info.alt}
          height={info.height}
        />
      </div>
      {info.caption ? (
        <figcaption className="text-secondary dark:text-secondary-dark text-center leading-tight mt-4">
          {info.caption}
        </figcaption>
      ) : null}
    </figure>
  ));
  return (
    <IllustrationContext.Provider value={isInBlockTrue}>
      <div className="relative group before:absolute before:-inset-y-16 before:inset-x-0 my-16 mx-0 2xl:mx-auto max-w-4xl 2xl:max-w-6xl">
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
