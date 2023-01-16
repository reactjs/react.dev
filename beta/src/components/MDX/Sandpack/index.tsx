/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {
  lazy,
  memo,
  Children,
  Suspense,
  useState,
  useMemo,
  useContext,
} from 'react';
import {createFileMap} from './createFileMap';
import {
  SnippetTargetLanguage,
  SnippetTargetLanguageContext,
  SnippetTargetLanguageContextValue,
} from './SnippetLanguage';

const SandpackRoot = lazy(() => import('./SandpackRoot'));

const SandpackGlimmer = ({code}: {code: string}) => (
  <div className="sandpack sandpack--playground my-8">
    <div className="sp-wrapper">
      <div className="shadow-lg dark:shadow-lg-dark rounded-lg">
        <div className="bg-wash h-10 dark:bg-card-dark flex justify-between items-center relative z-10 border-b border-border dark:border-border-dark rounded-t-lg rounded-b-none">
          <div className="px-4 lg:px-6">
            <div className="sp-tabs"></div>
          </div>
          <div className="px-3 flex items-center justify-end grow text-right"></div>
        </div>
        <div className="sp-layout min-h-[216px] flex items-stretch flex-wrap">
          <div className="sp-stack sp-editor max-h-[406px] h-auto overflow-auto">
            <div className="sp-code-editor">
              <div className="sp-cm sp-pristine">
                <div className="cm-editor">
                  <div>
                    <div className="cm-gutters pl-9 sticky min-h-[192px]">
                      <div className="cm-gutter cm-lineNumbers whitespace-pre sp-pre-placeholder">
                        {code}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sp-stack order-last xl:order-2 max-h-[406px] h-auto">
            <div className="p-0 sm:p-2 md:p-4 lg:p-8 bg-card dark:bg-wash-dark h-full relative rounded-b-lg lg:rounded-b-none overflow-auto"></div>
          </div>
          {code.split('\n').length > 16 && (
            <div className="flex h-[45px] text-base justify-between dark:border-card-dark bg-wash dark:bg-card-dark items-center z-10 rounded-t-none p-1 w-full order-2 xl:order-last border-b-1 relative top-0"></div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default memo(function SandpackWrapper(props: any): any {
  const {snippetTargetLanguage} = useContext(SnippetTargetLanguageContext);

  const codeSnippets = Children.toArray(props.children) as React.ReactElement[];
  const {files} = createFileMap(codeSnippets, snippetTargetLanguage);

  // To set the active file in the fallback we have to find the active file first.
  // If there are no active files we fallback to App.js as default.
  let activeCodeSnippet = Object.keys(files).filter(
    (fileName) =>
      files[fileName]?.active === true && files[fileName]?.hidden === false
  );
  let defaultActiveCodeSnippetName;
  if (!activeCodeSnippet.length) {
    if (snippetTargetLanguage === 'ts' && '/App.tsx' in files) {
      defaultActiveCodeSnippetName = '/App.tsx';
    } else {
      defaultActiveCodeSnippetName = '/App.js';
    }
  } else {
    defaultActiveCodeSnippetName = activeCodeSnippet[0];
  }

  return (
    <Suspense
      fallback={
        <SandpackGlimmer code={files[defaultActiveCodeSnippetName].code} />
      }>
      <SandpackRoot
        {...props}
        defaultActiveFile={defaultActiveCodeSnippetName}
      />
    </Suspense>
  );
});
