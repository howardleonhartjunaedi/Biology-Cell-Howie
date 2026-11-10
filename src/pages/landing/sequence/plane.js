// Bidang (plane) penuh layar di Three.js untuk menggambar frame walkthrough.
// Setiap kali frame berganti, gambar di tekstur diganti (texture swap) lalu diunggah ulang ke GPU.
import * as THREE from 'three';
import vertexShader from '../shaders/sequence.vert.glsl?raw';
import fragmentShader from '../shaders/sequence.frag.glsl?raw';

const RIPPLE_MAX = 1;
const RIPPLE_DECAY = 2.5;
const RIPPLE_PER_PIXEL = 0.004;
const VIGNETTE = 0.38;
const GRAIN = 0.045;

export function createSequencePlane() {
  const texture = new THREE.Texture();
  texture.colorSpace = THREE.NoColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const uniforms = {
    uFrame: { value: texture },
    uCoverScale: { value: new THREE.Vector2(1, 1) },
    uAspect: { value: 1 },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uRipple: { value: 0 },
    uVignette: { value: VIGNETTE },
    uGrain: { value: GRAIN },
  };
  const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, toneMapped: false, depthTest: false });
  const scene = new THREE.Scene();
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  let current = null;
  let lastPointer = null;

  // Hitung skala UV agar gambar menutupi layar tanpa gepeng (seperti CSS object-fit: cover).
  function fitCover(image) {
    const view = window.innerWidth / window.innerHeight;
    const picture = image.naturalWidth / image.naturalHeight;
    uniforms.uAspect.value = view;
    uniforms.uCoverScale.value.set(view < picture ? view / picture : 1, view < picture ? 1 : picture / view);
  }

  function setImage(image) {
    if (!image || image === current) return;
    current = image;
    texture.image = image;
    texture.needsUpdate = true;
    fitCover(image);
  }

  function onPointerMove(event) {
    const x = event.clientX / window.innerWidth;
    const y = 1 - event.clientY / window.innerHeight;
    if (lastPointer) {
      const moved = Math.hypot(event.clientX - lastPointer.x, event.clientY - lastPointer.y);
      uniforms.uRipple.value = Math.min(RIPPLE_MAX, uniforms.uRipple.value + moved * RIPPLE_PER_PIXEL);
    }
    lastPointer = { x: event.clientX, y: event.clientY };
    uniforms.uMouse.value.set(x, y);
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  function render(renderer, time, dt) {
    if (!current) return;
    uniforms.uTime.value = time;
    uniforms.uRipple.value *= Math.exp(-RIPPLE_DECAY * dt);
    renderer.render(scene, camera);
  }

  function resize() {
    if (current) fitCover(current);
  }

  function dispose() {
    window.removeEventListener('pointermove', onPointerMove);
    texture.dispose();
    material.dispose();
  }

  return { setImage, render, resize, dispose };
}
