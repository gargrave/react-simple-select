import * as React from 'react'

import Select, { SelectProps } from './Select'

const options = [
  { firstName: 'Larry', id: 1, lastName: 'McDonald' },
  { firstName: 'Lacey', id: 2, lastName: 'Struthers' },
  { firstName: 'Sandra', id: 3, lastName: 'Callahan' },
  { firstName: 'Billy', id: 4, lastName: 'Pickles' },
  { firstName: 'Davie', id: 5, lastName: 'McBavie' },
]

const getOptionKey = option => `${option.id}`
const getOptionLabel = option => `${option.firstName} ${option.lastName}`

type Props = {
  title?: string
} & Partial<SelectProps>

const Component: React.FC<Props> = props => {
  const { title } = props

  const [value, setValue] = React.useState(options[0])

  const handleChange = option => {
    setValue(option)
  }

  return (
    <>
      {title && <p>{title}:</p>}
      <Select
        getOptionKey={getOptionKey}
        getOptionLabel={getOptionLabel}
        onChange={handleChange}
        options={options}
        value={value}
        {...props}
      />
    </>
  )
}

const Basic = () => <Component title="A basic select" />

const Disabled = () => <Component disabled={true} title="Disabled" />

export const Examples = () => {
  return (
    <>
      <Basic />
      <Disabled />
    </>
  )
}
