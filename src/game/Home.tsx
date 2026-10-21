import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bubbu } from "./Bubbu";
import { BASIC, BUBBU } from "./config";
import { Floaters } from "./ui";

export function Home({
  hasSave,
  onStart,
  onContinue,
  onRestart,
}: {
  hasSave: boolean;
  onStart: () => void;
  onContinue: () => void;
  onRestart: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 py-10">
      <Floaters />
      <h1 className="relative z-10 mb-8 text-center font-display text-3xl">{BASIC.title}</h1>

      {!open ? (
        <div className="relative z-10 flex flex-col items-center gap-8 anim-rise">
          <p className="font-display text-sm text-muted-foreground">给小馨的第24份生日心意</p>
          <Button variant="ghost"
            onClick={() => setOpen(true)}
            aria-label="打开信封"
            className="group relative h-52 w-80 max-w-[86vw] [perspective:800px] transition active:scale-95"
          >
            <div className="absolute inset-0 rounded-2xl bg-card shadow-soft" />
            <div
              className="absolute inset-x-0 top-0 h-28 origin-top rounded-t-2xl bg-paper"
              style={{ clipPath: "polygon(0 0,100% 0,50% 100%)", filter: "brightness(0.97)" }}
            />
            <div className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 bg-secondary" />
            <div className="absolute left-1/2 top-1/2 h-full w-3 -translate-x-1/2 -translate-y-1/2 bg-secondary/80" />
            <div className="absolute left-1/2 top-[54%] flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-rose-grad text-2xl text-primary-foreground shadow-soft group-hover:anim-heartbeat">
              {BUBBU.assets.seal ? <Bubbu name="seal" size="sm" eager /> : "♥"}
            </div>
            <span className="absolute bottom-4 right-6 font-display text-lg text-foreground/80">
              {BASIC.name}亲启
            </span>
          </Button>
          <p className="text-sm text-muted-foreground">轻轻点一下信封</p>
          {hasSave && (
            <div className="flex flex-col items-center gap-2">
              <Button variant="ghost" className="btn-love" onClick={onContinue}>
                继续上次的回忆
              </Button>
              <Button variant="ghost" className="btn-soft text-sm" onClick={() => setConfirm(true)}>
                重新开始
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="relative z-10 w-full max-w-md">
          <div className="paper-card p-6 leading-loose" style={{ animation: "letter-out 1s ease-out both" }}>
            {BASIC.introLetter.map((l, i) => (
              <p
                key={i}
                className={i === 0 ? "font-display text-lg" : "indent-8 text-[15px]"}
                style={{ animation: `rise-in .6s ease-out ${0.6 + i * 0.25}s both` }}
              >
                {l}
              </p>
            ))}
          </div>
          <div className="mt-6 flex flex-col items-center gap-3" style={{ animation: "rise-in .6s ease-out 2.8s both" }}>
            <Button variant="ghost" className="btn-love text-lg" onClick={hasSave ? onContinue : onStart}>
              {hasSave ? "继续上次的回忆" : "开启我们的回忆之旅"}
            </Button>
            <p className="text-xs text-muted-foreground">建议戴上耳机，也可以和我打着语音慢慢玩。</p>
          </div>
        </div>
      )}

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4">
          <div className="paper-card w-full max-w-xs p-5 text-center">
            <p>真的要从最开始重新走一遍吗？</p>
            <div className="mt-4 flex justify-center gap-3">
              <Button variant="ghost" className="btn-soft" onClick={() => setConfirm(false)}>
                再想想
              </Button>
              <Button variant="ghost"
                className="btn-love"
                onClick={() => {
                  setConfirm(false);
                  onRestart();
                }}
              >
                重新开始
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
