import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { CHAPTER1, DEMO_MODE, type YMD } from "./config";
import { daysInMonth, sameDate } from "./logic";
import { sfx } from "./audio";
import { Celebrate, Floaters, HintBar } from "./ui";
import type { ChapterProps } from "./types";

const fmt = (d: YMD) => `${d.y} 年 ${d.m} 月 ${d.d} 日`;

export function Chapter1({ state, update, toast, next }: ChapterProps) {
  const [tab, setTab] = useState(0);
  const [bubble, setBubble] = useState<{ scene: number; id: string; text: string } | null>(null);
  const [spinning, setSpinning] = useState<string | null>(null);
  const [petals, setPetals] = useState(false);
  const [win, setWin] = useState(state.c1.solved);
  const { clocks } = state.c1;
  const both = clocks[0] && clocks[1];
  const used = state.hints["c1"] ?? 0;

  const hints = [...CHAPTER1.hints];
  if (DEMO_MODE) hints[1] += `（预览答案：${fmt(CHAPTER1.meetDate)} / ${fmt(CHAPTER1.confessDate)}）`;

  const tapHotspot = (scene: number, id: string, text: string, clock?: boolean) => {
    if (clock) {
      sfx.found();
      setSpinning(id);
      setTimeout(() => setSpinning(null), 1300);
      if (!clocks[scene]) {
        update((s) => {
          const c: [boolean, boolean] = [...s.c1.clocks];
          c[scene] = true;
          return { ...s, c1: { ...s.c1, clocks: c } };
        });
        if (scene === 1) {
          setPetals(true);
          setTimeout(() => setPetals(false), 6000);
        }
      }
      const foundScene = CHAPTER1.scenes[scene];
      if (foundScene) toast(foundScene.clockFound);
      return;
    }
    sfx.tap();
    setBubble({ scene, id, text });
  };

  const submit = () => {
    const { meet, confess } = state.c1;
    if (!meet || !confess) {
      toast("两个特别的日子都要选好哦。");
      return;
    }
    if (sameDate(meet, CHAPTER1.meetDate) && sameDate(confess, CHAPTER1.confessDate)) {
      sfx.bloom();
      update((s) => ({ ...s, c1: { ...s.c1, solved: true }, unlocked: Math.max(s.unlocked, 2) }));
      setWin(true);
    } else {
      sfx.soft();
      toast("是不是有一天被我们偷偷记错啦？再想想哦。");
    }
  };

  if (win) {
    return (
      <Celebrate
        lines={["从遇见你的那一天起，我的世界就不再一样。"]}
        button="进入下一段回忆"
        onNext={next}
      >
        <div className="relative text-[120px] leading-none text-primary anim-heartbeat drop-shadow-lg">♥</div>
      </Celebrate>
    );
  }

  return (
    <>
      {petals && <Floaters count={22} kind="fall" />}
      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-3 py-4">
        <p className="mb-3 text-center font-display text-lg">第一章 · 心动的两个瞬间</p>

        <div className="mb-3 flex justify-center gap-2 md:hidden">
          {CHAPTER1.scenes.map((s, i) => (
            <button
              key={i}
              onClick={() => setTab(i)}
              className={tab === i ? "btn-love !min-h-10 !px-4 text-sm" : "btn-soft !min-h-10 !px-4 text-sm"}
            >
              {s.tag} {clocks[i] && "⏰"}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {CHAPTER1.scenes.map((scene, si) => (
            <section key={si} className={tab === si ? "block" : "hidden md:block"}>
              <div className="paper-card overflow-hidden p-2">
                <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: "4 / 3" }}>
                  <img
                    src={scene.image}
                    alt={scene.title}
                    width={1024}
                    height={768}
                    className="absolute inset-0 size-full object-cover"
                  />
                  {scene.hotspots.map((h) => {
                    const isClock = !!h.clock;
                    const found = isClock && clocks[si];
                    return (
                      <button
                        key={h.id}
                        aria-label={isClock ? "时钟" : h.id}
                        onClick={() => tapHotspot(si, h.id, h.text, h.clock)}
                        className={`absolute rounded-xl transition active:scale-95 ${
                          found ? "shadow-glow" : "hover:bg-card/15"
                        } ${spinning === h.id ? "anim-spin-once" : ""}`}
                        style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }}
                      />
                    );
                  })}
                  {bubble?.scene === si && (
                    <button
                      onClick={() => setBubble(null)}
                      className="paper-card absolute inset-x-3 bottom-3 p-3 text-left text-sm anim-rise"
                    >
                      {bubble.text}
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between px-2 pb-1 pt-2">
                  <div>
                    <p className="font-display">《{scene.title}》</p>
                    <p className="text-xs text-muted-foreground">{scene.caption}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${
                      clocks[si] ? "bg-gold-grad text-accent-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {scene.clockLabel} · {clocks[si] ? "已找到" : "未找到"}
                  </span>
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-2 text-center md:hidden">
          <button className="btn-soft !min-h-10 text-sm" onClick={() => setTab(1 - tab)}>
            {tab === 0 ? (
              <>
                去看看告白那天 <ChevronRight className="size-4" />
              </>
            ) : (
              <>
                <ChevronLeft className="size-4" /> 回到初见那天
              </>
            )}
          </button>
        </div>

        <section className="paper-card mt-5 p-4">
          {!both ? (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
              <Clock className="size-4" /> 日历被锁住了……找到两只时钟才能打开它（{clocks.filter(Boolean).length}/2）
            </div>
          ) : (
            <div className="anim-rise">
              <p className="mb-3 text-center font-display text-lg">复古手账日历</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <DatePicker
                  label="我们初次见面的日子"
                  value={state.c1.meet}
                  onChange={(v) => update((s) => ({ ...s, c1: { ...s.c1, meet: v } }))}
                />
                <DatePicker
                  label="我们正式告白的日子"
                  value={state.c1.confess}
                  onChange={(v) => update((s) => ({ ...s, c1: { ...s.c1, confess: v } }))}
                />
              </div>
              <button className="btn-love mt-4 w-full" onClick={submit}>
                让两个特别的日子相遇
              </button>
            </div>
          )}
        </section>
      </main>
      <HintBar
        task={both ? "选出两个特别的日子吧" : "在两段回忆里找找，有什么在悄悄记录时间"}
        hints={hints}
        used={used}
        onUse={() => update((s) => ({ ...s, hints: { ...s.hints, c1: Math.min(2, used + 1) } }))}
      />
    </>
  );
}

function DatePicker({ label, value, onChange }: { label: string; value: YMD | null; onChange: (v: YMD) => void }) {
  const [y, setY] = useState(value?.y ?? CHAPTER1.yearRange[1] - 2);
  const [m, setM] = useState(value?.m ?? 1);
  const years = [];
  for (let i = CHAPTER1.yearRange[0]; i <= CHAPTER1.yearRange[1]; i++) years.push(i);
  const days = daysInMonth(y, m);
  const offset = new Date(y, m - 1, 1).getDay();
  const shiftMonth = (d: number) => {
    let nm = m + d;
    let ny = y;
    if (nm < 1) [nm, ny] = [12, y - 1];
    if (nm > 12) [nm, ny] = [1, y + 1];
    if (ny < CHAPTER1.yearRange[0] || ny > CHAPTER1.yearRange[1]) return;
    setM(nm);
    setY(ny);
  };

  return (
    <div className="rounded-2xl border border-dashed border-secondary bg-background p-3">
      <p className="mb-2 text-center text-sm font-medium">{label}</p>
      <div className="mb-2 flex items-center justify-between gap-1">
        <button className="btn-icon !size-9" onClick={() => shiftMonth(-1)} aria-label="上个月">
          <ChevronLeft className="size-4" />
        </button>
        <select
          className="rounded-lg border border-border bg-card px-2 py-1.5 text-sm"
          value={y}
          onChange={(e) => setY(Number(e.target.value))}
          aria-label="年份"
        >
          {years.map((yy) => (
            <option key={yy} value={yy}>
              {yy} 年
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-border bg-card px-2 py-1.5 text-sm"
          value={m}
          onChange={(e) => setM(Number(e.target.value))}
          aria-label="月份"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1}>
              {i + 1} 月
            </option>
          ))}
        </select>
        <button className="btn-icon !size-9" onClick={() => shiftMonth(1)} aria-label="下个月">
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {"日一二三四五六".split("").map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: offset }, (_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const d = i + 1;
          const sel = value && value.y === y && value.m === m && value.d === d;
          return (
            <button
              key={d}
              onClick={() => {
                sfx.tap();
                onChange({ y, m, d });
              }}
              className={`aspect-square rounded-lg text-sm transition ${
                sel ? "bg-rose-grad text-primary-foreground shadow-soft" : "hover:bg-muted"
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">{value ? `已选：${fmt(value)}` : "还没有选择"}</p>
    </div>
  );
}
