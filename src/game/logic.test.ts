import { describe, expect, it } from "vitest";
import {
  classifyCityTap,
  correctGiftOrder,
  fixOnePiece,
  isGiftOrderCorrect,
  isPuzzleSolved,
  pickGifts,
  shuffledPuzzle,
} from "./logic";
import type { Gift } from "./config";

const g = (no: string, order?: number): Gift => ({ no, name: no, icon: "box", text: "", ...(order === undefined ? {} : { order }) });

describe("gift chapter", () => {
  const gifts = [g("01", 5), g("02", 2), g("03", 3), g("04"), g("05", 1), g("06", 4)];

  it("picks 4 distinct gifts only from ones with a configured order", () => {
    for (let k = 0; k < 50; k++) {
      const p = pickGifts(gifts, 4);
      expect(new Set(p).size).toBe(4);
      expect(p).not.toContain(3);
    }
  });

  it("returns no puzzle when fewer than 4 orders are configured", () => {
    expect(pickGifts([g("a", 1), g("b", 2), g("c")], 4)).toEqual([]);
  });

  it("orders by configured giving order, not by display number", () => {
    expect(correctGiftOrder(gifts, [0, 1, 4, 5])).toEqual([4, 1, 5, 0]);
    expect(isGiftOrderCorrect(gifts, [4, 1, 5, 0])).toBe(true);
    expect(isGiftOrderCorrect(gifts, [0, 1, 4, 5])).toBe(false);
  });
});

describe("puzzle chapter", () => {
  it("never starts already solved", () => {
    for (let k = 0; k < 200; k++) expect(isPuzzleSolved(shuffledPuzzle(9))).toBe(false);
  });
  it("hint places exactly one more piece correctly", () => {
    const perm = [1, 0, 2, 3, 4, 5, 6, 8, 7];
    const fixed = fixOnePiece(perm);
    expect(fixed[0]).toBe(0);
  });
});

describe("map chapter", () => {
  it("only the next city unlocks", () => {
    expect(classifyCityTap(2, 2)).toBe("next");
    expect(classifyCityTap(5, 2)).toBe("early");
    expect(classifyCityTap(0, 2)).toBe("revisit");
  });
});
