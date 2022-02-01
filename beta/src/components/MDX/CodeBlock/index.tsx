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
    ),
  {
    suspense: true,
  }
);

export default React.memo(function CodeBlockWrapper(props: any): any {
  console.log('- render', props);
  return (
    <React.Suspense
      fallback={
        <div className="h-[406px] animate-pulse w-full shadow-lg dark:shadow-lg-dark rounded-lg dark:bg-[#16181d] bg-white">
          <div className="bg-wash dark:bg-card-dark h-[39px] border-b border-border dark:border-border-dark rounded-t-lg rounded-b-none"></div>
        </div>
      }>
      <CodeBlock {...props} />
    </React.Suspense>
  );
});
