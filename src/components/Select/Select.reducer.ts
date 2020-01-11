/* eslint-disable @typescript-eslint/no-explicit-any */
import { wrap } from '../../utils'
import { DEFAULT_GET_OPTION_LABEL } from './Select.helpers'
import { SelectProps } from './Select'

const getFilteredOptions = (props: SelectProps, inputValue: string): any[] => {
  const { getOptionLabel = DEFAULT_GET_OPTION_LABEL, options = [] } = props
  const filterer = (option: string) =>
    getOptionLabel!(option) // eslint-disable-line
      .toLowerCase()
      .includes(inputValue)
  return options.filter(filterer)
}

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
      const visibleOptions = getFilteredOptions(props, value)

      return {
        ...state,
        highlightedIdx: 0,
        inputValue: value,
        menuIsOpen: true,
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
      const inputValue = action.payload?.inputValue ?? ''

      return {
        ...state,
        inputValue,
        menuIsOpen: true,
        searching: true,
        visibleOptions: [],
      }
    }

    case SelectActionType.asyncSearchEnd: {
      const options = action.payload?.options || []

      return {
        ...state,
        searching: false,
        visibleOptions: options,
      }
    }

    default:
      return state
  }
}
