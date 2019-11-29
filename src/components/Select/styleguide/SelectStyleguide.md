```jsx
import * as React from 'react'
import { name, random } from 'faker'
import { Select } from '../Select'

// these helpers will be used in many of the examples below, but in all other
// examples, they will be imported from another file for brevity
const makePerson = () => ({
  firstName: name.firstName(),
  id: random.uuid(),
  lastName: name.lastName(),
})

const options = Array(10)
  .fill(0)
  .map(makePerson)

const getOptionKey = person => `${person.id}`
const getOptionLabel = person => `${person.firstName} ${person.lastName}`

const randomOption = () => options[Math.floor(Math.random() * 10)]

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Example = () => {
  const [value, setValue] = React.useState(randomOption())

  const [clearable, setClearable] = React.useState(true)
  const [disabled, setDisabled] = React.useState(false)
  const [showLabel, setShowLabel] = React.useState(true)
  const [searchable, setSearchable] = React.useState(true)

  const handleChange = person => {
    setValue(person)
  }

  return (
    <>
      <h2>Multiple Toggleable Props</h2>
      <p className="description">
        An example with toggles for lots of the basic boolean props.
      </p>

      <Select
        clearable={clearable}
        disabled={disabled}
        getOptionKey={getOptionKey}
        getOptionLabel={getOptionLabel}
        label={showLabel ? 'This is what a label looks like' : undefined}
        onChange={handleChange}
        options={options}
        searchable={searchable}
        value={value}
      />

      <div className="multiProps__controls">
        <Toggle
          checked={showLabel}
          label="Show Label"
          toggleFn={setShowLabel}
        />
        <Toggle checked={clearable} label="Clearable" toggleFn={setClearable} />
        <Toggle checked={disabled} label="Disabled" toggleFn={setDisabled} />
        <Toggle
          checked={searchable}
          label="Searchable"
          toggleFn={setSearchable}
        />
      </div>
    </>
  )
}

;<Example />
```

```jsx
import * as React from 'react'
import { Select } from '../Select'
// NOTE: see the first example for details on these helpers
import {
  getOptionKey,
  getOptionLabel,
  options,
} from './SelectStyleguide.helpers'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Example = () => {
  const [value, setValue] = React.useState(null)

  const handleChange = option => {
    setValue(option)
  }

  return (
    <>
      <h2>Custom placeholder</h2>
      <p className="description">
        The <span className="code">placeholder</span> prop will allow you to
        specify custom placeholder text when there is no current value.
      </p>

      <Select
        getOptionKey={getOptionKey}
        getOptionLabel={getOptionLabel}
        onChange={handleChange}
        options={options}
        placeholder="Choose your bestest buddy"
        value={value}
      />
    </>
  )
}

;<Example />
```

```jsx
import * as React from 'react'
import { Select } from '../Select'
// NOTE: see the first example for details on these helpers
import {
  getOptionKey,
  getOptionLabel,
  options,
} from './SelectStyleguide.helpers'

const optionIsDisabled = (option, _idx) => option.firstName.match(/e/i)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Example = () => {
  const [value, setValue] = React.useState(options[0])

  const handleChange = option => {
    setValue(option)
  }

  return (
    <>
      <h2>Disabled Options</h2>
      <p className="description">
        When providing a callback for the{' '}
        <span className="code">optionIsDisabled</span> prop, you can specify the
        conditions under which an option should be disabled, which means it will
        received "disabled" styling, and be un-selectable.
      </p>

      <p className="description">
        For illustration's sake, this example disables all options (i.e. users)
        who have the letter "e" in their first name.
      </p>

      <Select
        getOptionKey={getOptionKey}
        getOptionLabel={getOptionLabel}
        onChange={handleChange}
        optionIsDisabled={optionIsDisabled}
        options={options}
        value={value}
      />
    </>
  )
}

;<Example />
```
