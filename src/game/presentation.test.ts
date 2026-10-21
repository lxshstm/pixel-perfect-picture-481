import { describe, expect, it } from "vitest";
import { BUBBU } from "./config";
import { initialState, sanitize } from "./store";

describe("museum update constraints", () => {
  it("limits showcase stickers plus the curator to three placements", () => {
    expect(BUBBU.showcase.length + 1).toBeLessThanOrEqual(3);
    expect(new Set(BUBBU.showcase.map((item) => item.index)).size).toBe(BUBBU.showcase.length);
  });
  it("limits celebration sticker placements to two", () => {
    expect(BUBBU.celebration.length).toBeLessThanOrEqual(2);
  });
  it("preserves a version 2 saved gift challenge and unlocked chapter", () => {
    const saved = { ...initialState(), v: 2, screen: "c2", unlocked: 2,
      c2: { picked: [0, 1, 4, 5], order: [5, 1, 0, 4], solved: false }, hints: { c2: 1 } };
    const restored = sanitize(JSON.parse(JSON.stringify(saved)));
    expect(restored.v).toBe(2);
    expect(restored.screen).toBe("c2");
    expect(restored.unlocked).toBe(2);
    expect(restored.c2).toEqual(saved.c2);
    expect(restored.hints.c2).toBe(1);
  });
});