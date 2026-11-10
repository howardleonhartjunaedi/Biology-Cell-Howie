import * as THREE from 'three';
import fragmentShader from './shaders/title.frag.glsl?raw';
import { settings } from '../../core/settings.js';

const MAX_RIPPLES = 16;
const DROP_EVERY_PX = 40;
const MIN_AMPLITUDE = 1.5;
const MAX_AMPLITUDE = 3.5;
const CLICK_AMPLITUDE = 5;
const MAX_LENS_PX = 6;
const SPEED_FOR_MAX = 900;
// Kemiringan perspektif mengikuti kursor (mirip kemiringan model di Lab Sel).
const MAX_TILT_DEG = 7;
const PERSPECTIVE_PX = 1400;
const TILT_EASE = 6;

function drawText(canvas, title, tagline, dpr) {
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  [title, tagline].forEach((element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    ctx.letterSpacing = style.letterSpacing === 'normal' ? '0px' : style.letterSpacing;
    ctx.fillStyle = style.getPropertyValue('--webgl-color') || '#FFF4D6';
    // Bayangan lembut supaya teks krem tetap kontras di atas langit yang terang.
    ctx.shadowColor = 'rgba(3, 28, 36, 0.45)';
    ctx.shadowBlur = parseFloat(style.fontSize) * 0.12;
    ctx.shadowOffsetY = parseFloat(style.fontSize) * 0.02;
    const shift = parseFloat(ctx.letterSpacing) / 2 || 0;
    ctx.fillText(element.textContent, rect.left + rect.width / 2 + shift, rect.top + window.scrollY + rect.height / 2);
  });
}

export function createTitleRipple(title, tagline) {
  const canvas = document.createElement('canvas');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;

  const ripples = Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector4(0, 0, -10, 0));
  const uniforms = {
    uText: { value: texture },
    uTextSize: { value: new THREE.Vector2(1, 1) },
    uViewport: { value: new THREE.Vector2(1, 1) },
    uDpr: { value: 1 },
    uScroll: { value: 0 },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(-999, -999) },
    uLens: { value: 0 },
    uStrength: { value: 1 },
    uOpacity: { value: 1 },
    uRipples: { value: ripples },
    uTilt: { value: new THREE.Vector2() },
    uTiltCenter: { value: new THREE.Vector2() },
    uPerspective: { value: PERSPECTIVE_PX },
  };
  const tiltTarget = new THREE.Vector2();
  const tiltLayer = document.querySelector('.hero-meta');
  const calm = () => document.documentElement.classList.contains('calm')
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const material = new THREE.ShaderMaterial({
    uniforms,
    fragmentShader,
    vertexShader: 'void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }',
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

  let nextRipple = 0;
  let lastDrop = null;
  let lastMove = null;
  let speed = 0;
  let time = 0;

  function addRipple(x, y, amplitude) {
    ripples[nextRipple].set(x, y, time, amplitude);
    nextRipple = (nextRipple + 1) % MAX_RIPPLES;
  }

  function onPointerMove(event) {
    const now = performance.now();
    if (lastMove) {
      const moved = Math.hypot(event.clientX - lastMove.x, event.clientY - lastMove.y);
      const seconds = Math.max((now - lastMove.t) / 1000, 0.001);
      speed = speed * 0.7 + (moved / seconds) * 0.3;
    }
    lastMove = { x: event.clientX, y: event.clientY, t: now };
    if (event.pointerType === 'mouse') {
      tiltTarget.set((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1);
    }
    uniforms.uMouse.value.set(event.clientX, event.clientY);

    if (!lastDrop || Math.hypot(event.clientX - lastDrop.x, event.clientY - lastDrop.y) > DROP_EVERY_PX) {
      const strength = Math.min(speed / SPEED_FOR_MAX, 1);
      addRipple(event.clientX, event.clientY, MIN_AMPLITUDE + (MAX_AMPLITUDE - MIN_AMPLITUDE) * strength);
      lastDrop = { x: event.clientX, y: event.clientY };
    }
  }

  function onPointerDown(event) {
    addRipple(event.clientX, event.clientY, CLICK_AMPLITUDE);
  }

  function redraw(pixelRatio) {
    drawText(canvas, title, tagline, pixelRatio);
    texture.dispose();
    texture.needsUpdate = true;
    uniforms.uTextSize.value.set(window.innerWidth, window.innerHeight);
    uniforms.uViewport.value.set(window.innerWidth, window.innerHeight);
    const box = title.getBoundingClientRect();
    uniforms.uTiltCenter.value.set(box.left + box.width / 2, box.top + window.scrollY + box.height);
  }

  function update(dt, scrollY, heroProgress, renderer) {
    time += dt;
    speed *= Math.exp(-4 * dt);
    uniforms.uTime.value = time;
    uniforms.uDpr.value = renderer.getPixelRatio();
    uniforms.uLens.value = Math.min(speed / SPEED_FOR_MAX, 1) * MAX_LENS_PX;
    uniforms.uScroll.value = scrollY - heroProgress * 120;
    uniforms.uStrength.value = (1 + heroProgress * 3) * settings.rippleScale;
    uniforms.uOpacity.value = 1 - heroProgress;

    const goal = calm() ? 0 : 1;
    const ease = 1 - Math.exp(-TILT_EASE * dt);
    const k = Math.sin(THREE.MathUtils.degToRad(MAX_TILT_DEG)) * goal;
    uniforms.uTilt.value.x += (tiltTarget.x * k - uniforms.uTilt.value.x) * ease;
    uniforms.uTilt.value.y += (tiltTarget.y * k - uniforms.uTilt.value.y) * ease;
    if (tiltLayer) {
      // Teks DOM (label & kalimat) dimiringkan dengan sudut yang sama lewat CSS.
      const toDeg = MAX_TILT_DEG / Math.max(Math.sin(THREE.MathUtils.degToRad(MAX_TILT_DEG)), 1e-4);
      tiltLayer.style.setProperty('--tilt-y', `${(uniforms.uTilt.value.x * toDeg).toFixed(2)}deg`);
      tiltLayer.style.setProperty('--tilt-x', `${(-uniforms.uTilt.value.y * toDeg).toFixed(2)}deg`);
    }
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerdown', onPointerDown, { passive: true });

  function dispose() {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerdown', onPointerDown);
    texture.dispose();
    material.dispose();
  }

  return { scene, camera, update, redraw, dispose };
}
