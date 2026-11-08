import { setCalmMode } from './calm-mode.js';

const TIERS = ['high', 'medium', 'low'];
const MEASURE_SECONDS = 2;
const DROP_BELOW_FPS = 40;
const CALM_BELOW_FPS = 20;
const TOAST_MS = 5000;

export function startTier() {
  const cores = navigator.hardwareConcurrency || 4;
  const smallScreen = window.matchMedia('(max-width: 760px)').matches;
  if (smallScreen || cores <= 4) return 'medium';
  return 'high';
}

export function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  document.body.append(toast);
  setTimeout(() => toast.remove(), TOAST_MS);
}

export function createQualityMonitor(initialTier, onTierChange) {
  let tierIndex = TIERS.indexOf(initialTier);
  let frames = 0;
  let elapsed = 0;

  function tick(dt) {
    frames += 1;
    elapsed += dt;
    if (elapsed < MEASURE_SECONDS) return;

    const fps = frames / elapsed;
    frames = 0;
    elapsed = 0;

    if (fps < CALM_BELOW_FPS && tierIndex === TIERS.length - 1) {
      setCalmMode(true);
      showToast('Perangkat terasa berat, Mode Tenang dinyalakan. Semua isi tetap bisa dibaca.');
      return;
    }
    if (fps < DROP_BELOW_FPS && tierIndex < TIERS.length - 1) {
      tierIndex += 1;
      onTierChange(TIERS[tierIndex]);
    }
  }

  function reset() {
    frames = 0;
    elapsed = 0;
  }

  return { tick, reset, get tier() { return TIERS[tierIndex]; } };
}
