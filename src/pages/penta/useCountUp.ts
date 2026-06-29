import { useEffect, useRef, useState } from 'react';

const prefersReduced = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion:reduce)').matches;

const fin = (to: number, dec: boolean): string => (dec ? (+to).toFixed(1) : String(Math.round(to)));

/**
 * Count-up hook. Animates 0 → `to` with an ease-out cubic over `dur` ms,
 * re-running whenever `to` changes. Honors reduced-motion and guards against
 * NaN/negative frames, always settling on the exact final value.
 * `active` gates the start (e.g. only run once the section is on screen).
 */
export function useCountUp(to: number, dur = 800, dec = false, active = true): string {
  const [text, setText] = useState<string>(() => (active ? (dec ? '0.0' : '0') : fin(to, dec)));
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setText(fin(to, dec));
      return;
    }
    if (prefersReduced()) {
      setText(fin(to, dec));
      return;
    }
    let start: number | null = null;
    setText(dec ? '0.0' : '0');
    const step = (now: number) => {
      if (start === null) start = now;
      let k = (now - start) / dur;
      if (!(k >= 0)) k = 1; // NaN / clock guard
      k = Math.min(1, k);
      const e = 1 - Math.pow(1 - k, 3);
      const val = Math.max(0, to * e);
      setText(dec ? val.toFixed(1) : String(Math.round(val)));
      if (k < 1) raf.current = requestAnimationFrame(step);
      else setText(fin(to, dec));
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [to, dur, dec, active]);

  return text;
}
