import * as THREE from 'three';

export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp01 = (value) => Math.min(1, Math.max(0, value));
export const smooth = (t) => t * t * (3 - 2 * t);

export function rangeT(progress, start, end) {
  return clamp01((progress - start) / (end - start));
}

export function makeCamera(fov = 50) {
  return new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 400);
}

export function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

let dotTexture = null;

function roundDot() {
  if (dotTexture) return dotTexture;
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);
  dotTexture = new THREE.CanvasTexture(canvas);
  return dotTexture;
}

export function createDriftParticles({ count, spread, color, size, opacity = 0.6 }) {
  const random = seededRandom(7);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (random() - 0.5) * spread.x;
    positions[i * 3 + 1] = (random() - 0.5) * spread.y;
    positions[i * 3 + 2] = (random() - 0.5) * spread.z;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color,
    size,
    map: roundDot(),
    transparent: true,
    opacity,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(geometry, material);
  let baseY = null;

  function update(time) {
    if (baseY === null) baseY = points.position.y;
    points.position.y = baseY + Math.sin(time * 0.15) * 0.4;
    points.rotation.y = time * 0.01;
  }

  return { points, update };
}

export function addSway(material, { strength = 0.3, speed = 1.2, axis = 'y' } = {}) {
  const uniforms = { uTime: { value: 0 } };
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        float swayHeight = max(position.${axis}, 0.0);
        #ifdef USE_INSTANCING
          float swayPhase = instanceMatrix[3].x * 0.7 + instanceMatrix[3].z * 0.5;
        #else
          float swayPhase = 0.0;
        #endif
        transformed.x += sin(uTime * ${speed.toFixed(2)} + swayPhase) * swayHeight * swayHeight * ${strength.toFixed(2)};
        transformed.z += cos(uTime * ${(speed * 0.8).toFixed(2)} + swayPhase) * swayHeight * swayHeight * ${(strength * 0.5).toFixed(2)};`
      );
  };
  return uniforms;
}

export function disposeScene(scene) {
  scene.traverse((object) => {
    object.geometry?.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => {
      if (!material) return;
      Object.values(material).forEach((value) => value?.isTexture && value.dispose());
      material.dispose();
    });
  });
}
