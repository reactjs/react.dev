/**
 * @import {Attention, Handle, Info, State, Tracker} from 'mdast-util-to-markdown'
 * @import {PhrasingParents} from '../types.js'
 */

import {asciiPunctuation} from 'micromark-util-character'
import {classifyCharacter} from 'micromark-util-classify-character'
import {firstCharacter, lastCharacter} from './character.js'
import {encodeCharacterReference} from './encode-character-reference.js'
import {encodeInfo} from './encode-info.js'
import {htmlKind} from './html-kind.js'

/**
 * Markers for builtin attention (emphasis, strong) to whether they are stricter:
 * whether they cannot open and close inside words.
 *
 * Builtin runs pair following CommonMark rules for emphasis and strong:
 * they are split,
 * using one or two markers at a time,
 * with the rule of 3.
 * Other markers pair like GFM strikethrough:
 * whole runs pair with a run of the same size.
 *
 * @type {Map<string, boolean>}
 */
const builtins = new Map([
  ['*', false],
  ['_', true]
])

/**
 * @typedef AttentionResult
 *   Attention, of which the sequence is chosen later.
 * @property {Array<Item>} children
 *   Serialized children.
 * @property {Array<string>} sequences
 *   Sequences that can be used, in order of preference.
 */

/**
 * @typedef Improvement
 *   Improvement of attention sequences.
 * @property {Map<AttentionResult, string>} chosen
 *   Chosen sequences for each attention.
 * @property {Array<Token>} tokens
 *   Tokens involved in the improvement.
 * @property {Mistake | undefined} mistake
 *   Mistake that led to this improvement, if any.
 */

/**
 * @typedef {AttentionResult | string} Item
 *   Serialized phrasing.
 */

/**
 * @typedef Mistake
 *   Sequence that does not form its attention.
 * @property {Array<AttentionResult>} attention
 *   Attention to try other sequences for.
 * @property {number} index
 *   Index of the token.
 */

/**
 * @typedef Run
 *   Sequences next to each other with the same marker.
 * @property {boolean} close
 *   Whether it can close.
 * @property {number} end
 *   Index after the last marker not used (to open).
 * @property {Array<Token>} markers
 *   Sequence of each marker.
 * @property {boolean} open
 *   Whether it can open.
 * @property {boolean} split
 *   Whether it can be split (built-in attention).
 * @property {number} start
 *   Index of the first marker not used (to close).
 * @property {Array<Token>} tokens
 *   Sequences.
 */

/**
 * @typedef Token
 *   Rendered phrasing.
 * @property {AttentionResult | undefined} attention
 *   Attention, if this is one of its sequences.
 * @property {string} value
 *   Value.
 */

/**
 * Get candidates for a mistake:
 * attention to try other sequences for,
 * later first.
 *
 * @param {Array<Token>} tokens
 *   Tokens.
 * @param {Array<Token>} involved
 *   Sequences involved in the mistake.
 * @param {Map<Token, Run>} runOf
 *   Run of each sequence.
 * @returns {Array<AttentionResult>}
 *   Candidates.
 */
function candidates(tokens, involved, runOf) {
  /** @type {Set<AttentionResult | undefined>} */
  const related = new Set()

  // The attention involved, and attention in runs with its sequences.
  for (const token of tokens) {
    const siblings = runOf.get(token)
    if (
      siblings &&
      token.attention &&
      involved.some((d) => d.attention === token.attention)
    ) {
      for (const sibling of siblings.tokens) {
        related.add(sibling.attention)
      }
    }
  }

  /** @type {Array<AttentionResult>} */
  const ordered = []

  for (const token of tokens) {
    if (token.attention && related.delete(token.attention)) {
      ordered.push(token.attention)
    }
  }

  // Later first: attention that opens later is inner or next.
  ordered.reverse()
  return ordered
}

/**
 * Check whether sequences form their attention, like `micromark`.
 *
 * Sequences of `*` and `_` pair like emphasis and strong in CommonMark,
 * others like strikethrough in GFM.
 *
 * @param {Array<Token>} tokens
 *   Tokens.
 * @param {string} before
 *   Characters before.
 * @param {string} after
 *   Characters after.
 * @returns {Mistake | undefined}
 *   First mistake, if any.
 */
function check(tokens, before, after) {
  /** @type {Array<Run>} */
  const runs = []
  /** @type {Map<Token, Array<Token>>} */
  const wrong = new Map()
  /** @type {Map<Token, Run>} */
  const runOf = new Map()
  let index = 0

  while (index < tokens.length) {
    if (!tokens[index].attention) {
      index++
      continue
    }

    const marker = tokens[index].value.charAt(0)
    const strict = builtins.get(marker)
    let end = index + 1

    while (
      end < tokens.length &&
      tokens[end].attention &&
      tokens[end].value.charAt(0) === marker
    ) {
      end++
    }

    const head = index ? tokens[index - 1].value : before
    const previous = classifyCharacter(head.charCodeAt(head.length - 1))
    const next = classifyCharacter(
      (end < tokens.length ? tokens[end].value : after).charCodeAt(0)
    )
    const open = !next || (next === 2 && Boolean(previous))
    const close = !previous || (previous === 2 && Boolean(next))
    /** @type {Run} */
    const run = {
      tokens: tokens.slice(index, end),
      markers: [],
      start: 0,
      end: 0,
      // Underscores are strict, they cannot open or close inside words.
      open: strict ? open && (Boolean(previous) || !close) : open,
      close: strict ? close && (Boolean(next) || !open) : close,
      // All builtins can split runs.
      split: strict !== undefined
    }

    for (const token of run.tokens) {
      // Every sequence is wrong until it pairs with its other sequence.
      wrong.set(token, [...run.tokens])
      runOf.set(token, run)
      let size = token.value.length
      while (size--) run.markers.push(token)
    }

    run.end = run.markers.length
    runs.push(run)
    index = end
  }

  pair(runs, wrong)

  index = -1

  while (++index < tokens.length) {
    const involved = wrong.get(tokens[index])
    if (involved) return {attention: candidates(tokens, involved, runOf), index}
  }
}

/**
 * Serialize the children of a parent that contains phrasing children.
 *
 * @param {PhrasingParents} parent
 *   Parent of phrasing nodes.
 * @param {State} state
 *   Info passed around about the current state.
 * @param {Info} info
 *   Info on where we are in the document we are generating.
 * @returns {string}
 *   Serialized result.
 */
export function containerPhrasing(parent, state, info) {
  return serialize(phrasing(parent, state, info), info.before, info.after)
}

/**
 * Encode the first or last character of tokens as a character reference,
 * if it is text.
 *
 * @param {Array<Token>} tokens
 *   Tokens.
 * @param {boolean} start
 *   Whether to encode the first or last character.
 * @returns {undefined}
 *   Nothing.
 */
function encode(tokens, start) {
  const token = tokens[start ? 0 : tokens.length - 1]

  if (!token || token.attention) return

  const character = start
    ? firstCharacter(token.value)
    : lastCharacter(token.value)
  const reference = encodeCharacterReference(
    /** @type {number} */ (character.codePointAt(0))
  )

  if (start) {
    token.value = reference + token.value.slice(character.length)
  } else {
    let value = token.value.slice(0, token.value.length - character.length)
    let escapes = 0

    while (value.charCodeAt(value.length - 1 - escapes) === 92 /* `\` */) {
      escapes++
    }

    // Odd number would escape the `&` again.
    if (escapes % 2) value += '\\'
    token.value = value + reference
  }
}

/**
 * Try other sequences for the candidates of a mistake and use the first that
 * moves the mistake further.
 *
 * @param {Array<Item>} items
 *   Items.
 * @param {Map<AttentionResult, string>} chosen
 *   Sequences to use instead of preferred sequences.
 * @param {Mistake} mistake
 *   Mistake.
 * @param {string} before
 *   Characters before.
 * @param {string} after
 *   Characters after.
 * @returns {Improvement | undefined}
 *   Result if better.
 */
function improve(items, chosen, mistake, before, after) {
  for (const attention of mistake.attention) {
    const current = chosen.get(attention) || attention.sequences[0]

    for (const sequence of attention.sequences) {
      if (sequence === current) continue
      const trial = new Map(chosen)
      trial.set(attention, sequence)
      const tokens = render(items, trial, before, after)
      const next = check(tokens, before, after)

      if (!next || next.index > mistake.index) {
        return {chosen: trial, mistake: next, tokens}
      }
    }
  }
}

/**
 * Pair runs like `micromark` and mark sequences that do form their attention
 * as fine.
 *
 * Each pair uses markers from the end of an opener and the start of a closer.
 * It forms the intended attention if those markers are exactly the whole
 * opening and closing sequence of one attention.
 * Otherwise attention is mixed up:
 * either sequences of different attention pair,
 * part of a sequence is used (such as `**` of strong as `*`),
 * or several sequences are used together (such as `*` and `*` as `**`).
 * Then the sequences involved are recorded with each other.
 *
 * @param {Array<Run>} runs
 *   Runs.
 * @param {Map<Token, Array<Token>>} wrong
 *   Sequences that are wrong, with the sequences involved.
 * @returns {undefined}
 *   Nothing, `wrong` is changed.
 */
function pair(runs, wrong) {
  /** @type {Map<string, Array<Run>>} */
  const openersByMarker = new Map()

  for (const closer of runs) {
    const marker = closer.tokens[0].value.charAt(0)
    let openers = openersByMarker.get(marker)

    if (!openers) {
      openers = []
      openersByMarker.set(marker, openers)
    }

    let open = closer.close ? openers.length : 0

    while (open-- && closer.start < closer.end) {
      const opener = openers[open]
      const openerSize = opener.end - opener.start
      const closerSize = closer.end - closer.start

      if (
        closer.split
          ? // The rule of 3, on the sizes that are left.
            (opener.close || closer.open) &&
            closerSize % 3 &&
            !((openerSize + closerSize) % 3)
          : // Others pair whole runs of the same size.
            openerSize !== opener.markers.length || openerSize !== closerSize
      ) {
        continue
      }

      const size = closer.split
        ? openerSize > 1 && closerSize > 1
          ? 2
          : 1
        : closerSize
      const opening = opener.markers.slice(opener.end - size, opener.end)
      const closing = closer.markers.slice(closer.start, closer.start + size)
      const openToken = opening[0]
      const closeToken = closing[0]

      if (
        // Whole sequences:
        // the markers of a sequence are next to each other,
        // so if the first and last marker are of one sequence of that size,
        // all markers are exactly that sequence.
        openToken === opening[size - 1] &&
        openToken.value.length === size &&
        closeToken === closing[size - 1] &&
        closeToken.value.length === size &&
        // Of the same attention, so its opening and closing sequence.
        openToken.attention === closeToken.attention
      ) {
        wrong.delete(openToken)
        wrong.delete(closeToken)
      } else {
        const involved = [...new Set([...opening, ...closing])]
        // Add to what is involved already: a sequence can be in several pairs.
        for (const token of involved) {
          const list = wrong.get(token)
          if (list) list.push(...involved)
        }
      }

      opener.end -= size
      closer.start += size

      if (opener.start === opener.end) openers.splice(open, 1)

      // Search again from the start, as this run may close more.
      open = openers.length
    }

    if (closer.open && closer.start < closer.end) openers.push(closer)
  }
}

/**
 * Get the sequences that can be used for attention, in order of preference.
 *
 * @param {string} type
 *   Node type.
 * @param {Array<string>} markers
 *   Markers.
 * @param {Array<number>} sizes
 *   Sizes.
 * @returns {Array<string>}
 *   Sequences.
 */
function attentionSequences(type, markers, sizes) {
  if (markers.length === 0) {
    throw new Error(
      'Cannot serialize `' +
        type +
        '` as attention without markers, expected one or more markers'
    )
  }

  if (sizes.length === 0) {
    throw new Error(
      'Cannot serialize `' +
        type +
        '` as attention without sizes, expected one or more sizes'
    )
  }

  for (const size of sizes) {
    if (!Number.isSafeInteger(size) || size < 1) {
      throw new Error(
        'Cannot serialize `' +
          type +
          '` as attention with `' +
          size +
          '` as size, expected positive integer'
      )
    }
  }

  /** @type {Array<string>} */
  const sequences = []

  for (const marker of markers) {
    if (marker.length !== 1) {
      throw new Error(
        'Cannot serialize `' +
          type +
          '` as attention with `' +
          marker +
          '` as marker, expected a single ascii character'
      )
    }

    if (!asciiPunctuation(marker.charCodeAt(0))) {
      throw new Error(
        'Cannot serialize `' +
          type +
          '` as attention with `' +
          marker +
          '` as marker, expected ascii punctuation'
      )
    }

    for (const size of sizes) {
      sequences.push(marker.repeat(size))
    }
  }

  return sequences
}

/**
 * Serialize the children of a parent that contains phrasing children,
 * keeping attention separate,
 * so that its markers can be chosen later.
 *
 * @param {PhrasingParents} parent
 *   Parent of phrasing nodes.
 * @param {State} state
 *   Info passed around about the current state.
 * @param {Info} info
 *   Info on where we are in the document we are generating.
 * @returns {Array<Item>}
 *   Items.
 */
function phrasing(parent, state, info) {
  const indexStack = state.indexStack
  const children = parent.children || []
  /** @type {Array<Item>} */
  const results = []
  let index = -1
  let before = info.before

  indexStack.push(-1)
  let tracker = state.createTracker(info)

  while (++index < children.length) {
    const child = children[index]
    /** @type {string} */
    let after

    indexStack[indexStack.length - 1] = index

    if (index + 1 < children.length) {
      /** @type {Handle} */
      // @ts-expect-error: hush, it’s actually a `zwitch`.
      let handle = state.handle.handlers[children[index + 1].type]
      // @ts-expect-error: hush, it’s actually a `zwitch`.
      if (handle && handle.peek) handle = handle.peek
      after = handle
        ? firstCharacter(
            handle(children[index + 1], parent, state, {
              before: '',
              after: '',
              ...tracker.current()
            })
          )
        : ''
    } else {
      after = info.after
    }

    // In some cases, html (text) can be found in phrasing right after an eol.
    // When we’d serialize that, it could be seen as html (flow): all its kinds
    // except 7 can interrupt a paragraph.
    // As we can’t escape or so to prevent it from happening,
    // we take a somewhat reasonable approach:
    // replace that eol with a space.
    // See: <https://github.com/syntax-tree/mdast-util-to-markdown/issues/15>
    const previous = results[results.length - 1]

    if (
      typeof previous === 'string' &&
      (before === '\r' || before === '\n') &&
      child.type === 'html' &&
      htmlKind(child.value) !== 7
    ) {
      results[results.length - 1] = previous.replace(/(\r?\n|\r)$/, ' ')
      before = ' '

      // To do: does this work to reset tracker?
      tracker = state.createTracker(info)
      tracker.move(serialize(results, info.before, info.after))
    }

    /** @type {(Handle & {attention?: Attention | undefined}) | undefined} */
    // @ts-expect-error: hush, it’s actually a `zwitch`.
    const handle = state.handle.handlers[child.type]

    if (handle && handle.attention) {
      const item = attentionItem(
        /** @type {PhrasingParents} */ (child),
        handle.attention,
        state,
        tracker
      )
      results.push(item)
      before = lastCharacter(item.sequences[0])
    } else {
      const value = state.handle(child, parent, state, {
        ...tracker.current(),
        after,
        before
      })

      if (!value) continue
      tracker.move(value)
      results.push(value)
      before = lastCharacter(value)
    }
  }

  indexStack.pop()

  return results
}

/**
 * Serialize a node as attention,
 * with its sequence chosen later.
 *
 * @param {PhrasingParents} node
 *   Node.
 * @param {Attention} attention
 *   Attention of the node.
 * @param {State} state
 *   Info passed around about the current state.
 * @param {Tracker} tracker
 *   Tracker.
 * @returns {AttentionResult}
 *   Attention.
 */
export function attentionItem(node, attention, state, tracker) {
  const {construct, markers, sizes} = attention(node, state)
  const sequences = attentionSequences(node.type, markers, sizes)
  const sequence = sequences[0]
  const exit = state.enter(construct)
  tracker.move(sequence)
  const children = phrasing(node, state, {
    ...tracker.current(),
    before: sequence,
    after: sequence
  })
  tracker.move(serialize(children, sequence, sequence))
  tracker.move(sequence)
  exit()
  return {children, sequences}
}

/**
 * Render items with sequences;
 * encoding characters around attention where needed.
 *
 * @param {Array<Item>} items
 *   Serialized phrasing.
 * @param {Map<AttentionResult, string>} chosen
 *   Sequences to use instead of preferred sequences.
 * @param {string} before
 *   Characters before.
 * @param {string} after
 *   Characters after.
 * @returns {Array<Token>}
 *   Tokens.
 */
function render(items, chosen, before, after) {
  /** @type {Array<Token>} */
  const tokens = []
  /** @type {string | undefined} */
  let encodeAfter
  let previous = lastCharacter(before)
  let index = -1

  while (++index < items.length) {
    const item = items[index]

    if (typeof item === 'string') {
      /** @type {Token} */
      const token = {value: item, attention: undefined}

      // If attention before had to encode the character after it, encode it.
      if (encodeAfter && encodeAfter === firstCharacter(item)) {
        encode([token], true)
      }

      encodeAfter = undefined
      tokens.push(token)
      if (token.value) previous = lastCharacter(token.value)
      continue
    }

    const sequence = chosen.get(item) || item.sequences[0]
    const marker = sequence.charAt(0)
    const next = items[index + 1]
    const outsideBefore = previous
    const outsideAfter = firstCharacter(
      next === undefined
        ? after
        : typeof next === 'string'
          ? next
          : chosen.get(next) || next.sequences[0]
    )
    const inside = render(item.children, chosen, sequence, sequence)
    const head = inside.length > 0 ? inside[0].value : ''
    const open = encodeInfo(
      outsideBefore.charCodeAt(outsideBefore.length - 1),
      head.charCodeAt(0),
      marker
    )

    if (open.inside) encode(inside, true)

    const tail =
      inside.length > 0 ? lastCharacter(inside[inside.length - 1].value) : ''
    const close = encodeInfo(
      outsideAfter.charCodeAt(0),
      tail.charCodeAt(tail.length - 1),
      marker
    )

    if (close.inside) encode(inside, false)

    if (open.outside && outsideBefore !== '\n' && outsideBefore !== '\r') {
      encode(tokens, false)
    }

    if (close.outside) encodeAfter = outsideAfter

    tokens.push({value: sequence, attention: item}, ...inside, {
      value: sequence,
      attention: item
    })
    previous = sequence.charAt(sequence.length - 1)
  }

  return tokens
}

/**
 * Serialize phrasing with attention.
 *
 * Whether attention forms depends on everything around it.
 * This checks that it does and tries other sequences if not.
 *
 * @param {Array<Item>} items
 *   Phrasing items.
 * @param {string} before
 *   Characters before.
 * @param {string} after
 *   Characters after.
 * @returns {string}
 *   Serialized markdown.
 */
export function serialize(items, before, after) {
  /** @type {Map<AttentionResult, string>} */
  let chosen = new Map()
  const initial = render(items, chosen, before, after)
  let tokens = initial
  let mistake = check(tokens, before, after)

  while (mistake) {
    const next = improve(items, chosen, mistake, before, after)

    if (!next) {
      tokens = initial
      break
    }

    chosen = next.chosen
    tokens = next.tokens
    mistake = next.mistake
  }

  // Join the tokens.
  let result = ''
  for (const token of tokens) result += token.value
  return result
}
