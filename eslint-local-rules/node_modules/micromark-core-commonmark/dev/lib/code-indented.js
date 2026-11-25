/**
 * @import {
 *   Construct,
 *   State,
 *   TokenizeContext,
 *   Tokenizer
 * } from 'micromark-util-types'
 */

import {ok as assert} from 'devlop'
import {factorySpaceMinMax} from 'micromark-factory-space'
import {markdownLineEnding, markdownSpace} from 'micromark-util-character'
import {codes, constants, types} from 'micromark-util-symbol'

/** @type {Construct} */
export const codeIndented = {
  name: 'codeIndented',
  tokenize: tokenizeCodeIndented
}

/** @type {Construct} */
const furtherStart = {partial: true, tokenize: tokenizeFurtherStart}

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeCodeIndented(effects, ok, nok) {
  return start

  /**
   * Start of code (indented).
   *
   * > **Parsing note**: it is not needed to check if this first line is a
   * > filled line (that it has a non-whitespace character), because blank lines
   * > are parsed already, so we never run into that.
   *
   * ```markdown
   * > |     aaa
   *     ^
   * ```
   *
   * @type {State}
   */
  function start(code) {
    // To do: manually check if interrupting like `markdown-rs`.
    assert(markdownSpace(code))
    effects.enter(types.codeIndented)
    return factorySpaceMinMax(
      effects,
      atBreak,
      nok,
      types.linePrefix,
      constants.tabSize,
      constants.tabSize
    )(code)
  }

  /**
   * At a break.
   *
   * ```markdown
   * > |     aaa
   *         ^  ^
   * ```
   *
   * @type {State}
   */
  function atBreak(code) {
    if (code === codes.eof) {
      return after(code)
    }

    if (markdownLineEnding(code)) {
      return effects.attempt(furtherStart, atBreak, after)(code)
    }

    effects.enter(types.codeFlowValue)
    return inside(code)
  }

  /**
   * In code content.
   *
   * ```markdown
   * > |     aaa
   *         ^^^^
   * ```
   *
   * @type {State}
   */
  function inside(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      effects.exit(types.codeFlowValue)
      return atBreak(code)
    }

    effects.consume(code)
    return inside
  }

  /** @type {State} */
  function after(code) {
    effects.exit(types.codeIndented)
    // To do: allow interrupting like `markdown-rs`.
    // Feel free to interrupt.
    // tokenizer.interrupt = false
    return ok(code)
  }
}

/**
 * @this {TokenizeContext}
 *   Context.
 * @type {Tokenizer}
 */
function tokenizeFurtherStart(effects, ok, nok) {
  const self = this

  return furtherStart

  /**
   * At eol, trying to parse another indent.
   *
   * ```markdown
   * > |     aaa
   *            ^
   *   |     bbb
   * ```
   *
   * @type {State}
   */
  function furtherStart(code) {
    // To do: improve `lazy` / `pierce` handling.
    // If this is a lazy line, it can’t be code.
    if (self.parser.lazy[self.now().line]) {
      return nok(code)
    }

    if (markdownLineEnding(code)) {
      effects.enter(types.lineEnding)
      effects.consume(code)
      effects.exit(types.lineEnding)
      return furtherStart
    }

    // To do: the code here in `micromark-js` is a bit different from
    // `markdown-rs` because there it can attempt spaces.
    // We can’t yet.
    return factorySpaceMinMax(
      effects,
      ok,
      onNotEnoughPrefix,
      types.linePrefix,
      constants.tabSize,
      constants.tabSize
    )(code)
  }

  /**
   * After not enough of a prefix.
   *
   * A following line ending is another (potentially blank) line to try,
   * anything else means this isn’t a continuation.
   *
   * ```markdown
   * > |     aaa
   *
   *   |     bbb
   * ```
   *
   * @type {State}
   */
  function onNotEnoughPrefix(code) {
    return markdownLineEnding(code) ? furtherStart(code) : nok(code)
  }
}
