import * as React from 'react'
import { Select } from '../Select'
// NOTE: see the first example for details on these helpers
import {
  getOptionKey,
  getOptionLabel,
  getUserFullName,
  options,
} from './SelectStyleguide.helpers'

const userSearch = (inputValue: string) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(
        options.filter(user =>
          getUserFullName(user)
            .toLowerCase()
            .includes(inputValue),
        ),
      )
    }, 1000)
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Example = () => {
  const [value, setValue] = React.useState(options[0])

  return (
    <>
      <h2>Async Searching</h2>

      <Select
        asyncSearch={userSearch}
        getOptionKey={getOptionKey}
        getOptionLabel={getOptionLabel}
        onChange={setValue}
        options={options}
        placeholder="Type to search..."
      />
    </>
  )
}
