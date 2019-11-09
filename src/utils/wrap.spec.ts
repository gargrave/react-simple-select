import { wrap } from './wrap'

describe('wrap', () => {
  it('returns "max" if value is less than "min"', () => {
    expect(wrap(5, 10, 4)).toBe(10)
  })

  it('returns "min" if value is less than "max"', () => {
    expect(wrap(5, 10, 11)).toBe(5)
  })

  it('returns the original value if it is within the given range', () => {
    expect(wrap(5, 10, 8)).toBe(8)
  })
})
