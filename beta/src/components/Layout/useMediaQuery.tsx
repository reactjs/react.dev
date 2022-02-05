/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useState, useCallback, useEffect} from 'react';

const useMediaQuery = (width: number) => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback((e) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);

    try {
      // Chrome & Firefox
      media.addEventListener('change', updateTarget);
    } catch {
      // @deprecated method - Safari <= iOS12
      media.addListener(updateTarget);
    }

    // Check on mount (callback is not called until a change occurs)
    if (media.matches) {
      setTargetReached(true);
    }

    return () => {
      try {
        // Chrome & Firefox
        media.removeEventListener('change', updateTarget);
      } catch {
        // @deprecated method - Safari <= iOS12
        media.removeListener(updateTarget);
      }
    };
  }, [updateTarget, width]);

  return targetReached;
};

const useIsMobile = () => {
  return useMediaQuery(640);
};

export {useMediaQuery, useIsMobile};
