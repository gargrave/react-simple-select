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
