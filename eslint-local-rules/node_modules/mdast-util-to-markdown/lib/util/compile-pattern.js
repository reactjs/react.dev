/**
 * @import {CompilePattern} from '../types.js'
 */

/**
 * Compiles a pattern object into a regular expression.
 *
 * @type {CompilePattern}
 */
export function compilePattern(pattern) {
  if (!pattern._compiled) {
    const before =
      (pattern.atBreak ? '[\\r\\n][\\t ]*' : '') +
      (pattern.before ? '(?:' + pattern.before + ')' : '')

    pattern._compiled = new RegExp(
      (pattern.beforeNode ? '^' : before ? '(' + before + ')' : '') +
        (/[$()*+.?[\\\]^{|}]/.test(pattern.character) ? '\\' : '') +
        pattern.character +
        (pattern.afterNode
          ? '$'
          : pattern.after
            ? '(?:' + pattern.after + ')'
            : ''),
      pattern.unicode ? 'gu' : 'g'
    )
  }

  return pattern._compiled
}
