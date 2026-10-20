/* Self-made synthesized sounds (Web Audio) — no external audio files, never throws. */
let ctx: AudioContext | null = null;
let musicTimer: ReturnType<typeof setInterval> | null = null;
let master: GainNode | null = null;

function ac() {
  try {
    if (!ctx) {
      const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new C();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, start: number, dur: number, vol = 0.08, type: OscillatorType = "sine") {
  const c = ac();
  if (!c || !master) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  const t = c.currentTime + start;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.05);
}

export const sfx = {
  tap: () => tone(880, 0, 0.15, 0.04, "triangle"),
  found: () => [784, 988, 1175].forEach((f, i) => tone(f, i * 0.09, 0.5, 0.06)),
  soft: () => tone(440, 0, 0.3, 0.04),
  win: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.12, 0.9, 0.06)),
  bloom: () => [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.05, 1.4, 0.05)),
};

const MELODY = [523, 659, 784, 659, 587, 698, 880, 698, 523, 659, 784, 1047, 988, 784, 659, 587];
export function startMusic() {
  if (musicTimer || !ac()) return;
  let i = 0;
  musicTimer = setInterval(() => {
    tone(MELODY[i % MELODY.length], 0, 1.2, 0.025, "sine");
    if (i % 4 === 0) tone(MELODY[i % MELODY.length] / 2, 0, 2, 0.02, "sine");
    i++;
  }, 520);
}
export function stopMusic() {
  if (musicTimer) clearInterval(musicTimer);
  musicTimer = null;
}
