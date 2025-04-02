/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {memo} from 'react';
import type {SVGProps} from 'react';

export const IconBsky = memo<SVGProps<SVGSVGElement>>(function IconBsky(props) {
  return (
    <svg
      aria-label="Bluesky"
      viewBox="0 0 16 16"
      height="1.25em"
      width="1.25em"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path
        className="x19hqcy"
        d="M3.468 1.948C5.303 3.325 7.276 6.118 8 7.616c.725-1.498 2.697-4.29 4.532-5.668C13.855.955 16 .186 16 2.632c0 .489-.28 4.105-.444 4.692-.572 2.04-2.653 2.561-4.504 2.246 3.236.551 4.06 2.375 2.281 4.2-3.376 3.464-4.852-.87-5.23-1.98-.07-.204-.103-.3-.103-.218 0-.081-.033.014-.102.218-.379 1.11-1.855 5.444-5.231 1.98-1.778-1.825-.955-3.65 2.28-4.2-1.85.315-3.932-.205-4.503-2.246C.28 6.737 0 3.12 0 2.632 0 .186 2.145.955 3.468 1.948Z"></path>
    </svg>
  );
});
