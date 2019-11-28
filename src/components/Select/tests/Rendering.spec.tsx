import * as React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { cleanup, fireEvent, render } from '@testing-library/react'

import {
  css,
  getUserFullName,
  getUserIdString,
  usersOptions as options,
} from './testUtils'

import { Select, SelectProps } from '../Select'

describe('Select :: Rendering', () => {
  let defaultProps: SelectProps

  beforeEach(() => {
    jest.restoreAllMocks()
    jest.resetAllMocks()
    defaultProps = {
      getOptionKey: jest.fn(getUserIdString),
      getOptionLabel: jest.fn(getUserFullName),
      getOptionValue: jest.fn(getUserIdString),
      onChange: jest.fn(),
      options,
    }
  })

  afterEach(cleanup)

  describe('Searchable', () => {
    it('renders a regular input field when searchable', () => {
      const { container } = render(
        <Select {...defaultProps} searchable={true} />,
      )
      const q = query => container.querySelectorAll(query)

      expect(q('input:not([readonly])')).toHaveLength(1)
      expect(q('input[readonly]')).toHaveLength(0)
    })

    it('renders a "readonly" input field when not searchable', () => {
      const { container } = render(
        <Select {...defaultProps} searchable={false} />,
      )
      const q = query => container.querySelectorAll(query)

      expect(q('input:not([readonly])')).toHaveLength(0)
      expect(q('input[readonly]')).toHaveLength(1)
    })

    it('is searchable by default', () => {
      const { container } = render(<Select {...defaultProps} />)
      const q = query => container.querySelectorAll(query)

      expect(q('input:not([readonly])')).toHaveLength(1)
      expect(q('input[readonly]')).toHaveLength(0)
    })
  })

  describe('Disabled options', () => {
    it.todo('enables all options when no callback is provided')

    it('correctly disables options specified by the callback', () => {
      const { onChange, options } = defaultProps
      const optionsCount = options.length
      const optionIsDisabled = jest.fn((_, idx) => idx === 1)
      const { container } = render(
        <Select {...defaultProps} optionIsDisabled={optionIsDisabled} />,
      )
      const q = query => container.querySelectorAll(query)
      const containerEl = container.querySelector(
        css('__container'),
      ) as HTMLElement

      fireEvent.mouseDown(containerEl)
      // just to be sure the menu opened correctly...
      expect(q(css('__optionsWrapper'))).toHaveLength(1)

      // calls the callback with every provided option
      expect(optionIsDisabled).toHaveBeenCalledTimes(optionsCount)
      const calls = optionIsDisabled.mock.calls
      for (let i = 0; i < optionsCount; i += 1) {
        expect(calls[i][0]).toEqual(options[i])
      }

      // all options are showing, but only one is marked as "disabled"
      expect(q(css('__option'))).toHaveLength(optionsCount)
      const disabledOptions = q(css(['__option', '__disabled']))
      expect(disabledOptions).toHaveLength(1)

      // fire mouseDown THEN click to simulate what actually happens in the real DOM
      // this will trigger the "inside click" hook followed by the actual option selection
      fireEvent.mouseDown(disabledOptions[0])
      fireEvent.click(disabledOptions[0])
      // disables click handling on the disabled option
      expect(onChange).toHaveBeenCalledTimes(0)
    })
  })
})
