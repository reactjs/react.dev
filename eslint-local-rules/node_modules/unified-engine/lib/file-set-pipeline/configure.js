/**
 * @import {Settings} from '../index.js'
 */

/**
 * @typedef Context
 *   Context.
 * @property {Configuration | undefined} [configuration]
 *   Configuration.
 */

import {Configuration} from '../configuration.js'

/**
 * @param {Context} context
 *   Context.
 * @param {Settings} settings
 *   Settings.
 * @returns {undefined}
 *   Nothing.
 */
export function configure(context, settings) {
  context.configuration = new Configuration(settings)
}
