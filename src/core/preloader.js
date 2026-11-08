import { gsap } from 'gsap';
import { DURATION, EASE, prefersReducedMotion } from './motion.js';
import { isCalmMode } from './calm-mode.js';

const STORAGE_KEY = 'sel:preloaded';
const MAX_WAIT_MS = 6000;
const MIN_SHOW_MS = 1000;

function buildOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'preloader';
  overlay.setAttribute('role', 'status');
  overlay.setAttribute('aria-label', 'Memuat halaman');
  overlay.innerHTML = `
    <p class="preloader__word" aria-hidden="true">
      <span class="preloader__mask"><span class="preloader__letter">S</span></span>
      <span class="preloader__mask"><span class="preloader__letter">E</span></span>
      <span class="preloader__mask"><span class="preloader__letter">L</span></span>
    </p>
    <p class="preloader__count"><span class="preloader__number">0</span>%</p>`;
  document.body.append(overlay);
  return overlay;
}

function waitForAssets(onProgress) {
  const usesWebGL = document.body.dataset.preload === '3d' && !isCalmMode();
  let fontsDone = false;
  let assetsDone = !usesWebGL;
  let ratio = 0;

  return new Promise((resolve) => {
    const report = () => {
      const progress = ((fontsDone ? 1 : 0) + (assetsDone ? 1 : ratio)) / 2;
      onProgress(progress);
      if (fontsDone && assetsDone) resolve();
    };
    window.addEventListener('sel:assets-progress', (event) => {
      ratio = event.detail.ratio;
      report();
    });
    window.addEventListener('sel:assets-ready', () => {
      assetsDone = true;
      report();
    });
    document.fonts.ready.then(() => {
      fontsDone = true;
      report();
    });
    setTimeout(resolve, MAX_WAIT_MS);
  });
}

function finish(overlay, done) {
  document.documentElement.classList.remove('preloading');
  overlay.remove();
  try {
    sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {
    // tanpa storage: preloader muncul lagi di halaman berikutnya
  }
  done();
}

export function runPreloader() {
  if (!document.documentElement.classList.contains('preloading')) return Promise.resolve();
  return new Promise((done) => play(done));
}

function play(done) {
  const overlay = buildOverlay();
  const number = overlay.querySelector('.preloader__number');
  const letters = overlay.querySelectorAll('.preloader__letter');
  const counter = { value: 0 };
  const started = performance.now();

  if (prefersReducedMotion()) {
    waitForAssets(() => {}).then(() => finish(overlay, done));
    return;
  }

  gsap.set(letters, { yPercent: 105 });
  waitForAssets((progress) => {
    gsap.to(counter, {
      value: progress * 100,
      duration: DURATION.slow,
      ease: EASE.out,
      onUpdate: () => {
        number.textContent = Math.round(counter.value);
      },
    });
  }).then(() => {
    const wait = Math.max(0, MIN_SHOW_MS - (performance.now() - started)) / 1000;
    gsap
      .timeline({ delay: wait, onComplete: () => finish(overlay, done) })
      .to(counter, { value: 100, duration: DURATION.base, onUpdate: () => (number.textContent = Math.round(counter.value)) })
      .to(letters, { yPercent: 0, duration: DURATION.base * 2, ease: EASE.out, stagger: 0.06 }, '<')
      .to(overlay, { clipPath: 'inset(0% 0% 100% 0%)', duration: DURATION.slow, ease: EASE.inOut }, '+=0.15');
  });
}
