/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */
import {memo, useRef, useState} from 'react';
import {flushSync} from 'react-dom';
import {
  useSandpack,
  useActiveCode,
  SandpackCodeEditor,
  // SandpackReactDevTools,
  SandpackLayout,
} from '@codesandbox/sandpack-react';
import cn from 'classnames';

import {IconChevron} from 'components/Icon/IconChevron';
import {NavigationBar} from './NavigationBar';
import {Preview} from './Preview';

import {useSandpackLint} from './useSandpackLint';

export const CustomPreset = memo(function CustomPreset({
  showDevTools,
  onDevToolsLoad,
  devToolsLoaded,
  providedFiles,
}: {
  showDevTools: boolean;
  devToolsLoaded: boolean;
  onDevToolsLoad: () => void;
  providedFiles: Array<string>;
}) {
  const {lintErrors, lintExtensions} = useSandpackLint();
  const {sandpack} = useSandpack();
  const {code} = useActiveCode();
  const {activeFile} = sandpack;
  const lineCountRef = useRef<{[key: string]: number}>({});
  if (!lineCountRef.current[activeFile]) {
    lineCountRef.current[activeFile] = code.split('\n').length;
  }
  const lineCount = lineCountRef.current[activeFile];
  const isExpandable = lineCount > 16;
  return (
    <SandboxShell
      showDevTools={showDevTools}
      onDevToolsLoad={onDevToolsLoad}
      devToolsLoaded={devToolsLoaded}
      providedFiles={providedFiles}
      lintErrors={lintErrors}
      lintExtensions={lintExtensions}
      isExpandable={isExpandable}
    />
  );
});

const SandboxShell = memo(function SandboxShell({
  showDevTools,
  onDevToolsLoad,
  devToolsLoaded,
  providedFiles,
  lintErrors,
  lintExtensions,
  isExpandable,
}: {
  showDevTools: boolean;
  devToolsLoaded: boolean;
  onDevToolsLoad: () => void;
  providedFiles: Array<string>;
  lintErrors: Array<any>;
  lintExtensions: Array<any>;
  isExpandable: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      <div
        className="shadow-lg dark:shadow-lg-dark rounded-lg"
        ref={containerRef}>
        <NavigationBar providedFiles={providedFiles} />
        <SandpackLayout
          className={cn(
            showDevTools && devToolsLoaded && 'sp-layout-devtools',
            !(isExpandable || isExpanded) && 'rounded-b-lg overflow-hidden',
            isExpanded && 'sp-layout-expanded'
          )}>
          <Editor lintExtensions={lintExtensions} />
          <Preview
            className="order-last xl:order-2"
            isExpanded={isExpanded}
            lintErrors={lintErrors}
          />
          {(isExpandable || isExpanded) && (
            <button
              translate="yes"
              className="sandpack-expand flex text-base justify-between dark:border-card-dark bg-wash dark:bg-card-dark items-center z-10 p-1 w-full order-2 xl:order-last border-b-1 relative top-0"
              onClick={() => {
                const nextIsExpanded = !isExpanded;
                flushSync(() => {
                  setIsExpanded(nextIsExpanded);
                });
                if (!nextIsExpanded && containerRef.current !== null) {
                  // @ts-ignore
                  if (containerRef.current.scrollIntoViewIfNeeded) {
                    // @ts-ignore
                    containerRef.current.scrollIntoViewIfNeeded();
                  } else {
                    containerRef.current.scrollIntoView({
                      block: 'nearest',
                      inline: 'nearest',
                    });
                  }
                }
              }}>
              <span className="flex p-2 focus:outline-none text-primary dark:text-primary-dark leading-[20px]">
                <IconChevron
                  className="inline mr-1.5 text-xl"
                  displayDirection={isExpanded ? 'up' : 'down'}
                />
                {isExpanded ? 'Show less' : 'Show more'}
              </span>
            </button>
          )}
        </SandpackLayout>

        {/* {showDevTools && (
          // @ts-ignore TODO(@danilowoz): support devtools
          <SandpackReactDevTools onLoadModule={onDevToolsLoad} />
        )} */}
      </div>
    </>
  );
});

const Editor = memo(function Editor({
  lintExtensions,
}: {
  lintExtensions: Array<any>;
}) {
  return (
    <SandpackCodeEditor
      showLineNumbers
      showInlineErrors
      showTabs={false}
      showRunButton={false}
      extensions={lintExtensions}
    />
  );
});
