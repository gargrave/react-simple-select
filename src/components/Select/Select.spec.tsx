import * as React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { cleanup, fireEvent, render } from '@testing-library/react'

import {
  css as cssHelper,
  DEFAULT_NO_OPTIONS_MESSAGE,
  DEFAULT_PLACEHOLDER,
} from './Select.helpers'
import { Select, SelectProps } from './Select'

const cssMap = (className: string): string => `.${cssHelper(className)}`
const css = (classNames: string | string[]): string =>
  (Array.isArray(classNames)
    ? classNames.map(cssMap)
    : [classNames].map(cssMap)
  ).join('')

const options = [
  { id: 1, firstName: 'Larry', lastName: 'McDonald' },
  { id: 2, firstName: 'Lacey', lastName: 'Struthers' },
  { id: 3, firstName: 'Sandra', lastName: 'Callahan' },
  { id: 4, firstName: 'Billy', lastName: 'Pickles' },
  { id: 5, firstName: 'Davie', lastName: 'McBavie' },
]

const userIdString = user => `${user.id}`
const userFullName = user => `${user.firstName} ${user.lastName}`

describe('Select', () => {
  let defaultProps: SelectProps

  beforeEach(() => {
    jest.resetAllMocks()
    defaultProps = {
      getOptionKey: jest.fn(userIdString),
      getOptionLabel: jest.fn(userFullName),
      getOptionValue: jest.fn(userIdString),
      label: undefined,
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
      const { container } = render(<Select {...defaultProps} disabled={true} />)

      const q = query => container.querySelectorAll(query)
      // applies "disabled" styling and attrs
      expect(q(css('__disabled')).length).toBeGreaterThan(0)
      expect(q('input[disabled]')).toHaveLength(1)

      // does not open the menu when clicked
      expect(q('.optionsWrapper')).toHaveLength(0)
      fireEvent.mouseDown(container.querySelector(
        css('__container'),
      ) as HTMLElement)
      expect(q('.optionsWrapper')).toHaveLength(0)
      expect(q('.option')).toHaveLength(0)
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
      fireEvent.mouseDown(container.querySelector(
        css('__container'),
      ) as HTMLElement)
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
      fireEvent.mouseDown(container.querySelector(
        css('__container'),
      ) as HTMLElement)
      expect(getByText(noOptionsMsg)).toBeInTheDocument()
      expect(q(css('__noOptionsMessage'))).toHaveLength(1)
    })
  })

  describe('Placeholder', () => {
    it('displays the "value" prop instead of a placeholder', () => {
      const { placeholder = DEFAULT_PLACEHOLDER } = defaultProps
      const value = options[0]
      const label = userFullName(value)
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

  describe('Interactivity', () => {
    it('shows the options list when clicked', () => {
      const { container } = render(<Select {...defaultProps} />)

      const q = query => container.querySelectorAll(query)
      expect(q(css('__optionsWrapper'))).toHaveLength(0)
      // does not render the options wrapper until it is focused
      fireEvent.mouseDown(container.querySelector(
        css('__container'),
      ) as HTMLElement)
      expect(q(css('__optionsWrapper'))).toHaveLength(1)
      expect(q(css('__option'))).toHaveLength(options.length)
    })

    it('closes the options list when the wrapper is clicked', () => {
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
      const { onChange } = defaultProps
      const { container } = render(<Select {...defaultProps} />)
      const wrapper = container.firstChild as HTMLElement

      const q = query => container.querySelectorAll(query)
      fireEvent.mouseDown(wrapper)
      expect(q(css('__optionsWrapper'))).toHaveLength(1)
      fireEvent.click(q(css('__option'))[1])
      expect(q(css('__optionsWrapper'))).toHaveLength(0)
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(options[1])
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
})
