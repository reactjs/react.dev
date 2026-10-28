/**
 * @typedef {import('vfile').VFile} VFile
 * @typedef {import('vfile-message').VFileMessage} VFileMessage
 */

/**
 * @template Thing
 * @template Kind
 * @typedef {{[Key in keyof Thing]: NonNullable<Thing[Key]> extends Kind ? Key : never}[keyof Thing]} KeysOfType
 *   Complex type that finds the keys of fields whose values are of a certain
 *   type `Kind` (such as `string`) in `Thing` (probably an object).
 */

/**
 * Compare files.
 *
 * @since
 *   4.0.0
 * @param {VFile} a
 *   File.
 * @param {VFile} b
 *   Other file.
 * @returns {number}
 *   Order.
 */
export function compareFile(a, b) {
  return compareString(a, b, 'path')
}

/**
 * Compare messages.
 *
 * ###### Algorithm
 *
 * It first sorts by line/column: earlier messages come first.
 * When two messages occurr at the same place, sorts fatal error before
 * warnings, before info messages.
 * Finally, it sorts using `localeCompare` on `source`, `ruleId`, or finally
 * `reason`.
 *
 * @since
 *   4.0.0
 * @param {VFileMessage} a
 *   Message.
 * @param {VFileMessage} b
 *   Other message.
 * @returns {number}
 *   Order.
 */
export function compareMessage(a, b) {
  return (
    compareNumber(a, b, 'line') ||
    compareNumber(a, b, 'column') ||
    compareBoolean(a, b, 'fatal') ||
    compareString(a, b, 'source') ||
    compareString(a, b, 'ruleId') ||
    compareString(a, b, 'reason')
  )
}

/**
 * Compare a boolean field.
 *
 * @template {object} Thing
 *   Thing type.
 * @param {Thing} a
 *   Left thing.
 * @param {Thing} b
 *   Right thing.
 * @param {KeysOfType<Thing, boolean>} field
 *   Key of boolean field.
 * @returns {number}
 *   Order.
 */
function compareBoolean(a, b, field) {
  return scoreNullableBoolean(a[field]) - scoreNullableBoolean(b[field])
}

/**
 * Compare a numeric field.
 *
 * @template {object} Thing
 *   Thing type.
 * @param {Thing} a
 *   Left thing.
 * @param {Thing} b
 *   Right thing.
 * @param {KeysOfType<Thing, number>} field
 *   Key of number field.
 * @returns {number}
 *   Order.
 */
function compareNumber(a, b, field) {
  return (a[field] || 0) - (b[field] || 0)
}

/**
 * @template {object} Thing
 *   Thing type.
 * @param {Thing} a
 *   Left thing.
 * @param {Thing} b
 *   Right thing.
 * @param {KeysOfType<Thing, string>} field
 *   Key of string field.
 * @returns {number}
 *   Order.
 */
function compareString(a, b, field) {
  return String(a[field] || '').localeCompare(String(b[field] || ''))
}

/**
 * @param {boolean | null | undefined} value
 *   Value
 * @returns {number}
 *   Score.
 */
function scoreNullableBoolean(value) {
  return value ? 0 : value === false ? 1 : 2
}
