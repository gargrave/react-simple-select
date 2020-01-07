import * as React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { cleanup, fireEvent, render, wait } from '@testing-library/react'

import { DEFAULT_PLACEHOLDER } from '../Select.helpers'
import {
  css,
  getUserFullName,
  getUserIdString,
  searchResultUserOptions,
  usersOptions as options,
} from './testUtils'

import { Select, SelectProps } from '../Select'

import * as reducerImports from '../Select.reducer' // import all for mocking
const { SelectActionType } = reducerImports

describe('Select :: Search', () => {
  let defaultProps: SelectProps

  beforeEach(() => {
    jest.restoreAllMocks()
    jest.resetAllMocks()
    jest.useFakeTimers()

    defaultProps = {
      clearable: true,
      disabled: false,
      getOptionKey: jest.fn(getUserIdString),
      getOptionLabel: jest.fn(getUserFullName),
      getOptionValue: jest.fn(getUserIdString),
      label: undefined,
      noOptionsMessage: undefined,
      onChange: jest.fn(),
      options: ['a', 'b', 'c'],
      placeholder: DEFAULT_PLACEHOLDER,
      value: options[0],
    }
  })

  afterEach(cleanup)

  describe('Text Input', () => {
    it('shows the "current value" container when there is no search text', () => {
      const { container } = render(<Select {...defaultProps} />)

      const classString = css(['__currentValue', '__hidden'])
      expect(container.querySelectorAll(classString)).toHaveLength(0)
    })

    it('hides the "current value" container when there is search text', () => {
      const { container } = render(<Select {...defaultProps} />)
      const inputEl = container.querySelector('input') as HTMLElement

      const classString = css(['__currentValue', '__hidden'])
      const q = query => container.querySelectorAll(query)
      expect(q(classString)).toHaveLength(0)
      fireEvent.change(inputEl, { target: { value: 'show me the thing' } })
      expect(q(classString)).toHaveLength(1)
    })

    it('clears any existing search text on outside click', () => {
      const { container } = render(<Select {...defaultProps} />)
      const inputEl = container.querySelector('input') as HTMLElement

      const classString = css(['__currentValue', '__hidden'])
      const q = query => container.querySelectorAll(query)
      expect(q(classString)).toHaveLength(0)
      fireEvent.change(inputEl, { target: { value: 'show me the thing' } })
      expect(q(classString)).toHaveLength(1)

      fireEvent.mouseDown(container)
      expect(q(classString)).toHaveLength(0)
    })
  })

  describe('Async search', () => {
    it.only('performs async searching when the prop is present', async () => {
      const reducerSpy = jest.spyOn(reducerImports, 'reducer')
      const searchInput = 'searchString'
      const testTimeout = 1000

      const asyncSearch = jest.fn(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(searchResultUserOptions)
          }, testTimeout)
        })
      })

      const { container, getByText } = render(
        <Select {...defaultProps} asyncSearch={asyncSearch} />,
      )
      const q = query => container.querySelectorAll(query)

      // just to be sure we get the menu open correctly...
      const containerEl = container.querySelector(
        css('__container'),
      ) as HTMLElement
      fireEvent.mouseDown(containerEl)
      expect(q(css('__optionsWrapper'))).toHaveLength(1)

      // TODO: displays default options before a search is performed

      let currentReducerCalls = reducerSpy.mock.calls.length
      expect(asyncSearch).toHaveBeenCalledTimes(0)

      const inputEl = container.querySelector('input') as HTMLElement
      fireEvent.change(inputEl, { target: { value: searchInput } })

      // "async search start" action gets dispatched first
      let lastReducerCall = reducerSpy.mock.calls[currentReducerCalls]
      let lastDispatchedAction = lastReducerCall[1]
      expect(reducerSpy).toHaveBeenCalledTimes(currentReducerCalls + 1)
      expect(lastDispatchedAction.type).toBe(SelectActionType.asyncSearchStart)
      expect(lastDispatchedAction.payload).toEqual({
        inputValue: searchInput,
      })
      currentReducerCalls = reducerSpy.mock.calls.length

      // asyncSearch callback is triggered with the current value
      expect(asyncSearch).toHaveBeenCalledTimes(1)
      expect(asyncSearch).toHaveBeenCalledWith(searchInput)

      await wait(() => {
        jest.advanceTimersByTime(testTimeout)
      })

      // "async search end" action gets dispatched after it completes
      lastReducerCall = reducerSpy.mock.calls[currentReducerCalls]
      lastDispatchedAction = lastReducerCall[1]
      expect(reducerSpy).toHaveBeenCalledTimes(currentReducerCalls + 1)
      expect(lastDispatchedAction.type).toBe(SelectActionType.asyncSearchEnd)
      expect(lastDispatchedAction.payload).toEqual({
        options: searchResultUserOptions,
      })

      // TODO: shows loading state when the search is occurring
      // TODO: hides loading state when search completes

      // uses the returned user set for the options
      searchResultUserOptions.forEach(result => {
        expect(getByText(getUserFullName(result))).toBeInTheDocument()
      })
    })

    it.todo('debounces async search calls by the specified amount')
  })
})
