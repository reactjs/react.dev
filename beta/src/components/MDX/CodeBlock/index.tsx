/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */
import cn from 'classnames';
import * as React from 'react';
const CodeBlock = React.lazy(() => import('./CodeBlock') as any);

export default React.memo(function CodeBlockWrapper(props: {
  isFromAPIAnatomy: boolean;
  isFromPackageImport: boolean;
  children: string;
}): any {
  console.log('- render', props);
  const {children, isFromAPIAnatomy, isFromPackageImport} = props;
  return (
    <React.Suspense
      fallback={
        <pre
          className={cn(
            'rounded-lg leading-6 h-full w-full overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg text-[13.6px] overflow-hidden',
            !isFromPackageImport && !isFromAPIAnatomy && 'my-8'
          )}>
          <div className="py-6 pl-5 font-normal ">
            <p className="sp-pre-placeholder">{children}</p>
          </div>
        </pre>
      }>
      <CodeBlock {...props} />
    </React.Suspense>
  );
});
