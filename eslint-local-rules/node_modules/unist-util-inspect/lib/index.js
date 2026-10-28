/**
 * @import {Options} from 'unist-util-inspect'
 * @import {Node} from 'unist'
 * @import {State} from './types.js'
 */

import {color as colorDefault} from '#conditional-color'

/** @type {Readonly<Options>} */
const emptyOptions = {}

// To do: next major (?): use `Object.hasOwn`.
const own = {}.hasOwnProperty

/**
 * Inspect a node, without color.
 *
 * @param {unknown} tree
 *   Tree to inspect.
 * @param {Readonly<Options> | null | undefined} [options]
 *   Configuration.
 * @returns {string}
 *   Pretty printed `tree`.
 */
export function inspect(tree, options) {
  const settings = options || emptyOptions
  const color =
    typeof settings.color === 'boolean' ? settings.color : colorDefault
  const showPositions =
    typeof settings.showPositions === 'boolean' ? settings.showPositions : true
  /** @type {State} */
  const state = {
    bold: color ? ansiColor(1, 22) : identity,
    dim: color ? ansiColor(2, 22) : identity,
    green: color ? ansiColor(32, 39) : identity,
    showPositions,
    yellow: color ? ansiColor(33, 39) : identity
  }

  return inspectValue(tree, state)
}

// To do: remove.
/**
 * Inspect a node, without color.
 *
 * @deprecated
 *   Use `inspect` instead, with `color: false`.
 * @param {unknown} tree
 *   Tree to inspect.
 * @param {Readonly<Omit<Options, 'color'>> | null | undefined} [options]
 *   Configuration.
 * @returns {string}
 *   Pretty printed `tree`.
 */
export function inspectNoColor(tree, options) {
  return inspect(tree, {...options, color: false})
}

// To do: remove.
/**
 * Inspects a node, using color.
 *
 * @deprecated
 *   Use `inspect` instead, with `color: true`.
 * @param {unknown} tree
 *   Tree to inspect.
 * @param {Readonly<Omit<Options, 'color'>> | null | undefined} [options]
 *   Configuration (optional).
 * @returns {string}
 *   Pretty printed `tree`.
 */
export function inspectColor(tree, options) {
  return inspect(tree, {...options, color: true})
}

/**
 * Format any value.
 *
 * @param {unknown} node
 *   Thing to format.
 * @param {State} state
 *   Info passed around.
 * @returns {string}
 *   Formatted thing.
 */
function inspectValue(node, state) {
  if (isArrayUnknown(node)) {
    return inspectNodes(node, state)
  }

  if (isNode(node)) {
    return inspectTree(node, state)
  }

  return inspectNonTree(node)
}

/**
 * Format an unknown value.
 *
 * @param {unknown} value
 *   Thing to format.
 * @returns {string}
 *   Formatted thing.
 */
function inspectNonTree(value) {
  return JSON.stringify(value)
}

/**
 * Format a list of nodes.
 *
 * @param {Array<unknown>} nodes
 *   Nodes to format.
 * @param {State} state
 *   Info passed around.
 * @returns {string}
 *   Formatted nodes.
 */
function inspectNodes(nodes, state) {
  const size = String(nodes.length - 1).length
  /** @type {Array<string>} */
  const result = []
  let index = -1

  while (++index < nodes.length) {
    result.push(
      state.dim(
        (index < nodes.length - 1 ? '├' : '└') +
          '─' +
          String(index).padEnd(size)
      ) +
        ' ' +
        indent(
          inspectValue(nodes[index], state),
          (index < nodes.length - 1 ? state.dim('│') : ' ') +
            ' '.repeat(size + 2),
          true
        )
    )
  }

  return result.join('\n')
}

/**
 * Format the fields in a node.
 *
 * @param {Record<string, unknown>} object
 *   Node to format.
 * @param {State} state
 *   Info passed around.
 * @returns {string}
 *   Formatted node.
 */
// eslint-disable-next-line complexity
function inspectFields(object, state) {
  /** @type {Array<string>} */
  const result = []
  /** @type {string} */
  let key

  for (key in object) {
    /* c8 ignore next 1 */
    if (!own.call(object, key)) continue

    const value = object[key]
    /** @type {string} */
    let formatted

    if (
      value === undefined ||
      // Standard keys defined by unist that we format differently.
      // <https://github.com/syntax-tree/unist>
      key === 'type' ||
      key === 'value' ||
      key === 'children' ||
      key === 'position' ||
      // Ignore `name` (from xast) and `tagName` (from `hast`) when string.
      (typeof value === 'string' && (key === 'name' || key === 'tagName'))
    ) {
      continue
    }

    // A single node.
    if (
      isNode(value) &&
      key !== 'data' &&
      key !== 'attributes' &&
      key !== 'properties'
    ) {
      formatted = inspectTree(value, state)
    }
    // A list of nodes.
    else if (value && isArrayUnknown(value) && isNode(value[0])) {
      formatted = '\n' + inspectNodes(value, state)
    } else {
      formatted = inspectNonTree(value)
    }

    result.push(
      key +
        state.dim(':') +
        (/\s/.test(formatted.charAt(0)) ? '' : ' ') +
        formatted
    )
  }

  return indent(
    result.join('\n'),
    (isArrayUnknown(object.children) && object.children.length > 0
      ? state.dim('│')
      : ' ') + ' '
  )
}

/**
 * Format a node, its fields, and its children.
 *
 * @param {Node} node
 *   Node to format.
 * @param {State} state
 *   Info passed around.
 * @returns {string}
 *   Formatted node.
 */
function inspectTree(node, state) {
  const result = [formatNode(node, state)]
  // Cast as record to allow indexing.
  const map = /** @type {Record<string, unknown>} */ (
    /** @type {unknown} */ (node)
  )
  const fields = inspectFields(map, state)
  const content = isArrayUnknown(map.children)
    ? inspectNodes(map.children, state)
    : ''
  if (fields) result.push(fields)
  if (content) result.push(content)
  return result.join('\n')
}

/**
 * Format a node itself.
 *
 * @param {Node} node
 *   Node to format.
 * @param {State} state
 *   Info passed around.
 * @returns {string}
 *   Formatted node.
 */
function formatNode(node, state) {
  const result = [state.bold(node.type)]
  // Cast as record to allow indexing.
  const map = /** @type {Record<string, unknown>} */ (
    /** @type {unknown} */ (node)
  )
  const kind = map.tagName || map.name
  const position = state.showPositions ? stringifyPosition(node.position) : ''

  if (typeof kind === 'string') {
    result.push('<', kind, '>')
  }

  if (isArrayUnknown(map.children)) {
    result.push(
      state.dim('['),
      state.yellow(String(map.children.length)),
      state.dim(']')
    )
  } else if (typeof map.value === 'string') {
    result.push(' ', state.green(inspectNonTree(map.value)))
  }

  if (position) {
    result.push(' ', state.dim('('), position, state.dim(')'))
  }

  return result.join('')
}

/**
 * Indent a value.
 *
 * @param {string} value
 *   Value to indent.
 * @param {string} indentation
 *   Indent to use.
 * @param {boolean | undefined} [ignoreFirst=false]
 *   Whether to ignore indenting the first line (default: `false`).
 * @returns {string}
 *   Indented `value`.
 */
function indent(value, indentation, ignoreFirst) {
  if (!value) return value

  const lines = value.split('\n')
  let index = ignoreFirst ? 0 : -1

  while (++index < lines.length) {
    lines[index] = indentation + lines[index]
  }

  return lines.join('\n')
}

/**
 * Serialize a position.
 *
 * @param {unknown} [value]
 *   Position to serialize.
 * @returns {string}
 *   Serialized position.
 */
function stringifyPosition(value) {
  /** @type {Array<string>} */
  const result = []
  /** @type {Array<string>} */
  const positions = []
  /** @type {Array<string>} */
  const offsets = []

  if (value && typeof value === 'object') {
    point('start' in value ? value.start : undefined)
    point('end' in value ? value.end : undefined)
  }

  if (positions.length > 0) result.push(positions.join('-'))
  if (offsets.length > 0) result.push(offsets.join('-'))

  return result.join(', ')

  /**
   * Add a point.
   *
   * @param {unknown} value
   *   Point to add.
   */
  function point(value) {
    if (value && typeof value === 'object') {
      const line =
        'line' in value && typeof value.line === 'number' ? value.line : 1
      const column =
        'column' in value && typeof value.column === 'number' ? value.column : 1

      positions.push(line + ':' + column)

      if ('offset' in value && typeof value.offset === 'number') {
        offsets.push(String(value.offset || 0))
      }
    }
  }
}

/**
 * Factory to wrap values in ANSI colours.
 *
 * @param {number} open
 *   Opening color code.
 * @param {number} close
 *   Closing color code.
 * @returns {(value: string) => string}
 *   Color `value`.
 */
function ansiColor(open, close) {
  return color

  /**
   * Color `value`.
   *
   * @param {string} value
   *   Value to color.
   * @returns {string}
   *   Colored `value`.
   */
  function color(value) {
    return '\u001B[' + open + 'm' + value + '\u001B[' + close + 'm'
  }
}

/**
 * @param {unknown} value
 * @returns {value is Node}
 */
function isNode(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'type' in value &&
      typeof value.type === 'string'
  )
}

/**
 * @param {unknown} node
 * @returns {node is Array<unknown>}
 */
function isArrayUnknown(node) {
  return Array.isArray(node)
}

/**
 * @template T
 * @param {T} value
 * @returns {T}
 */
function identity(value) {
  return value
}
