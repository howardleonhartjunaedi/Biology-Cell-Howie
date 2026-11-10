// Koreografi halaman dalam (bukan Beranda):
// 1) Intro kepala halaman: eyebrow → judul → tagline → kontrol, naik bergantian (stagger).
// 2) Blok konten (kartu, panel, tabel) muncul saat masuk layar, sekali saja.
// Hanya transform + opacity (murah untuk GPU). Gerak dikurangi / Mode Tenang → langsung tampil.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DURATION, EASE, prefersReducedMotion } from './motion.js';
import { isCalmMode } from './calm-mode.js';

gsap.registerPlugin(ScrollTrigger);

const HEADER = 'main > header, main .gate-header, main .lab-header, main .quiz-header';
const BLOCKS = [
  '.scope',
  '.osmo-controls',
  '.result',
  '.remember',
  '.guess',
  '.quiz-card',
  '.summary-card',
  '.credits__group',
  '.team',
  '.closing__line',
  '.table-wrap',
  '.gate-other > div',
  '.fact',
].join(', ');
const RISE = 24;
const STAGGER = 0.08;

const visible = (element) => element.offsetParent !== null && !element.closest('[hidden]');

function introHeader() {
  const header = document.querySelector(HEADER);
  if (!header) return;
  const parts = [...header.querySelectorAll(':scope > *, :scope > div > *')].filter((el) => el.tagName !== 'DIV' && visible(el));
  gsap.from(parts, { y: RISE, opacity: 0, duration: DURATION.slow, ease: EASE.out, stagger: STAGGER, clearProps: 'transform,opacity' });
}

function revealBlocks() {
  const blocks = [...document.querySelectorAll(BLOCKS)].filter((el) => visible(el) && !el.closest(HEADER) && !el.closest('.landing'));
  if (!blocks.length) return;
  gsap.set(blocks, { y: RISE, opacity: 0 });
  ScrollTrigger.batch(blocks, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: DURATION.slow, ease: EASE.out, stagger: STAGGER, clearProps: 'transform,opacity' }),
  });
  // Jaga-jaga: kalau ScrollTrigger tidak sempat berjalan, jangan biarkan konten tetap tersembunyi.
  window.setTimeout(() => {
    blocks.forEach((el) => {
      if (Number(gsap.getProperty(el, 'opacity')) === 0 && el.getBoundingClientRect().top < window.innerHeight) {
        gsap.to(el, { y: 0, opacity: 1, duration: DURATION.base, clearProps: 'transform,opacity' });
      }
    });
  }, 2500);
}

export function setupPageIntro() {
  if (document.body.classList.contains('landing') || prefersReducedMotion() || isCalmMode()) return;
  introHeader();
  revealBlocks();
}
