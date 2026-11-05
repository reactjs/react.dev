/**
 * @typedef {import('vfile').VFile} VFile
 * @typedef {import('vfile-message').VFileMessage} VFileMessage
 * @typedef {import('vfile-statistics').Statistics} Statistics
 */

/**
 * @typedef Options
 *   Configuration (optional).
 * @property {boolean | null | undefined} [color]
 *   Use ANSI colors in report (default: `true` when in Node.js and
 *   [color is supported][supports-color], or `false`).
 *
 *   [supports-color]: https://github.com/chalk/supports-color
 * @property {string | null | undefined} [defaultName='<stdin>']
 *   Label to use for files without file path (default: `'<stdin>'`); if one
 *   file and no `defaultName` is given, no name will show up in the report.
 * @property {boolean | null | undefined} [verbose=false]
 *   Show message notes, URLs, and ancestor stack trace if available (default:
 *   `false`).
 * @property {boolean | null | undefined} [quiet=false]
 *   Do not show files without messages (default: `false`).
 * @property {boolean | null | undefined} [silent=false]
 *   Show errors only (default: `false`); this hides info and warning messages,
 *   and sets `quiet: true`.
 * @property {number | null | undefined} [traceLimit=10]
 *   Max number of nodes to show in ancestors trace (default: `10`); ancestors
 *   can be shown when `verbose: true`.
 */

/**
 * @typedef State
 *   Info passed around.
 * @property {string | undefined} defaultName
 *   Default name to use.
 * @property {boolean} oneFileMode
 *   Whether explicitly a single file is passed.
 * @property {boolean} verbose
 *   Whether notes should be shown.
 * @property {boolean} quiet
 *   Whether to hide files without messages.
 * @property {boolean} silent
 *   Whether to hide warnings and info messages.
 * @property {number} traceLimit
 *   Max number of nodes to show in ancestors trace.
 * @property {string} bold
 *   Bold style.
 * @property {string} underline
 *   Underline style.
 * @property {string} normalIntensity
 *   Regular style.
 * @property {string} noUnderline
 *   Regular style.
 * @property {string} red
 *   Color.
 * @property {string} cyan
 *   Color.
 * @property {string} green
 *   Color.
 * @property {string} yellow
 *   Color.
 * @property {string} defaultColor
 *   Regular color.
 *
 * @typedef CodeSplit
 * @property {number} index
 * @property {number} size
 */

import stringWidth from 'string-width'
import {stringifyPosition} from 'unist-util-stringify-position'
import {compareFile, compareMessage} from 'vfile-sort'
import {statistics} from 'vfile-statistics'
import {color} from 'vfile-reporter/do-not-use-color'

const eol = /\r?\n|\r/

/**
 * Create a report from one or more files.
 *
 * @param {Array<VFile> | VFile} files
 *   Files or error to report.
 * @param {Options | null | undefined} [options]
 *   Configuration.
 * @returns {string}
 *   Report.
 */
// eslint-disable-next-line complexity
export function reporter(files, options) {
  if (
    // Nothing.
    !files ||
    // Error.
    ('name' in files && 'message' in files)
  ) {
    throw new TypeError(
      'Unexpected value for `files`, expected one or more `VFile`s'
    )
  }

  const settings = options || {}
  const colorEnabled =
    typeof settings.color === 'boolean' ? settings.color : color
  let oneFileMode = false

  if (Array.isArray(files)) {
    // Empty.
  } else {
    oneFileMode = true
    files = [files]
  }

  return serializeRows(
    createRows(
      {
        defaultName: settings.defaultName || undefined,
        oneFileMode,
        quiet: settings.quiet || false,
        silent: settings.silent || false,
        traceLimit:
          typeof settings.traceLimit === 'number' ? settings.traceLimit : 10,
        verbose: settings.verbose || false,
        bold: colorEnabled ? '\u001B[1m' : '',
        underline: colorEnabled ? '\u001B[4m' : '',
        normalIntensity: colorEnabled ? '\u001B[22m' : '',
        noUnderline: colorEnabled ? '\u001B[24m' : '',
        red: colorEnabled ? '\u001B[31m' : '',
        cyan: colorEnabled ? '\u001B[36m' : '',
        green: colorEnabled ? '\u001B[32m' : '',
        yellow: colorEnabled ? '\u001B[33m' : '',
        defaultColor: colorEnabled ? '\u001B[39m' : ''
      },
      files
    )
  )
}

/**
 * Create lines for ancestors.
 *
 * @param {State} state
 *   Info passed around.
 * @param {NonNullable<VFileMessage['ancestors']>} ancestors
 *   Ancestors.
 * @returns {Array<string>}
 *   Lines.
 */
function createAncestorsLines(state, ancestors) {
  const min =
    ancestors.length > state.traceLimit
      ? ancestors.length - state.traceLimit
      : 0
  let index = ancestors.length

  /** @type {Array<string>} */
  const lines = []

  if (index > min) {
    lines.unshift('  ' + state.bold + '[trace]' + state.normalIntensity + ':')
  }

  while (index-- > min) {
    const node = ancestors[index]
    /** @type {Record<string, unknown>} */
    // @ts-expect-error: TypeScript is wrong: objects can be indexed.
    const value = node
    const name =
      // `hast`
      typeof value.tagName === 'string'
        ? value.tagName
        : // `xast` (and MDX JSX elements)
          typeof value.name === 'string'
          ? value.name
          : undefined

    const position = stringifyPosition(node.position)

    lines.push(
      '    at ' +
        state.yellow +
        node.type +
        (name ? '<' + name + '>' : '') +
        state.defaultColor +
        (position ? ' (' + position + ')' : '')
    )
  }

  return lines
}

/**
 * Create a summary of total problems.
 *
 * @param {Readonly<State>} state
 *   Info passed around.
 * @param {Readonly<Statistics>} stats
 *   Statistics.
 * @returns {string}
 *   Line.
 */
function createByline(state, stats) {
  let result = ''

  if (stats.fatal) {
    result =
      state.red +
      '✖' +
      state.defaultColor +
      ' ' +
      stats.fatal +
      ' ' +
      (fatalToLabel(true) + (stats.fatal === 1 ? '' : 's'))
  }

  if (stats.warn) {
    result =
      (result ? result + ', ' : '') +
      (state.yellow + '⚠' + state.defaultColor) +
      ' ' +
      stats.warn +
      ' ' +
      (fatalToLabel(false) + (stats.warn === 1 ? '' : 's'))
  }

  if (stats.total !== stats.fatal && stats.total !== stats.warn) {
    result = stats.total + ' messages (' + result + ')'
  }

  return result
}

/**
 * Create lines for cause.
 *
 * @param {State} state
 *   Info passed around.
 * @param {unknown} cause
 *   Cause.
 * @returns {Array<Array<string> | string>}
 *   Lines.
 */
function createCauseLines(state, cause) {
  /** @type {Array<Array<string> | string>} */
  const lines = ['  ' + state.bold + '[cause]' + state.normalIntensity + ':']
  let foundReasonableCause = false

  if (cause !== null && typeof cause === 'object') {
    const stackValue =
      ('stack' in cause ? String(cause.stack) : undefined) ||
      ('message' in cause ? String(cause.message) : undefined)

    if (typeof stackValue === 'string') {
      foundReasonableCause = true
      /** @type {Array<Array<string> | string>} */
      let causeLines

      // Looks like a message.
      if ('file' in cause && 'fatal' in cause) {
        causeLines = createMessageLine(
          state,
          /** @type {VFileMessage} */ (cause)
        )
      }
      // Regular error.
      else {
        causeLines = stackValue.split(eol)

        // Recurse.
        if ('cause' in cause && cause.cause) {
          causeLines.push(...createCauseLines(state, cause.cause))
        }
      }

      const head = causeLines[0]
      if (typeof head === 'string') {
        causeLines[0] = '    ' + head
      } else {
        head[0] = '    ' + head[0]
      }

      lines.push(...causeLines)
    }
  }

  if (!foundReasonableCause) {
    lines.push('    ' + cause)
  }

  return lines
}

/**
 * Create a summary of problems for a file.
 *
 * @param {Readonly<State>} state
 *   Info passed around.
 * @param {Readonly<VFile>} file
 *   File.
 * @returns {string}
 *   Line.
 */
function createFileLine(state, file) {
  const stats = statistics(file.messages)
  const fromPath = file.history[0]
  const toPath = file.path
  let left = ''
  let right = ''

  if (!state.oneFileMode || state.defaultName || fromPath) {
    const name = fromPath || state.defaultName || '<stdin>'

    left =
      state.underline +
      (stats.fatal ? state.red : stats.total ? state.yellow : state.green) +
      name +
      state.defaultColor +
      state.noUnderline +
      (file.stored && name !== toPath ? ' > ' + toPath : '')
  }

  if (file.stored) {
    right = state.yellow + 'written' + state.defaultColor
  } else if (!stats.total) {
    right = 'no issues found'
  }

  return left && right ? left + ': ' + right : left + right
}

/**
 * Create lines for cause.
 *
 * @param {State} state
 *   Info passed around.
 * @param {NonNullable<VFileMessage['note']>} note
 *   Cause.
 * @returns {Array<string>}
 *   Lines.
 */
function createNoteLines(state, note) {
  const noteLines = note.split(eol)
  let index = -1
  while (++index < noteLines.length) {
    noteLines[index] = '    ' + noteLines[index]
  }

  return [
    '  ' + state.bold + '[note]' + state.normalIntensity + ':',
    ...noteLines
  ]
}

/**
 * Show a problem.
 *
 * @param {Readonly<State>} state
 *   Info passed around.
 * @param {Readonly<VFileMessage>} message
 *   Message.
 * @returns {Array<Array<string> | string>}
 *   Line.
 */
function createMessageLine(state, message) {
  const label = fatalToLabel(message.fatal)
  let reason = message.stack || message.message

  const match = eol.exec(reason)
  /** @type {Array<Array<string> | string>} */
  let rest = []

  if (match) {
    rest = reason.slice(match.index + 1).split(eol)
    reason = reason.slice(0, match.index)
  }

  /** @type {VFileMessage['place']} */
  // @ts-expect-error: `position` is the old value
  const place = message.place || message.position

  const row = [
    stringifyPosition(place),
    (label === 'error' ? state.red : state.yellow) + label + state.defaultColor,
    formatReason(state, reason),
    message.ruleId || '',
    message.source || ''
  ]

  if (message.cause) {
    rest.push(...createCauseLines(state, message.cause))
  }

  if (state.verbose && message.url) {
    rest.push(...createUrlLines(state, message.url))
  }

  if (state.verbose && message.note) {
    rest.push(...createNoteLines(state, message.note))
  }

  if (state.verbose && message.ancestors) {
    rest.push(...createAncestorsLines(state, message.ancestors))
  }

  return [row, ...rest]
}

/**
 * @param {State} state
 *   Info passed around.
 * @param {Readonly<Array<VFile>>} files
 *   Files.
 * @returns {Array<Array<string> | string>}
 *   Rows.
 */
function createRows(state, files) {
  // To do: when Node 18 is EOL, use `toSorted`.
  const sortedFiles = [...files].sort(compareFile)
  /** @type {Array<VFileMessage>} */
  const all = []
  let index = -1
  /** @type {Array<Array<string> | string>} */
  const rows = []
  let lastWasMessage = false

  while (++index < sortedFiles.length) {
    const file = sortedFiles[index]
    // To do: when Node 18 is EOL, use `toSorted`.
    const messages = [...file.messages].sort(compareMessage)
    /** @type {Array<Array<string> | string>} */
    const messageRows = []
    let offset = -1

    while (++offset < messages.length) {
      const message = messages[offset]

      if (!state.silent || message.fatal) {
        all.push(message)
        messageRows.push(...createMessageLine(state, message))
      }
    }

    if ((!state.quiet && !state.silent) || messageRows.length > 0) {
      const line = createFileLine(state, file)

      // EOL between message and a file header.
      if (lastWasMessage && line) rows.push('')
      if (line) rows.push(line)
      if (messageRows.length > 0) rows.push(...messageRows)

      lastWasMessage = messageRows.length > 0
    }
  }

  const stats = statistics(all)

  if (stats.fatal || stats.warn) {
    rows.push('', createByline(state, stats))
  }

  return rows
}

/**
 * Create lines for a URL.
 *
 * @param {State} state
 *   Info passed around.
 * @param {NonNullable<VFileMessage['url']>} url
 *   URL.
 * @returns {Array<string>}
 *   Lines.
 */
function createUrlLines(state, url) {
  return [
    '  ' + state.bold + '[url]' + state.normalIntensity + ':',
    '    ' + url
  ]
}

/**
 * Format a reason.
 *
 * @param {State} state
 *   Info passed around.
 * @param {string} reason
 *   Reason.
 * @returns {string}
 *   Result.
 */
function formatReason(state, reason) {
  /** @type {Array<string>} */
  const result = []
  /** @type {Array<CodeSplit>} */
  const splits = []
  let index = reason.indexOf('`')

  while (index !== -1) {
    const split = {index, size: 1}
    splits.push(split)

    while (reason.codePointAt(index + 1) === 96) {
      split.size++
      index++
    }

    index = reason.indexOf('`', index + 1)
  }

  index = -1
  let textStart = 0

  while (++index < splits.length) {
    let closeIndex = index
    /** @type {CodeSplit | undefined} */
    let close

    while (++closeIndex < splits.length) {
      if (splits[index].size === splits[closeIndex].size) {
        close = splits[closeIndex]
        break
      }
    }

    if (close) {
      const codeStart = splits[index].index
      const codeEnd = close.index + close.size

      result.push(
        reason.slice(textStart, codeStart) +
          state.cyan +
          reason.slice(codeStart, codeEnd) +
          state.defaultColor
      )
      textStart = codeEnd
      index = closeIndex
    }
  }

  result.push(reason.slice(textStart))

  return state.bold + result.join('') + state.normalIntensity
}

/**
 * Serialize `fatal` as a label.
 *
 * @param {boolean | null | undefined} value
 *   Fatal.
 * @returns {string}
 *   Label.
 */
function fatalToLabel(value) {
  return value ? 'error' : value === false ? 'warning' : 'info'
}

/**
 * @param {Readonly<Array<Readonly<Array<string>> | string>>} rows
 *   Rows.
 * @returns {string}
 *   Report.
 */
function serializeRows(rows) {
  /** @type {Array<number>} */
  const sizes = []
  let index = -1

  // Calculate sizes.
  while (++index < rows.length) {
    const row = rows[index]

    if (typeof row === 'string') {
      // Continue.
    } else {
      let cellIndex = -1
      while (++cellIndex < row.length) {
        const current = sizes[cellIndex] || 0
        const size = stringWidth(row[cellIndex])
        if (size > current) {
          sizes[cellIndex] = size
        }
      }
    }
  }

  /** @type {Array<string>} */
  const lines = []
  index = -1

  while (++index < rows.length) {
    const row = rows[index]
    let line = ''

    if (typeof row === 'string') {
      line = row
    } else {
      let cellIndex = -1

      while (++cellIndex < row.length) {
        const cell = row[cellIndex] || ''
        const max = (sizes[cellIndex] || 0) + 1
        line += cell + ' '.repeat(max - stringWidth(cell))
      }
    }

    lines.push(line.trimEnd())
  }

  return lines.join('\n')
}
