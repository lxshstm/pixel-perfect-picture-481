import { useCallback, useEffect, useRef, useState } from "react";
import { useGame, type Screen } from "./store";
import { startMusic, stopMusic } from "./audio";
import { Home } from "./Home";
import { Chapter1 } from "./Chapter1";
import { Chapter2 } from "./Chapter2";
import { Chapter3 } from "./Chapter3";
import { Chapter4 } from "./Chapter4";
import { Finale } from "./Finale";
import { Toast, TopBar } from "./ui";

const ORDER: Screen[] = ["c1", "c2", "c3", "c4", "final"];
const TITLES: Record<string, string> = {
  c1: "心动的两个瞬间",
  c2: "爱你的八份证据",
  c3: "我们的足迹",
  c4: "把我们拼在一起",
  final: "生日快乐，小馨",
};

export function Game() {
  const { state, update, reset, hasSave, storageOk } = useGame();
  const [toastText, setToastText] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lock = useRef(false);

  const toast = useCallback((t: string) => {
    setToastText(t);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastText(null), 2800);
  }, []);

  useEffect(() => {
    if (!storageOk) toast("当前浏览器无法保存进度，可以继续玩，但关闭后可能需要重新开始。");
  }, [storageOk, toast]);

  useEffect(() => () => stopMusic(), []);

  const go = (screen: Screen) => {
    update((s) => ({ ...s, screen }));
    window.scrollTo({ top: 0 });
  };

  const enter = () => {
    if (state.music) startMusic();
    const target = ORDER[Math.min(state.unlocked, 5) - 1];
    if (target) go(target);
  };

  /** Guarded advance to prevent double-skips from rapid taps */
  const next = () => {
    if (lock.current) return;
    lock.current = true;
    setTimeout(() => (lock.current = false), 800);
    const i = ORDER.indexOf(state.screen);
    const target = ORDER[i + 1];
    if (target && ORDER.indexOf(target) + 1 <= state.unlocked) {
      if (target === "final") update((s) => ({ ...s, done: true }));
      go(target);
    }
  };

  const toggleMusic = () => {
    const on = !state.music;
    update((s) => ({ ...s, music: on }));
    if (on) startMusic();
    else stopMusic();
  };

  const restart = () => {
    stopMusic();
    reset();
    window.scrollTo({ top: 0 });
  };

  if (state.screen === "home")
    return <Home hasSave={hasSave} onStart={enter} onContinue={enter} onRestart={restart} />;

  const chapter = ORDER.indexOf(state.screen) + 1;
  const props = { state, update, toast, next };

  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar
        title={TITLES[state.screen] ?? "第24次许愿"}
        chapter={chapter <= 4 ? chapter : undefined}
        music={state.music}
        onMusic={toggleMusic}
        onHome={() => go("home")}
      />
      {state.screen === "c1" && <Chapter1 key="c1" {...props} />}
      {state.screen === "c2" && <Chapter2 key="c2" {...props} />}
      {state.screen === "c3" && <Chapter3 key="c3" {...props} />}
      {state.screen === "c4" && <Chapter4 key="c4" {...props} />}
      {state.screen === "final" && <Finale onRestart={restart} />}
      <Toast text={toastText} />
    </div>
  );
}
