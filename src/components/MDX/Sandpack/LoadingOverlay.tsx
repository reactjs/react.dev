/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState} from 'react';

import {
  LoadingOverlayState,
  useSandpack,
  OpenInStackBlitzButton,
} from '@webcontainer/react';
import {useEffect} from 'react';

const FADE_ANIMATION_DURATION = 200;

export const LoadingOverlay = ({
  dependenciesLoading,
  forceLoading,
}: {
  dependenciesLoading: boolean;
  forceLoading: boolean;
} & React.HTMLAttributes<HTMLDivElement>): React.ReactNode | null => {
  const loadingOverlayState = useLoadingOverlayState(
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
          Unable to start the sandbox. Make sure you are online or try again
          later. If the problem persists, please submit an issue on{' '}
          <a
            className="sp-error-message"
            href="https://github.com/reactjs/react.dev/issues"
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
      <div className="sp-cube-wrapper" title="Open in StackBlitz">
        {/* <OpenInStackBlitzButton /> */}
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
  dependenciesLoading: boolean,
  forceLoading: boolean
): LoadingOverlayState => {
  const {sandpack, listen} = useSandpack();
  const [state, setState] = useState<LoadingOverlayState>('HIDDEN');

  if (state !== 'LOADING' && forceLoading) {
    setState('LOADING');
  }

  const sandpackIdle = sandpack.status === 'idle';
  useEffect(() => {
    const unsubscribe = listen((message) => {
      if (message.type === 'done') {
        setState((prev) => {
          return prev === 'LOADING' ? 'PRE_FADING' : 'HIDDEN';
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [listen, sandpackIdle]);

  /**
   * Fading transient state
   */
  useEffect(() => {
    let fadeTimeout: ReturnType<typeof setTimeout>;

    if (state === 'PRE_FADING' && !dependenciesLoading) {
      setState('FADING');
    } else if (state === 'FADING') {
      fadeTimeout = setTimeout(
        () => setState('HIDDEN'),
        FADE_ANIMATION_DURATION
      );
    }

    return () => {
      clearTimeout(fadeTimeout);
    };
  }, [state, dependenciesLoading]);

  if (sandpack.status === 'timeout') {
    return 'TIMEOUT';
  }

  if (sandpack.status !== 'running') {
    return 'HIDDEN';
  }

  return state;
};
