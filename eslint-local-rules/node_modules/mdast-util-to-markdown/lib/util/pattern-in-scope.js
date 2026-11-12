/**
 * @import {ConstructName, Unsafe} from 'mdast-util-to-markdown'
 */

/**
 * Check if a pattern is in scope based on the current stack of constructs.
 *
 * @param {Array<ConstructName>} stack
 *   Current stack of constructs.
 * @param {Unsafe} pattern
 *   Pattern to check.
 * @returns {boolean}
 *   Whether the pattern is in scope.
 */
export function patternInScope(stack, pattern) {
  return (
    listInScope(stack, pattern.inConstruct, true) &&
    !listInScope(stack, pattern.notInConstruct, false)
  )
}

/**
 * Check if any of the constructs in the list are present in the stack.
 *
 * @param {Array<ConstructName>} stack
 *   Current stack of constructs.
 * @param {Unsafe['inConstruct']} list
 *   List of constructs to check for in the stack.
 * @param {boolean} none
 *   Value to return if the list is empty or not provided.
 * @returns {boolean}
 *   Whether any of the constructs in the list are present in the stack.
 */
function listInScope(stack, list, none) {
  if (typeof list === 'string') {
    list = [list]
  }

  if (!list || list.length === 0) {
    return none
  }

  let index = -1

  while (++index < list.length) {
    if (stack.includes(list[index])) {
      return true
    }
  }

  return false
}
