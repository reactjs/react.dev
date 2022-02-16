/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */
import cn from 'classnames';
import * as React from 'react';
const CodeBlock = React.lazy(() => import('./CodeBlock'));

export default React.memo(function CodeBlockWrapper(props: {
  isFromAPIAnatomy: boolean;
  isFromPackageImport: boolean;
  children: string;
  className?: string;
  metastring: string;
  noMargin?: boolean;
  noMarkers?: boolean;
}): any {
  const {children, isFromAPIAnatomy, isFromPackageImport} = props;
  return (
    <React.Suspense
      fallback={
        <pre
          className={cn(
            'rounded-lg leading-6 h-full w-full overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg text-[13.6px] overflow-hidden',
            !isFromPackageImport && !isFromAPIAnatomy && 'my-8'
          )}>
          <div className="py-[18px] pl-5 font-normal ">
            <p className="sp-pre-placeholder overflow-hidden">{children}</p>
          </div>
        </pre>
      }>
      <CodeBlock {...props} />
    </React.Suspense>
  );
});
