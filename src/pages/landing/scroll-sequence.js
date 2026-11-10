// Walkthrough Beranda gaya "scroll-scrub": video dipotong jadi gambar (public/seq), lalu posisi
// scroll menentukan gambar mana yang tampil. Section #perjalanan di-pin (diam di layar) sepanjang
// 600% tinggi layar; timeline GSAP yang di-scrub mengatur progres frame dan panel teks.
// Mode Tenang / gerak dikurangi: 6 gambar diam berurutan beserta teksnya, tanpa pin.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import beatsData from '../../data/landing-beats.json';
import { createFrameStore, stillUrl } from './sequence/frames.js';
import { createCanvasDrawer } from './sequence/canvas2d.js';
import { buildBeat } from './sequence/panels.js';

gsap.registerPlugin(ScrollTrigger);

const PIN_LENGTH = '+=600%';
const SCRUB = 0.5;
const LINE_IN = 0.03;
const LINE_OUT = 0.025;
const LINE_STAGGER = 0.006;
// Masker terbuka sedikit melebihi kotak teks, supaya huruf tebal yang lebar tidak terpotong.
const OPEN_MASK = 'inset(-20% -40% -20% -10%)';

function buildStatic(section) {
  const list = section.querySelector('.sequence__stills');
  beatsData.beats.forEach((beat) => {
    const figure = document.createElement('figure');
    figure.className = 'still';
    const image = document.createElement('img');
    image.className = 'still__image';
    image.src = stillUrl(beat.still);
    image.alt = '';
    image.loading = 'lazy';
    image.width = 1280;
    image.height = 720;
    figure.append(image, buildBeat(beat));
    list.append(figure);
  });
  document.body.classList.add('sequence-static');
  // Bagian ringkasan + tombol akhir memakai frame terakhir sebagai latar (bukan layar hitam).
  document.body.style.setProperty('--last-frame', `url(${stillUrl(Infinity)})`);
  return {
    imageAt: () => null,
    progress: () => 1,
    dispose() {
      list.replaceChildren();
      document.body.classList.remove('sequence-static');
      document.body.style.removeProperty('--last-frame');
    },
  };
}

function beatTimeline(timeline, article, beat) {
  const lines = article.querySelectorAll('.beat__line');
  timeline.fromTo(article, { opacity: 0 }, { opacity: 1, duration: 0.001 }, beat.from);
  timeline.fromTo(
    lines,
    { yPercent: 60, clipPath: 'inset(0% -40% 100% -10%)' },
    { yPercent: 0, clipPath: OPEN_MASK, duration: LINE_IN, stagger: LINE_STAGGER, ease: 'power2.out' },
    beat.from
  );
  timeline.to(lines, { yPercent: -30, opacity: 0, duration: LINE_OUT, stagger: LINE_STAGGER / 2, ease: 'power2.in' }, beat.to - LINE_OUT);
  timeline.set(article, { opacity: 0 }, beat.to);
}

function buildScrub(section, { useCanvas, onProgress, onReady }) {
  const panels = section.querySelector('.sequence__panels');
  const articles = beatsData.beats.map((beat) => panels.appendChild(buildBeat(beat)));
  const frames = createFrameStore({ onProgress, onReady });
  const state = { progress: 0 };
  document.body.classList.add('sequence-live');

  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: section, start: 'top top', end: PIN_LENGTH, pin: true, scrub: SCRUB, anticipatePin: 1 },
  });
  timeline.to(state, { progress: 1, duration: 1 }, 0);
  articles.forEach((article, index) => beatTimeline(timeline, article, beatsData.beats[index]));

  // Tanpa WebGL: gambar ke <canvas> 2D yang menempel di belakang halaman.
  let canvas = null;
  let drawer = null;
  let tick = null;
  if (useCanvas) {
    canvas = document.createElement('canvas');
    canvas.className = 'sequence-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
    drawer = createCanvasDrawer(canvas);
    tick = () => drawer.draw(frames.imageAt(state.progress));
    gsap.ticker.add(tick);
    window.addEventListener('resize', drawer.resize);
  }

  return {
    imageAt: () => frames.imageAt(state.progress),
    progress: () => state.progress,
    dispose() {
      frames.stop();
      timeline.scrollTrigger?.kill(true);
      timeline.kill();
      panels.replaceChildren();
      if (tick) gsap.ticker.remove(tick);
      if (drawer) window.removeEventListener('resize', drawer.resize);
      canvas?.remove();
      document.body.classList.remove('sequence-live');
    },
  };
}

export function createScrollSequence({ calm, useCanvas, onProgress, onReady }) {
  const section = document.getElementById('perjalanan');
  if (calm) {
    onReady?.();
    return buildStatic(section);
  }
  return buildScrub(section, { useCanvas, onProgress, onReady });
}
