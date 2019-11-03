import '@testing-library/jest-dom/extend-expect'

import {
  initialSelectState,
  reducer,
  SelectActionType,
  SelectState,
} from './Select.reducer'

describe('Select Reducer', () => {
  let state: SelectState

  describe('initial state', () => {
    it('initializes state correctly with no args', () => {
      const result = initialSelectState()

      expect(result).toEqual({
        active: false,
        highlightedOption: undefined,
        inputValue: '',
        menuIsOpen: false,
        visibleOptions: [],
      })
    })

    it('initializes state correctly with custom args', () => {
      const options = ['a', 'b', 'c']
      const result = initialSelectState(options)

      expect(result).toEqual({
        active: false,
        highlightedOption: options[0],
        inputValue: '',
        menuIsOpen: false,
        visibleOptions: options,
      })
    })
  })

  describe('focus', () => {
    beforeEach(() => {
      state = initialSelectState()
    })

    it('activates the component in state', () => {
      const action = {
        props: {} as any,
        type: SelectActionType.focus,
      }
      const result = reducer(state, action)
      expect(result).toEqual({
        ...state,
        active: true,
      })
    })
  })

  describe('blur', () => {
    beforeEach(() => {
      const visibleOptions = ['a', 'b', 'c']
      state = {
        active: true,
        highlightedOption: visibleOptions[1],
        inputValue: 'oh hai',
        menuIsOpen: true,
        visibleOptions,
      }
    })

    it('resets state to default-ish values', () => {
      const action = {
        props: {} as any,
        type: SelectActionType.blur,
      }
      const result = reducer(state, action)
      expect(result).toEqual(initialSelectState())
    })

    it('uses "options" from props when available', () => {
      state.visibleOptions = ['z']
      const options = ['a', 'b', 'c']
      const action = {
        props: { options } as any,
        type: SelectActionType.blur,
      }
      const result = reducer(state, action)
      expect(result).toEqual(initialSelectState(options))
    })
  })

  describe('inputChange', () => {
    const initialOptions = [
      'red',
      'orange',
      'yellow',
      'green',
      'blue',
      'purple',
    ]

    beforeEach(() => {
      state = {
        active: true,
        highlightedOption: initialOptions[1],
        inputValue: '',
        menuIsOpen: true,
        visibleOptions: initialOptions,
      }
    })

    it('filters options displayed based on search results', () => {
      const action = {
        inputValue: 'o',
        props: { options: initialOptions } as any,
        type: SelectActionType.inputChange,
      }
      const result = reducer(state, action)
      const visibleOptions = ['orange', 'yellow']

      expect(result).toEqual({
        ...state,
        highlightedOption: visibleOptions[0],
        inputValue: action.inputValue,
        visibleOptions,
      })
    })

    it('opens the menu if it is not already open', () => {
      state.menuIsOpen = false
      const action = {
        inputValue: 'a',
        props: {} as any,
        type: SelectActionType.inputChange,
      }
      const result = reducer(state, action)

      expect(result.menuIsOpen).toBe(true)
    })
  })

  describe('openMenu', () => {
    it('updates the state to open the menu', () => {
      const options = ['a', 'b', 'c']
      const state = {
        ...initialSelectState(options),
        highlightedOption: options[1],
      }
      const action = {
        props: { options } as any,
        type: SelectActionType.openMenu,
      }
      const result = reducer(state, action)

      expect(result).toEqual({
        ...state,
        active: true,
        highlightedOption: options[0],
        menuIsOpen: true,
      })
    })
  })

  describe('closeMenu', () => {
    beforeEach(() => {
      const options = ['a', 'b', 'c']
      state = {
        ...initialSelectState(options),
        highlightedOption: options[1],
        inputValue: 'something',
        menuIsOpen: true,
      }
    })

    it('updates the state to close and reset the menu with default options', () => {
      const action = { props: {} as any, type: SelectActionType.closeMenu }
      const result = reducer(state, action)

      expect(result).toEqual({
        ...state,
        highlightedOption: undefined,
        inputValue: '',
        menuIsOpen: false,
        visibleOptions: [],
      })
    })

    it('updates the state to close and reset the menu with options from props', () => {
      const options = ['z', 'y', 'x', 'w']
      const action = {
        props: { options } as any,
        type: SelectActionType.closeMenu,
      }
      const result = reducer(state, action)

      expect(result).toEqual({
        ...state,
        highlightedOption: options[0],
        inputValue: '',
        menuIsOpen: false,
        visibleOptions: options,
      })
    })
  })

  describe('setHighlighted', () => {
    it.todo('updates the highlighted option to the specified option')

    it.todo('users the first option as a fallback value')
  })
})
