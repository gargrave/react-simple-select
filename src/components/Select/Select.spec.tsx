import * as React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { cleanup, render } from '@testing-library/react'

import Select, { SelectProps } from './Select'

let defaultProps: SelectProps

describe('Select', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    defaultProps = {}
  })

  afterEach(cleanup)

  describe('Basic Rendering', () => {
    it('renders correctly', () => {
      const { container, getByText } = render(<Select {...defaultProps} />)
      expect(getByText(/Hello, Select!/i)).toBeInTheDocument()
      expect(container.querySelectorAll('.message')).toHaveLength(1)
    })
  })
})
