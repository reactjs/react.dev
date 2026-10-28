/**
 * @import {Options, State} from './types.js'
 */

const own = {}.hasOwnProperty

/**
 * Configure a base state w/ an extension.
 *
 * @param {State} base
 *   Base state to configure.
 * @param {Options} extension
 *   Extension to apply.
 * @returns {State}
 *   Given `base`.
 */
export function configure(base, extension) {
  let index = -1
  /** @type {keyof Options} */
  let key

  // First do subextensions.
  if (extension.extensions) {
    while (++index < extension.extensions.length) {
      configure(base, extension.extensions[index])
    }
  }

  for (key in extension) {
    if (own.call(extension, key)) {
      switch (key) {
        case 'extensions': {
          // Empty.
          break
        }

        /* c8 ignore next 4 */
        case 'unsafe': {
          list(base[key], extension[key])
          break
        }

        case 'join': {
          list(base[key], extension[key])
          break
        }

        case 'handlers': {
          map(base[key], extension[key])
          break
        }

        default: {
          // @ts-expect-error: matches.
          base.options[key] = extension[key]
        }
      }
    }
  }

  return base
}

/**
 * Merge arrays from the extension into the base state.
 *
 * @template T
 *   Kind.
 * @param {Array<T>} left
 *   List to merge into.
 * @param {Array<T> | null | undefined} right
 *   List to merge from.
 * @returns {undefined}
 *   Nothing.
 */
function list(left, right) {
  if (right) {
    left.push(...right)
  }
}

/**
 * Merge objects from the extension into the base state.
 *
 * @template T
 *   Kind.
 * @param {Record<string, T>} left
 *   Object to merge into.
 * @param {Record<string, T> | null | undefined} right
 *   Object to merge from.
 * @returns {undefined}
 *   Nothing.
 */
function map(left, right) {
  if (right) {
    Object.assign(left, right)
  }
}
