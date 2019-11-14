import * as React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { cleanup, fireEvent, render } from '@testing-library/react'

import {
  DEFAULT_NO_OPTIONS_MESSAGE,
  DEFAULT_PLACEHOLDER,
  TEST_ID_CLEAR_ICON,
} from './Select.helpers'
import {
  css,
  getUserFullName,
  getUserIdString,
  usersOptions as options,
} from './tests/testUtils'

import { Select, SelectProps } from './Select'

import * as reducerImports from './Select.reducer' // import all for mocking
const { SelectActionType } = reducerImports

describe('Select', () => {
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

  describe('Conditional styling', () => {
    describe('Placeholder', () => {
      it('applies a "placeholder" class when there is no value', () => {
        const { container } = render(<Select {...defaultProps} value={null} />)

        const q = query => container.querySelectorAll(query)
        const len = q(css('__placeholder')).length
        expect(len).toBeGreaterThan(0)
      })

      it('does not apply a "placeholder" class when there is a value', () => {
        const { container } = render(<Select {...defaultProps} />)

        const q = query => container.querySelectorAll(query)
        expect(q(css('__placeholder'))).toHaveLength(0)
      })
    })
  })

  describe('Disabled state', () => {
    it('has no "disabled" state by default', () => {
      const { container } = render(<Select {...defaultProps} />)

      const q = query => container.querySelectorAll(query)
      expect(q(css('__disabled'))).toHaveLength(0)
      expect(q('input[disabled]')).toHaveLength(0)
    })

    it('sets "disabled" state when the prop is true', () => {
      const { container, queryByTestId } = render(
        <Select {...defaultProps} disabled={true} />,
      )

      const q = query => container.querySelectorAll(query)
      // applies "disabled" styling and attrs
      expect(q(css('__disabled')).length).toBeGreaterThan(0)
      expect(q('input[disabled]')).toHaveLength(1)

      // does not open the menu when clicked
      expect(q('.optionsWrapper')).toHaveLength(0)
      fireEvent.mouseDown(
        container.querySelector(css('__container')) as HTMLElement,
      )
      expect(q('.optionsWrapper')).toHaveLength(0)
      expect(q('.option')).toHaveLength(0)

      // does not render the "clear" button
      expect(queryByTestId(TEST_ID_CLEAR_ICON)).not.toBeInTheDocument()
    })
  })

  describe('"No Options" messaging', () => {
    it('displays a default "no options" message when options list is empty', () => {
      const { container, getByText, queryByText } = render(
        <Select {...defaultProps} options={[]} />,
      )

      const q = query => container.querySelectorAll(query)
      expect(queryByText(DEFAULT_NO_OPTIONS_MESSAGE)).not.toBeInTheDocument()
      expect(q(css('__noOptionsMessage'))).toHaveLength(0)
      fireEvent.mouseDown(
        container.querySelector(css('__container')) as HTMLElement,
      )
      expect(getByText(DEFAULT_NO_OPTIONS_MESSAGE)).toBeInTheDocument()
      expect(q(css('__noOptionsMessage'))).toHaveLength(1)
    })

    it('displays a custom "no options" message when provided', () => {
      const noOptionsMsg = "You ain't go no options, fool"
      const { container, getByText, queryByText } = render(
        <Select
          {...defaultProps}
          noOptionsMessage={noOptionsMsg}
          options={[]}
        />,
      )

      const q = query => container.querySelectorAll(query)
      expect(queryByText(noOptionsMsg)).not.toBeInTheDocument()
      expect(q(css('__noOptionsMessage'))).toHaveLength(0)
      fireEvent.mouseDown(
        container.querySelector(css('__container')) as HTMLElement,
      )
      expect(getByText(noOptionsMsg)).toBeInTheDocument()
      expect(q(css('__noOptionsMessage'))).toHaveLength(1)
    })
  })

  describe('Placeholder', () => {
    it('displays the "value" prop instead of a placeholder', () => {
      const { placeholder = DEFAULT_PLACEHOLDER } = defaultProps
      const value = options[0]
      const label = getUserFullName(value)
      const { getByText, queryByText } = render(
        <Select {...defaultProps} value={value} />,
      )

      expect(queryByText(placeholder)).not.toBeInTheDocument()
      expect(getByText(label)).toBeInTheDocument()
    })

    it('displays a default placeholder text when there is no current "value"', () => {
      const { placeholder = DEFAULT_PLACEHOLDER } = defaultProps
      const { getByText } = render(<Select {...defaultProps} value={null} />)

      expect(getByText(placeholder)).toBeInTheDocument()
    })

    it('displays a custom placeholder text when one is provided and there is no current "value"', () => {
      const placeholder = 'This is a custom placeholder!'
      const { getByText } = render(
        <Select {...defaultProps} placeholder={placeholder} value={null} />,
      )

      expect(getByText(placeholder)).toBeInTheDocument()
    })
  })

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

  describe('Label', () => {
    it('renders a label with the specified text', () => {
      const labelTxt = 'This is the label'
      const { container, getByText } = render(
        <Select {...defaultProps} label={labelTxt} />,
      )

      const q = query => container.querySelectorAll(query)
      expect(q(css(`__labelWrapper`))).toHaveLength(1)
      expect(q(`label${css('__label')}`)).toHaveLength(1)
      expect(getByText(labelTxt)).toBeInTheDocument()
      expect(container.querySelector(css('__container'))).toHaveAttribute(
        'aria-labelledby',
      )
    })

    it('does not render a label if no prop is provided', () => {
      const { container } = render(<Select {...defaultProps} />)

      const q = query => container.querySelectorAll(query)
      expect(q(css(`__labelWrapper`))).toHaveLength(0)
      expect(q('label')).toHaveLength(0)
      expect(container.querySelector(css('__container'))).not.toHaveAttribute(
        'aria-labelledby',
      )
    })
  })

  describe('Clearable', () => {
    it('renders a clickable "clear" icon by default when a selected value is present', () => {
      const reducerSpy = jest.spyOn(reducerImports, 'reducer')
      const { onChange } = defaultProps
      const { getAllByTestId } = render(<Select {...defaultProps} />)
      const clearIcon = getAllByTestId(TEST_ID_CLEAR_ICON)

      expect(clearIcon).toHaveLength(1)
      expect(onChange).toHaveBeenCalledTimes(0)
      expect(reducerSpy).toHaveBeenCalledTimes(0)
      fireEvent.mouseDown(clearIcon[0])
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(undefined)

      // ensure that our "open menu" dispatch call is NOT called when clicking on the clear icon
      const allActionTypes = reducerSpy.mock.calls.map(
        ([_state, action]) => action.type,
      )
      const lastActionType = allActionTypes[allActionTypes.length - 1]
      expect(allActionTypes.includes(SelectActionType.openMenu)).toBe(false)
      expect(lastActionType).toBe(SelectActionType.closeMenu)
    })

    it('does not render a "clear" icon when there is no selection', () => {
      const { queryByTestId } = render(
        <Select {...defaultProps} value={undefined} />,
      )
      expect(queryByTestId(TEST_ID_CLEAR_ICON)).not.toBeInTheDocument()
    })

    it('never renders a "clear" icon when prop is false', () => {
      const { queryByTestId } = render(
        <Select {...defaultProps} clearable={false} />,
      )
      expect(queryByTestId(TEST_ID_CLEAR_ICON)).not.toBeInTheDocument()
    })
  })
})
