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
  SandpackReactDevTools,
  CodeEditorProps,
  CodeEditorRef,
} from '@codesandbox/sandpack-react';
import scrollIntoView from 'scroll-into-view-if-needed';
import cn from 'classnames';

import {IconChevron} from 'components/Icon/IconChevron';
import {NavigationBar} from './NavigationBar';
import {Preview} from './Preview';
import {CustomTheme} from './Themes';
import {useSandpackLint} from './useSandpackLint';
import {useTypescriptExtension} from './sandpack-tsserver/useTypescriptExtension';

// Workaround for https://github.com/reactjs/reactjs.org/issues/4686#issuecomment-1137402613.
const emptyArray: Array<any> = [];

export function CustomPreset({
  isSingleFile,
  showDevTools,
  onDevToolsLoad,
  devToolsLoaded,
}: {
  isSingleFile: boolean;
  showDevTools: boolean;
  devToolsLoaded: boolean;
  onDevToolsLoad: () => void;
}) {
  const {lintErrors, lintExtensions} = useSandpackLint();
  const typescriptExtensions = useTypescriptExtension();
  const extensions = React.useMemo(
    () => [lintExtensions, typescriptExtensions].flat(),
    [lintExtensions, typescriptExtensions]
  );

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

  return (
    <>
      <div
        className="shadow-lg dark:shadow-lg-dark rounded-lg"
        ref={containerRef}>
        <NavigationBar showDownload={isSingleFile} />
        <SandpackThemeProvider theme={CustomTheme}>
          <div
            ref={sandpack.lazyAnchorRef}
            className={cn(
              'sp-layout sp-custom-layout',
              showDevTools && devToolsLoaded && 'sp-layout-devtools',
              isExpanded && 'sp-layout-expanded'
            )}>
            <MemoCodeEditor
              showLineNumbers
              // If `showInlineErrors` is enabled, Sandpack dismisses autocompletion whenever
              // the build errors. This is frustrating because on a fast connection, the editor
              // will update and dismiss autocomplete in the middle of a function name!
              //
              // Instead, we use typescript's error diagnostics, which are more
              // subtle but don't disrupt autocomplete.
              showInlineErrors={false}
              showTabs={false}
              showRunButton={false}
              extensions={extensions}
              extensionsKeymap={emptyArray}
            />
            <Preview
              className="order-last xl:order-2"
              isExpanded={isExpanded}
              lintErrors={lintErrors}
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

          {showDevTools && (
            <SandpackReactDevTools onLoadModule={onDevToolsLoad} />
          )}
        </SandpackThemeProvider>
      </div>
    </>
  );
}

const MemoCodeEditor = React.memo(
  React.forwardRef<CodeEditorRef, CodeEditorProps>((props, ref) => {
    const {extensions, ...rest} = props;

    // Conspire to re-mount SandpackCodeEditor if extensions change.
    const keyRef = React.useRef(0);
    const prevExtensions = React.useRef(extensions);
    if (prevExtensions.current !== extensions) {
      keyRef.current++;
    }
    prevExtensions.current = extensions;

    console.log('MemoCodeEditor', keyRef.current, extensions);

    return (
      <SandpackCodeEditor
        ref={ref}
        key={keyRef.current}
        {...rest}
        extensions={extensions}
      />
    );
  })
);

MemoCodeEditor.displayName = 'MemoCodeEditor';
