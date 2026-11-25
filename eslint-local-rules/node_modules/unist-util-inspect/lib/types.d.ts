/**
 * Configuration.
 */
export interface Options {
  /**
   * Whether to use ANSI colors (default: `true` in Node, `false` otherwise).
   */
  color?: boolean | null | undefined
  /**
   * Whether to include positional info (default: `true`).
   */
  showPositions?: boolean | null | undefined
}

/**
 * Info passed around.
 */
export interface State {
  /**
   * Node type.
   */
  bold: Style
  /**
   * Punctuation.
   */
  dim: Style
  /**
   * Non-tree value.
   */
  green: Style
  /**
   * Whether to include positional info.
   */
  showPositions: boolean
  /**
   * Numeric count of node children.
   */
  yellow: Style
}

/**
 * Style a string.
 *
 * @param value
 *   Value to style.
 * @returns
 *   Styled value.
 */
type Style = (value: string) => string
