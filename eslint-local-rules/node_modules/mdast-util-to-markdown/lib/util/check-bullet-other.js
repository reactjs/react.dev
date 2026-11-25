/**
 * @import {Options, State} from 'mdast-util-to-markdown'
 */

import {checkBullet} from './check-bullet.js'

/**
 * Checks the preferred alternate list bullet option.
 *
 * @param {State} state
 *   Info passed around.
 * @returns {Exclude<Options['bullet'], null | undefined>}
 *   Preferred alternate list bullet.
 */
export function checkBulletOther(state) {
  const bullet = checkBullet(state)
  const bulletOther = state.options.bulletOther

  if (!bulletOther) {
    return bullet === '*' ? '-' : '*'
  }

  if (bulletOther !== '*' && bulletOther !== '+' && bulletOther !== '-') {
    throw new Error(
      'Cannot serialize items with `' +
        bulletOther +
        '` for `options.bulletOther`, expected `*`, `+`, or `-`'
    )
  }

  if (bulletOther === bullet) {
    throw new Error(
      'Expected `bullet` (`' +
        bullet +
        '`) and `bulletOther` (`' +
        bulletOther +
        '`) to be different'
    )
  }

  return bulletOther
}
