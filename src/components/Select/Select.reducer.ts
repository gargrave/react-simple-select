/* eslint-disable @typescript-eslint/no-explicit-any */
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
}

type SelectReducerAction = {
  inputValue?: string
  option?: any
  props: SelectProps
  type: SelectActionType
}

export type SelectState = {
  active: boolean
  highlightedOption: any
  inputValue: string
  menuIsOpen: boolean
  visibleOptions: any[]
}

export const initialSelectState = (options: any[] = []): SelectState => ({
  active: false,
  highlightedOption: options[0],
  inputValue: '',
  menuIsOpen: false,
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
      const highlightedOption = visibleOptions[0]

      return {
        ...state,
        active: false,
        highlightedOption,
        inputValue: '',
        menuIsOpen: false,
        visibleOptions,
      }
    }

    case SelectActionType.inputChange: {
      const props = action.props || ({} as SelectProps) // eslint-disable-line
      const value = action.inputValue || ''
      const visibleOptions = getFilteredOptions(props, value)
      const highlightedOption = visibleOptions[0]

      return {
        ...state,
        highlightedOption,
        inputValue: value,
        menuIsOpen: true,
        visibleOptions,
      }
    }

    case SelectActionType.openMenu: {
      const highlightedOption = (action.props.options || [])[0]

      return {
        ...state,
        active: true,
        highlightedOption,
        menuIsOpen: true,
      }
    }

    case SelectActionType.closeMenu:
      const visibleOptions = action.props.options || []
      const highlightedOption = visibleOptions[0]

      return {
        ...state,
        highlightedOption,
        inputValue: '',
        menuIsOpen: false,
        visibleOptions,
      }

    case SelectActionType.setHighlighted: {
      const highlightedOption = action.option || state.visibleOptions[0]

      return {
        ...state,
        highlightedOption,
      }
    }

    default:
      return state
  }
}
