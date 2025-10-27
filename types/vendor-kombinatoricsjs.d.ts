declare module './lib/kombinatoricsjs/src/kombinatoricsjs' {
  export function shuffle<T>(arr: T[]): void;
  export function combinations<T>(arr: T[], k: number): T[][];
  export function multiCombinations<T>(arr: T[], k: number, repetition?: number): T[][];
  export function crossProduct<T>(arr: T[], k: number): T[][];
  export function indexArray(n: number): number[];
}
