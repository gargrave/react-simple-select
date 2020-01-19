/* eslint-disable @typescript-eslint/no-explicit-any */
import { wrap } from '../../utils'
import { filterOptionsBySearch } from './Select.helpers'
import { SelectProps } from './Select'

export enum SelectActionType {
  focus,
  blur,
  inputChange,
  openMenu,
  closeMenu,
  setHighlighted,
  asyncSearchStart,
  asyncSearchEnd,
}

export type SelectReducerAction = {
  payload?: {
    highlightIdx?: number
    highlightIncrement?: number
    inputValue?: string
    options?: any[]
  }
  props: SelectProps
  type: SelectActionType
}

export type SelectState = {
  active: boolean
  highlightedIdx: number
  inputValue: string
  menuIsOpen: boolean
  searching: boolean
  visibleOptions: any[]
}

export const initialSelectState = (options: any[] = []): SelectState => ({
  active: false,
  highlightedIdx: 0,
  inputValue: '',
  menuIsOpen: false,
  searching: false,
  visibleOptions: options,
})

export const reducer = (
  state: SelectState,
  action: SelectReducerAction,
): SelectState => {
  switch (action.type) {
    case SelectActionType.focus:
      return {
        ...state,
        active: true,
      }

    case SelectActionType.blur: {
      const visibleOptions = action.props.options || []

      return {
        ...state,
        active: false,
        highlightedIdx: 0,
        inputValue: '',
        menuIsOpen: false,
        visibleOptions,
      }
    }

    case SelectActionType.inputChange: {
      const props = action.props || ({} as SelectProps) // eslint-disable-line
      const value = action.payload?.inputValue ?? ''
      const visibleOptions = filterOptionsBySearch(props, value)

      return {
        ...state,
        highlightedIdx: 0,
        inputValue: value,
        menuIsOpen: true,
        searching: false,
        visibleOptions,
      }
    }

    case SelectActionType.openMenu: {
      return {
        ...state,
        active: true,
        highlightedIdx: 0,
        menuIsOpen: true,
      }
    }

    case SelectActionType.closeMenu: {
      const visibleOptions = action.props.options || []

      return {
        ...state,
        highlightedIdx: 0,
        inputValue: '',
        menuIsOpen: false,
        visibleOptions,
      }
    }

    case SelectActionType.setHighlighted: {
      const newIdx =
        action.payload?.highlightIdx ||
        state.highlightedIdx + (action.payload?.highlightIncrement || 0)

      const highlightedIdx = wrap(0, state.visibleOptions.length - 1, newIdx)

      if (highlightedIdx === state.highlightedIdx) {
        return state
      }

      return {
        ...state,
        highlightedIdx,
      }
    }

    case SelectActionType.asyncSearchStart: {
      const newInputValue = action.payload?.inputValue ?? ''

      return {
        ...state,
        inputValue: newInputValue,
        menuIsOpen: true,
        searching: true,
        visibleOptions: [],
      }
    }

    case SelectActionType.asyncSearchEnd: {
      if (!state.searching) return state

      const newOptions = action.payload?.options || []

      return {
        ...state,
        searching: false,
        visibleOptions: newOptions,
      }
    }

    default:
      return state
  }
}
