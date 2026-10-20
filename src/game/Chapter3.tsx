import { useEffect, useRef, useState } from "react";
import { Plane } from "lucide-react";
import { CITIES, CITY_INTERLUDES, type City } from "./config";
import { CHINA_PATH, MAP_H, MAP_W, project } from "./china-map";
import { classifyCityTap } from "./logic";
import { sfx } from "./audio";
import { Celebrate, HintBar, Modal } from "./ui";
import type { ChapterProps } from "./types";

const PTS = CITIES.map((c) => project(c.lon, c.lat));

function Film({ city, index, big }: { city: City; index: number; big?: boolean }) {
  return (
    <div className={`film ${big ? "w-64" : "w-24 shrink-0"}`} style={{ transform: `rotate(${index % 2 ? 2 : -2}deg)` }}>
      <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-sm bg-sky">
        {city.photo ? (
          <img src={city.photo} alt={city.name} loading="lazy" className="size-full object-cover" />
        ) : (
          <span className={`font-display text-primary ${big ? "text-3xl" : "text-base"}`}>{city.name}</span>
        )}
      </div>
      <p className={`mt-1 text-center ${big ? "text-sm" : "text-[11px]"}`}>
        {String(index + 1).padStart(2, "0")} · {city.name}
      </p>
    </div>
  );
}

export function Chapter3({ state, update, toast, next }: ChapterProps) {
  const count = state.c3.count;
  const [shake, setShake] = useState<number | null>(null);
  const [popup, setPopup] = useState<number | null>(null);
  const [view, setView] = useState<number | null>(null);
  const [win, setWin] = useState(count >= CITIES.length);
  const strip = useRef<HTMLDivElement>(null);
  const used = state.hints.c3 ?? 0;

  useEffect(() => {
    strip.current?.scrollTo({ left: strip.current.scrollWidth, top: strip.current.scrollHeight, behavior: "smooth" });
  }, [count]);

  const nextCity = CITIES[count];
  const hints = [
    "试着回忆一下，我们是从哪里开始，一站站走到这里的？",
    nextCity ? `下一站，是${nextCity.province}的${nextCity.name}。` : "已经全部点亮啦！",
  ];

  const tap = (i: number) => {
    const kind = classifyCityTap(i, count);
    if (kind === "revisit") {
      sfx.tap();
      setView(i);
      return;
    }
    if (kind === "early") {
      sfx.soft();
      setShake(i);
      setTimeout(() => setShake(null), 800);
      toast("这座城市也有我们的故事，不过好像还没走到这里哦。");
      return;
    }
    sfx.found();
    const n = count + 1;
    update((s) => ({ ...s, c3: { ...s.c3, count: n } }));
    setPopup(i);
    setTimeout(() => setPopup((p) => (p === i ? null : p)), 1800);
    if (CITY_INTERLUDES[n]) setTimeout(() => toast(CITY_INTERLUDES[n]), 1900);
    if (n === CITIES.length) {
      update((s) => ({ ...s, unlocked: Math.max(s.unlocked, 4) }));
      setTimeout(() => {
        sfx.win();
        setWin(true);
      }, 2600);
    }
  };

  if (win)
    return (
      <Celebrate
        lines={["原来不知不觉，我们已经一起走过这么多地方。", "以后，我们还要一起去更远、更美的地方。"]}
        button="继续收藏我们的回忆"
        onNext={next}
      >
        <div className="relative flex max-w-md flex-wrap justify-center gap-1">
          {CITIES.map((c, i) => (
            <div key={c.name} style={{ animation: `rise-in .5s ease-out ${i * 0.08}s both` }} className="scale-75">
              <Film city={c} index={i} />
            </div>
          ))}
        </div>
      </Celebrate>
    );

  const route = PTS.slice(0, count)
    .map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  return (
    <>
      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-3 py-4">
        <p className="text-center font-display text-lg">第三章 · 我们的足迹</p>
        <p className="mb-3 text-center text-xs text-muted-foreground">
          已点亮 {count} / {CITIES.length} 站
        </p>

        {!state.c3.started ? (
          <div className="paper-card mx-auto max-w-md space-y-3 p-6 text-center leading-relaxed">
            {[
              "我们一起去过的地方，好像已经越来越多了。",
              "有些地方很近，有些地方很远。",
              "但只要身边的人是你，每一站都有意义。",
            ].map((t, i) => (
              <p key={i} style={{ animation: `rise-in .7s ease-out ${i * 0.7}s both` }}>
                {t}
              </p>
            ))}
            <p className="font-display text-lg" style={{ animation: "rise-in .7s ease-out 2.1s both" }}>
              请按照我们走过的顺序，点亮属于我们的旅行地图。
            </p>
            <button
              className="btn-love"
              style={{ animation: "rise-in .7s ease-out 2.6s both" }}
              onClick={() => update((s) => ({ ...s, c3: { ...s.c3, started: true } }))}
            >
              开始重走我们的旅程
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 lg:flex-row-reverse">
            <div className="paper-card relative flex-1 overflow-hidden p-2 anim-rise">
              <Plane className="absolute right-6 top-4 size-5 text-primary/50 anim-drift" />
              <span className="absolute left-6 top-6 text-3xl text-card anim-drift">☁</span>
              <div className="relative w-full" style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}>
                <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="absolute inset-0 size-full">
                  <path d={CHINA_PATH} className="fill-card stroke-accent" strokeWidth={2} strokeLinejoin="round" />
                  {count > 1 && (
                    <path
                      key={count}
                      d={route}
                      fill="none"
                      className="stroke-primary"
                      strokeWidth={3}
                      strokeDasharray="6 5"
                      strokeLinecap="round"
                    />
                  )}
                  {PTS.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r={4} className={i < count ? "fill-primary" : "fill-locked"} />
                  ))}
                </svg>
                {CITIES.map((c, i) => {
                  const p = PTS[i];
                  const lit = i < count;
                  const glow = used >= 2 && i === count;
                  return (
                    <div
                      key={c.name}
                      className="absolute"
                      style={{ left: `${(p.x / MAP_W) * 100}%`, top: `${(p.y / MAP_H) * 100}%` }}
                    >
                      <svg className="pointer-events-none absolute overflow-visible" width="1" height="1">
                        <line x1={0} y1={0} x2={c.dx} y2={c.dy} className="stroke-muted-foreground/40" strokeWidth={1} />
                      </svg>
                      <button
                        onClick={() => tap(i)}
                        className={`absolute flex min-h-8 -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 whitespace-nowrap rounded-full border px-2 text-[11px] transition sm:text-xs ${
                          lit
                            ? "border-primary bg-rose-grad text-primary-foreground"
                            : "border-border bg-background/90 text-muted-foreground"
                        } ${shake === i ? "anim-shake" : ""} ${glow ? "shadow-glow" : ""}`}
                        style={{ left: c.dx, top: c.dy }}
                      >
                        <span className={lit ? "anim-breathe inline-block" : ""}>{lit ? "♥" : "♡"}</span>
                        {c.name}
                      </button>
                      {popup === i && (
                        <span className="pointer-events-none absolute -left-4 -top-4 size-8 rounded-full border-2 border-primary anim-ripple" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              ref={strip}
              className="flex gap-3 overflow-x-auto px-1 py-3 lg:max-h-[70vh] lg:w-36 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden"
            >
              {count === 0 && <p className="text-xs text-muted-foreground">点亮城市后，回忆照片会收藏在这里</p>}
              {CITIES.slice(0, count).map((c, i) => (
                <button key={c.name} onClick={() => setView(i)} className="anim-rise">
                  <Film city={c} index={i} />
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {popup !== null && (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center">
          <div style={{ animation: "rise-in .5s ease-out both" }}>
            <Film city={CITIES[popup]} index={popup} big />
            <p className="mt-2 text-center text-sm">{CITIES[popup].memo}</p>
          </div>
        </div>
      )}
      {view !== null && (
        <Modal onClose={() => setView(null)}>
          <div className="flex flex-col items-center">
            <Film city={CITIES[view]} index={view} big />
            <p className="mt-3 text-center text-sm">{CITIES[view].memo}</p>
          </div>
        </Modal>
      )}

      {state.c3.started && (
        <HintBar
          task={nextCity ? "按顺序点亮我们去过的城市" : "旅程全部点亮啦"}
          hints={hints}
          used={used}
          onUse={() => update((s) => ({ ...s, hints: { ...s.hints, c3: Math.min(2, used + 1) } }))}
        />
      )}
    </>
  );
}
