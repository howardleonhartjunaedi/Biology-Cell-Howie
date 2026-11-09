import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isCalmMode } from './calm-mode.js';

const LERP = 0.1;
const WHEEL_MULTIPLIER = 0.9;

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

function onTick(time) {
  lenis.raf(time * 1000);
}

function start() {
  if (lenis) return;
  lenis = new Lenis({ lerp: LERP, wheelMultiplier: WHEEL_MULTIPLIER, smoothWheel: true, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(onTick);
  gsap.ticker.lagSmoothing(0);
}

function stop() {
  if (!lenis) return;
  gsap.ticker.remove(onTick);
  lenis.destroy();
  lenis = null;
}

export function setupSmoothScroll() {
  // Scroll halus dilewati jika pengguna meminta gerak dikurangi (prefers-reduced-motion).
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!isCalmMode() && !reduce) start();
  window.addEventListener('calmmodechange', (event) => (event.detail.on || reduce ? stop() : start()));
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
