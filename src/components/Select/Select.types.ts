/* eslint-disable @typescript-eslint/no-explicit-any */
type RssElementsList = {
  active?: any
  container?: any
  currentValue?: any
  disabled?: any
  hidden?: any
  highlighted?: any
  inputWrapper?: any
  label?: any
  labelWrapper?: any
  loader?: any
  loaderItem?: any
  loaderWrapper?: any
  noOptionsMessage?: any
  option?: any
  optionsWrapper?: any
  placeholder?: any
  selectInput?: any
  selected?: any
  svgWrapper?: any
}

export type CustomStyleElementsList = RssElementsList

export type TestIdElementsList = Pick<
  RssElementsList,
  | 'container'
  | 'currentValue'
  | 'inputWrapper'
  | 'label'
  | 'labelWrapper'
  | 'loader'
  | 'loaderWrapper'
  | 'noOptionsMessage'
  | 'optionsWrapper'
  | 'selectInput'
  // svgWrapper''
>

export type AsyncSearchProps = {
  /**
   * (Optional) Callback to provide async search capabilities.
   */
  asyncSearch?: (searchString: string) => Promise<any>
  /**
   * (Optional) Override setting for the debounce time (in ms) that will occur before
   * an async search is triggered.
   *
   * This is useful for preventing triggering multiple instantaneous searching,
   * and thus give your users time to type before triggering the search.
   *
   * **Default**: 500
   */
  asyncSearchDebounceTime?: number
  /**
   * (Optional) Specify a minimum length requirement for a search string before
   * the async search prop is triggered.
   *
   * **Default**: 1
   */
  asyncSearchMinLength?: number
  /**
   * (Optional) Text to display in the menu when an async search call is pending
   *
   * **Default**: "Searching..."
   */
  asyncSearchingText?: string
}

export type SelectProps = AsyncSearchProps & {
  /**
   * **(Optional)** Whether a "clear" button should be rendered, allowing the user to clear any current selection.
   *
   * **Default:** `true`
   */
  clearable?: boolean
  /**
   * **(Optional)** Whether the select element should be disabled. When true, this will prevent any user interaction
   * and apply "disabled" style classes.
   *
   * **Default:** `false`
   */
  disabled?: boolean
  /**
   * **(Optional)** Custom parsing function for specifying how to generate the React key for
   * each option. By default, this will simply be the option's index in the options list, which
   * is generally not the best way to handle React keys. Ideally, if you options have reliably
   * unique IDs, those are a safe bet for these keys.
   *
   * For example, if your options are users with reliably unique IDs, you might specify this function as:
   *
   * <pre>(user: User) => user.id</pre>
   */
  getOptionKey?: (option: any) => string
  /**
   * **(Optional)** A function to parse data-testid attributes for each individual option.
   * This is useful to set a test ID that is unique for every option.
   *
   * Note that there is no default value for this. If nothing is provided
   * for this prop, no data-testid attribute will be applied to options.
   * @param option
   * @param idx
   */
  getOptionTestId?: (option: any, idx: number) => string
  /**
   * **(Optional)** Custom parsing function for specifying how to render the labels that will be
   * shown for each option in the dropdown. By default, this will be simply be a stringified version
   * of the option, so if your options are anything aside from simple numbers or strings, you will
   * probably want to specify something here.
   *
   * For example, if your options are users, you might specify this function as:
   *
   * <pre>(user: User) => `` `${user.firstName} ${user.lastName}` ``</pre>
   */
  getOptionLabel?: (option: any) => string
  /**
   * **(Optional)** Custom parsing function for specifying what the select component will pass back
   * to the `onChange` handler when a selection is changed. By default, this will simply
   * be the full option, whether it be an object, string, or whatever.
   *
   * In most cases, you probably will not need to utilize this, since you can always parse the
   * data however you need to within your `onChange` handler.
   */
  getOptionValue?: (option: any) => any
  /**
   * **(Optional)** Text to display in a <label> element
   * Note that this uses a native HTML <label> element and applies the `aria-labelledby`
   * attribute to the main wrapper element, neither of which will be present if left blank.
   * Thus, from an accessibility perspective, it is generally recommended to supply a value here.
   *
   * **Default:** `undefined`
   */
  label?: string
  /**
   * **(Optional)** Custom text to show when there are no valid options (e.g. a search yields no results)
   *
   * **Default:** `"No Options"`
   */
  noOptionsMessage?: string
  /**
   * Callback for handling a selection change.
   * The parent component can handle this however it wants, but generally speaking, it should
   * at least trigger an update to the `value` prop.
   */
  onChange: (option: any) => void
  /**
   * The list of options to display in the menu
   * These can be any shape of data you wish, but do note that by default, the select will treat
   * these very naively, where the label value (what is rendered in the dropdown) is a direct "stringified"
   * version of the data, and the value passed back on change is the full option.
   *
   * If you need to customize this behavior, you will want to specify custom parsers in the `getOption...` props.
   */
  options: any[]
  /**
   * **(Optional)** Callback for specifying if an option should be disabled. An option that is disabled
   * will have additional styling applied to show it as disabled, and it will not be selectable.
   *
   * **Default:** `undefined` (i.e. all options will be enabled)
   */
  optionIsDisabled?: (option: any, idx: number) => boolean
  /**
   * **(Optional)** Custom placeholder text to display when there is no selected value.
   *
   * **Default:** `"Select..."`
   */
  placeholder?: string
  /**
   * **(Optional)** Whether the input should accept text input to filter options.
   * Currently, this a simple exact-match search (i.e. no fuzzy search capabilities).
   *
   * **Default:** true
   */
  searchable?: boolean
  testIds?: TestIdElementsList
  /**
   * **(Optional)** The currently-selected value (if any); if not value is selected, the placeholder text will be shown.
   *
   * **Default:** `undefined`
   */
  value?: any
}
