// Alat dev (tidak ikut build): merender klip pendek sel hewan / sel tumbuhan dari model Lab Sel,
// untuk dipakai di video walkthrough Beranda. Buka /tools/render-cell.html?cell=hewan
// lalu panggil window.renderAt(t) untuk t = 0..1 dan ambil screenshot tiap frame (Playwright).
import * as THREE from 'three';
import { loadCellModel } from '../src/pages/sel/glb-cell.js';
import { useLabLighting } from '../src/core/materials.js';

const WIDTH = 1280;
const HEIGHT = 720;
const BACKGROUND = '#04252D';
const START = { distance: 17, yaw: -0.5 };
const END = { distance: 12, yaw: 0.35 };
// Kamera digeser ke kiri supaya sel tampil di kanan layar (kolom kiri dipakai panel teks).
const SHIFT_X = -2.2;

const cellId = new URLSearchParams(location.search).get('cell') ?? 'hewan';
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(WIDTH, HEIGHT);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.append(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(BACKGROUND);
scene.fog = new THREE.Fog(BACKGROUND, 14, 30);
useLabLighting(scene, renderer, { intensity: 0.7 });
const camera = new THREE.PerspectiveCamera(35, WIDTH / HEIGHT, 0.1, 100);
const pivot = new THREE.Group();
scene.add(pivot);

const ease = (t) => t * t * (3 - 2 * t);

window.renderAt = (t) => {
  const k = ease(t);
  const distance = THREE.MathUtils.lerp(START.distance, END.distance, k);
  pivot.rotation.y = THREE.MathUtils.lerp(START.yaw, END.yaw, k);
  camera.position.set(SHIFT_X, 1.2, distance);
  camera.lookAt(SHIFT_X, -0.3, 0);
  renderer.render(scene, camera);
  return true;
};

loadCellModel(cellId).then((cell) => {
  pivot.add(cell);
  window.renderAt(0);
  window.ready = true;
});
