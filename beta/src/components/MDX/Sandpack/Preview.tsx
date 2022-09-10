/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import {
  useSandpack,
  LoadingOverlay,
  SandpackStack,
} from '@codesandbox/sandpack-react';
import cn from 'classnames';
import {Error} from './Error';
import {SandpackConsole} from './Console';
import type {LintDiagnostic} from './useSandpackLint';

/**
 * TODO: can we use React.useId?
 */
const generateRandomId = (): string =>
  Math.floor(Math.random() * 10000).toString();

type CustomPreviewProps = {
  className?: string;
  customStyle?: Record<string, unknown>;
  isExpanded: boolean;
  lintErrors: LintDiagnostic;
};

function useDebounced(value: any): any {
  const ref = React.useRef<any>(null);
  const [saved, setSaved] = React.useState(value);
  React.useEffect(() => {
    clearTimeout(ref.current);
    ref.current = setTimeout(() => {
      setSaved(value);
    }, 300);
  }, [value]);
  return saved;
}

export function Preview({
  customStyle,
  isExpanded,
  className,
  lintErrors,
}: CustomPreviewProps) {
  const {sandpack, listen} = useSandpack();
  const [isReady, setIsReady] = React.useState(false);
  const [iframeComputedHeight, setComputedAutoHeight] = React.useState<
    number | null
  >(null);

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
  const firstLintError = React.useMemo(() => {
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

  const clientId = React.useRef<string>(generateRandomId());
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

  // SandpackPreview immediately registers the custom screens/components so the bundler does not render any of them
  // TODO: why are we doing this during render?
  openInCSBRegisteredRef.current = true;
  errorScreenRegisteredRef.current = true;
  loadingScreenRegisteredRef.current = true;

  React.useEffect(function createBundler() {
    const iframeElement = iframeRef.current!;
    registerBundler(iframeElement, clientId.current);

    return () => {
      unregisterBundler(clientId.current);
    };
  }, []);

  React.useEffect(
    function bundlerListener() {
      const unsubscribe = listen((message: any) => {
        if (message.type === 'resize') {
          setComputedAutoHeight(message.height);
        } else if (message.type === 'start') {
          if (message.firstLoad) {
            setIsReady(false);
          }
        } else if (message.type === 'done') {
          setIsReady(true);
        }
      }, clientId.current);

      return () => {
        setIsReady(false);
        setComputedAutoHeight(null);
        unsubscribe();
      };
    },
    [status === 'idle']
  );

  const overrideStyle = error
    ? {
        // Don't collapse errors
        maxHeight: undefined,
      }
    : null;
  const hideContent = !isReady || error;

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

  return (
    <SandpackStack
      className={className}
      style={{
        // TODO: clean up this mess.
        ...customStyle,
        ...overrideStyle,
      }}>
      <div
        className={cn(
          'p-0 sm:p-2 md:p-4 lg:p-8 bg-card dark:bg-wash-dark h-full relative md:rounded-b-lg lg:rounded-b-none',
          // Allow content to be scrolled if it's too high to fit.
          // Note we don't want this in the expanded state
          // because it breaks position: sticky (and isn't needed anyway).
          !isExpanded && (error || isReady) ? 'overflow-auto' : null
        )}>
        <div
          style={{
            padding: 'initial',
            position: hideContent
              ? 'relative'
              : isExpanded
              ? 'sticky'
              : undefined,
            top: isExpanded ? '2rem' : undefined,
          }}>
          <iframe
            ref={iframeRef}
            className={cn(
              'rounded-t-none bg-white md:shadow-md sm:rounded-lg w-full max-w-full',
              // We can't *actually* hide content because that would
              // break calculating the computed height in the iframe
              // (which we're using for autosizing). This is noticeable
              // if you make a compiler error and then fix it with code
              // that expands the content. You want to measure that.
              hideContent
                ? 'absolute opacity-0 pointer-events-none'
                : 'opacity-100'
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
              'p-2',
              // This isn't absolutely positioned so that
              // the errors can also expand the parent height.
              isExpanded ? 'sticky top-8' : null
            )}>
            <Error error={error} />
          </div>
        )}
        <LoadingOverlay
          showOpenInCodeSandbox
          clientId={clientId.current}
          loading={!isReady && iframeComputedHeight === null}
        />
      </div>
      {!error && <SandpackConsole />}
    </SandpackStack>
  );
}
