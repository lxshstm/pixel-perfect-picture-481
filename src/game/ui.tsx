import { useMemo, useState, type ReactNode } from "react";
import { Heart, Home, Lightbulb, Music, VolumeX, X } from "lucide-react";
import { DEMO_MODE } from "./config";

export function Floaters({ count = 14, kind = "up" }: { count?: number; kind?: "up" | "fall" }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 37) % 100,
        delay: (i * 1.3) % 12,
        dur: 10 + ((i * 7) % 9),
        size: 10 + ((i * 5) % 14),
        glyph: ["♥", "✦", "❀", "♡"][i % 4],
      })),
    [count],
  );
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {items.map((it, i) => (
        <span
          key={i}
          className={i % 2 ? "absolute text-primary/40" : "absolute text-accent/70"}
          style={{
            left: `${it.left}%`,
            [kind === "up" ? "bottom" : "top"]: "-5%",
            fontSize: it.size,
            animation: `${kind === "up" ? "float-up" : "fall"} ${it.dur}s linear ${it.delay}s infinite`,
          }}
        >
          {it.glyph}
        </span>
      ))}
    </div>
  );
}

/** One-shot radial burst of hearts/petals/stars */
export function Burst({ n = 36, className = "" }: { n?: number; className?: string }) {
  const parts = useMemo(
    () =>
      Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        const r = 120 + ((i * 53) % 160);
        return { dx: Math.cos(a) * r, dy: Math.sin(a) * r, g: ["♥", "❀", "✦", "♡"][i % 4], d: (i % 6) * 0.04 };
      }),
    [n],
  );
  return (
    <div aria-hidden className={`pointer-events-none absolute left-1/2 top-1/2 ${className}`}>
      {parts.map((p, i) => (
        <span
          key={i}
          className={i % 3 === 0 ? "absolute text-accent" : "absolute text-primary"}
          style={{
            ["--dx" as string]: `${p.dx}px`,
            ["--dy" as string]: `${p.dy}px`,
            fontSize: 14 + (i % 4) * 4,
            animation: `burst 1.6s cubic-bezier(.2,.7,.3,1) ${p.d}s both`,
          }}
        >
          {p.g}
        </span>
      ))}
    </div>
  );
}

export function TopBar({
  title,
  chapter,
  music,
  onMusic,
  onHome,
}: {
  title: string;
  chapter?: number;
  music: boolean;
  onMusic: () => void;
  onHome: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
      {DEMO_MODE && (
        <div className="bg-accent/60 px-3 py-1 text-center text-xs text-accent-foreground">
          预览模式：日期与礼物顺序为示例数据，发布前请在配置区替换
        </div>
      )}
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-3 py-2">
        <button className="btn-icon" onClick={onHome} aria-label="返回首页">
          <Home className="size-5" />
        </button>
        <div className="min-w-0 flex-1 text-center">
          <div className="truncate font-display text-base font-semibold">{title}</div>
          {chapter ? <div className="text-xs text-muted-foreground">第 {chapter} / 4 章</div> : null}
        </div>
        <button className="btn-icon" onClick={onMusic} aria-label={music ? "关闭音乐" : "开启音乐"}>
          {music ? <Music className="size-5" /> : <VolumeX className="size-5" />}
        </button>
      </div>
    </header>
  );
}

export function HintBar({
  task,
  hints,
  used,
  onUse,
  children,
}: {
  task: string;
  hints: string[];
  used: number;
  onUse: () => void;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="sticky bottom-0 z-20 border-t border-border/60 bg-background/90 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-2">
        <div className="flex items-center gap-2">
          <Heart className="size-4 shrink-0 fill-primary text-primary" />
          <p className="flex-1 text-sm">{task}</p>
          <button className="btn-soft !min-h-10 !px-3 text-sm" onClick={() => setOpen(true)}>
            <Lightbulb className="size-4 text-accent-foreground" /> 提示
          </button>
        </div>
        {children}
      </div>
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <h3 className="font-display text-lg">小小提示</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {hints.slice(0, used).map((h, i) => (
              <li key={i} className="rounded-xl bg-muted p-3">
                {i + 1}. {h}
              </li>
            ))}
          </ul>
          {used < hints.length ? (
            <button className="btn-love mt-4 w-full" onClick={onUse}>
              {used === 0 ? "给我一点点提示" : "再给我一个提示"}
            </button>
          ) : (
            <p className="mt-4 text-center text-xs text-muted-foreground">提示已经全部用完啦，你一定可以的</p>
          )}
        </Modal>
      )}
    </div>
  );
}

export function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4 anim-rise" onClick={onClose}>
      <div className="paper-card relative w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()} role="dialog">
        <button className="btn-icon absolute right-2 top-2" onClick={onClose} aria-label="关闭">
          <X className="size-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

export function Toast({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-24 z-40 flex justify-center px-4">
      <div key={text} className="paper-card anim-rise px-4 py-3 text-center text-sm">
        {text}
      </div>
    </div>
  );
}

/** Full-screen celebration overlay with burst and lines of text */
export function Celebrate({
  lines,
  button,
  onNext,
  children,
}: {
  lines: string[];
  button: string;
  onNext: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-hidden bg-celebrate px-6 text-center">
      <Burst n={48} />
      {children}
      <div className="relative z-10 mt-6 space-y-3">
        {lines.map((l, i) => (
          <p
            key={i}
            className={i === 0 ? "font-display text-2xl leading-relaxed" : "text-base text-muted-foreground"}
            style={{ animation: `rise-in .8s ease-out ${0.6 + i * 0.9}s both` }}
          >
            {l}
          </p>
        ))}
        <button
          className="btn-love mt-4"
          onClick={onNext}
          style={{ animation: `rise-in .8s ease-out ${0.6 + lines.length * 0.9}s both` }}
        >
          {button}
        </button>
      </div>
    </div>
  );
}
