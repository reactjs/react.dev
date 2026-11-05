/**
 * @import {Info, State} from 'mdast-util-to-markdown'
 * @import {Link, Parents} from 'mdast'
 * @import {Exit} from '../types.js'
 */

import {checkQuote} from '../util/check-quote.js'
import {formatLinkAsAutolink} from '../util/format-link-as-autolink.js'

link.peek = linkPeek

/**
 * Serialize a link node.
 *
 * @param {Link} node
 *   Node to serialize.
 * @param {Parents | undefined} _
 *   Parent node.
 * @param {State} state
 *   Info passed around.
 * @param {Info} info
 *   Info on surrounding context.
 * @returns {string}
 *   Serialized markdown.
 */
export function link(node, _, state, info) {
  const quote = checkQuote(state)
  const suffix = quote === '"' ? 'Quote' : 'Apostrophe'
  const tracker = state.createTracker(info)

  if (formatLinkAsAutolink(node, state)) {
    // Hide that we’re in phrasing as things like attention or code cannot form
    // in autolinks.
    // Character escapes also don’t work (nor character references),
    // but that is a different matter, which `safe.js` handles for `autolink`.
    // It is important to know about other constructs, such as table cells.
    const stack = state.stack
    state.stack = stack.filter(function (d) {
      return d !== 'phrasing'
    })
    const exit = state.enter('autolink')
    let value = tracker.move('<')
    value += tracker.move(
      state.containerPhrasing(node, {
        before: value,
        after: '>',
        ...tracker.current()
      })
    )
    value += tracker.move('>')
    exit()
    state.stack = stack
    return value
  }

  const exit = state.enter('link')
  let subexit = state.enter('label')
  let value = tracker.move('[')
  const text = state.containerPhrasing(node, {
    before: value,
    after: '](',
    ...tracker.current()
  })
  value += tracker.move(text)
  subexit()
  value += tracker.move('](')

  // A link could accidentally turn into a definition in certain contexts:
  // at the start of a line, without title, when its text has a `]` that
  // cannot be escaped (such as in code).
  //
  // We can prevent that with an empty title:
  //
  // ```
  // [`a]:`](b)
  // ```
  //
  // …is a definition with `` `](b) `` as its destination.
  //
  // Using:
  //
  // ```
  // [`a]:`](b "")
  // ```
  //
  // …instead fixes it.
  //
  // Control characters or whitespace in the url need an enclosed destination,
  // which also prevents this.
  const enclose = /[\0- \u007F]/.test(node.url)
  const last = info.before.charAt(info.before.length - 1)
  let title = node.title || undefined

  if (!title && !enclose && (last === '\n' || last === '\r')) {
    let index = 0

    while (index < text.length && text.charCodeAt(index) !== 93 /* `]` */) {
      index += text.charCodeAt(index) === 92 /* `\` */ ? 2 : 1
    }

    if (text.charCodeAt(index + 1) === 58 /* `:` */) title = ''
  }

  if (
    // If there’s no url but there is a title…
    (!node.url && typeof title === 'string') ||
    // If there are control characters or whitespace.
    enclose
  ) {
    subexit = state.enter('destinationLiteral')
    value += tracker.move('<')
    value += tracker.move(
      state.safe(node.url, {before: value, after: '>', ...tracker.current()})
    )
    value += tracker.move('>')
  } else {
    // No whitespace, raw is prettier.
    subexit = state.enter('destinationRaw')
    value += tracker.move(
      state.safe(node.url, {
        before: value,
        after: typeof title === 'string' ? ' ' : ')',
        ...tracker.current()
      })
    )
  }

  subexit()

  if (typeof title === 'string') {
    subexit = state.enter(`title${suffix}`)
    value += tracker.move(' ' + quote)
    value += tracker.move(
      state.safe(title, {
        before: value,
        after: quote,
        ...tracker.current()
      })
    )
    value += tracker.move(quote)
    subexit()
  }

  value += tracker.move(')')

  exit()
  return value
}

/**
 * Peek at this node.
 *
 * @param {Link} node
 *   Node to peek at.
 * @param {Parents | undefined} _
 *   Parent node.
 * @param {State} state
 *   Info passed around.
 * @returns {string}
 *   Start of the serialized markdown.
 */
function linkPeek(node, _, state) {
  return formatLinkAsAutolink(node, state) ? '<' : '['
}
