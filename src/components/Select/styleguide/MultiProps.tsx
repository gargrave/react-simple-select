import * as React from 'react'
import { name, random } from 'faker'

import { Select } from '../Select'

type Person = {
  firstName: string
  id: string
  lastName: string
}

const makePerson = (): Person => ({
  firstName: name.firstName(),
  id: random.uuid(),
  lastName: name.lastName(),
})

const OPTIONS_COUNT = 10

const options: Person[] = Array(OPTIONS_COUNT)
  .fill(0)
  .map(makePerson)

const randomOption = (): Person =>
  options[Math.floor(Math.random() * OPTIONS_COUNT)]

const getOptionKey = (person: Person) => `${person.id}`

const getOptionLabel = (person: Person) =>
  `${person.firstName} ${person.lastName}`

const Toggle = ({ checked, label, toggleFn }) => {
  return (
    <label className="multiProps__toggle">
      <input
        checked={checked}
        type="checkbox"
        onChange={() => toggleFn(prev => !prev)}
      />
      {label}
    </label>
  )
}

const MultiPropsHarness = props => {
  const [value, setValue] = React.useState(randomOption())

  const [clearable, setClearable] = React.useState(true)
  const [disabled, setDisabled] = React.useState(false)
  const [showLabel, setShowLabel] = React.useState(true)

  const handleChange = (person: Person) => {
    setValue(person)
  }

  return (
    <>
      <Select
        clearable={clearable}
        disabled={disabled}
        getOptionKey={getOptionKey}
        getOptionLabel={getOptionLabel}
        label={showLabel ? 'Multiple Props' : undefined}
        onChange={handleChange}
        options={options}
        value={value}
        {...props}
      />

      <div className="multiProps__controls">
        <Toggle checked={clearable} label="Clearable" toggleFn={setClearable} />
        <Toggle checked={disabled} label="Disabled" toggleFn={setDisabled} />
        <Toggle
          checked={showLabel}
          label="Show Label"
          toggleFn={setShowLabel}
        />
      </div>
    </>
  )
}

export const MultiProps = () => {
  return <MultiPropsHarness />
}
