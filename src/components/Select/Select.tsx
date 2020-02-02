/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'

import { useHotkeys, useOutsideClick } from '../../hooks'
import { classNames, debounce, Keys } from '../../utils'
import { Loader, SvgWrapper } from './components'
import { ClearX, DownArrowSVG } from './svg'

import {
  DEFAULT_ASYNC_SEARCH_DEBOUNCE,
  DEFAULT_ASYNC_SEARCHING_TEXT,
  DEFAULT_GET_OPTION_KEY,
  DEFAULT_GET_OPTION_LABEL,
  DEFAULT_GET_OPTION_VALUE,
  DEFAULT_NO_OPTIONS_MESSAGE,
  DEFAULT_PLACEHOLDER,
  DEFAULT_TEST_ID_CLEAR_ICON,
  styles,
} from './Select.helpers'
import { initialSelectState, reducer, SelectActionType } from './Select.reducer'
import { SelectProps } from './Select.types'

let nextId = 0

export const Select: React.FC<SelectProps> = React.memo(props => {
  const {
    asyncSearch,
    asyncSearchDebounceTime = DEFAULT_ASYNC_SEARCH_DEBOUNCE,
    asyncSearchMinLength = 1,
    asyncSearchingText = DEFAULT_ASYNC_SEARCHING_TEXT,
    clearable = true,
    disabled = false,
    getOptionKey = DEFAULT_GET_OPTION_KEY,
    getOptionLabel = DEFAULT_GET_OPTION_LABEL,
    getOptionTestId,
    getOptionValue = DEFAULT_GET_OPTION_VALUE,
    label,
    noOptionsMessage = DEFAULT_NO_OPTIONS_MESSAGE,
    onChange,
    options = [],
    optionIsDisabled,
    placeholder = DEFAULT_PLACEHOLDER,
    searchable = true,
    testIds = {},
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

  /**
   * Debounced async search function
   * Will attempt to trigger the async search prop when specified.
   * Any errors caught here will be gracefully ignored, based on the assumption
   * that the error is being properly handled in the parent component.
   */
  const debouncedAsyncSearch = asyncSearch
    ? React.useCallback(
        debounce(async (searchString: string) => {
          let newOptions: any[] = []

          try {
            newOptions = await asyncSearch(searchString)
          } catch (err) {
            // gracefully ignore any errors here;
          } finally {
            dispatch({
              payload: { options: newOptions },
              props,
              type: SelectActionType.asyncSearchEnd,
            })
          }
        }, asyncSearchDebounceTime),
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
    const { value: inputValue = '' } = event?.target

    if (asyncSearch && inputValue.length >= asyncSearchMinLength) {
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
        <div
          className={classNames(styles.labelWrapper)}
          data-testid={testIds.labelWrapper}
        >
          <label
            className={classNames(styles.label)}
            data-testid={testIds.label}
            id={labelId}
          >
            {label}
          </label>
        </div>
      )}

      <div
        aria-labelledby={label ? labelId : undefined}
        className={classNames(styles.container, {
          [styles.disabled]: disabled,
        })}
        data-testid={testIds.container}
        ref={containerRef}
      >
        <div
          className={classNames(styles.inputWrapper, {
            [styles.active]: active,
            [styles.disabled]: disabled,
          })}
          data-testid={testIds.inputWrapper}
        >
          <div
            className={classNames(styles.currentValue, {
              [styles.hidden]: !!inputValue,
              [styles.placeholder]: !value,
            })}
            data-testid={testIds.currentValue}
          >
            {displayValue}
          </div>

          <input
            className={classNames(styles.selectInput, {
              [styles.disabled]: disabled,
            })}
            data-testid={testIds.selectInput}
            disabled={disabled}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            readOnly={!searchable}
            ref={inputRef}
            type="text"
            value={inputValue}
          />

          {searching && <Loader testIds={testIds} />}

          {shouldRenderClearIcon && (
            <SvgWrapper
              onMouseDown={handleClearClick}
              ref={closeIconRef}
              testId={testIds.clearSelection ?? DEFAULT_TEST_ID_CLEAR_ICON}
            >
              <ClearX />
            </SvgWrapper>
          )}

          <SvgWrapper>
            <DownArrowSVG />
          </SvgWrapper>
        </div>

        {menuIsOpen && (
          <div
            className={classNames(styles.optionsWrapper)}
            data-testid={testIds.optionsWrapper}
            ref={menuRef}
          >
            {visibleOptions.length ? (
              visibleOptions.map((option, idx) => {
                const key = getOptionKey ? getOptionKey(option) : idx
                const testId = getOptionTestId && getOptionTestId(option, idx)

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
                    data-testid={testId}
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
                data-testid={testIds.noOptionsMessage}
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
