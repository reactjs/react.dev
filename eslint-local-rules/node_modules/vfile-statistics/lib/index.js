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
export function statistics(value) {
  const result = {fatal: 0, warn: 0, info: 0}

  if (!value) {
    throw new TypeError(
      'Expected file or message for `value`, not `' + value + '`'
    )
  }

  if (Array.isArray(value)) {
    list(value)
  } else {
    one(value)
  }

  return {
    fatal: result.fatal,
    nonfatal: result.warn + result.info,
    warn: result.warn,
    info: result.info,
    total: result.fatal + result.warn + result.info
  }

  /**
   * Count a list.
   *
   * @param {Array<VFile | VFileMessage>} value
   *   List.
   * @returns {undefined}
   *   Nothing.
   */
  function list(value) {
    let index = -1

    while (++index < value.length) {
      one(value[index])
    }
  }

  /**
   * Count a value.
   *
   * @param {VFile | VFileMessage} value
   *   Value.
   * @returns {undefined}
   *   Nothing.
   */
  function one(value) {
    if ('messages' in value) return list(value.messages)
    result[value.fatal ? 'fatal' : value.fatal === false ? 'warn' : 'info']++
  }
}
