import {IconUser} from '@tabler/icons-react';
import {FC} from 'react';

import {MemoizedReactMarkdown} from './Markdown/MemoizedReactMarkdown';

//@ts-ignore
import rehypeMathjax from 'rehype-mathjax';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import {ContentRefList, Message} from './type/ask';
import {CodeBlock} from './Markdown/CodeBlock';
import {Logo} from 'components/Logo';

export interface Props {
  message: Message;
  messageIndex: number;
}

function isMineMessage(message: Message) {
  return message.role === 'user';
}

export const ChatMessage: FC<Props> = ({message}) => {
  console.log('message is', message.content);

  function renderLinkList(content_ref_list?: ContentRefList) {
    return (
      message.content_ref_list &&
      message.content_ref_list.length > 0 && (
        <div className=" flex  flex-col mt-4">
          <div> For more information, please check the following link:</div>
          {content_ref_list?.map((content_ref, index) => {
            return (
              <div key={index} className="flex">
                <a
                  href={content_ref.ref_link}
                  className=" underline text-blue-40 text-lg"
                  target="_blank"
                  rel="noreferrer">
                  {' '}
                  {content_ref.ref_desc}{' '}
                </a>
              </div>
            );
          })}
        </div>
      )
    );
  }

  return (
    <div
      className={`group md:px-4 ${
        !isMineMessage(message)
          ? 'border-b border-black/10 bg-white text-gray-800 dark:border-gray-900/50 dark:bg-[#444654] dark:text-gray-100'
          : 'border-b border-black/10 bg-white text-gray-800 dark:border-gray-900/50 dark:bg-[#343541] dark:text-gray-100'
      }`}
      style={{overflowWrap: 'anywhere'}}>
      <div className="relative m-auto flex p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
        <div className="min-w-[40px] text-right font-bold">
          {!isMineMessage(message) ? (
            <Logo className="text-sm me-0 w-7 h-7 text-link dark:text-link-dark flex origin-center transition-all ease-in-out" />
          ) : (
            <IconUser size={28} />
          )}
        </div>

        <div className="prose mt-[-2px] w-full dark:prose-invert">
          {isMineMessage(message) ? (
            <div className="flex w-full">
              {
                <div className="prose whitespace-pre-wrap dark:prose-invert flex-1">
                  {message.content}
                </div>
              }
            </div>
          ) : (
            <div className="flex flex-col">
              <MemoizedReactMarkdown
                className="prose dark:prose-invert flex-1"
                remarkPlugins={[remarkGfm as any, remarkMath]}
                rehypePlugins={[rehypeMathjax]}
                components={{
                  code({inline, className, children, ...props}: any) {
                    if (typeof children === 'string' && children?.length) {
                      if (children[0] == '▍') {
                        return (
                          <span className="animate-pulse cursor-default mt-1">
                            ▍
                          </span>
                        );
                      }

                      const new_children0 = (children[0] as string).replace(
                        '`▍`',
                        '▍'
                      );
                      children = new_children0 + children.slice(1);
                    }

                    const match = /language-(\w+)/.exec(className || '');

                    return !inline ? (
                      <CodeBlock
                        key={Math.random()}
                        language={(match && match[1]) || ''}
                        value={String(children).replace(/\n$/, '')}
                        {...props}
                      />
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  table({children}) {
                    return (
                      <table className="border-collapse border border-black px-3 py-1 dark:border-white">
                        {children}
                      </table>
                    );
                  },
                  th({children}) {
                    return (
                      <th className="break-words border border-black bg-gray-500 px-3 py-1 text-white dark:border-white">
                        {children}
                      </th>
                    );
                  },
                  td({children}) {
                    return (
                      <td className="break-words border border-black px-3 py-1 dark:border-white">
                        {children}
                      </td>
                    );
                  },
                }}>
                {`${message.content}${''}`}
              </MemoizedReactMarkdown>
              {renderLinkList(message.content_ref_list)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
ChatMessage.displayName = 'ChatMessage';
