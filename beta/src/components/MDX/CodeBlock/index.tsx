/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import cn from 'classnames';

const CodeBlock = function CodeBlock({
  children: {
    props: {highlightedCode},
  },
  noMargin,
}: {
  children: React.ReactNode & {
    props: {
      highlightedCode: string;
    };
  };
  className?: string;
  noMargin?: boolean;
}) {
  return (
    <div
      className={cn(
        'sandpack sandpack--codeblock',
        'rounded-lg h-full w-full overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg',
        !noMargin && 'my-8'
      )}>
      <div className="sp-wrapper">
        <div className="sp-stack">
          <div className="sp-code-editor">
            <pre className="sp-cm sp-pristine sp-javascript flex align-start">
              <code className="sp-pre-placeholder grow-[2]">{highlightedCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
