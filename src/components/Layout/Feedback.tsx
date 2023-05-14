/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useState} from 'react';
import {useRouter} from 'next/router';
import {ga} from '../../utils/analytics';
import {IconThumbsUp} from 'components/Icon/IconThumbsUp';
import {IconThumbsDown} from 'components/Icon/IconThumbsDown';

export function Feedback({onSubmit = () => {}}: {onSubmit?: () => void}) {
  const {asPath} = useRouter();
  const cleanedPath = asPath.split(/[\?\#]/)[0];
  // Reset on route changes.
  return <SendFeedback key={cleanedPath} onSubmit={onSubmit} />;
}

function sendGAEvent(isPositive: boolean) {
  // Fragile. Don't change unless you've tested the network payload
  // and verified that the right events actually show up in GA.
  ga(
    'send',
    'event',
    'button',
    'feedback',
    window.location.pathname,
    isPositive ? '1' : '0'
  );
}

function SendFeedback({onSubmit}: {onSubmit: () => void}) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  return (
    <div className="max-w-xs w-80 lg:w-auto py-3 shadow-lg rounded-lg m-4 bg-wash dark:bg-gray-95 px-4 flex">
      <p className="w-full font-bold text-primary dark:text-primary-dark text-lg mr-4">
        {isSubmitted ? 'Thank you for your feedback!' : 'Is this page useful?'}
      </p>
      {!isSubmitted && (
        <>
          <button
            aria-label="Yes"
            className="bg-secondary-button dark:bg-secondary-button-dark rounded-lg text-primary dark:text-primary-dark px-3 mr-2"
            onClick={() => {
              setIsSubmitted(true);
              onSubmit();
              sendGAEvent(true);
            }}>
            <IconThumbsUp />
          </button>
          <button
            aria-label="No"
            className="bg-secondary-button dark:bg-secondary-button-dark rounded-lg text-primary dark:text-primary-dark px-3"
            onClick={() => {
              setIsSubmitted(true);
              onSubmit();
              sendGAEvent(false);
            }}>
            <IconThumbsDown />
          </button>
        </>
      )}
    </div>
  );
}
