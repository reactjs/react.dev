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
export function compareFile(a: VFile, b: VFile): number
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
export function compareMessage(a: VFileMessage, b: VFileMessage): number
export type VFile = import('vfile').VFile
export type VFileMessage = import('vfile-message').VFileMessage
/**
 * Complex type that finds the keys of fields whose values are of a certain
 * type `Kind` (such as `string`) in `Thing` (probably an object).
 */
export type KeysOfType<Thing, Kind> = {
  [Key in keyof Thing]: NonNullable<Thing[Key]> extends Kind ? Key : never
}[keyof Thing]
