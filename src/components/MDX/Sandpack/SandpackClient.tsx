'use client';

import {lazy, memo, Suspense} from 'react';
import type {SandpackFile} from '@codesandbox/sandpack-react/unstyled';

const SandpackRoot = lazy(() => import('./SandpackRoot'));
const SandpackRSCRoot = lazy(() => import('./SandpackRSCRoot'));

type Files = Record<string, SandpackFile>;

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
                    <div className="cm-gutters ps-9 sticky min-h-[192px]">
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

function activeCode(files: Files) {
  const active = Object.values(files).find(
    (file) => file.active && !file.hidden
  );
  const fallback = files['/src/App.js'] ?? Object.values(files)[0];
  return active?.code ?? fallback?.code ?? '';
}

export const SandpackClientIsland = memo(function SandpackClientIsland({
  files,
  ...props
}: any & {files: Files}) {
  return (
    <Suspense fallback={<SandpackGlimmer code={activeCode(files)} />}>
      <SandpackRoot {...props} files={files} />
    </Suspense>
  );
});

export const SandpackRSCIsland = memo(function SandpackRSCIsland({
  files,
  ...props
}: any & {files: Files}) {
  return (
    <Suspense fallback={<SandpackGlimmer code={activeCode(files)} />}>
      <SandpackRSCRoot {...props} files={files} />
    </Suspense>
  );
});
