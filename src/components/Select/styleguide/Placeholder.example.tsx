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
        The `placeholder` prop will allow you to specify custom placeholder text
        when there is no current value.
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
