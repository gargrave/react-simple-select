import { classNames } from './classNames'

describe('classNames', () => {
  describe('Valid arg handling', () => {
    it('correctly applies a single string class name', () => {
      const result = classNames('cool')
      expect(result).toBe('cool')
    })

    it('correctly applies multiple string class names', () => {
      const result = classNames('cool', 'awesome')
      expect(result).toBe('cool awesome')
    })

    it('applies conditional args correctly', () => {
      const result = classNames(
        'one',
        'two',
        {
          three: false,
          four: true,
          five: !!'yesPlease',
          six: undefined,
          seven: null,
          eight: 2 > 1,
          nine: 2 < 1,
        },
        'ten',
      )
      expect(result).toBe('one two four five eight ten')
    })
  })

  describe('Invalid arg handling', () => {
    it('ignores a single empty string', () => {
      const result = classNames('')
      expect(result).toBe('')
    })

    it('ignores multiple empty strings', () => {
      const result = classNames('', '')
      expect(result).toBe('')
    })

    it('ignores a single "undefined" arg', () => {
      const result = classNames(undefined)
      expect(result).toBe('')
    })

    it('ignores multiple "undefined" args', () => {
      const result = classNames(undefined, undefined)
      expect(result).toBe('')
    })

    it('ignores invalid values among valid values', () => {
      const result = classNames('', 'neat', '', 'excellent')
      expect(result).toBe('neat excellent')
    })
  })
})
