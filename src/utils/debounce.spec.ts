import '@testing-library/jest-dom/extend-expect'

import { debounce } from './debounce'

describe('debounce', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.useFakeTimers()
  })

  it('returns a debounced function that only gets called after the specified period of time', () => {
    const timeout = 100
    const testName = 'Billy'
    const testNum = 42
    const fn = jest.fn((name: string, num: number) => `Hi ${name} ${num}`)
    const debounced = debounce(fn, timeout)

    expect(typeof debounced).toBe('function')
    expect(fn).toHaveBeenCalledTimes(0)

    debounced(testName, testNum)
    expect(fn).toHaveBeenCalledTimes(0)

    // calls a few times and advance timers by "less than timeout"
    jest.advanceTimersByTime(10)
    debounced(testName, testNum)
    jest.advanceTimersByTime(20)
    debounced(testName, testNum)
    jest.advanceTimersByTime(timeout - 1)
    expect(fn).toHaveBeenCalledTimes(0)

    // now call, advance to timeout, and ensure it got called and returned correctly
    debounced(testName, testNum)
    jest.advanceTimersByTime(timeout)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenLastCalledWith(testName, testNum)
    expect(fn).toHaveReturnedWith('Hi Billy 42')
  })
})
