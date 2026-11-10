import { setupPage } from '../../core/page-setup.js';
import { isCalmMode } from '../../core/calm-mode.js';
import { prefersReducedMotion } from '../../core/motion.js';
import { setupWordReveal } from './word-reveal.js';
import { createStage } from './stage.js';
import { createScrollSequence } from './scroll-sequence.js';
import './landing.css';
import './hero.css';
import './sequence.css';

const HERO_PASSED_AT = 0.65;
const shortViewport = window.matchMedia('(max-height: 30rem)');

// Preloader menunggu dua hal: tekstur adegan hero (permukaan) dan 25% frame walkthrough.
const loading = { surface: 0, frames: 0, surfaceDone: false, framesDone: false };

function reportLoading() {
  const ratio = ((loading.surfaceDone ? 1 : loading.surface) + (loading.framesDone ? 1 : loading.frames)) / 2;
  window.dispatchEvent(new CustomEvent('sel:assets-progress', { detail: { ratio } }));
  if (loading.surfaceDone && loading.framesDone) window.dispatchEvent(new Event('sel:assets-ready'));
}

window.addEventListener('sel:surface-progress', (event) => {
  loading.surface = event.detail.ratio;
  reportLoading();
});
window.addEventListener('sel:surface-ready', () => {
  loading.surfaceDone = true;
  reportLoading();
});

setupPage({ footer: false });
setupWordReveal();

const hero = document.getElementById('permukaan');

function updateNavOverHero() {
  const overHero = window.scrollY < hero.offsetHeight * HERO_PASSED_AT;
  document.body.classList.toggle('nav-over-hero', overHero);
}

window.addEventListener('scroll', updateNavOverHero, { passive: true });
window.addEventListener('resize', updateNavOverHero);
updateNavOverHero();

let stage = null;
let sequence = null;

function makeSequence(calm, useCanvas) {
  return createScrollSequence({
    calm,
    useCanvas,
    onProgress: (ratio) => {
      loading.frames = ratio;
      reportLoading();
    },
    onReady: () => {
      loading.framesDone = true;
      reportLoading();
    },
  });
}

function start() {
  const calm = isCalmMode() || prefersReducedMotion() || shortViewport.matches;
  // Tanpa WebGL (Mode Tenang) adegan hero tidak dimuat, jadi bagiannya dianggap selesai.
  if (calm) loading.surfaceDone = true;
  sequence = makeSequence(calm, false);
  if (calm) return;
  stage = createStage({ sequence });
  if (!stage) {
    // WebGL gagal dibuat: frame walkthrough digambar ke canvas 2D.
    sequence.dispose();
    sequence = makeSequence(false, true);
  }
  document.documentElement.classList.toggle('webgl-on', Boolean(stage));
  document.fonts.ready.then(() => stage?.resize());
}

function stop() {
  stage?.dispose();
  stage = null;
  sequence?.dispose();
  sequence = null;
  document.documentElement.classList.remove('webgl-on');
}

function restart() {
  stop();
  start();
}

window.addEventListener('calmmodechange', restart);
shortViewport.addEventListener('change', restart);
window.addEventListener('pagehide', stop);
start();
