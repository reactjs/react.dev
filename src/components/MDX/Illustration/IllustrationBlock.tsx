import {Children} from 'react';
import {IllustrationContext} from './IllustrationContext';
import {AuthorCredit} from './AuthorCredit';

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
    <IllustrationContext value={isInBlockTrue}>
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
    </IllustrationContext>
  );
}
