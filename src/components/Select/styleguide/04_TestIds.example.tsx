import * as React from 'react'
import nanoid from 'nanoid'
import { Select } from '../Select'
// NOTE: see the first example for details on these helpers
import {
  getOptionKey,
  getOptionLabel,
  options,
} from './SelectStyleguide.helpers'

// dynamic test ID generation for each individual option
const getUserTestId = user => `user__${user.id}`

// generate test IDs for all elements
const testId = key => `${key}__${nanoid()}`
// use the `TestIdElementList` type for completion help
const testIds = {
  clearSelection: testId('clearSelection'),
  container: testId('container'),
  currentValue: testId('currentValue'),
  inputWrapper: testId('inputWrapper'),
  label: testId('label'),
  labelWrapper: testId('labelWrapper'),
  optionsWrapper: testId('optionsWrapper'),
  selectInput: testId('selectInput'),
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Example = () => {
  const [value, setValue] = React.useState(null)

  const handleChange = option => {
    setValue(option)
  }

  return (
    <>
      <h2>Test IDs</h2>
      <p className="description">
        This simple example shows how to apply custom{' '}
        <span className="code">data-testid</span>
        attributes to specific elements. This can be useful if you need an
        obvious, predictable hook for interacting with the rendered output of
        the Select component (e.g. if you want to test what happens when you
        click on a specific option).
      </p>
      <p>
        These are optional for all elements, so if you don't need these, you can
        safely ignore this set of props, and nothing will be applied. Note that
        most test IDs are a single string within a config object, but the
        options have their own getter function, to ensure you are able to
        provide a unique ID for each individual option.
      </p>
      <p>
        For this example in particular, you may want to view the code snippets
        and inspect the DOM to see this in action. For simplicity's sake, this
        one just applies the name of the element + a UUID, but these can
        literally be anything you want--whatever works best for you and your
        application's needs.
      </p>
      <p>
        Note that there are a few more "data testable" elements that are not
        shown here, because they are related to specific conditions (e.g.
        loaders, "no options" messaging, etc.).
      </p>

      <Select
        getOptionKey={getOptionKey}
        getOptionLabel={getOptionLabel}
        getOptionTestId={getUserTestId}
        onChange={handleChange}
        options={options}
        placeholder="Choose your bestest buddy"
        label="Let's see some test IDs!"
        testIds={testIds}
        value={value}
      />
    </>
  )
}
