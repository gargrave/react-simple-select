import * as React from 'react'
import { Select } from '../Select'
// NOTE: see the first example for details on these helpers
import {
  getOptionKey,
  getOptionLabel,
  getUserFullName,
  options,
  searchableOptions,
} from './SelectStyleguide.helpers'

const userSearch = (inputValue: string) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(
        searchableOptions.filter(user =>
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
  const [value, setValue] = React.useState(null)
  const [value2, setValue2] = React.useState(null)

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
      <p className="description">
        You can use the <span className="code">asyncSearchMinLength</span> prop
        to specify a threshold for a search to occur--anything input shorter
        than this length will simply act as a non-async filter for the{' '}
        <span className="code">options</span> already specified.
      </p>

      <p className="description">
        This instance has a 350ms debounce time before a search occurs, and a
        minimum search length of 3 characters.
      </p>
      <Select
        asyncSearch={userSearch}
        asyncSearchDebounceTime={350}
        asyncSearchMinLength={3}
        asyncSearchingText="Doing a most excellent search..."
        getOptionKey={getOptionKey}
        getOptionLabel={getOptionLabel}
        onChange={setValue}
        options={options}
        placeholder="Type to search..."
        value={value}
      />

      <p className="description">
        This instance has a 500ms debounce time before a search occurs, a
        minimum search string length of 2 characters, an no default options.
        (This can sort of simulate what it might look like if all of your
        options are loaded asynchronously from an API.)
      </p>
      <Select
        asyncSearch={userSearch}
        asyncSearchDebounceTime={500}
        asyncSearchMinLength={2}
        asyncSearchingText="Finding the best users..."
        getOptionKey={getOptionKey}
        getOptionLabel={getOptionLabel}
        onChange={setValue2}
        options={[]}
        placeholder="Type to search..."
        value={value2}
      />
    </>
  )
}
