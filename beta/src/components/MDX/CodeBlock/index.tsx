/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
const CodeBlock = React.lazy(
  () =>
    import('./CodeBlock').then(
      (x) =>
        new Promise((resolve) => {
          setTimeout(() => resolve(x), 3000);
        })
    ) as any
);

export default React.memo(function CodeBlockWrapper(props: any): any {
  console.log('- render', props);
  return (
    <React.Suspense
      fallback={
        <pre className="rounded-lg leading-6 h-full w-full overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg my-8 text-[13.6px] overflow-hidden">
          <div className="py-6 pl-5 transition-all duration-1000 font-normal">
            {props.children}
          </div>
        </pre>
      }>
      <CodeBlock {...props} />
    </React.Suspense>
  );
});
