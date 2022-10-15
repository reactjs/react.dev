/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

/* eslint-disable react-hooks/exhaustive-deps */
import {useRef, useState, useEffect, useMemo, useId} from 'react';
import {useSandpack, SandpackStack} from '@codesandbox/sandpack-react';
import cn from 'classnames';
import {ErrorMessage} from './ErrorMessage';
import {SandpackConsole} from './Console';
import type {LintDiagnostic} from './useSandpackLint';
import {CSSProperties} from 'react';
import {LoadingOverlay} from './LoadingOverlay';

type CustomPreviewProps = {
  className?: string;
  isExpanded: boolean;
  lintErrors: LintDiagnostic;

  start: any;
  pause: any;
  time: number;
};

function useDebounced(value: any): any {
  const ref = useRef<any>(null);
  const [saved, setSaved] = useState(value);
  useEffect(() => {
    clearTimeout(ref.current);
    ref.current = setTimeout(() => {
      setSaved(value);
    }, 300);
  }, [value]);
  return saved;
}

export function Preview({
  isExpanded,
  className,
  lintErrors,
  start,
  pause,
  time,
}: CustomPreviewProps) {
  const {sandpack, listen} = useSandpack();
  const [bundlerIsReady, setBundlerIsReady] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [iframeComputedHeight, setComputedAutoHeight] = useState<number | null>(
    null
  );

  let {
    error: rawError,
    registerBundler,
    unregisterBundler,
    errorScreenRegisteredRef,
    openInCSBRegisteredRef,
    loadingScreenRegisteredRef,
    status,
  } = sandpack;

  if (
    rawError &&
    rawError.message === '_csbRefreshUtils.prelude is not a function'
  ) {
    // Work around a noisy internal error.
    rawError = null;
  }

  // Memoized because it's fed to debouncing.
  const firstLintError = useMemo(() => {
    if (lintErrors.length === 0) {
      return null;
    } else {
      const {line, column, message} = lintErrors[0];
      return {
        title: 'Lint Error',
        message: `${line}:${column} - ${message}`,
      };
    }
  }, [lintErrors]);

  if (rawError == null || rawError.title === 'Runtime Exception') {
    if (firstLintError !== null) {
      rawError = firstLintError;
    }
  }

  if (rawError != null && rawError.title === 'Runtime Exception') {
    rawError.title = 'Runtime Error';
  }

  // It changes too fast, causing flicker.
  const error = useDebounced(rawError);

  const clientId = useId();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // SandpackPreview immediately registers the custom screens/components so the bundler does not render any of them
  // TODO: why are we doing this during render?
  openInCSBRegisteredRef.current = true;
  errorScreenRegisteredRef.current = true;
  loadingScreenRegisteredRef.current = true;

  useEffect(function createBundler() {
    const iframeElement = iframeRef.current!;
    registerBundler(iframeElement, clientId);

    return () => {
      unregisterBundler(clientId);
    };
  }, []);

  useEffect(
    function bundlerListener() {
      let timeout: ReturnType<typeof setTimeout>;

      const unsubscribe = listen((message) => {
        if (message.type === 'resize') {
          setComputedAutoHeight(message.height);
        } else if (message.type === 'start') {
          /**
           * The spinner component transition might be longer than
           * the bundler loading, so we only show the spinner if
           * it takes more than 1s to load the bundler.
           */
          timeout = setTimeout(() => {
            setShowLoading(true);
          }, 1000);

          if (message.firstLoad) {
            start();
            setBundlerIsReady(false);
          }
        } else if (message.type === 'done') {
          setBundlerIsReady(true);
          setShowLoading(false);
          clearTimeout(timeout);

          pause();
        }
      }, clientId);

      return () => {
        clearTimeout(timeout);
        setBundlerIsReady(false);
        setComputedAutoHeight(null);
        unsubscribe();
      };
    },
    [status === 'idle']
  );

  // const hideContent = !bundlerIsReady || error;

  // WARNING:
  // The layout and styling here is convoluted and really easy to break.
  // If you make changes to it, you need to test different cases:
  // - Content -> (compile | runtime) error -> content editing flow should work.
  // - Errors should expand parent height rather than scroll.
  // - Long sandboxes should scroll unless "show more" is toggled.
  // - Expanded sandboxes ("show more") have sticky previews and errors.
  // - Sandboxes have autoheight based on content.
  // - That autoheight should be measured correctly! (Check some long ones.)
  // - You shouldn't see nested scrolls (that means autoheight is borked).
  // - Ideally you shouldn't see a blank preview tile while recompiling.
  // - Container shouldn't be horizontally scrollable (even while loading).
  // - It should work on mobile.
  // The best way to test it is to actually go through some challenges.

  const iframeWrapperPosition = (): CSSProperties => {
    if (!bundlerIsReady || error) {
      return {position: 'relative'};
    }

    if (isExpanded) {
      return {position: 'sticky', top: '2em'};
    }

    return {};
  };

  return (
    <SandpackStack className={className}>
      <h1>{time}</h1>
      <div
        className={cn(
          'p-0 sm:p-2 md:p-4 lg:p-8 bg-card dark:bg-wash-dark h-full relative md:rounded-b-lg lg:rounded-b-none',
          // Allow content to be scrolled if it's too high to fit.
          // Note we don't want this in the expanded state
          // because it breaks position: sticky (and isn't needed anyway).
          !isExpanded && (error || bundlerIsReady) ? 'overflow-auto' : null
        )}>
        <div
          className={cn(
            'rounded-t-none sm:rounded-lg bg-white md:shadow-md w-full max-w-full',
            error && 'border-2 border-red-40'
          )}>
          <div style={iframeWrapperPosition()}>
            <iframe
              ref={iframeRef}
              className={cn(
                'w-full max-w-full rounded-t-none sm:rounded-lg transition-opacity',
                // We can't *actually* hide content because that would
                // break calculating the computed height in the iframe
                // (which we're using for autosizing). This is noticeable
                // if you make a compiler error and then fix it with code
                // that expands the content. You want to measure that.
                error && 'absolute',

                // Transition between start/refresh and done state
                bundlerIsReady
                  ? 'opacity-100 duration-150'
                  : 'opacity-0 pointer-events-none duration-75'
              )}
              title="Sandbox Preview"
              style={{
                height: iframeComputedHeight || '100%',
                zIndex: isExpanded ? 'initial' : -1,
              }}
            />
          </div>

          {error && (
            <div
              className={cn(
                // This isn't absolutely positioned so that
                // the errors can also expand the parent height.
                isExpanded ? 'sticky top-8' : null
              )}>
              <ErrorMessage error={error} />
            </div>
          )}
        </div>

        <LoadingOverlay
          clientId={clientId}
          dependenciesLoading={!bundlerIsReady && iframeComputedHeight === null}
          forceLoading={showLoading}
        />
      </div>
      <SandpackConsole visible={!error} />
    </SandpackStack>
  );
}
