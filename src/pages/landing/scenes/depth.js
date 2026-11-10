// Alat "rasa ruang" untuk adegan bawah air di Beranda.
// Ide utamanya: mata menilai jarak dari PARALAKS (benda dekat bergeser lebih cepat dari benda jauh),
// dari BENDA YANG MENUTUPI benda lain (oklusi), dan dari BENDA PEMBANDING di kejauhan yang memudar oleh kabut.
import * as THREE from 'three';
import { seededRandom } from './shared.js';

const DUST_VERTEX = `
uniform vec3 uCamera;
uniform vec3 uBox;
uniform float uSize;
uniform float uTime;
uniform float uPixelRatio;
uniform float uFade;
attribute float aSeed;
varying float vAlpha;
void main() {
  vec3 p = position;
  p.y += sin(uTime * 0.3 + aSeed * 6.2831) * 0.25;
  p.x += cos(uTime * 0.2 + aSeed * 3.0) * 0.15;
  // Kotak debu selalu "mengikuti" kamera: titik yang tertinggal di belakang muncul lagi di depan.
  vec3 rel = mod(p - uCamera + uBox * 0.5, uBox) - uBox * 0.5;
  vec4 mv = viewMatrix * vec4(uCamera + rel, 1.0);
  gl_Position = projectionMatrix * mv;
  float dist = max(-mv.z, 0.001);
  gl_PointSize = clamp(uSize * uPixelRatio * 300.0 / dist, 1.0, 72.0 * uPixelRatio);
  vec3 edgeRatio = abs(rel) / uBox;
  float edge = 1.0 - smoothstep(0.36, 0.5, max(max(edgeRatio.x, edgeRatio.y), edgeRatio.z));
  vAlpha = edge * smoothstep(0.25, 1.2, dist) * exp(-dist * uFade);
}`;

const DUST_FRAGMENT = `
uniform vec3 uColor;
uniform float uOpacity;
uniform float uSoftness;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = 1.0 - smoothstep(0.5 - uSoftness, 0.5, d);
  if (a <= 0.001) discard;
  gl_FragColor = vec4(uColor, a * uOpacity * vAlpha);
}`;

function dustLayer({ count, box, size, opacity, color, softness, fade, seed }) {
  const random = seededRandom(seed);
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (random() - 0.5) * box.x;
    positions[i * 3 + 1] = (random() - 0.5) * box.y;
    positions[i * 3 + 2] = (random() - 0.5) * box.z;
    seeds[i] = random();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  const material = new THREE.ShaderMaterial({
    vertexShader: DUST_VERTEX,
    fragmentShader: DUST_FRAGMENT,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uCamera: { value: new THREE.Vector3() },
      uBox: { value: box.clone() },
      uSize: { value: size },
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
      uFade: { value: fade },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uSoftness: { value: softness },
    },
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  return points;
}

// Tiga lapis partikel: jauh (kecil, banyak), tengah, dan dekat (besar, buram seperti bokeh kamera).
// Saat kamera bergerak karena scroll, lapis dekat melintas jauh lebih cepat → terasa ada kedalaman.
export function createDepthDust({ tier = 'medium', color = '#CFF3EE', scale = 1 } = {}) {
  const many = tier === 'high' ? 1 : tier === 'low' ? 0.4 : 0.7;
  const group = new THREE.Group();
  const layers = [
    dustLayer({ count: Math.round(900 * many), box: new THREE.Vector3(44, 22, 44).multiplyScalar(scale), size: 0.045, opacity: 0.5, color, softness: 0.25, fade: 0.035, seed: 3 }),
    dustLayer({ count: Math.round(260 * many), box: new THREE.Vector3(16, 9, 16).multiplyScalar(scale), size: 0.11, opacity: 0.45, color, softness: 0.35, fade: 0.02, seed: 5 }),
    dustLayer({ count: Math.round(70 * many), box: new THREE.Vector3(7, 5, 7).multiplyScalar(scale), size: 0.45, opacity: 0.24, color, softness: 0.5, fade: 0, seed: 9 }),
  ];
  group.add(...layers);

  function update(time, camera) {
    layers.forEach((layer) => {
      layer.material.uniforms.uTime.value = time;
      layer.material.uniforms.uCamera.value.copy(camera.position);
    });
  }

  return { group, update };
}

