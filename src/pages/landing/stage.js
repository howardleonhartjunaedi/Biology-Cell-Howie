import * as THREE from 'three';
import { createRenderer, applyTier, resizeRenderer } from '../../core/renderer.js';
import { createQualityMonitor, startTier } from '../../core/quality.js';
import { createConductor } from './conductor.js';
import { createTitleRipple } from './title-ripple.js';
import { syncDom } from './dom-sync.js';
import { sceneFactories } from './scenes/index.js';
import { disposeScene } from './scenes/shared.js';

const MAX_DT = 1 / 30;
const HERO_SECTIONS = ['permukaan', 'menyelam'];

export function createStage() {
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
    return null;
  }

  const quality = createQualityMonitor(startTier(), (tier) => applyTier(renderer, tier));
  const conductor = createConductor();
  const title = createTitleRipple(document.getElementById('judul-sel'), document.querySelector('.hero-tagline'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scenes = new Map();
  const clock = new THREE.Clock();
  let time = 0;
  let running = true;
  let frameId = 0;

  function getScene(name) {
    if (!scenes.has(name)) scenes.set(name, sceneFactories[name]({ tier: quality.tier }));
    return scenes.get(name);
  }

  function resize() {
    resizeRenderer(renderer);
    scenes.forEach(({ camera }) => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });
    conductor.remeasure();
    title.redraw(renderer.getPixelRatio());
  }

  function frame() {
    if (!running) return;
    frameId = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), MAX_DT);
    time += reduceMotion ? 0 : dt;
    quality.tick(dt);

    const state = conductor.update(dt, reduceMotion);
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
    syncDom(conductor.exact());
  }

  function setRunning(next) {
    if (next === running) return;
    running = next;
    if (running) {
      clock.getDelta();
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
    scenes.forEach(({ scene }) => disposeScene(scene));
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
