/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

/**
 * Remove one string from another, from the end.
 * @param path A string
 * @param key Another string cursor
 */
export function removeFromLast(path: string, key: string) {
  const i = path.lastIndexOf(key);
  return i === -1 ? path : path.substring(0, i);
}
