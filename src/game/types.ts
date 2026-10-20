import type { GameState } from "./store";

export type ChapterProps = {
  state: GameState;
  update: (fn: (s: GameState) => GameState) => void;
  toast: (t: string) => void;
  next: () => void;
};
