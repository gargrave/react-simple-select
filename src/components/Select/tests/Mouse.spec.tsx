import * as React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { cleanup, fireEvent, render } from '@testing-library/react'

import { DEFAULT_PLACEHOLDER } from '../Select.helpers'
import { SelectProps } from '../Select.types'
import {
  css,
  getUserFullName,
  getUserIdString,
  usersOptions as options,
} from './testUtils'

import { Select } from '../Select'

import * as reducerImports from '../Select.reducer' // import all for mocking
const { SelectActionType } = reducerImports

describe('Select :: Mouse/Click Interactivity', () => {
  let defaultProps: SelectProps

  beforeEach(() => {
    jest.restoreAllMocks()
    jest.resetAllMocks()
    defaultProps = {
      clearable: true,
      disabled: false,
      getOptionKey: jest.fn(getUserIdString),
      getOptionLabel: jest.fn(getUserFullName),
      getOptionValue: jest.fn(getUserIdString),
      label: undefined,
      noOptionsMessage: undefined,
      onChange: jest.fn(),
      options,
      placeholder: DEFAULT_PLACEHOLDER,
      value: options[0],
    }
  })

  afterEach(cleanup)

  it('shows the options list on mouseDown', () => {
    const { container } = render(<Select {...defaultProps} />)

    const q = query => container.querySelectorAll(query)
    expect(q(css('__optionsWrapper'))).toHaveLength(0)
    // does not render the options wrapper until it is focused
    fireEvent.mouseDown(
      container.querySelector(css('__container')) as HTMLElement,
    )
    expect(q(css('__optionsWrapper'))).toHaveLength(1)
    expect(q(css('__option'))).toHaveLength(options.length)
  })

  it('closes the options list when the wrapper gets mouseDown', () => {
    const { onChange } = defaultProps
    const { container } = render(<Select {...defaultProps} />)
    const wrapper = container.firstChild as HTMLElement

    const q = query => container.querySelectorAll(query)
    fireEvent.mouseDown(wrapper)
    expect(q(css('__optionsWrapper'))).toHaveLength(1)
    fireEvent.mouseDown(wrapper)
    expect(q(css('__optionsWrapper'))).toHaveLength(0)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('closes the options list and calls the callback when an option is clicked', () => {
    const reducerSpy = jest.spyOn(reducerImports, 'reducer')
    const { onChange } = defaultProps
    const { container } = render(<Select {...defaultProps} />)
    const wrapper = container.firstChild as HTMLElement

    const q = query => container.querySelectorAll(query)
    // fire one mouseDown event to open the menu
    fireEvent.mouseDown(wrapper)
    expect(q(css('__optionsWrapper'))).toHaveLength(1)
    // fire mouseDown THEN click to simulate what actually happens in the real DOM
    // this will trigger the "inside click" hook followed by the actual option selection
    fireEvent.mouseDown(q(css('__option'))[1])
    fireEvent.click(q(css('__option'))[1])
    expect(q(css('__optionsWrapper'))).toHaveLength(0)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(options[1])

    // ensure that our "close menu" dispatch call is NOT called when clicking on the clear icon
    const allActionTypes = reducerSpy.mock.calls.map(
      ([_state, action]) => action.type,
    )
    const lastActionType = allActionTypes[allActionTypes.length - 1]
    expect(lastActionType).toBe(SelectActionType.closeMenu)
    expect(allActionTypes.includes(SelectActionType.blur)).toBe(false)
  })

  it('highlights an option on mouse over', () => {
    const reducerSpy = jest.spyOn(reducerImports, 'reducer')
    const { container } = render(<Select {...defaultProps} />)

    const q = query => container.querySelectorAll(query)
    fireEvent.mouseDown(container.firstChild as HTMLElement)
    expect(q(css('__optionsWrapper'))).toHaveLength(1)

    const currentReducerCalls = reducerSpy.mock.calls.length
    fireEvent.mouseOver(q(css('__option'))[0])
    expect(reducerSpy).toHaveBeenCalledTimes(currentReducerCalls + 1)

    // manually inspect the dispatch/reducer call for the correct data
    const lastCall = reducerSpy.mock.calls[currentReducerCalls]
    const [_state, action] = lastCall
    expect(action.type).toBe(SelectActionType.setHighlighted)
    expect(action.payload).toEqual({
      highlightIdx: 0,
    })
  })
})
