export interface RngSource {
  nextInt(maxExclusive: number): number;
  shuffleInPlace<T>(arr: T[]): T[];
}

export function createRng(seed: number): RngSource {
  let state = seed >>> 0;
  const next = (): number => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    nextInt: (max: number): number => Math.floor(next() * max),
    shuffleInPlace: <T>(arr: T[]): T[] => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        const tmp = arr[i] as T;
        arr[i] = arr[j] as T;
        arr[j] = tmp;
      }
      return arr;
    },
  };
}
