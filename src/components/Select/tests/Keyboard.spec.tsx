import * as React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { cleanup, fireEvent, render, wait } from '@testing-library/react'

import { Keys } from '../../../utils'
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

      expect(reducerSpy).toHaveBeenCalledTimes(currentReducerCalls + 1)
      const lastCall = reducerSpy.mock.calls[currentReducerCalls]
      expect(lastCall[1].type).toBe(SelectActionType.closeMenu)
    })
  })

  describe('Tab key handling', () => {
    it('selects current highlight and prevents default when menu is open', async () => {
      const reducerSpy = jest.spyOn(reducerImports, 'reducer')
      const { onChange } = defaultProps
      const { container } = render(<Select {...defaultProps} />)

      const q = query => container.querySelectorAll(query)
      const containerEl = container.querySelector(
        css('__container'),
      ) as HTMLElement

      fireEvent.mouseDown(containerEl)

      await wait(() => {
        expect(q(css('__optionsWrapper'))).toHaveLength(1)
        expect(q('input:focus')).toHaveLength(1)
      })

      fireEvent.keyDown(container, { code: Keys.ArrowDown })
      const currentReducerCalls = reducerSpy.mock.calls.length
      fireEvent.keyDown(container, { code: Keys.Tab })

      await wait(() => {
        expect(q(css('__optionsWrapper'))).toHaveLength(0)
        expect(q('input:focus')).toHaveLength(1)
        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange).toHaveBeenCalledWith(options[1])
      })

      expect(reducerSpy).toHaveBeenCalledTimes(currentReducerCalls + 1)
      const lastCall = reducerSpy.mock.calls[currentReducerCalls]
      expect(lastCall[1].type).toBe(SelectActionType.closeMenu)
    })

    it('uses default Tab handling when menu is not open', async () => {
      const reducerSpy = jest.spyOn(reducerImports, 'reducer')
      const { container } = render(<Select {...defaultProps} />)

      const q = query => container.querySelectorAll(query)
      const containerEl = container.querySelector(
        css('__container'),
      ) as HTMLElement

      expect(q('input:focus')).toHaveLength(0)
      // click twice, so simulate opening then closing the menu
      fireEvent.mouseDown(containerEl)
      fireEvent.mouseDown(containerEl)

      await wait(() => {
        expect(q(css('__optionsWrapper'))).toHaveLength(0)
        expect(q('input:focus')).toHaveLength(1)
      })

      const currentReducerCalls = reducerSpy.mock.calls.length
      fireEvent.keyDown(container, { code: Keys.Tab })

      await wait(() => {
        expect(q('input:focus')).toHaveLength(0)
        expect(reducerSpy).toHaveBeenCalledTimes(currentReducerCalls + 1)
        const lastCall = reducerSpy.mock.calls[currentReducerCalls]
        expect(lastCall[1].type).toBe(SelectActionType.blur)
      })
    })

    it('uses default Tab handling when menu is open, but there are no valid options', async () => {
      const reducerSpy = jest.spyOn(reducerImports, 'reducer')
      const { container } = render(<Select {...defaultProps} />)

      const q = query => container.querySelectorAll(query)
      const containerEl = container.querySelector(
        css('__container'),
      ) as HTMLElement

      fireEvent.mouseDown(containerEl)

      await wait(() => {
        expect(q(css('__optionsWrapper'))).toHaveLength(1)
        expect(q('input:focus')).toHaveLength(1)
      })

      const inputEl = container.querySelector('input:focus') as HTMLElement
      // enter an obviously invalid search to ensure we have no options in the menu
      fireEvent.change(inputEl, { target: { value: 'zzalskdfzz' } })

      await wait(() => {
        expect(q(css('__noOptionsMessage'))).toHaveLength(1)
      })

      const currentReducerCalls = reducerSpy.mock.calls.length
      fireEvent.keyDown(container, { code: Keys.Tab })

      await wait(() => {
        expect(q('input:focus')).toHaveLength(0)
        expect(reducerSpy).toHaveBeenCalledTimes(currentReducerCalls + 1)
        const lastCall = reducerSpy.mock.calls[currentReducerCalls]
        expect(lastCall[1].type).toBe(SelectActionType.blur)
      })
    })
  })

  describe('Navigation', () => {
    it('increments the current highlighted option on "Down" key', () => {
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

      expect(reducerSpy).toHaveBeenCalledTimes(currentReducerCalls + 1)
      const lastCall = reducerSpy.mock.calls[currentReducerCalls]
      const [_state, action] = lastCall
      expect(action.type).toBe(SelectActionType.setHighlighted)
      expect(action.payload).toEqual({ highlightIncrement: 1 })
    })

    it('decrements the current highlighted option on "Up" key', () => {
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

      expect(reducerSpy).toHaveBeenCalledTimes(currentReducerCalls + 1)
      const lastCall = reducerSpy.mock.calls[currentReducerCalls]
      const [_state, action] = lastCall
      expect(action.type).toBe(SelectActionType.setHighlighted)
      expect(action.payload).toEqual({ highlightIncrement: -1 })
    })
  })
})
