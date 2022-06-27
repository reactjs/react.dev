/**
 * Get localStorage, or undefined if not available.
 */
export function getLocalStorage(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch (error) {
    console.warn('localStorage is not available:', error);
    return undefined;
  }
}
