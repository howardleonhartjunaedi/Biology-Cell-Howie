import * as THREE from 'three';

export const PIXEL_RATIO_BY_TIER = { high: 1.5, medium: 1, low: 0.75 };

export function createRenderer(canvas, tier) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: tier === 'high',
    powerPreference: 'high-performance',
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.autoClear = false;
  applyTier(renderer, tier);
  resizeRenderer(renderer);
  return renderer;
}

export function applyTier(renderer, tier) {
  const max = PIXEL_RATIO_BY_TIER[tier] ?? 1;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, max));
}

export function resizeRenderer(renderer) {
  renderer.setSize(window.innerWidth, window.innerHeight, false);
}
