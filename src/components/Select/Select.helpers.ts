export const DEFAULT_CSS_CLASS_BASE = 'reactSimpleSelect'
export const DEFAULT_NO_OPTIONS_MESSAGE = 'No Options'
export const DEFAULT_PLACEHOLDER = 'Select...'

export const DEFAULT_GET_OPTION_VALUE = option => option
export const DEFAULT_GET_OPTION_LABEL = option => `${option}`

export const css = (className: string): string =>
  `${DEFAULT_CSS_CLASS_BASE}${className}`
