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
      <p className="description">
        If you need to load and/or search for options asynchronously, you can do
        so with the async searching options. Provide an{' '}
        <span className="code">asyncSearch</span> implementation, which takes a
        string (the current search string) and resolves a Promise with a new set
        of options.
      </p>
      <p className="description">
        The search has a debounce timer attached to it, so you can specify the
        length of the delay that will occur before the search is actually
        triggered (in general, you don't want to fire searches immediately, but
        rather give your users time to search and rest before sending the search
        request).
      </p>

      <Select
        asyncSearch={userSearch}
        asyncSearchDebounceTime={350}
        asyncSearchingText="Doing a most excellent search..."
        getOptionKey={getOptionKey}
        getOptionLabel={getOptionLabel}
        onChange={setValue}
        options={options}
        placeholder="Type to search..."
        value={value}
      />
    </>
  )
}
