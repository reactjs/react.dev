/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState} from 'react';

import {LoadingOverlayState, useSandpack} from '@webcontainer/react';
import {useEffect} from 'react';

const FADE_ANIMATION_DURATION = 200;

type BootPhase = 'booting' | 'installing' | 'starting';

const BOOT_PHASES: BootPhase[] = ['booting', 'installing', 'starting'];

function isBootPhase(status: string): status is BootPhase {
  return BOOT_PHASES.includes(status as BootPhase);
}

const BOOT_STEPS: {phase: BootPhase; label: string}[] = [
  {phase: 'booting', label: 'Booting sandbox'},
  {phase: 'installing', label: 'Installing dependencies'},
  {phase: 'starting', label: 'Starting dev server'},
];

type StepState = 'pending' | 'active' | 'done';

function getStepState(
  stepPhase: BootPhase,
  currentPhase: BootPhase
): StepState {
  const stepIndex = BOOT_PHASES.indexOf(stepPhase);
  const currentIndex = BOOT_PHASES.indexOf(currentPhase);
  if (currentIndex > stepIndex) return 'done';
  if (currentIndex === stepIndex) return 'active';
  return 'pending';
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 8.5l2 2 4-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className="sp-boot-spinner"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none">
      <circle
        cx="8"
        cy="8"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.2"
      />
      <path
        d="M8 1.5A6.5 6.5 0 0 1 14.5 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle
        cx="8"
        cy="8"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.25"
      />
    </svg>
  );
}

function BootProgressChecklist({
  phase,
  opacity = 1,
}: {
  phase: BootPhase | 'complete';
  opacity?: number;
}) {
  return (
    <div
      className="sp-overlay sp-loading"
      style={{
        opacity,
        transition: `opacity ${FADE_ANIMATION_DURATION}ms ease-out`,
      }}>
      <div className="sp-boot-checklist">
        {BOOT_STEPS.map(({phase: stepPhase, label}) => {
          const state =
            phase === 'complete' ? 'done' : getStepState(stepPhase, phase);
          return (
            <div
              key={stepPhase}
              className={`sp-boot-step sp-boot-step-${state}`}>
              <span className="sp-boot-step-icon">
                {state === 'done' && <CheckIcon />}
                {state === 'active' && <SpinnerIcon />}
                {state === 'pending' && <CircleIcon />}
              </span>
              <span className="sp-boot-step-label">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const LoadingOverlay = ({
  dependenciesLoading,
  forceLoading,
}: {
  dependenciesLoading: boolean;
  forceLoading: boolean;
} & React.HTMLAttributes<HTMLDivElement>): React.ReactNode | null => {
  const {sandpack} = useSandpack();
  const loadingOverlayState = useLoadingOverlayState(
    dependenciesLoading,
    forceLoading
  );

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

  if (isBootPhase(sandpack.status)) {
    return <BootProgressChecklist phase={sandpack.status} />;
  }

  if (loadingOverlayState === 'HIDDEN') {
    return null;
  }

  const stillLoading =
    loadingOverlayState === 'LOADING' || loadingOverlayState === 'PRE_FADING';

  return (
    <BootProgressChecklist phase="complete" opacity={stillLoading ? 1 : 0} />
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
