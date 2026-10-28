/**
 * @import {Join} from 'mdast-util-to-markdown'
 */

import {checkRule} from './util/check-rule.js'
import {formatCodeAsIndented} from './util/format-code-as-indented.js'
import {formatHeadingAsSetext} from './util/format-heading-as-setext.js'
import {htmlKind} from './util/html-kind.js'

/** @type {Array<Join>} */
export const join = [joinDefaults]

/**
 * Default join function.
 *
 * @type {Join}
 */
function joinDefaults(left, right, parent, state) {
  // Indented code after list or another indented code.
  if (
    right.type === 'code' &&
    formatCodeAsIndented(right, state) &&
    (left.type === 'list' ||
      (left.type === right.type && formatCodeAsIndented(left, state)))
  ) {
    return false
  }

  // Join children of a list or an item.
  // In which case, `parent` has a `spread` field.
  if ('spread' in parent && typeof parent.spread === 'boolean') {
    if (parent.spread) return 1

    // HTML that only ends at a blank line.
    if (left.type === 'html') {
      const kind = htmlKind(left.value)
      if (kind === undefined || kind === 6 || kind === 7) return 1
    }

    if (left.type === 'blockquote' && right.type === 'blockquote') return 1

    // Lists with non-1 start would turn into a paragraph.
    if (
      (left.type === 'definition' || left.type === 'paragraph') &&
      right.type === 'list' &&
      ((right.ordered &&
        typeof right.start === 'number' &&
        right.start !== 1) ||
        (right.children.length > 0 && right.children[0].children.length === 0))
    ) {
      return 1
    }

    // Thematic break with dashes would turn into a setext heading.
    if (
      left.type === 'paragraph' &&
      right.type === 'thematicBreak' &&
      checkRule(state) === '-' &&
      !state.options.ruleSpaces
    ) {
      return 1
    }

    // We have to “delve” into containers that form from the left margin.
    let tail = left

    while (
      (tail.type === 'blockquote' ||
        tail.type === 'list' ||
        tail.type === 'listItem') &&
      tail.children.length > 0
    ) {
      tail = tail.children[tail.children.length - 1]
    }

    if (tail.type !== 'definition' && tail.type !== 'paragraph') return 0

    // Indented code would turn into a paragraph.
    if (right.type === 'code' && formatCodeAsIndented(right, state)) return 1

    // Kind 7 HTML would turn into a paragraph.
    if (right.type === 'html') {
      const kind = htmlKind(right.value)
      if (kind === undefined || kind === 7) return 1
    }

    // Text joins the paragraph before it, also one at the end of a container.
    // Not a definition before it: definitions are parsed out of the start of
    // a paragraph, so they and the text after them are read back the same.
    if (
      (left.type === 'paragraph' || left !== tail) &&
      (right.type === 'definition' ||
        (right.type === 'heading' && formatHeadingAsSetext(right, state)) ||
        right.type === 'paragraph')
    ) {
      return 1
    }

    return 0
  }
}
