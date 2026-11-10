import * as THREE from 'three';
import fragmentShader from './shaders/title.frag.glsl?raw';
import { settings } from '../../core/settings.js';

const MAX_RIPPLES = 24;
const DROP_EVERY_PX = 40;
const MIN_AMPLITUDE = 3;
const MAX_AMPLITUDE = 8;
const CLICK_AMPLITUDE = 10;
const MAX_LENS_PX = 20;
const SPEED_FOR_MAX = 900;
// Kemiringan perspektif mengikuti kursor (mirip kemiringan model di Lab Sel).
const MAX_TILT_DEG = 20;
const TILT_LIMIT = Math.sin(THREE.MathUtils.degToRad(MAX_TILT_DEG));
const TILT_EASE = 8;

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
  const heroText = title.parentElement;
  const style = getComputedStyle(heroText);
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
    uPerspective: { value: parseFloat(style.getPropertyValue('--hero-perspective')) },
    uScrimOpacity: { value: parseFloat(style.getPropertyValue('--hero-scrim-opacity')) },
    uScrimColor: { value: new THREE.Color(style.getPropertyValue('--c-lab').trim()) },
  };
  const tiltTarget = new THREE.Vector2();
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
      tiltTarget.clampScalar(-1, 1);
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

  function onPointerLeave(event) {
    if (event.pointerType === 'mouse') tiltTarget.set(0, 0);
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
    const k = TILT_LIMIT * goal;
    uniforms.uTilt.value.x += (tiltTarget.x * k - uniforms.uTilt.value.x) * ease;
    uniforms.uTilt.value.y += (tiltTarget.y * k - uniforms.uTilt.value.y) * ease;
    const tilt = uniforms.uTilt.value;
    heroText.style.setProperty('--tilt-y', `${THREE.MathUtils.radToDeg(Math.asin(tilt.x)).toFixed(2)}deg`);
    heroText.style.setProperty('--tilt-x', `${THREE.MathUtils.radToDeg(Math.asin(-tilt.y)).toFixed(2)}deg`);
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerdown', onPointerDown, { passive: true });
  document.documentElement.addEventListener('pointerleave', onPointerLeave);

  function dispose() {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerdown', onPointerDown);
    document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    heroText.style.removeProperty('--tilt-x');
    heroText.style.removeProperty('--tilt-y');
    texture.dispose();
    material.dispose();
  }

  return { scene, camera, update, redraw, dispose };
}
