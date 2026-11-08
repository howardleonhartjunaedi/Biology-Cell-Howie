import * as THREE from 'three';
import { seededRandom } from './shared.js';

const LAYERS = [
  { z: -60, x: -34, width: 70, height: 16, color: '#7FB7A2', seed: 3 },
  { z: -60, x: 38, width: 60, height: 20, color: '#7FB7A2', seed: 5 },
  { z: -38, x: -26, width: 44, height: 13, color: '#3F8A63', seed: 11 },
  { z: -42, x: 30, width: 40, height: 15, color: '#3F8A63', seed: 13 },
  { z: -22, x: -18, width: 26, height: 9, color: '#245E43', seed: 17 },
  { z: -24, x: 21, width: 24, height: 10, color: '#245E43', seed: 19 },
];

function drawIsland(color, seed) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 192;
  const ctx = canvas.getContext('2d');
  const random = seededRandom(seed);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  for (let x = 0; x <= canvas.width; x += 8) {
    const edge = Math.sin((x / canvas.width) * Math.PI);
    const bump = random() * 14;
    ctx.lineTo(x, canvas.height - edge * (canvas.height * 0.82) - bump);
  }
  ctx.lineTo(canvas.width, canvas.height);
  ctx.closePath();
  ctx.fill();

  for (let i = 0; i < 70; i += 1) {
    const x = random() * canvas.width;
    const edge = Math.sin((x / canvas.width) * Math.PI);
    const y = canvas.height - edge * canvas.height * 0.8;
    ctx.beginPath();
    ctx.arc(x, y + 6, 6 + random() * 12, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createForestLayers() {
  const group = new THREE.Group();
  LAYERS.forEach((layer) => {
    const material = new THREE.MeshBasicMaterial({
      map: drawIsland(layer.color, layer.seed),
      transparent: true,
      fog: true,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(layer.width, layer.height), material);
    mesh.position.set(layer.x, layer.height / 2 - 0.6, layer.z);
    group.add(mesh);
  });
  return group;
}
