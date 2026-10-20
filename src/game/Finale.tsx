import { useEffect, useRef, useState } from "react";
import { FINALE } from "./config";
import { sfx } from "./audio";
import { Burst, Floaters, Modal } from "./ui";

export function Finale({ onRestart }: { onRestart: () => void }) {
  const [phase, setPhase] = useState<"box" | "opening" | "open">("box");
  const [secret, setSecret] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [big, setBig] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase !== "open") return;
    const t = setInterval(() => setSlide((s) => (s + 1) % FINALE.carousel.length), 4000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    const el = track.current;
    if (el) el.scrollTo({ left: el.clientWidth * slide, behavior: "smooth" });
  }, [slide]);

  const open = () => {
    sfx.bloom();
    setPhase("opening");
    setTimeout(() => {
      sfx.win();
      setPhase("open");
    }, 1700);
  };

  if (phase !== "open")
    return (
      <main className="relative flex min-h-[80dvh] flex-1 flex-col items-center justify-center px-6">
        <Floaters />
        <div className={`relative z-10 ${phase === "opening" ? "anim-wobble" : ""}`}>
          <div
            className="relative z-10 mx-auto h-10 w-60 rounded-lg bg-rose-grad shadow-soft"
            style={phase === "opening" ? { animation: "lid-pop .8s ease-in .9s both" } : undefined}
          >
            <div className="absolute left-1/2 top-0 h-full w-6 -translate-x-1/2 bg-gold-grad" />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-4xl text-accent">🎀</div>
          </div>
          <div className="relative mx-auto h-44 w-52 rounded-b-xl bg-secondary shadow-soft">
            <div className="absolute left-1/2 top-0 h-full w-6 -translate-x-1/2 bg-gold-grad" />
            <div className="absolute -right-10 top-6 rotate-6 rounded-md bg-card px-2 py-1 text-xs shadow-soft">
              小馨的专属生日礼物
            </div>
          </div>
          {phase === "opening" && <Burst n={60} className="top-0" />}
        </div>
        {phase === "box" && (
          <button className="btn-love relative z-10 mt-10 text-lg" onClick={open}>
            打开我的生日礼物
          </button>
        )}
      </main>
    );

  return (
    <main className="relative flex-1 bg-celebrate">
      <Floaters count={18} kind="fall" />
      <div className="relative z-10 mx-auto max-w-xl px-4 py-10">
        <h1 className="text-center font-display text-3xl leading-snug anim-rise">生日快乐，我最爱的小馨！</h1>

        <div className="relative mt-8">
          <div ref={track} className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]">
            {FINALE.carousel.map((p, i) => (
              <div key={i} className="w-full shrink-0 snap-center px-6">
                <button
                  onClick={() => setBig(i)}
                  className="film mx-auto block w-full max-w-xs"
                  style={{ transform: `rotate(${i % 2 ? 2 : -2}deg)` }}
                >
                  <img src={p.src} alt={p.caption} loading="lazy" className="aspect-square w-full rounded-sm object-cover" />
                  <p className="mt-2 font-display text-sm">{p.caption}</p>
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-center gap-2">
            {FINALE.carousel.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`第 ${i + 1} 张`}
                className={`h-2 rounded-full transition-all ${i === slide ? "w-6 bg-primary" : "w-2 bg-secondary"}`}
              />
            ))}
          </div>
        </div>

        <article className="paper-card mt-10 p-6 leading-loose">
          <h2 className="mb-3 text-center font-display text-xl">《{FINALE.letterTitle}》</h2>
          {FINALE.letter.map((l, i) => (
            <p key={i} className={i === 0 ? "font-display" : i >= FINALE.letter.length - 3 ? "text-right font-display" : "indent-8"}>
              {l}
            </p>
          ))}
        </article>

        <p className="mt-10 text-center text-sm leading-relaxed text-muted-foreground">{FINALE.closing}</p>

        <div className="mt-6 flex flex-col items-center gap-6">
          <button className="btn-soft" onClick={() => setConfirm(true)}>
            再陪我回忆一次
          </button>
          <button
            aria-label="小爱心"
            onClick={() => {
              sfx.bloom();
              setSecret(true);
            }}
            className="size-11 text-xs text-primary/40 transition hover:text-primary"
          >
            ♥
          </button>
        </div>
      </div>

      {secret && (
        <Modal onClose={() => setSecret(false)}>
          <div className="relative py-2 text-center">
            <Burst n={24} />
            <p className="text-sm text-muted-foreground">嘘……这里还有一句只说给小馨听的话。</p>
            <p className="mt-4 font-display text-lg leading-relaxed">{FINALE.secret}</p>
          </div>
        </Modal>
      )}
      {big !== null && (
        <Modal onClose={() => setBig(null)}>
          <img src={FINALE.carousel[big].src} alt={FINALE.carousel[big].caption} className="w-full rounded-lg" />
        </Modal>
      )}
      {confirm && (
        <Modal onClose={() => setConfirm(false)}>
          <p className="text-center">真的要从最开始重新走一遍吗？</p>
          <div className="mt-4 flex justify-center gap-3">
            <button className="btn-soft" onClick={() => setConfirm(false)}>
              再想想
            </button>
            <button className="btn-love" onClick={onRestart}>
              重新开始
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}
