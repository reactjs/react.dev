/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {lazy, memo, Children, Suspense} from 'react';
import {createFileMap} from './createFileMap';

const SandpackRoot = lazy(() => import('./SandpackRoot'));

const SandpackGlimmer = ({code}: {code: string}) => (
  <div className="sandpack sandpack--playground my-8">
    <div className="sp-wrapper">
      <div className="rounded-lg shadow-lg dark:shadow-lg-dark">
        <div className="relative z-10 flex h-10 items-center justify-between rounded-t-lg rounded-b-none border-b border-border bg-wash dark:border-border-dark dark:bg-card-dark">
          <div className="px-4 lg:px-6">
            <div className="sp-tabs"></div>
          </div>
          <div className="flex grow items-center justify-end px-3 text-right"></div>
        </div>
        <div className="sp-layout flex min-h-[216px] flex-wrap items-stretch">
          <div className="sp-stack sp-editor h-auto max-h-[406px] overflow-auto">
            <div className="sp-code-editor">
              <div className="sp-cm sp-pristine">
                <div className="cm-editor">
                  <div>
                    <div className="cm-gutters sticky min-h-[192px] pl-9">
                      <div className="cm-gutter cm-lineNumbers sp-pre-placeholder whitespace-pre">
                        {code}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sp-stack order-last h-auto max-h-[406px] xl:order-2">
            <div className="relative h-full overflow-auto rounded-b-lg bg-card p-0 dark:bg-wash-dark sm:p-2 md:p-4 lg:rounded-b-none lg:p-8"></div>
          </div>
          {code.split('\n').length > 16 && (
            <div className="border-b-1 relative top-0 z-10 order-2 flex h-[45px] w-full items-center justify-between rounded-t-none bg-wash p-1 text-base dark:border-card-dark dark:bg-card-dark xl:order-last"></div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default memo(function SandpackWrapper(props: any): any {
  const codeSnippet = createFileMap(Children.toArray(props.children));

  // To set the active file in the fallback we have to find the active file first.
  // If there are no active files we fallback to App.js as default.
  let activeCodeSnippet = Object.keys(codeSnippet).filter(
    (fileName) =>
      codeSnippet[fileName]?.active === true &&
      codeSnippet[fileName]?.hidden === false
  );
  let activeCode;
  if (!activeCodeSnippet.length) {
    activeCode = codeSnippet['/App.js'].code;
  } else {
    activeCode = codeSnippet[activeCodeSnippet[0]].code;
  }

  return (
    <Suspense fallback={<SandpackGlimmer code={activeCode} />}>
      <SandpackRoot {...props} />
    </Suspense>
  );
});
