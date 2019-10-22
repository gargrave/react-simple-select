import * as React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { cleanup, render } from '@testing-library/react'

import { styles } from '../Select.helpers'

import { SvgWrapper, SvgWrapperProps } from './SvgWrapper'

let defaultProps: SvgWrapperProps

describe('SvgWrapper', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    defaultProps = {
      children: null,
      onMouseDown: jest.fn(),
      ref: undefined,
      testId: '',
    }
  })

  afterEach(cleanup)

  describe('Basic Rendering', () => {
    it('renders something', () => {
      const { container } = render(
        <SvgWrapper {...defaultProps}>
          <div>pretend this is an svg</div>
        </SvgWrapper>,
      )

      const q = query => container.querySelectorAll(query)
      expect(container.firstChild).not.toBeNull()
      expect(q(`.${styles.svgWrapper}`)).toHaveLength(1)
    })
  })
})
