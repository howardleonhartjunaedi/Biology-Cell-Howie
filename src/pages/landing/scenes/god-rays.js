import * as THREE from 'three';
import { seededRandom } from './shared.js';

function rayTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const vertical = ctx.createLinearGradient(0, 0, 0, canvas.height);
  vertical.addColorStop(0, 'rgba(255,255,255,0.9)');
  vertical.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = vertical;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'destination-in';
  const horizontal = ctx.createLinearGradient(0, 0, canvas.width, 0);
  horizontal.addColorStop(0, 'rgba(0,0,0,0)');
  horizontal.addColorStop(0.5, 'rgba(0,0,0,1)');
  horizontal.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = horizontal;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return new THREE.CanvasTexture(canvas);
}

export function createGodRays({ count = 8, top = 0, length = 18, spread = 24, color = '#CFF6F2', strength = 0.22 }) {
  const group = new THREE.Group();
  const texture = rayTexture();
  const random = seededRandom(23);
  const rays = [];

  for (let i = 0; i < count; i += 1) {
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      color,
      transparent: true,
      opacity: strength,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      fog: false,
    });
    const width = 1.2 + random() * 2.4;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, length), material);
    mesh.position.set((random() - 0.5) * spread, top - length / 2, -4 - random() * spread * 0.6);
    mesh.rotation.z = 0.25 + random() * 0.1;
    mesh.rotation.y = (random() - 0.5) * 0.6;
    rays.push({ mesh, phase: random() * Math.PI * 2 });
    group.add(mesh);
  }

  function update(time) {
    rays.forEach(({ mesh, phase }) => {
      mesh.material.opacity = strength * (0.55 + 0.45 * Math.sin(time * 0.6 + phase));
    });
  }

  return { group, update };
}
