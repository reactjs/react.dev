/**
 * @import {Nodes} from 'mdast'
 * @import {SafeConfig, State, Unsafe} from 'mdast-util-to-markdown'
 */

import {classifyCharacter} from 'micromark-util-classify-character'
import {encodeCharacterReference} from './encode-character-reference.js'
import {patternInScope} from './pattern-in-scope.js'

const own = {}.hasOwnProperty

/**
 * Make a string safe for embedding in markdown constructs.
 *
 * In markdown, almost all punctuation characters can, in certain cases,
 * result in something.
 * Whether they do is highly subjective to where they happen and in what
 * they happen.
 *
 * To solve this, `mdast-util-to-markdown` tracks:
 *
 * * characters before and after something;
 * * what “constructs” we are in.
 *
 * This information is then used by this function to escape or encode
 * special characters.
 *
 * @param {State} state
 *   Info passed around about the current state.
 * @param {string | null | undefined} input
 *   Raw value to make safe.
 * @param {SafeConfig} config
 *   Configuration.
 * @returns {string}
 *   Serialized markdown safe for embedding.
 */
export function safe(state, input, config) {
  const value = (config.before || '') + (input || '') + (config.after || '')
  /** @type {Array<number>} */
  const positions = []
  /** @type {Array<string>} */
  const result = []
  /** @type {Record<number, {before: boolean, after: boolean}>} */
  const infos = {}
  // Character escapes and references do not work in autolinks, so
  // percent-encoding is used instead.
  const percentEncode = state.stack.includes('autolink')
  const offset = config.before ? config.before.length : 0
  const end = value.length - (config.after ? config.after.length : 0)
  let index = -1

  while (++index < state.unsafe.length) {
    const pattern = state.unsafe[index]

    if (
      !patternInScope(state.stack, pattern) ||
      !nodeInScope(pattern.beforeNode, config.beforeNode) ||
      !nodeInScope(pattern.afterNode, config.afterNode)
    ) {
      continue
    }

    const expression = state.compilePattern(pattern)
    const from = pattern.beforeNode ? offset : 0
    const subject = value.slice(from, pattern.afterNode ? end : undefined)
    /** @type {RegExpExecArray | null} */
    let match

    while ((match = expression.exec(subject))) {
      const before = 'before' in pattern || Boolean(pattern.atBreak)
      const after = 'after' in pattern
      const position = from + match.index + (before ? match[1].length : 0)

      if (own.call(infos, position)) {
        if (infos[position].before && !before) {
          infos[position].before = false
        }

        if (infos[position].after && !after) {
          infos[position].after = false
        }
      } else {
        positions.push(position)
        infos[position] = {before, after}
      }
    }
  }

  positions.sort(numerical)

  let start = offset
  index = -1

  while (++index < positions.length) {
    const position = positions[index]

    // Character before or after matched:
    if (position < start || position >= end) {
      continue
    }

    // Special handling for “intraword” underscores (`a_b`, `a__b`).
    // Those are different from asterisks in forming attention.
    // Note that `a _ b` also cannot form but not escaping it is very complex,
    // so that’s not handled.
    if (
      value.charAt(position) === '_' &&
      // Preceded by an unescaped character that is not punctuation or whitespace:
      position > 0 &&
      classifyCharacter(value.charCodeAt(position - 1)) === undefined &&
      !own.call(infos, position - 1) &&
      // Characters next to attention markers can become character references
      // later, turning `a` into `&#x61;`, so those do not count.
      !(position - 1 === offset && /[*_]/.test(value.charAt(offset - 1)))
    ) {
      let sequenceEnd = position + 1

      // Look for the whole run.
      while (sequenceEnd < end && value.charAt(sequenceEnd) === '_') {
        sequenceEnd++
      }

      const skip = sequenceEnd - position - 1

      if (
        // All underscores in the run are unsafe positions, so they can be
        // skipped.
        positions[index + skip] === sequenceEnd - 1 &&
        // Rest as above.
        sequenceEnd < value.length &&
        classifyCharacter(value.charCodeAt(sequenceEnd)) === undefined &&
        !own.call(infos, sequenceEnd) &&
        !(sequenceEnd === end - 1 && /[*_]/.test(value.charAt(end)))
      ) {
        index += skip
        continue
      }
    }

    // If this character is supposed to be escaped because it has a condition on
    // the next character, and the next character is definitly being escaped,
    // then skip this escape.
    if (
      (position + 1 < end &&
        positions[index + 1] === position + 1 &&
        infos[position].after &&
        !infos[position + 1].before &&
        !infos[position + 1].after) ||
      (position - 1 >= offset &&
        positions[index - 1] === position - 1 &&
        infos[position].before &&
        !infos[position - 1].before &&
        !infos[position - 1].after)
    ) {
      continue
    }

    if (start !== position) {
      const slice = value.slice(start, position)
      // If we have to use a character reference, an ampersand would be more
      // correct, but as backslashes only care about punctuation, either will
      // do the trick
      result.push(percentEncode ? slice : escapeBackslashes(slice, '\\'))
    }

    start = position + 1

    // Percent-encoding such as `%20`.
    if (percentEncode) {
      result.push(
        '%' +
          value.charCodeAt(position).toString(16).toUpperCase().padStart(2, '0')
      )
    } else if (
      /[!-/:-@[-`{-~]/.test(value.charAt(position)) &&
      (!config.encode || !config.encode.includes(value.charAt(position)))
    ) {
      // Character escape.
      result.push('\\' + value.charAt(position))
    } else {
      // Character reference.
      result.push(encodeCharacterReference(value.charCodeAt(position)))
    }
  }

  const rest = value.slice(start, end)
  result.push(percentEncode ? rest : escapeBackslashes(rest, config.after))

  return result.join('')
}

/**
 * Check if a node matches the node types of a pattern.
 *
 * @param {Array<Nodes['type']> | Nodes['type'] | null | undefined} types
 *   Node types.
 * @param {Nodes | undefined} node
 *   Node.
 * @returns {boolean}
 *   Whether `node` matches `types`.
 */
function nodeInScope(types, node) {
  if (!types) return true
  if (!node) return false
  return typeof types === 'string'
    ? types === node.type
    : types.includes(node.type)
}

/**
 * Compare two numbers.
 *
 * @param {number} a
 *   Number.
 * @param {number} b
 *   Other number.
 * @returns {number}
 *   Result.
 */
function numerical(a, b) {
  return a - b
}

/**
 * Escape backslashes in a string, considering characters that follow.
 *
 * @param {string} value
 *   Value.
 * @param {string} after
 *   Characters that follow the value.
 * @returns {string}
 *   Escaped string.
 */
function escapeBackslashes(value, after) {
  const expression = /\\(?=[!-/:-@[-`{-~])/g
  /** @type {Array<number>} */
  const positions = []
  /** @type {Array<string>} */
  const results = []
  const whole = value + after
  let index = -1
  let start = 0
  /** @type {RegExpExecArray | null} */
  let match

  while ((match = expression.exec(whole))) {
    positions.push(match.index)
  }

  while (++index < positions.length) {
    if (start !== positions[index]) {
      results.push(value.slice(start, positions[index]))
    }

    results.push('\\')
    start = positions[index]
  }

  results.push(value.slice(start))

  return results.join('')
}
