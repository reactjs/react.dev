/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect, useState} from 'react';

import {
  LoadingOverlayState,
  OpenInCodeSandboxButton,
  useSandpack,
} from '@codesandbox/sandpack-react/unstyled';

const FADE_ANIMATION_DURATION = 200;

export const LoadingOverlay = ({
  clientId,
  dependenciesLoading,
  forceLoading,
}: {
  clientId: string;
  dependenciesLoading: boolean;
  forceLoading: boolean;
} & React.HTMLAttributes<HTMLDivElement>): React.ReactNode | null => {
  const loadingOverlayState = useLoadingOverlayState(
    clientId,
    dependenciesLoading,
    forceLoading
  );

  if (loadingOverlayState === 'HIDDEN') {
    return null;
  }

  if (loadingOverlayState === 'TIMEOUT') {
    return (
      <div className="sp-overlay sp-error">
        <div className="sp-error-message">
          Unable to establish connection with the sandpack bundler. Make sure
          you are online or try again later. If the problem persists, please
          report it via{' '}
          <a
            className="sp-error-message"
            href="mailto:hello@codesandbox.io?subject=Sandpack Timeout Error">
            email
          </a>{' '}
          or submit an issue on{' '}
          <a
            className="sp-error-message"
            href="https://github.com/codesandbox/sandpack/issues"
            rel="noreferrer noopener"
            target="_blank">
            GitHub.
          </a>
        </div>
      </div>
    );
  }

  const stillLoading =
    loadingOverlayState === 'LOADING' || loadingOverlayState === 'PRE_FADING';

  return (
    <div
      className="sp-overlay sp-loading"
      style={{
        opacity: stillLoading ? 1 : 0,
        transition: `opacity ${FADE_ANIMATION_DURATION}ms ease-out`,
      }}>
      <div className="sp-cube-wrapper" title="Open in CodeSandbox">
        {/* @ts-ignore: the OpenInCodeSandboxButton type from '@codesandbox/sandpack-react/unstyled' is incompatible with JSX in React 19 */}
        <OpenInCodeSandboxButton />
        <div className="sp-cube">
          <div className="sp-sides">
            <div className="top" />
            <div className="right" />
            <div className="bottom" />
            <div className="left" />
            <div className="front" />
            <div className="back" />
          </div>
        </div>
      </div>
    </div>
  );
};

const useLoadingOverlayState = (
  clientId: string,
  dependenciesLoading: boolean,
  forceLoading: boolean
): LoadingOverlayState => {
  const {sandpack, listen} = useSandpack();
  const [state, setState] = useState<LoadingOverlayState>('HIDDEN');

  /**
   * Sandpack listener
   */
  useEffect(() => {
    const unsubscribe = listen((message) => {
      if (message.type === 'done') {
        setState((prev) => {
          return forceLoading || prev === 'LOADING' ? 'PRE_FADING' : 'HIDDEN';
        });
      }
    }, clientId);

    return () => {
      unsubscribe();
    };
  }, [clientId, forceLoading, listen]);

  /**
   * Fading transient state
   */
  useEffect(() => {
    let fadeTimeout: ReturnType<typeof setTimeout> | undefined;

    if (state === 'PRE_FADING' && !dependenciesLoading) {
      fadeTimeout = setTimeout(() => {
        setState('FADING');
      }, 0);
    } else if (state === 'FADING') {
      fadeTimeout = setTimeout(
        () => setState('HIDDEN'),
        FADE_ANIMATION_DURATION
      );
    }

    return () => {
      if (fadeTimeout !== undefined) {
        clearTimeout(fadeTimeout);
      }
    };
  }, [state, dependenciesLoading]);

  if (sandpack.status === 'timeout') {
    return 'TIMEOUT';
  }

  if (sandpack.status !== 'running') {
    return 'HIDDEN';
  }

  return forceLoading ? 'LOADING' : state;
};
