/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomStyleElementsList, SelectProps } from './Select.types'

export const DEFAULT_CSS_CLASS_BASE = 'reactSimpleSelect'
export const DEFAULT_NO_OPTIONS_MESSAGE = 'No Options'
export const DEFAULT_PLACEHOLDER = 'Select...'

export const DEFAULT_ASYNC_SEARCH_DEBOUNCE = 500
export const DEFAULT_ASYNC_SEARCHING_TEXT = 'Searching...'

export const DEFAULT_GET_OPTION_KEY = option => option
export const DEFAULT_GET_OPTION_VALUE = option => option
export const DEFAULT_GET_OPTION_LABEL = option => `${option}`

export const TEST_ID_CLEAR_ICON = `${DEFAULT_CSS_CLASS_BASE}-icon-clear`

/**
 * A helper function to generate the full CSS class name
 * on top of the shared base class name.
 *
 * e.g. If base class name is `reactSimpleSelect`, calling this with `__label`
 * would return teh full string `reactSimpleSelect__label`.
 * @param className
 */
export const css = (className: string): string =>
  `${DEFAULT_CSS_CLASS_BASE}${className}`

/**
 * A map of pre-built style names for the default styling for the Select component.
 * This is mostly a convenience to simplify and shorten the application of some
 * fairly long and repetitive names. It also gives a "faux CSS Modules" style
 * naming convention, of being able to apply CSS classes with type completion.
 *
 * In general, these should be used when applying default styles to Select,
 * rather than setting them as strings.
 *
 * Something like:
 * `<div className={styles.active} />`
 */
export const styles: CustomStyleElementsList = {
  active: css('__active'),
  container: css('__container'),
  currentValue: css('__currentValue'),
  disabled: css('__disabled'),
  hidden: css('__hidden'),
  highlighted: css('__highlighted'),
  inputWrapper: css('__inputWrapper'),
  label: css('__label'),
  labelWrapper: css('__labelWrapper'),
  loader: css('__loader'),
  loaderItem: css('__loaderItem'),
  loaderWrapper: css('__loaderWrapper'),
  noOptionsMessage: css('__noOptionsMessage'),
  option: css('__option'),
  optionsWrapper: css('__optionsWrapper'),
  placeholder: css('__placeholder'),
  selectInput: css('__selectInput'),
  selected: css('__selected'),
  svgWrapper: css('__svgWrapper'),
}

/**
 * A simple default search/filter function for the provided set of options.
 * Performs a simple case-insensitive search between the search term
 * and the parsed label of each option in the current set.
 * @param props
 * @param searchString
 */
export const filterOptionsBySearch = (
  props: SelectProps,
  searchString: string,
): any[] => {
  const { options = [] } = props
  const getOptionLabel = props.getOptionLabel ?? DEFAULT_GET_OPTION_LABEL

  const filterOptions = (option: string) =>
    getOptionLabel(option)
      .toLowerCase()
      .includes(searchString.toLowerCase())

  return options.filter(filterOptions)
}
