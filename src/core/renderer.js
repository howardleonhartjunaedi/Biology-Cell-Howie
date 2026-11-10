import * as THREE from 'three';
import { setCalmMode } from './calm-mode.js';
import { showToast } from './quality.js';

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
  canvas.addEventListener('webglcontextlost', onContextLost, { once: true });
  return renderer;
}

// Kartu grafis bisa "kehilangan konteks" (driver error, memori GPU penuh, laptop tidur).
// Daripada layar 3D membeku/hitam, kita pindah ke Mode Tenang: semua teks dan interaksi tetap ada.
function onContextLost(event) {
  event.preventDefault();
  showToast('Grafik 3D berhenti di perangkat ini, Mode Tenang dinyalakan. Matikan Mode Tenang untuk mencoba lagi.');
  setCalmMode(true);
}

export function applyTier(renderer, tier) {
  const max = PIXEL_RATIO_BY_TIER[tier] ?? 1;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, max));
}

export function resizeRenderer(renderer, width = window.innerWidth, height = window.innerHeight) {
  renderer.setSize(width, height, false);
}
