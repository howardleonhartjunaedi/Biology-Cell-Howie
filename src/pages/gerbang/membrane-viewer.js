import * as THREE from 'three';
import { gsap } from 'gsap';
import { createRenderer, resizeRenderer } from '../../core/renderer.js';
import { startTier } from '../../core/quality.js';
import { useLabLighting } from '../../core/materials.js';
import { DURATION, EASE, prefersReducedMotion } from '../../core/motion.js';
import { createInfoCard } from '../../core/info-card.js';
import { disposeScene } from '../landing/scenes/shared.js';
import data from '../../data/membran.json';
import { buildMembrane } from './membrane-model.js';
import { createDiffusion, createFacilitated, createOsmosis } from './modes/passive.js';
import { createPump } from './modes/pump.js';

const CAMERA = new THREE.Vector3(0.4, 9.2, 26);
const TARGET = new THREE.Vector3(0.4, -0.3, 0);
const EXPLODE = 0.45;
const MAX_TILT = 0.12;
const STEP_SECONDS = 1;
const MAX_ZOOM = 2;
const WIDTH_FIT = 0.82;

export function createMembraneViewer({ pump: pumpState }) {
  const stage = document.getElementById('gate-stage');
  const canvas = document.createElement('canvas');
  canvas.className = 'gate-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  stage.prepend(canvas);
  let renderer;
  try {
    renderer = createRenderer(canvas, startTier());
  } catch {
    canvas.remove();
    return null;
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0E1116');
  scene.fog = new THREE.Fog('#0E1116', 18, 40);
  useLabLighting(scene, renderer, { intensity: 0.55 });
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const parts = buildMembrane();
  const rig = new THREE.Group();
  rig.add(parts.membrane);
  scene.add(rig);

  const card = createInfoCard();
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(-9, -9);
  const tilt = new THREE.Vector2();
  const sideOut = document.querySelector('.gate-side--out');
  const sideIn = document.querySelector('.gate-side--in');
  const reduce = prefersReducedMotion();
  let mode = null;
  let active = null;
  let playing = true;
  let speed = 1;
  let visible = true;
  let running = true;

  function resize() {
    const { clientWidth: width, clientHeight: height } = canvas;
    if (!width || !height) return;
    resizeRenderer(renderer, width, height);
    camera.aspect = width / height;
    camera.zoom = Math.min(MAX_ZOOM, WIDTH_FIT * camera.aspect);
    camera.position.copy(CAMERA);
    camera.lookAt(TARGET);
    camera.updateProjectionMatrix();
    card.hide();
  }

  function setLayers(apart) {
    const to = (group, y) => (reduce ? (group.position.y = y) : gsap.to(group.position, { y, duration: DURATION.slow, ease: EASE.inOut }));
    to(parts.outer, apart ? EXPLODE : 0);
    to(parts.inner, apart ? -EXPLODE : 0);
  }

  function setSides(outText, inText) {
    sideOut.textContent = outText;
    sideIn.textContent = inText;
  }

  function setMode(id) {
    if (active) {
      rig.remove(active.group);
      active.dispose?.();
      disposeScene(active.group);
    }
    mode = id;
    setLayers(id === 'struktur');
    const builders = {
      difusi: () => createDiffusion(),
      fasilitasi: () => createFacilitated(parts),
      osmosis: () => createOsmosis(),
      pompa: () => createPump(parts, pumpState),
    };
    active = builders[id]?.() ?? null;
    if (active) rig.add(active.group);
    if (id === 'pompa') setSides('LUAR SEL (+)', 'DALAM SEL (−)');
    else if (id === 'osmosis') setSides('LUAR SEL · hipotonik', 'DALAM SEL · hipertonik');
    else setSides('LUAR SEL', 'DALAM SEL');
  }

  function pickPart(event) {
    const { left, top, width, height } = canvas.getBoundingClientRect();
    pointer.set(((event.clientX - left) / width) * 2 - 1, 1 - ((event.clientY - top) / height) * 2);
    if (event.pointerType === 'mouse') tilt.copy(pointer);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObject(parts.membrane, true).find((item) => item.object.userData.part);
    const id = hit?.object.userData.part ?? null;
    if (!id) return card.hide();
    const info = data.parts[id];
    const screen = hit.point.clone().project(camera);
    card.show(id, { name: info.name, short: `${info.deskripsi} ${info.fungsi}` }, left + ((screen.x + 1) / 2) * width, top + ((1 - screen.y) / 2) * height);
  }

  function onPointerMove(event) {
    if (event.pointerType === 'mouse') pickPart(event);
  }

  function onPointerUp(event) {
    if (event.pointerType !== 'mouse') pickPart(event);
  }

  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse') {
      tilt.set(0, 0);
      card.hide();
    }
  });
  window.addEventListener('scroll', card.hide, { passive: true });

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    canvas.style.visibility = visible ? 'visible' : 'hidden';
    if (!visible) card.hide();
  });
  observer.observe(stage);

  const timer = new THREE.Timer();
  timer.connect(document);

  function frame() {
    if (!running) return;
    requestAnimationFrame(frame);
    timer.update();
    if (!visible) return;
    const dt = Math.min(timer.getDelta(), 0.1);
    rig.rotation.y += (tilt.x * MAX_TILT - rig.rotation.y) * 0.05;
    rig.rotation.x += (-tilt.y * MAX_TILT * 0.5 - rig.rotation.x) * 0.05;
    if (active) {
      if (mode !== 'pompa') active.update(playing && !reduce ? dt * speed : 0);
      else active.update();
    }
    if (mode === 'difusi' && active.counts) {
      const { out, in: inside } = active.counts();
      setSides(`LUAR SEL · ${out} molekul`, `DALAM SEL · ${inside} molekul`);
    }
    renderer.render(scene, camera);
  }

  resize();
  frame();

  return {
    setMode,
    setPlaying: (value) => (playing = value),
    setSpeed: (value) => (speed = value),
    step: () => mode !== 'pompa' && active?.update(STEP_SECONDS * speed),
    reset: () => setMode(mode),
    dispose: () => {
      running = false;
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('scroll', card.hide);
      active?.dispose?.();
      card.dispose();
      disposeScene(scene);
      timer.dispose();
      renderer.dispose();
      canvas.remove();
      setSides('LUAR SEL', 'DALAM SEL');
    },
  };
}
