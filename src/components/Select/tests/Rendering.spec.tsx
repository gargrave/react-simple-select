import * as React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { cleanup, render } from '@testing-library/react'

import { usersOptions as options } from './testUtils'

import { Select, SelectProps } from '../Select'

describe('Select :: Rendering', () => {
  let defaultProps: SelectProps

  beforeEach(() => {
    jest.restoreAllMocks()
    jest.resetAllMocks()
    defaultProps = {
      onChange: jest.fn(),
      options,
    }
  })

  afterEach(cleanup)

  describe('Searchable', () => {
    it('renders a regular input field when searchable', () => {
      const { container } = render(
        <Select {...defaultProps} searchable={true} />,
      )
      const q = query => container.querySelectorAll(query)

      expect(q('input:not([readonly])')).toHaveLength(1)
      expect(q('input[readonly]')).toHaveLength(0)
    })

    it('renders a "readonly" input field when not searchable', () => {
      const { container } = render(
        <Select {...defaultProps} searchable={false} />,
      )
      const q = query => container.querySelectorAll(query)

      expect(q('input:not([readonly])')).toHaveLength(0)
      expect(q('input[readonly]')).toHaveLength(1)
    })

    it('is searchable by default', () => {
      const { container } = render(<Select {...defaultProps} />)
      const q = query => container.querySelectorAll(query)

      expect(q('input:not([readonly])')).toHaveLength(1)
      expect(q('input[readonly]')).toHaveLength(0)
    })
  })
})
