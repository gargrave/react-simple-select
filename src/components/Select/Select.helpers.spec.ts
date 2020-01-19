import '@testing-library/jest-dom/extend-expect'

import { filterOptionsBySearch } from './Select.helpers'
import { SelectProps } from './Select'

describe('Select helpers', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('filterOptionsBySearch', () => {
    const user1 = { firstName: 'Larry', lastName: 'Cartwright' }
    const user2 = { firstName: 'Lorenzo', lastName: 'Kris' }
    const user3 = { firstName: 'Barry', lastName: 'Cartwright' }

    let mockGetOptionLabel
    let options
    let props: Partial<SelectProps>

    beforeEach(() => {
      jest.resetAllMocks()

      mockGetOptionLabel = jest.fn(user => `${user.firstName} ${user.lastName}`)
      options = [user1, user2, user3]
      props = {
        getOptionLabel: mockGetOptionLabel,
        options,
      }
    })

    it('filters options with all lowercase search', () => {
      const result = filterOptionsBySearch(props as any, 'arry')
      expect(mockGetOptionLabel).toHaveBeenCalledTimes(options.length)
      expect(result).toEqual([user1, user3])
    })

    it('filters options with mixed-case search', () => {
      const result = filterOptionsBySearch(props as any, 'ArRy')
      expect(mockGetOptionLabel).toHaveBeenCalledTimes(options.length)
      expect(result).toEqual([user1, user3])
    })

    it('returns an empty array if there are no matches', () => {
      const result = filterOptionsBySearch(props as any, 'ohdglkd')
      expect(mockGetOptionLabel).toHaveBeenCalledTimes(options.length)
      expect(result).toEqual([])
    })
  })
})
