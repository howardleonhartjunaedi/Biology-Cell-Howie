import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

const root = getComputedStyle(document.documentElement);

function readSeconds(name, fallback) {
  const value = root.getPropertyValue(name).trim();
  const seconds = value.endsWith('ms') ? parseFloat(value) / 1000 : parseFloat(value);
  return Number.isFinite(seconds) ? seconds : fallback;
}

function readBezier(name, fallback) {
  const match = root.getPropertyValue(name).match(/cubic-bezier\(([^)]+)\)/);
  const [x1, y1, x2, y2] = match ? match[1].split(',').map(Number) : fallback;
  return `M0,0 C${x1},${y1} ${x2},${y2} 1,1`;
}

export const DURATION = {
  fast: readSeconds('--dur-fast', 0.16),
  base: readSeconds('--dur-base', 0.36),
  slow: readSeconds('--dur-slow', 0.9),
};

export const EASE = {
  out: CustomEase.create('sel-out', readBezier('--ease-out', [0.22, 1, 0.36, 1])),
  inOut: CustomEase.create('sel-in-out', readBezier('--ease-in-out', [0.65, 0, 0.35, 1])),
  in: CustomEase.create('sel-in', readBezier('--ease-in', [0.55, 0, 1, 0.45])),
};

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

gsap.defaults({ ease: EASE.out, duration: DURATION.base });
