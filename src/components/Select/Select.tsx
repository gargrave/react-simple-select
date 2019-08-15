/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import { memo } from 'react'

import { classNames } from '../../utils'

import { useOutsideClick } from '../../hooks'
import {
  DEFAULT_GET_OPTION_LABEL,
  DEFAULT_GET_OPTION_VALUE,
  DEFAULT_NO_OPTIONS_MESSAGE,
  DEFAULT_PLACEHOLDER,
} from './Select.helpers'
import { initialSelectState, reducer, SelectActionType } from './Select.reducer'

import styles from './Select.module.scss'

export type SelectProps = {
  getOptionKey?: (option: any) => string
  getOptionLabel?: (option: any) => string
  getOptionValue?: (option: any) => any
  noOptionsMessage?: string
  onChange: (option: any) => void
  /** The list of options to display in the menu */
  options: any[]
  placeholder?: string
  value?: any
}

export const Select: React.FC<SelectProps> = memo(props => {
  const {
    getOptionKey,
    getOptionLabel = DEFAULT_GET_OPTION_LABEL,
    getOptionValue = DEFAULT_GET_OPTION_VALUE,
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
  const { active, inputValue, menuIsOpen, visibleOptions } = state

  const containerRef = React.useRef<any>(null) // ref to the main wrapper element
  const inputRef = React.useRef<any>(null) // ref to the <input> element
  const menuRef = React.useRef<any>(null) // ref to the options menu/list

  const displayValue = (value && getOptionLabel(value)) || placeholder

  const focusInputElement = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleInsideClick = (event: Event) => {
    if (menuIsOpen) {
      // we don't want to close the menu if an option was clicked,
      // as that will prevent on the "onChange()" callback from triggering
      const isMenuClick = menuRef.current.contains(event.target)
      if (!isMenuClick) {
        dispatch({ props, type: SelectActionType.closeMenu })
      }
    } else {
      dispatch({ props, type: SelectActionType.openMenu })
    }
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
    <div className={classNames(styles.select)} ref={containerRef}>
      <div
        className={classNames(styles.inputWrapper, { [styles.active]: active })}
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
          className={classNames(styles.selectInput)}
          onBlur={handleInputBlur}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          ref={inputRef}
          type="text"
          value={inputValue}
        />

        <svg
          height="20"
          width="20"
          viewBox="0 0 20 20"
          aria-hidden="true"
          focusable="false"
          className="css-tj5bde-Svg"
        >
          <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" />
        </svg>
      </div>

      {menuIsOpen && (
        <div className={classNames(styles.optionsWrapper)} ref={menuRef}>
          {visibleOptions.length ? (
            visibleOptions.map((option, idx) => {
              const key = getOptionKey ? getOptionKey(option) : idx
              const isSelectedOption =
                getOptionValue(option) === getOptionValue(value)

              return (
                <div
                  className={classNames(styles.option, {
                    [styles.selected]: isSelectedOption,
                  })}
                  key={key}
                  onClick={() => handleOptionClick(option)}
                  onMouseDown={handleOptionMouseDown}
                >
                  {getOptionLabel(option)}
                </div>
              )
            })
          ) : (
            <div className={classNames(styles.option, styles.noOptionsMessage)}>
              {noOptionsMessage}
            </div>
          )}
        </div>
      )}
    </div>
  )
})

/**
 * This is a Select component!
 */
export default memo(Select)
