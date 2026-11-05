/**
 * @import {Callback} from 'trough'
 * @import {VFile} from 'vfile'
 * @import {Context} from './index.js'
 */

import createDebug from 'debug'
import isEmpty from 'is-empty'
import {statistics} from 'vfile-statistics'

const debug = createDebug('unified-engine:file-pipeline:configure')

/**
 * Collect configuration for a file based on the context.
 *
 * @param {Context} context
 *   Context.
 * @param {VFile} file
 *   File.
 * @param {Callback} next
 *   Callback
 * @returns {undefined}
 *   Nothing
 */
export function configure(context, file, next) {
  if (statistics(file).fatal || file.data.unifiedEngineIgnored) {
    next()
    return
  }

  context.configuration.load(
    file.path,
    /**
     * @returns {undefined}
     *   Nothing.
     */
    function (error, configuration) {
      let index = -1

      if (!configuration) {
        next(error)
        return
      }

      // If there was no explicit corresponding config file found
      if (!configuration.filePath && context.settings.ignoreUnconfigured) {
        debug('Ignoring file w/o corresponding config file')
        file.data.unifiedEngineIgnored = true
      } else {
        /* c8 ignore next 1 -- could be missing if a `configTransform` returns weird things. */
        const plugins = configuration.plugins || []

        // Store configuration on the context object.
        debug('Using settings `%j`', configuration.settings)
        context.processor.data('settings', configuration.settings)

        debug('Using `%d` plugins', plugins.length)

        while (++index < plugins.length) {
          const plugin = plugins[index][0]
          let options = plugins[index][1]

          if (options === false) {
            continue
          }

          /* c8 ignore next 6 -- allow for default arguments in es2020. */
          if (
            options === null ||
            (typeof options === 'object' && isEmpty(options))
          ) {
            options = undefined
          }

          debug(
            'Using plugin `%s`, with options `%j`',
            /* c8 ignore next 4 -- V8 is good at inferring names. */
            ('displayName' in plugin ? plugin.displayName : 'name') ||
              plugin.name ||
              'function',
            options
          )

          context.processor.use(plugin, options, context.fileSet)
        }
      }

      next()
    }
  )
}
