// Memuat gambar-gambar frame walkthrough (public/seq/f_0001.webp …) secara bertahap:
// 1) setiap frame ke-8 dulu (supaya seluruh video cepat "kasar" tersedia),
// 2) lalu frame sisanya untuk mengisi celah.
// Kalau frame yang diminta belum ada, dipakai frame terdekat yang sudah dimuat.
import seq from '../../../data/seq.json';

const COARSE_STEP = 8;
const PARALLEL = 6;
const READY_SHARE = 0.25;
const NARROW_WIDTH = 768;

const frameUrl = (number) => `/seq/f_${String(number).padStart(4, '0')}.webp`;

// Layar sempit (HP): hanya setiap frame ke-2, supaya memori dan kuota lebih hemat.
function frameNumbers() {
  const step = window.innerWidth < NARROW_WIDTH ? 2 : 1;
  const numbers = [];
  for (let n = 1; n <= seq.count; n += step) numbers.push(n);
  if (numbers.at(-1) !== seq.count) numbers.push(seq.count);
  return numbers;
}

function loadOrder(numbers) {
  const coarse = numbers.filter((_, index) => index % COARSE_STEP === 0);
  const rest = numbers.filter((_, index) => index % COARSE_STEP !== 0);
  return [...coarse, numbers.at(-1), ...rest];
}

export function createFrameStore({ onProgress, onReady } = {}) {
  const numbers = frameNumbers();
  const images = new Map();
  const queue = [...new Set(loadOrder(numbers))];
  const readyAt = Math.ceil(numbers.length * READY_SHARE);
  let loaded = 0;
  let stopped = false;
  let readySent = false;

  function loadNext() {
    if (stopped || !queue.length) return;
    const number = queue.shift();
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      images.set(number, image);
      loaded += 1;
      onProgress?.(Math.min(1, loaded / readyAt));
      if (!readySent && loaded >= readyAt) {
        readySent = true;
        onReady?.();
      }
      loadNext();
    };
    image.onerror = loadNext;
    image.src = frameUrl(number);
  }

  for (let i = 0; i < PARALLEL; i += 1) loadNext();

  // progress 0–1 → nomor frame → gambar terdekat yang sudah ada
  function imageAt(progress) {
    const wanted = 1 + Math.round(Math.min(1, Math.max(0, progress)) * (seq.count - 1));
    if (images.has(wanted)) return images.get(wanted);
    for (let distance = 1; distance < seq.count; distance += 1) {
      const before = images.get(wanted - distance);
      if (before) return before;
      const after = images.get(wanted + distance);
      if (after) return after;
    }
    return null;
  }

  function stop() {
    stopped = true;
    queue.length = 0;
  }

  return { imageAt, stop, total: numbers.length };
}

export function stillUrl(seconds) {
  return frameUrl(Math.min(seq.count, Math.round(seconds * seq.fps) + 1));
}
