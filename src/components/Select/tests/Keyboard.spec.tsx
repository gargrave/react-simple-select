import * as React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { cleanup, fireEvent, render } from '@testing-library/react'

import { Keys } from '../../../utils'
import { DEFAULT_PLACEHOLDER } from '../Select.helpers'
import {
  css,
  getUserFullName,
  getUserIdString,
  usersOptions as options,
} from './testUtils'

import { Select, SelectProps } from '../Select'

import * as reducerImports from '../Select.reducer' // import all for mocking
const { SelectActionType } = reducerImports

describe('Select :: Keyboard', () => {
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

  describe('Open/close menu', () => {
    it('closes the menu with no selection on "Escape" key', () => {
      const reducerSpy = jest.spyOn(reducerImports, 'reducer')
      const { onChange } = defaultProps
      const { container } = render(<Select {...defaultProps} />)

      const q = query => container.querySelectorAll(query)
      const containerEl = container.querySelector(
        css('__container'),
      ) as HTMLElement

      fireEvent.mouseDown(containerEl)
      // just to be sure the menu opened correctly...
      expect(q(css('__optionsWrapper'))).toHaveLength(1)

      const currentReducerCalls = reducerSpy.mock.calls.length
      fireEvent.keyDown(container, { code: Keys.Esc })

      expect(q(css('__optionsWrapper'))).toHaveLength(0)
      expect(onChange).toHaveBeenCalledTimes(0)

      // manually inspect the dispatch/reducer call for the correct data
      expect(reducerSpy).toHaveBeenCalledTimes(currentReducerCalls + 1)
      const lastCall = reducerSpy.mock.calls[currentReducerCalls]
      const [_state, action] = lastCall
      expect(action.type).toBe(SelectActionType.closeMenu)
    })

    it('opens the menu on "Up" and "Down" key presses', () => {
      const reducerSpy = jest.spyOn(reducerImports, 'reducer')
      const { container } = render(<Select {...defaultProps} />)

      const q = query => container.querySelectorAll(query)
      const containerEl = container.querySelector(
        css('__container'),
      ) as HTMLElement

      // fireEvent.mouseDown(containerEl)
      fireEvent.focus(container.querySelector('input') as HTMLElement)
      expect(q(css('__optionsWrapper'))).toHaveLength(0)

      let prevReducerCalls = reducerSpy.mock.calls.length
      fireEvent.keyDown(containerEl, { code: Keys.ArrowUp })
      expect(q(css('__optionsWrapper'))).toHaveLength(1)

      expect(reducerSpy).toHaveBeenCalledTimes(prevReducerCalls + 1)
      let lastCall = reducerSpy.mock.calls[prevReducerCalls]
      expect(lastCall[1].type).toBe(SelectActionType.openMenu)

      // now close the menu and do it again with "down"
      fireEvent.keyDown(container, { code: Keys.Esc })
      expect(q(css('__optionsWrapper'))).toHaveLength(0)
      fireEvent.focus(container.querySelector('input') as HTMLElement)

      prevReducerCalls = reducerSpy.mock.calls.length

      fireEvent.keyDown(containerEl, { code: Keys.ArrowDown })
      expect(q(css('__optionsWrapper'))).toHaveLength(1)

      expect(reducerSpy).toHaveBeenCalledTimes(prevReducerCalls + 1)
      lastCall = reducerSpy.mock.calls[prevReducerCalls]
      expect(lastCall[1].type).toBe(SelectActionType.openMenu)
    })

    it('closes the menu and updates selection on "Enter" key', () => {
      const reducerSpy = jest.spyOn(reducerImports, 'reducer')
      const { onChange } = defaultProps
      const { container } = render(<Select {...defaultProps} />)

      const q = query => container.querySelectorAll(query)
      const containerEl = container.querySelector(
        css('__container'),
      ) as HTMLElement

      fireEvent.mouseDown(containerEl)
      // just to be sure the menu opened correctly...
      expect(q(css('__optionsWrapper'))).toHaveLength(1)

      fireEvent.keyDown(container, { code: Keys.ArrowDown })
      const currentReducerCalls = reducerSpy.mock.calls.length
      fireEvent.keyDown(container, { code: Keys.Enter })

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(options[1])

      // manually inspect the dispatch/reducer call for the correct data
      expect(reducerSpy).toHaveBeenCalledTimes(currentReducerCalls + 1)
      const lastCall = reducerSpy.mock.calls[currentReducerCalls]
      expect(lastCall[1].type).toBe(SelectActionType.closeMenu)
    })
  })

  describe('Navigation', () => {
    it('increments the current highlighted option on down key', () => {
      const reducerSpy = jest.spyOn(reducerImports, 'reducer')
      const { container } = render(<Select {...defaultProps} />)

      const q = query => container.querySelectorAll(query)
      const containerEl = container.querySelector(
        css('__container'),
      ) as HTMLElement

      fireEvent.mouseDown(containerEl)
      // just to be sure the menu opened correctly...
      expect(q(css('__optionsWrapper'))).toHaveLength(1)

      const currentReducerCalls = reducerSpy.mock.calls.length
      fireEvent.keyDown(container, { code: Keys.ArrowDown })

      // manually inspect the dispatch/reducer call for the correct data
      expect(reducerSpy).toHaveBeenCalledTimes(currentReducerCalls + 1)
      const lastCall = reducerSpy.mock.calls[currentReducerCalls]
      const [_state, action] = lastCall
      expect(action.type).toBe(SelectActionType.setHighlighted)
      expect(action.payload).toEqual({ highlightIncrement: 1 })
    })

    it('decrements the current highlighted option on up key', () => {
      const reducerSpy = jest.spyOn(reducerImports, 'reducer')
      const { container } = render(<Select {...defaultProps} />)

      const q = query => container.querySelectorAll(query)
      const containerEl = container.querySelector(
        css('__container'),
      ) as HTMLElement

      fireEvent.mouseDown(containerEl)
      // just to be sure the menu opened correctly...
      expect(q(css('__optionsWrapper'))).toHaveLength(1)

      const currentReducerCalls = reducerSpy.mock.calls.length
      fireEvent.keyDown(container, { code: Keys.ArrowUp })

      // manually inspect the dispatch/reducer call for the correct data
      expect(reducerSpy).toHaveBeenCalledTimes(currentReducerCalls + 1)
      const lastCall = reducerSpy.mock.calls[currentReducerCalls]
      const [_state, action] = lastCall
      expect(action.type).toBe(SelectActionType.setHighlighted)
      expect(action.payload).toEqual({ highlightIncrement: -1 })
    })
  })
})
