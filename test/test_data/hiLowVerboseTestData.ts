export const TEST_DATA = {
  "low8": [
    {
      inputs: {
        5: [],
        6: [],
        7: [4, 17, 19, 20, 11, 5, 0]
      },
      output: {
        hi: {
          hand: [4, 4, 6, 7, 11],
          handRank: 2345,
          faces: '6689K',
          handGroup: 'one pair',
          flushSuit: "no flush",
          winningCards: [4, 17, 19, 20, 11]
        },
        low: {
          hand: [],
          handRank: -1,
          faces: '',
          handGroup: 'unqualified',
          flushSuit: "no flush",
          winningCards: []
        }
      }
    }
  ]
};
