import * as React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { cleanup, fireEvent, render } from '@testing-library/react'

import {
  css as cssHelper,
  DEFAULT_NO_OPTIONS_MESSAGE,
  DEFAULT_PLACEHOLDER,
  TEST_ID_CLEAR_ICON,
} from './Select.helpers'
import * as reducerImports from './Select.reducer'
import { SelectActionType } from './Select.reducer'

import { Select, SelectProps } from './Select'
import { Keys } from '../../utils'

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
    jest.restoreAllMocks()
    jest.resetAllMocks()
    defaultProps = {
      clearable: true,
      disabled: false,
      getOptionKey: jest.fn(userIdString),
      getOptionLabel: jest.fn(userFullName),
      getOptionValue: jest.fn(userIdString),
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

  describe('Mouse/Click Interactivity', () => {
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
      expect(allActionTypes.includes(SelectActionType.closeMenu)).toBe(false)
      expect(lastActionType).toBe(SelectActionType.blur)
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
      expect(lastActionType).toBe(SelectActionType.blur)
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

  describe('Keyboard', () => {
    it('increments the current selection on down key', () => {
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

    it('decrements the current selection on up key', () => {
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
