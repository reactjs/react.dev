import supportsColor from 'supports-color'

/** @type {boolean} */
// @ts-expect-error Types are incorrect.
const color = supportsColor.stderr.hasBasic

export {color}
