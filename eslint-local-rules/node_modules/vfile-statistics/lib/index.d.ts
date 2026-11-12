/**
 * @typedef {import('vfile').VFile} VFile
 * @typedef {import('vfile-message').VFileMessage} VFileMessage
 */
/**
 * @typedef Statistics
 *   Statistics.
 * @property {number} fatal
 *   Fatal errors (`fatal: true`).
 * @property {number} warn
 *   Warning messages (`fatal: false`).
 * @property {number} info
 *   Informational messages (`fatal: undefined`).
 * @property {number} nonfatal
 *   Warning + info.
 * @property {number} total
 *   Nonfatal + fatal.
 */
/**
 * Get stats for a file, list of files, or list of messages.
 *
 * @param {Array<VFile | VFileMessage> | VFile | VFileMessage} value
 *   File, message, or list of files or messages.
 * @returns {Statistics}
 *   Statistics.
 */
export function statistics(
  value: Array<VFile | VFileMessage> | VFile | VFileMessage
): Statistics
export type VFile = import('vfile').VFile
export type VFileMessage = import('vfile-message').VFileMessage
/**
 * Statistics.
 */
export type Statistics = {
  /**
   *   Fatal errors (`fatal: true`).
   */
  fatal: number
  /**
   *   Warning messages (`fatal: false`).
   */
  warn: number
  /**
   *   Informational messages (`fatal: undefined`).
   */
  info: number
  /**
   *   Warning + info.
   */
  nonfatal: number
  /**
   *   Nonfatal + fatal.
   */
  total: number
}
