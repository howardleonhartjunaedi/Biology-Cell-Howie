import * as THREE from 'three';
import { createRenderer, applyTier, resizeRenderer } from '../../core/renderer.js';
import { createQualityMonitor, startTier } from '../../core/quality.js';
import { createConductor } from './conductor.js';
import { createTitleRipple } from './title-ripple.js';
import { sceneFactories } from './scenes/index.js';
import { disposeScene } from './scenes/shared.js';
import { createSequencePlane } from './sequence/plane.js';

const MAX_DT = 1 / 30;
const HERO_SECTIONS = ['permukaan', 'menyelam'];
const SEQUENCE_VEIL = '#04252D';

function reportAssets() {
  const manager = THREE.DefaultLoadingManager;
  manager.onProgress = (url, loaded, total) => {
    window.dispatchEvent(new CustomEvent('sel:surface-progress', { detail: { ratio: total ? loaded / total : 0 } }));
  };
  manager.onLoad = () => window.dispatchEvent(new Event('sel:surface-ready'));
}

// `sequence` (dari scroll-sequence.js) memberi gambar frame walkthrough untuk progres scroll saat ini.
export function createStage({ sequence } = {}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'stage-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const veil = document.createElement('div');
  veil.className = 'stage-veil';
  document.body.prepend(canvas, veil);

  let renderer;
  try {
    renderer = createRenderer(canvas, startTier());
  } catch {
    canvas.remove();
    veil.remove();
    window.dispatchEvent(new Event('sel:surface-ready'));
    return null;
  }

  reportAssets();

  const quality = createQualityMonitor(startTier(), (tier) => applyTier(renderer, tier));
  const conductor = createConductor();
  const title = createTitleRipple(document.getElementById('judul-sel'), document.querySelector('.hero-tagline'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scenes = new Map();
  const plane = createSequencePlane();
  const journey = document.getElementById('perjalanan');
  const timer = new THREE.Timer();
  timer.connect(document);
  let time = 0;
  let running = true;
  let frameId = 0;

  function getScene(name) {
    if (!scenes.has(name)) scenes.set(name, sceneFactories[name]({ tier: quality.tier, renderer }));
    return scenes.get(name);
  }

  function resize() {
    resizeRenderer(renderer);
    scenes.forEach(({ camera }) => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });
    conductor.remeasure();
    plane.resize();
    title.redraw(renderer.getPixelRatio());
  }

  function frame() {
    if (!running) return;
    frameId = requestAnimationFrame(frame);
    timer.update();
    const rawDt = Math.min(timer.getDelta(), 0.5);
    const dt = Math.min(rawDt, MAX_DT);
    time += reduceMotion ? 0 : dt;
    quality.tick(dt);

    // Setelah hero: section #perjalanan menutupi layar → gambar frame walkthrough, bukan adegan 3D.
    const journeyTop = journey.getBoundingClientRect().top;
    const half = window.innerHeight / 2;
    if (sequence && journeyTop < half) {
      plane.setImage(sequence.imageAt());
      renderer.clear();
      plane.render(renderer, time, dt);
      veil.style.opacity = Math.max(0, journeyTop / half).toFixed(3);
      veil.style.backgroundColor = SEQUENCE_VEIL;
      return;
    }

    const state = conductor.update(rawDt, reduceMotion);
    const active = getScene(state.scene);
    active.update(dt, state.sceneProgress, time);

    renderer.clear();
    renderer.render(active.scene, active.camera);

    const heroIndex = HERO_SECTIONS.indexOf(state.sectionId);
    if (heroIndex !== -1) {
      const heroProgress = heroIndex === 0 ? 0 : state.sectionT;
      title.update(dt, window.scrollY, heroProgress, renderer);
      renderer.render(title.scene, title.camera);
    }

    veil.style.opacity = state.veil.amount.toFixed(3);
    veil.style.backgroundColor = state.veil.color;
  }

  function setRunning(next) {
    if (next === running) return;
    running = next;
    if (running) {
      timer.reset();
      quality.reset();
      frame();
    } else {
      cancelAnimationFrame(frameId);
    }
  }

  function onVisibility() {
    setRunning(!document.hidden);
  }

  function dispose() {
    setRunning(false);
    layoutObserver.disconnect();
    window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', onVisibility);
    scenes.forEach((item) => {
      item.dispose?.();
      disposeScene(item.scene);
    });
    timer.dispose();
    plane.dispose();
    title.dispose();
    renderer.dispose();
    canvas.remove();
    veil.remove();
  }

  const layoutObserver = new ResizeObserver(() => conductor.remeasure());
  layoutObserver.observe(document.querySelector('main'));

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', onVisibility);
  resize();
  frame();

  return { dispose, resize };
}
