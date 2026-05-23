// Deterministic pseudo-random generator so mock data is stable across renders/builds.
export function makeRng(seed: number) {
  let s = seed >>> 0;
  return function rng() {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function hashStr(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

export function range(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}

export function intRange(rng: () => number, min: number, max: number): number {
  return Math.floor(range(rng, min, max + 1));
}

// Build a sparkline of `n` points trending around `change`.
export function sparkline(rng: () => number, n = 24, drift = 0): number[] {
  let v = 100;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    v += (rng() - 0.5) * 3 + drift / n;
    out.push(Number(v.toFixed(2)));
  }
  return out;
}

// ISO timestamp `mins` minutes ago (relative to a fixed reference for determinism).
const REF = new Date("2026-05-23T15:30:00Z").getTime();
export function ago(mins: number): string {
  return new Date(REF - mins * 60_000).toISOString();
}
