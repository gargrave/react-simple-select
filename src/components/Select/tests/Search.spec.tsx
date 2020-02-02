import * as React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { cleanup, fireEvent, render, wait } from '@testing-library/react'

import {
  DEFAULT_ASYNC_SEARCH_DEBOUNCE,
  DEFAULT_ASYNC_SEARCHING_TEXT,
  DEFAULT_NO_OPTIONS_MESSAGE,
  DEFAULT_PLACEHOLDER,
} from '../Select.helpers'
import { SelectProps } from '../Select.types'
import {
  css,
  getUserFullName,
  getUserIdString,
  searchResultUserOptions,
  usersOptions as options,
} from './testUtils'

import { Select } from '../Select'

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
      onChange: jest.fn(),
      options,
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
    const debounceTimeout = DEFAULT_ASYNC_SEARCH_DEBOUNCE
    const testTimeout = 100

    it('performs async searching when the prop is present', async () => {
      const searchInput = 'searchString'
      const reducerSpy = jest.spyOn(reducerImports, 'reducer')
      const asyncSearch = jest.fn(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(searchResultUserOptions)
          }, testTimeout)
        })
      })

      const { container, getAllByText, queryAllByText } = render(
        <Select {...defaultProps} asyncSearch={asyncSearch} />,
      )

      // just to be sure we get the menu open correctly...
      const containerEl = container.querySelector(css('__container'))
      fireEvent.mouseDown(containerEl as HTMLElement)
      const optionsWrapper = container.querySelectorAll(css('__optionsWrapper'))
      expect(optionsWrapper).toHaveLength(1)

      // no loader should be showing yet
      let currentReducerCalls = reducerSpy.mock.calls.length
      const inputEl = container.querySelector('input') as HTMLElement
      expect(container.querySelectorAll(css('__loader'))).toHaveLength(0)
      // trigger a search, but not advance timers enough for debounce to occur
      // ensure that the "search start" dispatch occurs, but NOT the actual search
      fireEvent.change(inputEl, { target: { value: 'no' } })
      jest.advanceTimersByTime(debounceTimeout - 1)
      let lastReducerCall = reducerSpy.mock.calls[currentReducerCalls]
      let lastDispatchedAction = lastReducerCall[1]
      expect(reducerSpy).toHaveBeenCalledTimes(currentReducerCalls + 1)
      expect(lastDispatchedAction.type).toBe(SelectActionType.asyncSearchStart)
      expect(lastDispatchedAction.payload).toEqual({ inputValue: 'no' })
      expect(asyncSearch).toHaveBeenCalledTimes(0)
      currentReducerCalls = reducerSpy.mock.calls.length

      // do the same thing again, just to ensure that multiple "short searches" will not trigger the search
      fireEvent.change(inputEl, { target: { value: 'still_no' } })
      jest.advanceTimersByTime(debounceTimeout - 1)
      lastReducerCall = reducerSpy.mock.calls[currentReducerCalls]
      lastDispatchedAction = lastReducerCall[1]
      expect(reducerSpy).toHaveBeenCalledTimes(currentReducerCalls + 1)
      expect(lastDispatchedAction.type).toBe(SelectActionType.asyncSearchStart)
      expect(lastDispatchedAction.payload).toEqual({ inputValue: 'still_no' })
      expect(asyncSearch).toHaveBeenCalledTimes(0)
      currentReducerCalls = reducerSpy.mock.calls.length

      // now do the search again, but this time advance enough for the debounce happen,
      // and ensure the search is handled as expected
      fireEvent.change(inputEl, { target: { value: searchInput } })
      lastReducerCall = reducerSpy.mock.calls[currentReducerCalls]
      lastDispatchedAction = lastReducerCall[1]
      expect(reducerSpy).toHaveBeenCalledTimes(currentReducerCalls + 1)
      expect(lastDispatchedAction.type).toBe(SelectActionType.asyncSearchStart)
      expect(lastDispatchedAction.payload).toEqual({ inputValue: searchInput })
      expect(asyncSearch).toHaveBeenCalledTimes(0)
      currentReducerCalls = reducerSpy.mock.calls.length

      expect(queryAllByText(DEFAULT_NO_OPTIONS_MESSAGE)).toHaveLength(0)
      expect(getAllByText(DEFAULT_ASYNC_SEARCHING_TEXT)).toHaveLength(1)
      expect(container.querySelectorAll(css('__loader'))).toHaveLength(1)

      // asyncSearch callback is triggered with the current value
      jest.advanceTimersByTime(debounceTimeout)
      expect(asyncSearch).toHaveBeenCalledTimes(1)
      expect(asyncSearch).toHaveBeenCalledWith(searchInput)

      // now wait for our mock "API Search" and ensure we handle the results correctly
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

      // uses the returned user set for the options
      searchResultUserOptions.forEach(result => {
        expect(getAllByText(getUserFullName(result))).toHaveLength(1)
      })
      // hides loading state when search completes
      expect(queryAllByText(DEFAULT_ASYNC_SEARCHING_TEXT)).toHaveLength(0)
      expect(container.querySelectorAll(css('__loader'))).toHaveLength(0)
    })

    it('uses a custom debounce time when the prop is specified', async () => {
      const shortDebounceTimeout = 47
      const asyncSearch = jest.fn(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(searchResultUserOptions)
          }, testTimeout)
        })
      })

      const { container, getAllByText } = render(
        <Select
          {...defaultProps}
          asyncSearch={asyncSearch}
          asyncSearchDebounceTime={shortDebounceTimeout}
        />,
      )

      // just to be sure we get the menu open correctly...
      const containerEl = container.querySelector(css('__container'))
      fireEvent.mouseDown(containerEl as HTMLElement)
      const optionsWrapper = container.querySelectorAll(css('__optionsWrapper'))
      expect(optionsWrapper).toHaveLength(1)

      const inputEl = container.querySelector('input') as HTMLElement
      fireEvent.change(inputEl, { target: { value: 'hey there' } })
      jest.advanceTimersByTime(shortDebounceTimeout - 1)
      expect(asyncSearch).toHaveBeenCalledTimes(0)
      jest.advanceTimersByTime(1)
      expect(asyncSearch).toHaveBeenCalledTimes(1)
      expect(asyncSearch).toHaveBeenCalledWith('hey there')

      // now wait for our mock "API Search" and ensure we handle the results correctly
      await wait(() => {
        jest.advanceTimersByTime(testTimeout)
      })

      // uses the returned user set for the options
      searchResultUserOptions.forEach(result => {
        expect(getAllByText(getUserFullName(result))).toHaveLength(1)
      })
    })

    it('does not trigger an async search if the string is too short', async () => {
      const asyncSearch = jest.fn(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(searchResultUserOptions)
          }, testTimeout)
        })
      })

      const { container } = render(
        <Select
          {...defaultProps}
          asyncSearch={asyncSearch}
          asyncSearchMinLength={3}
        />,
      )
      // just to be sure we get the menu open correctly...
      const containerEl = container.querySelector(css('__container'))
      fireEvent.mouseDown(containerEl as HTMLElement)
      const optionsWrapper = container.querySelectorAll(css('__optionsWrapper'))
      expect(optionsWrapper).toHaveLength(1)

      // searching with a string shorter than min length should not trigger search
      const inputEl = container.querySelector('input') as HTMLElement
      fireEvent.change(inputEl, { target: { value: 'hi' } })
      jest.advanceTimersByTime(debounceTimeout)
      await wait(() => {
        jest.advanceTimersByTime(testTimeout)
      })
      expect(asyncSearch).toHaveBeenCalledTimes(0)
      expect(container.querySelectorAll(css('__loader'))).toHaveLength(0)

      // now try again with a long enough string, and ensure it is called
      fireEvent.change(inputEl, { target: { value: 'hey' } })
      jest.advanceTimersByTime(debounceTimeout)
      // loader should show, because this search is long enough
      expect(container.querySelectorAll(css('__loader'))).toHaveLength(1)
      await wait(() => {
        jest.advanceTimersByTime(testTimeout)
      })
      expect(asyncSearch).toHaveBeenCalledTimes(1)
    })

    it('resets options and ignores any pending debounced searches if search is empty', async () => {
      const asyncSearch = jest.fn(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(searchResultUserOptions)
          }, testTimeout)
        })
      })

      const { container, getAllByText } = render(
        <Select {...defaultProps} asyncSearch={asyncSearch} />,
      )

      // just to be sure we get the menu open correctly...
      const containerEl = container.querySelector(css('__container'))
      fireEvent.mouseDown(containerEl as HTMLElement)
      const optionsWrapper = container.querySelectorAll(css('__optionsWrapper'))
      expect(optionsWrapper).toHaveLength(1)

      const inputEl = container.querySelector('input') as HTMLElement
      fireEvent.change(inputEl, { target: { value: 'hi' } })
      jest.advanceTimersByTime(debounceTimeout)
      await wait(() => {
        jest.advanceTimersByTime(testTimeout)
      })

      // confirm that we have our mock search results
      searchResultUserOptions.forEach(result => {
        expect(getAllByText(getUserFullName(result))).toHaveLength(1)
      })

      fireEvent.change(inputEl, { target: { value: '' } })
      jest.advanceTimersByTime(debounceTimeout)
      await wait(() => {
        jest.advanceTimersByTime(testTimeout)
      })

      // all default options are back in the list
      options.forEach(result => {
        expect(getAllByText(getUserFullName(result)).length).toBeGreaterThan(0)
      })
    })

    it('resets to default state if an async search is rejected', async () => {
      const asyncSearch = jest.fn(() => {
        return new Promise((_, reject) => {
          setTimeout(() => {
            reject(searchResultUserOptions)
          }, testTimeout)
        })
      })

      const { container } = render(
        <Select {...defaultProps} asyncSearch={asyncSearch} />,
      )

      // just to be sure we get the menu open correctly...
      const containerEl = container.querySelector(css('__container'))
      fireEvent.mouseDown(containerEl as HTMLElement)
      const optionsWrapper = container.querySelectorAll(css('__optionsWrapper'))
      expect(optionsWrapper).toHaveLength(1)

      // trigger search and wait for the rejection
      const inputEl = container.querySelector('input') as HTMLElement
      fireEvent.change(inputEl, { target: { value: 'hi' } })
      jest.advanceTimersByTime(debounceTimeout)
      await wait(() => {
        jest.advanceTimersByTime(testTimeout)
      })

      // hides the loader and shows the "no options" message
      expect(container.querySelectorAll(css('__loader'))).toHaveLength(0)
      expect(
        container.querySelectorAll(css(['__option', '__noOptionsMessage'])),
      ).toHaveLength(1)
    })
  })
})
