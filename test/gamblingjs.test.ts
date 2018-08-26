import { fac } from '../src/gamblingjs'

describe('Dummy test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('test inclusion', () => {
    expect(fac(1)).toBe(1)
  })
})
