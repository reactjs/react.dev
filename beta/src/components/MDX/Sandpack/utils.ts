/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

export type ViewportSizePreset =
  | 'iPhone X'
  | 'Pixel 2'
  | 'iPad'
  | 'Moto G4'
  | 'Surface Duo';

export type ViewportSize =
  | ViewportSizePreset
  | 'auto'
  | {width: number; height: number};

export type ViewportOrientation = 'portrait' | 'landscape';

export const generateRandomId = (): string =>
  Math.floor(Math.random() * 10000).toString();

const VIEWPORT_SIZE_PRESET_MAP: Record<
  ViewportSizePreset,
  {x: number; y: number}
> = {
  'iPhone X': {x: 375, y: 812},
  iPad: {x: 768, y: 1024},
  'Pixel 2': {x: 411, y: 731},
  'Moto G4': {x: 360, y: 640},
  'Surface Duo': {x: 540, y: 720},
};

export const computeViewportSize = (
  viewport: ViewportSize,
  orientation: ViewportOrientation
): {width?: number; height?: number} => {
  if (viewport === 'auto') {
    return {};
  }

  if (typeof viewport === 'string') {
    const {x, y} = VIEWPORT_SIZE_PRESET_MAP[viewport];
    return orientation === 'portrait'
      ? {width: x, height: y}
      : {width: y, height: x};
  }

  return viewport;
};
