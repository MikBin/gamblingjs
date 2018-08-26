/**
 * think of using typed array for performance reasons as these data is accessed very often
 * 8bit or 16bits arrays can be used
 */

export const flushHash: number[] = [] // 13 one for each rank

flushHash[0] = 1
flushHash[1] = 2
flushHash[2] = 4
flushHash[3] = 8
flushHash[4] = 16
flushHash[5] = 32
flushHash[6] = 64
flushHash[7] = 128
flushHash[8] = 255
flushHash[9] = 508
flushHash[10] = 1012
flushHash[11] = 2016
flushHash[12] = 4016

export const suitsHash: Readonly<number[]> = [0, 57, 1, 8] // 4 one for each suit

/**check for !==undefined */
export const flush5hHashCheck: Readonly<object> = {
  '0': 0,
  '5': 1,
  '40': 8,
  '285': 57
}

export const flush7HashCheck: Readonly<object> = {
  '0': 0,
  '1': 0,
  '2': 0,
  '5': 1,
  '6': 1,
  '7': 1,
  '8': 0,
  '9': 0,
  '13': 1,
  '14': 1,
  '16': 0,
  '21': 1,
  '40': 8,
  '41': 8,
  '42': 8,
  '48': 8,
  '49': 8,
  '56': 8,
  '57': 0,
  '58': 0,
  '62': 1,
  '63': 1,
  '65': 0,
  '70': 1,
  '97': 8,
  '98': 8,
  '105': 8,
  '114': 0,
  '119': 1,
  '154': 8,
  '285': 57,
  '286': 57,
  '287': 57,
  '293': 57,
  '294': 57,
  '301': 57,
  '342': 57,
  '343': 57,
  '350': 57,
  '399': 57
}

const ranksHashOn7: number[] = [] // 13 one for each rank

ranksHashOn7[0] = 0
ranksHashOn7[1] = 1
ranksHashOn7[2] = 5
ranksHashOn7[3] = 22
ranksHashOn7[4] = 98
ranksHashOn7[5] = 453
ranksHashOn7[6] = 2031
ranksHashOn7[7] = 8698
ranksHashOn7[8] = 22854
ranksHashOn7[9] = 83661
ranksHashOn7[10] = 262349
ranksHashOn7[11] = 636345
ranksHashOn7[12] = 1479181

const ranksHashOn5: number[] = [] // one for each rank

ranksHashOn5[0] = 0 // 2
ranksHashOn5[1] = 1 // 3
ranksHashOn5[2] = 5 // 4
ranksHashOn5[3] = 22 // 5
ranksHashOn5[4] = 94 // 6
ranksHashOn5[5] = 312 // 7
ranksHashOn5[6] = 992 // 8
ranksHashOn5[7] = 2422 // 9
ranksHashOn5[8] = 5624 // 10
ranksHashOn5[9] = 12522 // J
ranksHashOn5[10] = 19998 // Q
ranksHashOn5[11] = 43258 // K
ranksHashOn5[12] = 79415 // A

/* 
arrays initialization
*/
export const deckOfRanks: number[] = new Array(52)
export const deckOfFlushes: number[] = new Array(52)
export const deckOfSuits: number[] = new Array(52)

for (let i: number = 0; i < 52; i += 1) {
  deckOfRanks[i] = ranksHashOn5[i % 13]
  deckOfFlushes[i] = flushHash[i % 13]
  deckOfSuits[i] = suitsHash[~~(i / 13)]
}

export const STRAIGHTS: number[][] = [
  [12, 0, 1, 2, 3],
  [0, 1, 2, 3, 4],
  [1, 2, 3, 4, 5],
  [2, 3, 4, 5, 6],
  [3, 4, 5, 6, 7],
  [4, 5, 6, 7, 8],
  [5, 6, 7, 8, 9],
  [6, 7, 8, 9, 10],
  [7, 8, 9, 10, 11],
  [8, 9, 10, 11, 12]
]

export const rankCards: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
export const HIGH_CARDS_5_AMOUNT = 1277
export const FLUSHES_BASE_START = 5863

/**
 * @TODO make function to work with non full decks. ex. deck of 40 cards
 *
 * */

/**
 * @TODO prepare similar stuff for dice suited poker
 *
 * */
