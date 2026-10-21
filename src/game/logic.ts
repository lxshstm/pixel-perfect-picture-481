import type { Gift, YMD } from "./config";

export const sameDate = (a: YMD | null | undefined, b: YMD) =>
  !!a && a.y === b.y && a.m === b.m && a.d === b.d;

/** Pick `n` distinct gift indices among gifts that have a configured order. */
export function pickGifts(gifts: Gift[], n = 4, rand = Math.random): number[] {
  const pool = gifts.map((g, i) => (typeof g.order === "number" ? i : -1)).filter((i) => i >= 0);
  if (pool.length < n) return [];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]] as [number, number];
  }
  return pool.slice(0, n);
}

/** Correct earliest→latest order, computed from configured gift order (never from display number). */
export const correctGiftOrder = (gifts: Gift[], picked: number[]) =>
  [...picked].sort((a, b) => (gifts[a]?.order ?? 0) - (gifts[b]?.order ?? 0));

export const isGiftOrderCorrect = (gifts: Gift[], current: number[]) =>
  current.length > 0 && current.every((v, i) => v === correctGiftOrder(gifts, current)[i]);

/** Shuffle 0..n-1 such that the result is never already solved; also not equal to `avoid`. */
export function shuffledPuzzle(n: number, rand = Math.random): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  do {
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]] as [number, number];
    }
  } while (isPuzzleSolved(arr));
  return arr;
}

/** perm[slot] = piece id; solved when every piece sits in its own slot */
export const isPuzzleSolved = (perm: number[]) => perm.every((p, i) => p === i);

export const swap = (arr: number[], a: number, b: number) => {
  const c = [...arr];
  [c[a], c[b]] = [c[b], c[a]] as [number, number];
  return c;
};

/** Hint: put one misplaced piece into its correct slot. */
export function fixOnePiece(perm: number[]): number[] {
  const slot = perm.findIndex((p, i) => p !== i);
  if (slot < 0) return perm;
  const where = perm.indexOf(slot);
  return swap(perm, slot, where);
}

export type CityTap = "next" | "early" | "revisit";
export function classifyCityTap(index: number, unlockedCount: number): CityTap {
  if (index < unlockedCount) return "revisit";
  if (index === unlockedCount) return "next";
  return "early";
}

export const daysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate();
