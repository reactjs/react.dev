/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import React from 'react';
// @ts-ignore
import {flushSync} from 'react-dom';
import {
  useSandpack,
  useActiveCode,
  SandpackCodeEditor,
  SandpackThemeProvider,
} from '@codesandbox/sandpack-react';
import scrollIntoView from 'scroll-into-view-if-needed';

import {IconChevron} from 'components/Icon/IconChevron';
import {NavigationBar} from './NavigationBar';
import {Preview} from './Preview';
import {CustomTheme} from './Themes';

export function CustomPreset({
  isSingleFile,
  onReset,
}: {
  isSingleFile: boolean;
  onReset: () => void;
}) {
  const lineCountRef = React.useRef<{[key: string]: number}>({});
  const containerRef = React.useRef<HTMLDivElement>(null);
  const {sandpack} = useSandpack();
  const {code} = useActiveCode();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const {activePath} = sandpack;
  if (!lineCountRef.current[activePath]) {
    lineCountRef.current[activePath] = code.split('\n').length;
  }
  const lineCount = lineCountRef.current[activePath];
  const isExpandable = lineCount > 16 || isExpanded;
  const editorHeight = isExpandable ? lineCount * 24 + 24 : 'auto'; // shown lines * line height (24px)
  const getHeight = () => {
    if (!isExpandable) {
      return editorHeight;
    }
    return isExpanded ? editorHeight : 406;
  };

  return (
    <>
      <div
        className="shadow-lg dark:shadow-lg-dark rounded-lg"
        ref={containerRef}>
        <NavigationBar showDownload={isSingleFile} onReset={onReset} />
        <SandpackThemeProvider theme={CustomTheme}>
          <div
            ref={sandpack.lazyAnchorRef}
            className="sp-layout rounded-t-none"
            style={{
              // Prevent it from collapsing below the initial (non-loaded) height.
              // There has to be some better way to do this...
              minHeight: 216,
            }}>
            <SandpackCodeEditor
              customStyle={{
                height: getHeight(),
                maxHeight: isExpanded ? '' : 406,
              }}
              showLineNumbers
              showInlineErrors
              showTabs={false}
            />
            <Preview
              isExpanded={isExpanded}
              className="order-last xl:order-2"
              customStyle={{
                height: getHeight(),
                maxHeight: isExpanded ? '' : 406,
              }}
            />
            {isExpandable && (
              <button
                translate="yes"
                className="flex text-base justify-between dark:border-card-dark bg-wash dark:bg-card-dark items-center z-10 rounded-t-none p-1 w-full order-2 xl:order-last border-b-1 relative top-0"
                onClick={() => {
                  const nextIsExpanded = !isExpanded;
                  flushSync(() => {
                    setIsExpanded(nextIsExpanded);
                  });
                  if (!nextIsExpanded && containerRef.current !== null) {
                    scrollIntoView(containerRef.current, {
                      scrollMode: 'if-needed',
                      block: 'nearest',
                      inline: 'nearest',
                    });
                  }
                }}>
                <span className="flex p-2 focus:outline-none text-primary dark:text-primary-dark">
                  <IconChevron
                    className="inline mr-1.5 text-xl"
                    displayDirection={isExpanded ? 'up' : 'down'}
                  />
                  {isExpanded ? 'Show less' : 'Show more'}
                </span>
              </button>
            )}
          </div>
        </SandpackThemeProvider>
      </div>
    </>
  );
}
