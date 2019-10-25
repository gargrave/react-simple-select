import * as React from 'react'

import { MultiProps } from './MultiProps'
import { Select, SelectProps } from '../Select'

const options = [
  { firstName: 'Larry', id: 1, lastName: 'McDonald' },
  { firstName: 'Lacey', id: 2, lastName: 'Johnson' },
  { firstName: 'Sandra', id: 3, lastName: 'Callahan' },
  { firstName: 'Billy', id: 4, lastName: 'Pickles' },
  { firstName: 'Davie', id: 5, lastName: 'Stanton' },
]
const randomOption = () => options[Math.floor(Math.random() * options.length)]

const getOptionKey = option => `${option.id}`
const getOptionLabel = option => `${option.firstName} ${option.lastName}`

type Props = {
  hasInitialValue?: boolean
} & Partial<SelectProps>

const Component: React.FC<Props> = props => {
  const { hasInitialValue = true, label } = props

  const initial = hasInitialValue && randomOption()
  const [value, setValue] = React.useState(initial)

  const handleChange = option => {
    setValue(option)
  }

  return (
    <>
      <Select
        getOptionKey={getOptionKey}
        getOptionLabel={getOptionLabel}
        label={label}
        onChange={handleChange}
        options={options}
        value={value}
        {...props}
      />
    </>
  )
}

const Placeholder = () => (
  <Component
    hasInitialValue={false}
    placeholder="Choose your bestest buddy"
    label="With custom placeholder text (no selected value)"
  />
)

export const Examples = () => {
  return (
    <>
      <MultiProps />
      <hr />
      <Placeholder />
    </>
  )
}
