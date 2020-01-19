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

```jsx
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

const userSearch = inputValue => {
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

const rejectedUserSearch = _inputValue => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('This search has failed.'))
    }, 1000)
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Example = () => {
  const [value, setValue] = React.useState(options[1])
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
        If an error occurs during the async search, the parent component should
        both reject the Promise and handle the error in whatever way is best for
        your app. Internally, react-simple-select will simply ignore the error
        (assuming it has already been handled appropriately in the parent) and
        show the "no options" message.
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

      <p className="description">
        This instance is hard-coded to reject its search, as an example of how
        search errors are "silently ignored" by react-simple-select. If you need
        specific error handling, it needs to be implemented in the parent
        component.
      </p>
      <Select
        asyncSearch={rejectedUserSearch}
        asyncSearchDebounceTime={500}
        asyncSearchMinLength={2}
        asyncSearchingText="This is bound to fail..."
        getOptionKey={getOptionKey}
        getOptionLabel={getOptionLabel}
        onChange={setValue2}
        options={options}
        placeholder="Type to trigger a failed search..."
        value={value2}
      />
    </>
  )
}

;<Example />
```
