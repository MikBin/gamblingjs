import { atLeast5Eq, getVectorSum, getFlushSuit7, checkStraight5on7 } from '../src/routines'

describe('testing basic routines', () => {
  it('returns the only element with 5 equals', () => {
    expect(atLeast5Eq([[2, 3, 1, 1, 1, 1, 1, 5], [1, 1, 1, 1]])).toEqual([[2, 3, 1, 1, 1, 1, 1, 5]])
  })
  it('sums all numbers', () => {
    expect(getVectorSum([2, 3, 1, 1, 1, 1, 1, 5])).toEqual(15)
  })

  it('gets sum suits on 7', () => {
    expect(getFlushSuit7([1, 2, 3, 2, 2, 2, 2])).toEqual(2)
  })

  it('false when no straight is passed', () => {
    expect(checkStraight5on7([1, 2, 3, 2, 2, 2, 2])).toEqual(false)
  })

  it('true when  straight is passed', () => {
    expect(checkStraight5on7([0, 1, 2, 2, 3, 8, 12])).toEqual(true)
  })
})
