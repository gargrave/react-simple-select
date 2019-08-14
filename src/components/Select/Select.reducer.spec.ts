import 'jest-dom/extend-expect'

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
      state = {
        active: true,
        inputValue: 'oh hai',
        menuIsOpen: true,
        visibleOptions: ['a', 'b', 'c'],
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
        inputValue: '',
        menuIsOpen: true,
        visibleOptions: initialOptions,
      }
    })

    it('filters options displayed based on search results', () => {
      const action = {
        inputValue: 'o',
        props: {
          options: initialOptions,
        } as any,
        type: SelectActionType.inputChange,
      }
      const result = reducer(state, action)
      expect(result).toEqual({
        ...state,
        inputValue: action.inputValue,
        visibleOptions: ['orange', 'yellow'],
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
      const state = initialSelectState()
      const action = { props: {} as any, type: SelectActionType.openMenu }
      const result = reducer(state, action)
      expect(result).toEqual({
        ...state,
        active: true,
        menuIsOpen: true,
      })
    })
  })

  describe('closeMenu', () => {
    beforeEach(() => {
      state = {
        ...initialSelectState(),
        inputValue: 'something',
        menuIsOpen: true,
        visibleOptions: ['a', 'b', 'c'],
      }
    })

    it('updates the state to close and reset the menu with default options', () => {
      const action = { props: {} as any, type: SelectActionType.closeMenu }
      const result = reducer(state, action)
      expect(result).toEqual({
        ...state,
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
        inputValue: '',
        menuIsOpen: false,
        visibleOptions: options,
      })
    })
  })
})
