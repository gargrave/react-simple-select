/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'

import { useOutsideClick } from '../../hooks'
import { classNames } from '../../utils'
import { SvgWrapper } from './components'
import { ClearX, DownArrowSVG } from './svg'

import {
  DEFAULT_GET_OPTION_KEY,
  DEFAULT_GET_OPTION_LABEL,
  DEFAULT_GET_OPTION_VALUE,
  DEFAULT_NO_OPTIONS_MESSAGE,
  DEFAULT_PLACEHOLDER,
  styles,
  TEST_ID_CLEAR_ICON,
} from './Select.helpers'
import { initialSelectState, reducer, SelectActionType } from './Select.reducer'

let nextId = 0

export type SelectProps = {
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
   * **(Optional)** Custom placeholder text to display when there is no selected value.
   *
   * **Default:** `"Select..."`
   */
  placeholder?: string
  /**
   * **(Optional)** The currently-selected value (if any); if not value is selected, the placeholder text will be shown.
   *
   * **Default:** `undefined`
   */
  value?: any
}

export const Select: React.FC<SelectProps> = React.memo(props => {
  const {
    clearable = true,
    disabled = false,
    getOptionKey = DEFAULT_GET_OPTION_KEY,
    getOptionLabel = DEFAULT_GET_OPTION_LABEL,
    getOptionValue = DEFAULT_GET_OPTION_VALUE,
    label,
    noOptionsMessage = DEFAULT_NO_OPTIONS_MESSAGE,
    onChange,
    options = [],
    placeholder = DEFAULT_PLACEHOLDER,
    value,
  } = props

  const [state, dispatch] = React.useReducer(
    reducer,
    initialSelectState(options),
  )
  const {
    active,
    highlightedIdx,
    inputValue,
    menuIsOpen,
    visibleOptions,
  } = state

  // eslint-disable-next-line no-plusplus
  const id = React.useRef(++nextId) // unique ID for each instance
  const labelId = React.useMemo(
    () => `reactSimpleSelect__label--${id.current}`,
    [id],
  )

  const containerRef = React.useRef<any>(null) // ref to the main wrapper element
  const inputRef = React.useRef<any>(null) // ref to the <input> element
  const menuRef = React.useRef<any>(null) // ref to the options menu/list
  const closeIconRef = React.useRef<any>(null)

  // refs that should prevent the handling of "inside click" callbacks when the menu is open
  // menuRef: this needs to process "click" on its own, and "mouseDown" will cause the menu to disappear too early
  const openMenuMouseDownStopRefs = [menuRef]

  // refs that should prevent the handling of "inside click" callbacks when the menu is closed
  // closeIconRef: this should clear selection, but not open the menu
  const closedMenuMouseDownStopRefs = [closeIconRef]

  /** Text value to display in the "current value" field; either the current value or placeholder text */
  const displayValue = (value && getOptionLabel(value)) || placeholder
  const shouldRenderClearIcon = !disabled && clearable && value

  const focusInputElement = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }

  const setHighlightedOption = (highlightIdx: number) => {
    dispatch({
      payload: { highlightIdx },
      props,
      type: SelectActionType.setHighlighted,
    })
  }

  // callback for handling clicks within the parent element
  // note that this callback is triggered by the `useOutsideClick` hook
  const handleInsideClick = (event: Event) => {
    if (disabled) return

    const refs = menuIsOpen
      ? openMenuMouseDownStopRefs
      : closedMenuMouseDownStopRefs

    const actionType = menuIsOpen
      ? SelectActionType.closeMenu
      : SelectActionType.openMenu

    for (let i = 0; i < refs.length; i += 1) {
      const ref = refs[i].current
      if (ref && ref.contains(event.target)) {
        return
      }
    }

    dispatch({ props, type: actionType })
  }

  const handOutsideClick = (_event: Event) => {
    dispatch({ props, type: SelectActionType.blur })
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      inputValue: event.target.value,
      props,
      type: SelectActionType.inputChange,
    })
  }

  const handleInputFocus = () => {
    if (disabled) return

    dispatch({ props, type: SelectActionType.focus })
  }

  const handleInputBlur = () => {
    dispatch({ props, type: SelectActionType.blur })
  }

  /**
   * A handler simply to prevent the initial 'mousedown' event from stealing focus
   * from the <input>, thus preventing an unwanted blur.
   *
   * The selecting of the option will handle in the 'click' handler, but the browser
   * will fire this AFTER the <input> element blurs, so we need to manually prevent
   * that from happening.
   * @param event
   */
  const handleOptionMouseDown = event => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleOptionMouseOver = (event, idx) => {
    setHighlightedOption(idx)
  }

  /**
   * Handler for clicking on an option in the menu. Unlike the 'mousedown' handler,
   * this one actually does fire the 'onChange' callback with the selected option,
   * and then triggers the 'blur' action itself.
   */
  const handleOptionClick = React.useCallback(
    option => {
      onChange(option)
      dispatch({ props, type: SelectActionType.blur })
    },
    [onChange, props],
  )

  const handleClearClick = React.useCallback(() => {
    onChange(undefined)
    dispatch({ props, type: SelectActionType.blur })
  }, [onChange, props])

  /**
   * Effect handler to focus the <input> element any time the wrapper is activated.
   */
  React.useEffect(() => {
    if (active) {
      setTimeout(focusInputElement, 0)
    }
  }, [active])

  useOutsideClick({
    containerRef,
    onInsideClick: handleInsideClick,
    onOutsideClick: handOutsideClick,
  })

  return (
    <>
      {label && (
        <div className={classNames(styles.labelWrapper)}>
          <label className={classNames(styles.label)} id={labelId}>
            {label}
          </label>
        </div>
      )}

      <div
        aria-labelledby={label ? labelId : undefined}
        className={classNames(styles.container, {
          [styles.disabled]: disabled,
        })}
        ref={containerRef}
      >
        <div
          className={classNames(styles.inputWrapper, {
            [styles.active]: active,
            [styles.disabled]: disabled,
          })}
        >
          <div
            className={classNames(styles.currentValue, {
              [styles.hidden]: !!inputValue,
              [styles.placeholder]: !value,
            })}
          >
            {displayValue}
          </div>

          <input
            className={classNames(styles.selectInput, {
              [styles.disabled]: disabled,
            })}
            disabled={disabled}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            ref={inputRef}
            type="text"
            value={inputValue}
          />

          {shouldRenderClearIcon && (
            <SvgWrapper
              onMouseDown={handleClearClick}
              ref={closeIconRef}
              testId={TEST_ID_CLEAR_ICON}
            >
              <ClearX />
            </SvgWrapper>
          )}

          <SvgWrapper>
            <DownArrowSVG />
          </SvgWrapper>
        </div>

        {menuIsOpen && (
          <div className={classNames(styles.optionsWrapper)} ref={menuRef}>
            {visibleOptions.length ? (
              visibleOptions.map((option, idx) => {
                const key = getOptionKey ? getOptionKey(option) : idx

                const isHighlightedOption = idx === highlightedIdx

                const isSelectedOption =
                  getOptionValue(option) === getOptionValue(value)

                return (
                  <div
                    className={classNames(styles.option, {
                      [styles.highlighted]: isHighlightedOption,
                      [styles.selected]: isSelectedOption,
                    })}
                    key={key}
                    onClick={() => handleOptionClick(option)}
                    onMouseDown={handleOptionMouseDown}
                    onMouseOver={event => handleOptionMouseOver(event, idx)}
                  >
                    {getOptionLabel(option)}
                  </div>
                )
              })
            ) : (
              <div
                className={classNames(styles.option, styles.noOptionsMessage)}
              >
                {noOptionsMessage}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
})
