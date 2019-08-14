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
  blur,
  focus,
  inputChange,
  openMenu,
  closeMenu,
}

type SelectReducerAction = {
  inputValue?: string
  props: SelectProps
  type: SelectActionType
}

export type SelectState = {
  active: boolean
  inputValue: string
  menuIsOpen: boolean
  visibleOptions: any[]
}

export const initialSelectState = (options: any[] = []): SelectState => ({
  active: false,
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

    case SelectActionType.blur:
      return {
        ...state,
        active: false,
        inputValue: '',
        menuIsOpen: false,
        visibleOptions: action.props.options || [],
      }

    case SelectActionType.inputChange: {
      const props = action.props || ({} as SelectProps) // eslint-disable-line
      const value = action.inputValue || ''

      return {
        ...state,
        inputValue: value,
        menuIsOpen: true,
        visibleOptions: getFilteredOptions(props, value),
      }
    }

    case SelectActionType.openMenu:
      return {
        ...state,
        active: true,
        menuIsOpen: true,
      }

    case SelectActionType.closeMenu:
      return {
        ...state,
        inputValue: '',
        menuIsOpen: false,
        visibleOptions: action.props.options || [],
      }

    default:
      return state
  }
}
