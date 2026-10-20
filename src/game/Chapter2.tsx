import { useState } from "react";
import { GIFTS } from "./config";
import { correctGiftOrder, isGiftOrderCorrect, pickGifts, swap } from "./logic";
import { sfx } from "./audio";
import { Celebrate, HintBar, Modal } from "./ui";
import { GiftArt } from "./giftIcon";
import type { ChapterProps } from "./types";

export function Chapter2({ state, update, toast, next }: ChapterProps) {
  const [view, setView] = useState<number | null>(null);
  const [task, setTask] = useState(false);
  const [sel, setSel] = useState<number | null>(null);
  const [win, setWin] = useState(state.c2.solved);
  const [busy, setBusy] = useState(false);
  const { picked, order } = state.c2;
  const used = state.hints.c2 ?? 0;

  const hints = ["这些礼物都很特别，但它们来到你身边的时间不一样哦。"];
  if (picked) {
    const first = GIFTS[correctGiftOrder(GIFTS, picked)[0]];
    hints.push(`悄悄告诉你，这四件里面，最早收到的是「${first.name}」。`);
  } else hints.push("先点「开始回忆挑战」，看看是哪四份礼物吧。");

  const begin = () => {
    const p = pickGifts(GIFTS, 4);
    if (p.length < 4) {
      toast("还没有配置足够的礼物赠送顺序，请先在配置区填写。");
      return;
    }
    let o = [...p];
    while (isGiftOrderCorrect(GIFTS, o)) o = [o[1], o[0], ...o.slice(2)];
    update((s) => ({ ...s, c2: { ...s.c2, picked: p, order: o } }));
    setTask(false);
  };

  const tapSort = (i: number) => {
    if (!order || busy) return;
    sfx.tap();
    if (sel === null) return setSel(i);
    if (sel === i) return setSel(null);
    update((s) => ({ ...s, c2: { ...s.c2, order: swap(order, sel, i) } }));
    setSel(null);
  };

  const confirm = () => {
    if (!order || busy) return;
    if (isGiftOrderCorrect(GIFTS, order)) {
      setBusy(true);
      sfx.win();
      update((s) => ({ ...s, c2: { ...s.c2, solved: true }, unlocked: Math.max(s.unlocked, 3) }));
      setTimeout(() => setWin(true), 1200);
    } else {
      sfx.soft();
      toast("好像有两份心意站错了位置，再想想它们来到你身边的先后吧。");
    }
  };

  if (win)
    return (
      <Celebrate
        lines={["礼物有先后，爱你没有期限。", "谢谢你，把我的每一份心意都收藏得这么好。"]}
        button="下一站，去看看我们一起走过的世界"
        onNext={next}
      >
        <div className="relative size-48">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 -ml-3 -mt-3 text-2xl text-accent anim-orbit"
              style={{ animationDelay: `${-i * 0.6}s` }}
            >
              ✦
            </span>
          ))}
          <span className="absolute inset-0 flex items-center justify-center text-7xl text-primary anim-heartbeat">♥</span>
        </div>
      </Celebrate>
    );

  return (
    <>
      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-3 py-4">
        <p className="text-center font-display text-lg">第二章 · 爱你的八份证据</p>
        <p className="mb-4 text-center text-xs text-muted-foreground">礼物收藏馆 · 展柜编号不代表赠送顺序</p>

        {!picked ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {GIFTS.map((g, i) => (
                <button
                  key={g.no}
                  onClick={() => {
                    sfx.tap();
                    setView(i);
                  }}
                  className="paper-card group overflow-hidden p-2 text-left transition hover:-translate-y-1"
                >
                  <div className="aspect-square overflow-hidden rounded-xl border border-border">
                    <GiftArt gift={g} />
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">展柜 {g.no}</p>
                  <p className="text-sm leading-snug">{g.name}</p>
                </button>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button className="btn-love" onClick={() => setTask(true)}>
                开始回忆挑战
              </button>
            </div>
          </>
        ) : (
          <div className="anim-rise">
            <p className="mb-3 text-center text-sm">
              点一张礼物，再点另一张，它们就会交换位置。从 <b>最早</b> 排到 <b>最晚</b>。
            </p>
            <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {order!.map((gi, i) => {
                const g = GIFTS[gi];
                return (
                  <button
                    key={gi}
                    onClick={() => tapSort(i)}
                    className={`paper-card relative overflow-hidden p-2 text-left transition ${
                      sel === i ? "shadow-select -translate-y-1" : ""
                    } ${busy ? "shadow-glow" : ""}`}
                    style={busy ? { animation: `heartbeat 1s ease-in-out ${i * 0.2}s` } : undefined}
                  >
                    <span className="absolute left-3 top-3 z-10 flex size-7 items-center justify-center rounded-full bg-rose-grad text-sm text-primary-foreground">
                      {i + 1}
                    </span>
                    <div className="aspect-square overflow-hidden rounded-xl border border-border">
                      <GiftArt gift={g} />
                    </div>
                    <p className="mt-2 text-[11px] text-muted-foreground">展柜 {g.no}</p>
                    <p className="text-sm leading-snug">{g.name}</p>
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex justify-between px-1 text-xs text-muted-foreground sm:mx-auto sm:max-w-2xl">
              <span>← 最早</span>
              <span>最晚 →</span>
            </div>
          </div>
        )}
      </main>

      <HintBar
        task={picked ? "把四份心意按赠送时间排好" : "随便逛逛礼物收藏馆吧"}
        hints={hints}
        used={used}
        onUse={() => update((s) => ({ ...s, hints: { ...s.hints, c2: Math.min(2, used + 1) } }))}
      >
        {picked && (
          <button className="btn-love w-full" onClick={confirm} disabled={busy}>
            确认我们的礼物时间线
          </button>
        )}
      </HintBar>

      {view !== null && (
        <Modal onClose={() => setView(null)}>
          <div className="aspect-square overflow-hidden rounded-xl border border-border">
            <GiftArt gift={GIFTS[view]} large />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">展柜 {GIFTS[view].no}</p>
          <p className="font-display text-lg">{GIFTS[view].name}</p>
          <p className="mt-2 text-sm leading-relaxed">“{GIFTS[view].text}”</p>
        </Modal>
      )}
      {task && (
        <Modal onClose={() => setTask(false)}>
          <p className="font-display text-lg">回忆挑战</p>
          <p className="mt-3 text-sm leading-relaxed">
            这些礼物里，藏着我们一路走来的时间线。
            <br />
            我悄悄挑出了四份心意。
            <br />
            小馨，你还记得它们来到你身边的先后顺序吗？
          </p>
          <button className="btn-love mt-4 w-full" onClick={begin}>
            看看是哪四份礼物
          </button>
        </Modal>
      )}
    </>
  );
}
