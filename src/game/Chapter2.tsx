import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShowcaseCard } from "./ShowcaseCard";
import { Bubbu } from "./Bubbu";
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
  const viewedGift = view === null ? undefined : GIFTS[view];
  const used = state.hints["c2"] ?? 0;

  const hints = ["这些礼物都很特别，但它们来到你身边的时间不一样哦。"];
  if (picked) {
    const firstIndex = correctGiftOrder(GIFTS, picked)[0];
    const first = firstIndex === undefined ? undefined : GIFTS[firstIndex];
    if (first) hints.push(`悄悄告诉你，这四件里面，最早收到的是「${first.name}」。`);
  } else hints.push("先点「开始回忆挑战」，看看是哪四份礼物吧。");

  const begin = () => {
    const p = pickGifts(GIFTS, 4);
    if (p.length < 4) {
      toast("还没有配置足够的礼物赠送顺序，请先在配置区填写。");
      return;
    }
    let o = [...p];
    while (isGiftOrderCorrect(GIFTS, o)) o = swap(o, 0, 1);
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
        <div className="museum-heading">
          <Bubbu name="curator" size="md" />
          <div className="text-center"><h2 className="font-display">爱你的八份证据</h2>
          <p>第二章 · 礼物收藏馆</p></div>
        </div>

        {!picked ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {GIFTS.map((g, i) => (
                <ShowcaseCard key={g.no} gift={g} index={i} onClick={() => {
                  sfx.tap();
                  setView(i);
                }} />
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button variant="ghost" className="btn-love" onClick={() => setTask(true)}>
                开始回忆挑战
              </Button>
            </div>
          </>
        ) : (
          <div className="anim-rise">
            <p className="mb-3 text-center text-sm">
              四份心意，一条属于我们的时间线。
            </p>
            <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {(order ?? []).map((gi, i) => {
                const g = GIFTS[gi];
                if (!g) return null;
                return <ShowcaseCard key={gi} gift={g} position={i + 1}
                  selected={sel === i} busy={busy} onClick={() => tapSort(i)} />;
              })}
            </div>
            <div className="museum-timeline">
              <span>最早的心意</span>
              <span>最近的礼物 →</span>
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
          <Button variant="ghost" className="btn-love w-full" onClick={confirm} disabled={busy}>
            确认我们的礼物时间线
          </Button>
        )}
      </HintBar>

      {viewedGift && (
        <Modal onClose={() => setView(null)}>
          <div className="museum-detail-image">
            <GiftArt gift={viewedGift} large />
          </div>
          <p className="museum-detail-label">馆藏 · {viewedGift.no}</p>
          <p className="font-display text-lg">{viewedGift.name}</p>
          {viewedGift.givenAt && <p className="museum-inscription">{viewedGift.givenAt}</p>}
          <p className="mt-3 border-t border-border pt-3 text-sm leading-loose">“{viewedGift.text}”</p>
        </Modal>
      )}
      {task && (
        <Modal onClose={() => setTask(false)}>
          <Bubbu name="handhold" size="md" className="mx-auto mb-3 block" />
          <p className="font-display text-lg">回忆挑战</p>
          <p className="mt-3 text-sm leading-relaxed">
            这些礼物里，藏着我们一路走来的时间线。
            <br />
            我悄悄挑出了四份心意。
            <br />
            小馨，你还记得它们来到你身边的先后顺序吗？
          </p>
          <Button variant="ghost" className="btn-love mt-4 w-full" onClick={begin}>
            看看是哪四份礼物
          </Button>
        </Modal>
      )}
    </>
  );
}
