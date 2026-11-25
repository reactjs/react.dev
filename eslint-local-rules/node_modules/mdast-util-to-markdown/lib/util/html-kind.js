import {asciiAlpha, asciiAlphanumeric} from 'micromark-util-character'
import {htmlBlockNames, htmlRawNames} from 'micromark-util-html-tag-name'

/**
 * @typedef {1 | 2 | 3 | 4 | 5 | 6 | 7} Kind
 *   Kind of HTML (flow) element.
 */

/**
 * Infer the kind of HTML that `value` is.
 *
 * This works on valid trees as produced by `micromark`.
 * Kinds:
 *
 * 1. raw
 * 2. comment
 * 3. instruction
 * 4. declaration
 * 5. cdata
 * 6. block
 * 7. other
 *
 * See: <https://spec.commonmark.org/0.31.2/#html-blocks>.
 *
 * @param {string} value
 *   HTML.
 * @returns {Kind | undefined}
 *   Kind; `undefined` if unknown.
 */
export function htmlKind(value) {
  if (value.charCodeAt(0) !== 60 /* `<` */) return

  const next = value.charCodeAt(1)

  if (next === 33 /* `!` */) {
    const code = value.charCodeAt(2)
    if (code === 45 /* `-` */) return 2
    if (code === 91 /* `[` */) return 5
    if (asciiAlpha(code)) return 4
    return
  }

  if (next === 63 /* `?` */) return 3

  const closing = next === 47 /* `/` */
  const start = closing ? 2 : 1
  let end = start
  let code = value.charCodeAt(end)

  if (!asciiAlpha(code)) return

  while (code === 45 /* `-` */ || asciiAlphanumeric(code)) {
    code = value.charCodeAt(++end)
  }

  const name = value.slice(start, end).toLowerCase()

  if (!closing && code !== 47 /* `/` */ && htmlRawNames.includes(name)) {
    return 1
  }

  return htmlBlockNames.includes(name) ? 6 : 7
}
