export const DEFAULT_CSS_CLASS_BASE = 'reactSimpleSelect'
export const DEFAULT_NO_OPTIONS_MESSAGE = 'No Options'
export const DEFAULT_PLACEHOLDER = 'Select...'

export const DEFAULT_ASYNC_SEARCH_DEBOUNCE = 500
export const DEFAULT_ASYNC_SEARCHING_TEXT = 'Searching...'

export const DEFAULT_GET_OPTION_KEY = option => option
export const DEFAULT_GET_OPTION_VALUE = option => option
export const DEFAULT_GET_OPTION_LABEL = option => `${option}`

export const TEST_ID_CLEAR_ICON = `${DEFAULT_CSS_CLASS_BASE}-icon-clear`

export const css = (className: string): string =>
  `${DEFAULT_CSS_CLASS_BASE}${className}`

export const styles = {
  active: css('__active'),
  container: css('__container'),
  currentValue: css('__currentValue'),
  disabled: css('__disabled'),
  hidden: css('__hidden'),
  highlighted: css('__highlighted'),
  inputWrapper: css('__inputWrapper'),
  label: css('__label'),
  labelWrapper: css('__labelWrapper'),
  noOptionsMessage: css('__noOptionsMessage'),
  option: css('__option'),
  optionsWrapper: css('__optionsWrapper'),
  placeholder: css('__placeholder'),
  selectInput: css('__selectInput'),
  selected: css('__selected'),
  svgWrapper: css('__svgWrapper'),
}
