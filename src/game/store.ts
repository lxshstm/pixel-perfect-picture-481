import { useCallback, useEffect, useRef, useState } from "react";
import type { YMD } from "./config";
import { CITIES, GIFTS } from "./config";

export type Screen = "home" | "c1" | "c2" | "c3" | "c4" | "final";

export type GameState = {
  v: 2;
  screen: Screen;
  unlocked: number; // highest chapter reached 1..5
  hints: Record<string, number>;
  c1: { clocks: [boolean, boolean]; meet: YMD | null; confess: YMD | null; solved: boolean };
  c2: { picked: number[] | null; order: number[] | null; solved: boolean };
  c3: { count: number; started: boolean };
  c4: { perm: number[] | null; solved: boolean };
  done: boolean;
  music: boolean;
};

const KEY = "xiaoxin-birthday-v2";

export const initialState = (): GameState => ({
  v: 2,
  screen: "home",
  unlocked: 1,
  hints: {},
  c1: { clocks: [false, false], meet: null, confess: null, solved: false },
  c2: { picked: null, order: null, solved: false },
  c3: { count: 0, started: false },
  c4: { perm: null, solved: false },
  done: false,
  music: true,
});

const isYmd = (x: unknown): x is YMD =>
  !!x && typeof x === "object" && ["y", "m", "d"].every((k) => typeof (x as Record<string, unknown>)[k] === "number");
const isIdxArr = (x: unknown, max: number) =>
  Array.isArray(x) && x.every((n) => Number.isInteger(n) && n >= 0 && n < max) && new Set(x).size === x.length;

/** Validate cached state; any malformed field falls back to its default so the game never white-screens. */
export function sanitize(raw: unknown): GameState {
  const d = initialState();
  if (!raw || typeof raw !== "object") return d;
  const r = raw as Partial<GameState>;
  const screens: Screen[] = ["home", "c1", "c2", "c3", "c4", "final"];
  const s: GameState = { ...d };
  s.unlocked = Number.isInteger(r.unlocked) ? Math.min(5, Math.max(1, r.unlocked!)) : 1;
  s.screen = screens.includes(r.screen as Screen) ? (r.screen as Screen) : "home";
  s.hints = r.hints && typeof r.hints === "object" ? r.hints : {};
  if (r.c1) {
    s.c1 = {
      clocks: Array.isArray(r.c1.clocks) ? [!!r.c1.clocks[0], !!r.c1.clocks[1]] : [false, false],
      meet: isYmd(r.c1.meet) ? r.c1.meet : null,
      confess: isYmd(r.c1.confess) ? r.c1.confess : null,
      solved: !!r.c1.solved,
    };
  }
  if (r.c2) {
    const ok = isIdxArr(r.c2.picked, GIFTS.length) && r.c2.picked!.length === 4;
    s.c2 = {
      picked: ok ? r.c2.picked! : null,
      order: ok && isIdxArr(r.c2.order, GIFTS.length) && r.c2.order!.length === 4 ? r.c2.order! : null,
      solved: !!r.c2.solved,
    };
  }
  if (r.c3) s.c3 = { count: Math.min(CITIES.length, Math.max(0, Number(r.c3.count) || 0)), started: !!r.c3.started };
  if (r.c4) s.c4 = { perm: isIdxArr(r.c4.perm, 9) && r.c4.perm!.length === 9 ? r.c4.perm! : null, solved: !!r.c4.solved };
  s.done = !!r.done;
  s.music = r.music !== false;
  const order: Screen[] = ["c1", "c2", "c3", "c4", "final"];
  if (s.screen !== "home" && order.indexOf(s.screen) + 1 > s.unlocked) s.screen = "home";
  return s;
}

export function useGame() {
  const [state, setState] = useState<GameState>(initialState);
  const [loaded, setLoaded] = useState(false);
  const [hasSave, setHasSave] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const first = useRef(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = sanitize(JSON.parse(raw));
        setHasSave(s.unlocked > 1 || s.c1.clocks.some(Boolean) || s.done);
        setState({ ...s, screen: "home" });
      }
    } catch {
      setStorageOk(false);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      setStorageOk(false);
    }
  }, [state, loaded]);

  const update = useCallback((fn: (s: GameState) => GameState) => setState((s) => fn(s)), []);
  const reset = useCallback(() => {
    const s = initialState();
    setState((prev) => ({ ...s, music: prev.music }));
    setHasSave(false);
  }, []);

  return { state, update, reset, loaded, hasSave, storageOk };
}
