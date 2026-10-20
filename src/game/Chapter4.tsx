import { useEffect, useState } from "react";
import { CHAPTER4 } from "./config";
import { fixOnePiece, isPuzzleSolved, shuffledPuzzle, swap } from "./logic";
import { sfx } from "./audio";
import { Burst, HintBar } from "./ui";
import type { ChapterProps } from "./types";

const N = CHAPTER4.size;

export function Chapter4({ state, update, next }: ChapterProps) {
  const [sel, setSel] = useState<number | null>(null);
  const [stage, setStage] = useState(state.c4.solved ? 1 : 0);
  const [imgOk, setImgOk] = useState(true);
  const perm = state.c4.perm;
  const used = state.hints.c4 ?? 0;

  useEffect(() => {
    if (!perm) update((s) => ({ ...s, c4: { ...s.c4, perm: shuffledPuzzle(N * N) } }));
  }, [perm, update]);

  useEffect(() => {
    const img = new Image();
    img.onerror = () => setImgOk(false);
    img.src = CHAPTER4.photo;
  }, []);

  const apply = (p: number[]) => {
    update((s) => ({ ...s, c4: { ...s.c4, perm: p } }));
    if (isPuzzleSolved(p) && !state.c4.solved) {
      update((s) => ({ ...s, c4: { ...s.c4, solved: true }, unlocked: Math.max(s.unlocked, 5) }));
      sfx.win();
      setTimeout(() => setStage(1), 600);
    }
  };

  useEffect(() => {
    if (stage < 1 || stage >= 4) return;
    const t = setTimeout(() => setStage(stage + 1), 1600);
    return () => clearTimeout(t);
  }, [stage]);

  const tap = (i: number) => {
    if (!perm || stage > 0) return;
    sfx.tap();
    if (sel === null) return setSel(i);
    if (sel === i) return setSel(null);
    setSel(null);
    apply(swap(perm, sel, i));
  };

  const hints = ["先看看照片边缘，哪些画面应该连在一起？", "我偷偷帮你找到了一块的位置哦。"];

  const pieceStyle = (piece: number) =>
    imgOk
      ? {
          backgroundImage: `url(${CHAPTER4.photo})`,
          backgroundSize: `${N * 100}% ${N * 100}%`,
          backgroundPosition: `${((piece % N) / (N - 1)) * 100}% ${(Math.floor(piece / N) / (N - 1)) * 100}%`,
        }
      : {};

  return (
    <>
      <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col items-center px-3 py-4">
        <p className="font-display text-lg">第四章 · 把我们拼在一起</p>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          最后一份回忆，好像被不小心打乱了。
          <br />
          不过我相信，你一定能把我们重新拼在一起。
        </p>

        <div
          className={`relative mt-4 w-full max-w-[min(92vw,440px)] transition-all duration-1000 ${
            stage > 0 ? "scale-105 rounded-2xl p-2 bg-gold-grad shadow-glow" : "paper-card p-2"
          }`}
        >
          <div
            className={`grid aspect-square w-full transition-all duration-1000 ${stage > 0 ? "gap-0" : "gap-1"}`}
            style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}
          >
            {(perm ?? []).map((piece, slot) => (
              <button
                key={piece}
                onClick={() => tap(slot)}
                aria-label={`拼图块 ${slot + 1}`}
                className={`relative flex items-center justify-center overflow-hidden bg-secondary font-display text-2xl text-primary-foreground transition ${
                  stage > 0 ? "rounded-none" : "rounded-md"
                } ${sel === slot ? "z-10 scale-95 shadow-select" : ""}`}
                style={pieceStyle(piece)}
              >
                {!imgOk && piece + 1}
              </button>
            ))}
          </div>
          {stage > 0 && <Burst n={30} />}
        </div>

        <div className="mt-6 min-h-32 space-y-2 text-center">
          {stage >= 1 && <p className="font-display text-xl anim-rise">照片终于完整啦。</p>}
          {stage >= 2 && <p className="anim-rise">不过，我最想拼在一起的，从来不只是照片。</p>}
          {stage >= 3 && <p className="font-display text-2xl text-primary anim-rise">是和你的未来。</p>}
          {stage >= 4 && (
            <button className="btn-love mt-2 anim-rise" onClick={next}>
              <span className="text-xl">🗝</span> 用爱心钥匙打开生日礼盒
            </button>
          )}
        </div>
      </main>
      {stage === 0 && (
        <HintBar
          task="点两块拼图交换位置，把合照还原"
          hints={hints}
          used={used}
          onUse={() => {
            update((s) => ({ ...s, hints: { ...s.hints, c4: Math.min(2, used + 1) } }));
            if (used === 1 && perm) apply(fixOnePiece(perm));
          }}
        />
      )}
    </>
  );
}
