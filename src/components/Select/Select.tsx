/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'

import { useHotkeys, useOutsideClick } from '../../hooks'
import { classNames, debounce, Keys } from '../../utils'
import { SvgWrapper } from './components'
import { ClearX, DownArrowSVG } from './svg'

import {
  DEFAULT_ASYNC_SEARCH_DEBOUNCE,
  DEFAULT_ASYNC_SEARCHING_TEXT,
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
   * (Optional) Callback to provide async search capabilities.
   */
  asyncSearch?: (searchString: string) => Promise<any> // TODO: type this correctly
  /**
   * (Optional) Text to display in the menu when an async search call is pending
   * **Default:** "Searching..."
   */
  asyncSearchingText?: string
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
  /**
   * **(Optional)** The currently-selected value (if any); if not value is selected, the placeholder text will be shown.
   *
   * **Default:** `undefined`
   */
  value?: any
}

/**
 * This is the primary component exported from react-simple-select.
 *
 * In case you're not familiar with Styleguidist, here a couple of things you can do:
 *
 * - Clicking on the `Props & Methods` button directly below this text will show you full
 *    docs on all of the props this component can take. (I have done my best to document
 *    them as clearly as possible.)
 * - Clicking on the `View Code` button beneath any example will expand an interactive
 *    code editor which not only shows you the code for the example, but also allows you
 *    to edit it inline, which will hot reload said example. This is a good way to quickly
 *    experience with different props and settings.
 *
 * @visibleName Select
 */
export const Select: React.FC<SelectProps> = React.memo(props => {
  const {
    asyncSearch,
    asyncSearchingText = DEFAULT_ASYNC_SEARCHING_TEXT,
    clearable = true,
    disabled = false,
    getOptionKey = DEFAULT_GET_OPTION_KEY,
    getOptionLabel = DEFAULT_GET_OPTION_LABEL,
    getOptionValue = DEFAULT_GET_OPTION_VALUE,
    label,
    noOptionsMessage = DEFAULT_NO_OPTIONS_MESSAGE,
    onChange,
    options = [],
    optionIsDisabled,
    placeholder = DEFAULT_PLACEHOLDER,
    searchable = true,
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
    searching,
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
    if (inputRef?.current) {
      inputRef.current.focus()
    }
  }

  const blurInputElement = () => {
    if (inputRef?.current) {
      inputRef.current.blur()
    }
  }

  const openMenu = React.useCallback(() => {
    dispatch({ props, type: SelectActionType.openMenu })
  }, [props])

  const closeMenu = React.useCallback(() => {
    dispatch({ props, type: SelectActionType.closeMenu })
    setTimeout(focusInputElement, 0)
  }, [props])

  const blur = React.useCallback(() => {
    dispatch({ props, type: SelectActionType.blur })
    blurInputElement()
  }, [props])

  const debouncedAsyncSearch = asyncSearch
    ? React.useCallback(
        debounce(async (searchString: string) => {
          const result = await asyncSearch(searchString)
          dispatch({
            payload: { options: result },
            props,
            type: SelectActionType.asyncSearchEnd,
          })
        }, DEFAULT_ASYNC_SEARCH_DEBOUNCE),
        [asyncSearch, props],
      )
    : () => void 0

  // ============================================================
  //  Highlight/selection management
  // ============================================================
  const decrementHighlightedOption = React.useCallback(() => {
    dispatch({
      payload: { highlightIncrement: -1 },
      props,
      type: SelectActionType.setHighlighted,
    })
  }, [props])

  const incrementHighlightedOption = React.useCallback(() => {
    dispatch({
      payload: { highlightIncrement: 1 },
      props,
      type: SelectActionType.setHighlighted,
    })
  }, [props])

  const setHighlightedOption = (highlightIdx: number) => {
    dispatch({
      payload: { highlightIdx },
      props,
      type: SelectActionType.setHighlighted,
    })
  }

  const setSelectedOption = React.useCallback(
    option => {
      onChange(option)
      closeMenu()
    },
    [closeMenu, onChange],
  )

  /**
   * Attempts to call the reducer to update the currently-highlighted option.
   * If the currently-highlighted option is disabled, nothing will happen.
   */
  const selectHighlightedOption = React.useCallback(() => {
    const option = visibleOptions[highlightedIdx]
    if (option) {
      if (optionIsDisabled && optionIsDisabled(option, highlightedIdx)) {
        return
      }

      setSelectedOption(option)
    }
  }, [highlightedIdx, optionIsDisabled, setSelectedOption, visibleOptions])

  // ============================================================
  //  Keyboard handlers
  // ============================================================
  const handleUpKey = React.useCallback(() => {
    if (menuIsOpen) {
      decrementHighlightedOption()
    } else {
      openMenu()
    }
  }, [decrementHighlightedOption, menuIsOpen, openMenu])

  const handleDownKey = React.useCallback(() => {
    if (menuIsOpen) {
      incrementHighlightedOption()
    } else {
      openMenu()
    }
  }, [incrementHighlightedOption, menuIsOpen, openMenu])

  const handleEnterKey = React.useCallback(() => {
    selectHighlightedOption()
  }, [selectHighlightedOption])

  const handleEscKey = React.useCallback(() => {
    closeMenu()
  }, [closeMenu])

  const handleTabKey = React.useCallback(
    event => {
      if (menuIsOpen && visibleOptions.length) {
        event.preventDefault()
        event.stopPropagation()
        selectHighlightedOption()
      } else {
        blur()
      }
    },
    [blur, menuIsOpen, selectHighlightedOption, visibleOptions],
  )

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value: inputValue } = event?.target

    if (asyncSearch && inputValue) {
      dispatch({
        payload: { inputValue },
        props,
        type: SelectActionType.asyncSearchStart,
      })

      debouncedAsyncSearch(inputValue)
    } else {
      dispatch({
        payload: { inputValue },
        props,
        type: SelectActionType.inputChange,
      })
    }
  }

  // callback for handling clicks within the parent element
  // note that this callback is triggered by the `useOutsideClick` hook
  const handleInsideClick = (event: Event) => {
    if (disabled) return

    const refs = menuIsOpen
      ? openMenuMouseDownStopRefs
      : closedMenuMouseDownStopRefs

    for (let i = 0; i < refs.length; i += 1) {
      const ref = refs[i].current
      if (ref && ref.contains(event.target)) {
        return
      }
    }

    if (menuIsOpen) {
      closeMenu()
    } else {
      openMenu()
    }
  }

  const handOutsideClick = (_event: Event) => {
    blur()
  }

  const handleInputFocus = () => {
    if (disabled || active) return

    dispatch({ props, type: SelectActionType.focus })
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
      closeMenu()
    },
    [closeMenu, onChange],
  )

  const handleClearClick = React.useCallback(() => {
    onChange(undefined)
    closeMenu()
  }, [closeMenu, onChange])

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

  useHotkeys({
    active,
    handlers: {
      [Keys.ArrowUp]: handleUpKey,
      [Keys.ArrowDown]: handleDownKey,
      [Keys.Enter]: handleEnterKey,
      [Keys.Esc]: handleEscKey,
      [Keys.Tab]: handleTabKey,
    },
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
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            readOnly={!searchable}
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

                const isHighlighted = idx === highlightedIdx
                const isSelected =
                  getOptionValue(option) === getOptionValue(value)
                const isDisabled = optionIsDisabled
                  ? optionIsDisabled(option, idx)
                  : false

                return (
                  <div
                    className={classNames(styles.option, {
                      [styles.highlighted]: isHighlighted,
                      [styles.selected]: isSelected,
                      [styles.disabled]: isDisabled,
                    })}
                    key={key}
                    onClick={
                      isDisabled ? undefined : () => handleOptionClick(option)
                    }
                    onMouseDown={isDisabled ? undefined : handleOptionMouseDown}
                    onMouseOver={
                      isDisabled
                        ? undefined
                        : event => handleOptionMouseOver(event, idx)
                    }
                  >
                    {getOptionLabel(option)}
                  </div>
                )
              })
            ) : (
              <div
                className={classNames(styles.option, styles.noOptionsMessage)}
              >
                {searching ? asyncSearchingText : noOptionsMessage}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
})
