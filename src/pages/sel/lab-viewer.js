import * as THREE from 'three';
import { gsap } from 'gsap';
import { createRenderer, resizeRenderer } from '../../core/renderer.js';
import { startTier } from '../../core/quality.js';
import { DURATION, EASE, prefersReducedMotion } from '../../core/motion.js';
import { createInfoCard } from '../../core/info-card.js';
import { disposeScene } from '../landing/scenes/shared.js';
import { buildAnimalCell, buildPlantCell, organelleMeshes, SHELL_IDS } from './cell-models.js';
import { buildDetail } from './detail-models.js';
import { loadCellModel } from './glb-cell.js';
import { createLabRoom } from './lab-room.js';
import { organelleOf } from './organelle-ui.js';
import { createHighlight } from './highlight.js';
import { createPins } from './detail-pins.js';

const MAX_YAW = THREE.MathUtils.degToRad(25);
const MAX_PITCH = THREE.MathUtils.degToRad(15);
const CELL_CAMERA = new THREE.Vector3(0, 0.8, 13);
const DETAIL_CAMERA = new THREE.Vector3(0, 0.4, 9);
const SLIDE_DISTANCE = 9;
const SWIPE_MIN_PX = 60;
const NARROW_ASPECT = 0.8;
const CELL_LOOK = new THREE.Vector3(0, -0.2, 0);
const look = new THREE.Vector3();

export function createLabViewer({ onPick, onHover, onSwipe, onPartPick }) {
  const canvas = document.createElement('canvas');
  canvas.className = 'lab-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  let renderer;
  try {
    renderer = createRenderer(canvas, startTier());
  } catch {
    canvas.remove();
    return null;
  }
  renderer.localClippingEnabled = true;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.copy(CELL_CAMERA);
  const room = createLabRoom(scene, renderer);
  const tilt = new THREE.Group();
  scene.add(tilt);

  const cells = { hewan: buildAnimalCell(), tumbuhan: buildPlantCell() };
  cells.tumbuhan.scale.setScalar(0.9);
  Object.values(cells).forEach((cell) => {
    cell.visible = false;
    tilt.add(cell);
  });
  const meshes = { hewan: organelleMeshes(cells.hewan), tumbuhan: organelleMeshes(cells.tumbuhan) };
  const highlight = createHighlight(meshes);
  const card = createInfoCard({ onDetail: (id) => onPick(id) });
  const pins = createPins(document.getElementById('detail-pins'), (id) => onPartPick(id));

  // Model sel unduhan (montanna dan okchs) menggantikan model buatan setelah selesai dimuat.
  // Jika gagal dimuat (misalnya file hilang), model buatan sendiri tetap dipakai.
  function swapInModel(cellId, model) {
    if (disposed) return disposeScene(model);
    const old = cells[cellId];
    model.visible = old.visible;
    model.position.copy(old.position);
    tilt.add(model);
    tilt.remove(old);
    disposeScene(old);
    cells[cellId] = model;
    meshes[cellId] = organelleMeshes(model);
    if (current === cellId) highlight.set(cellId, hovered);
  }
  Object.keys(cells).forEach((cellId) => {
    loadCellModel(cellId)
      .then((model) => swapInModel(cellId, model))
      .catch((error) => console.warn('Model 3D unduhan gagal dimuat, model buatan sendiri dipakai:', error));
  });

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const tiltTarget = new THREE.Vector2();
  const reduce = prefersReducedMotion();
  let current = null;
  let hovered = null;
  let mode = 'cell';
  let detail = null;
  let dragStart = null;
  let running = true;
  let disposed = false;

  function stageCenterOffset() {
    const id = mode === 'cell' ? 'lab-stage' : 'detail-pins';
    const rect = document.getElementById(id)?.getBoundingClientRect();
    if (!rect || rect.width === 0) return { x: 0, y: 0 };
    return { x: rect.left + rect.width / 2 - window.innerWidth / 2, y: rect.top + rect.height / 2 - window.innerHeight / 2 };
  }

  function resize() {
    resizeRenderer(renderer);
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    const fit = Math.max(1, NARROW_ASPECT / camera.aspect);
    if (mode === 'cell') camera.position.z = CELL_CAMERA.z * fit;
    const offset = stageCenterOffset();
    camera.setViewOffset(width, height, -offset.x, -offset.y, width, height);
    camera.updateProjectionMatrix();
  }

  function pick() {
    if (!current || mode !== 'cell') return null;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObject(cells[current], true).filter((hit) => hit.object.userData.organelle);
    if (!hits.length) return null;
    return hits.find((hit) => !SHELL_IDS.includes(hit.object.userData.organelle)) ?? hits[0];
  }

  function setHover(id, point) {
    if (id !== hovered) {
      hovered = id;
      highlight.set(current, id);
      onHover(id);
    }
    if (!id) return card.hide();
    const screen = point.clone().project(camera);
    card.show(id, organelleOf(id), ((screen.x + 1) / 2) * window.innerWidth, ((1 - screen.y) / 2) * window.innerHeight);
  }

  function onPointerMove(event) {
    pointer.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    if (event.pointerType === 'mouse') tiltTarget.set(pointer.x, pointer.y);
    else if (dragStart) tiltTarget.set(THREE.MathUtils.clamp((event.clientX - dragStart.x) / 200, -1, 1), tiltTarget.y);
    if (event.target !== canvas && !event.target.closest?.('.lab-stage')) return;
    const hit = pick();
    setHover(hit?.object.userData.organelle ?? null, hit?.point);
    canvas.style.cursor = hit ? 'pointer' : 'default';
  }

  function onPointerDown(event) {
    dragStart = { x: event.clientX, y: event.clientY };
  }

  function onPointerUp(event) {
    const moved = dragStart ? event.clientX - dragStart.x : 0;
    dragStart = null;
    if (mode !== 'cell') return;
    if (event.pointerType !== 'mouse' && Math.abs(moved) > SWIPE_MIN_PX) return onSwipe(moved < 0 ? 1 : -1);
    if (event.target.closest?.('button, a, summary, .organelle-list, .info-card')) return;
    const hit = pick();
    if (hit) onPick(hit.object.userData.organelle);
  }

  const stage = document.getElementById('lab-stage');
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  stage.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('resize', resize);

  function setCell(id) {
    if (id === current) return;
    const previous = current ? cells[current] : null;
    const next = cells[id];
    const direction = current && Object.keys(cells).indexOf(id) < Object.keys(cells).indexOf(current) ? -1 : 1;
    current = id;
    card.hide();
    next.visible = true;
    if (!previous || reduce) {
      if (previous) previous.visible = false;
      next.position.x = 0;
      return;
    }
    gsap.fromTo(next.position, { x: SLIDE_DISTANCE * direction }, { x: 0, duration: DURATION.slow, ease: EASE.inOut });
    gsap.to(previous.position, { x: -SLIDE_DISTANCE * direction, duration: DURATION.slow, ease: EASE.inOut, onComplete: () => (previous.visible = previous === cells[current]) });
  }

  function highlightFromList(id) {
    if (mode !== 'cell') return;
    hovered = id;
    highlight.set(current, id);
    card.hide();
  }

  function flyTo(id) {
    card.hide();
    const box = new THREE.Box3();
    (meshes[current].get(id) ?? []).forEach((mesh) => box.expandByObject(mesh));
    if (box.isEmpty() || reduce) return Promise.resolve();
    const target = box.getCenter(new THREE.Vector3());
    const end = target.clone().add(new THREE.Vector3(0, 0.3, 2.4));
    return new Promise((resolve) => {
      gsap.to(camera.position, { x: end.x, y: end.y, z: end.z, duration: DURATION.slow * 1.1, ease: EASE.inOut, onComplete: resolve });
    });
  }

  function showDetail(id, partId) {
    mode = 'detail';
    card.hide();
    Object.values(cells).forEach((cell) => (cell.visible = false));
    if (detail) {
      tilt.remove(detail.group);
      disposeScene(detail.group);
    }
    detail = buildDetail(id, meshes[current]);
    tilt.add(detail.group);
    camera.position.copy(DETAIL_CAMERA);
    requestAnimationFrame(resize);
    pins.set(detail.parts);
    selectPart(partId);
    if (!reduce) gsap.from(detail.group.scale, { x: 0.6, y: 0.6, z: 0.6, duration: DURATION.slow, ease: EASE.out });
  }

  function selectPart(partId) {
    if (!detail) return;
    highlight.setParts(detail.parts, partId);
    pins.select(partId);
  }

  function showCell() {
    mode = 'cell';
    pins.set([]);
    if (detail) {
      tilt.remove(detail.group);
      disposeScene(detail.group);
      detail = null;
    }
    cells[current].visible = true;
    cells[current].position.x = 0;
    camera.position.copy(CELL_CAMERA);
    requestAnimationFrame(resize);
  }

  const timer = new THREE.Timer();
  timer.connect(document);
  let time = 0;
  room.setLight(reduce ? 1 : 0);
  if (!reduce) gsap.to({ v: 0 }, { v: 1, duration: DURATION.slow * 1.6, ease: EASE.out, onUpdate() { room.setLight(this.targets()[0].v); } });

  function frame() {
    if (!running) return;
    requestAnimationFrame(frame);
    timer.update();
    const dt = Math.min(timer.getDelta(), 0.1);
    time += dt;
    room.update(time);
    const ease = 1 - Math.exp(-4 * dt);
    tilt.rotation.y += (tiltTarget.x * MAX_YAW - tilt.rotation.y) * ease;
    tilt.rotation.x += (-tiltTarget.y * MAX_PITCH - tilt.rotation.x) * ease;
    if (mode === 'cell' && camera.position.z > 10) look.copy(CELL_LOOK);
    else look.copy(camera.position).setZ(0);
    camera.lookAt(look);
    if (detail) pins.update(detail.parts, detail.group, camera);
    renderer.render(scene, camera);
  }

  function onVisibility() {
    running = !document.hidden;
    if (running) frame();
  }
  document.addEventListener('visibilitychange', onVisibility);
  resize();
  frame();

  function dispose() {
    running = false;
    disposed = true;
    window.removeEventListener('pointermove', onPointerMove);
    stage.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', onVisibility);
    card.dispose();
    pins.set([]);
    disposeScene(scene);
    timer.dispose();
    renderer.dispose();
    canvas.remove();
  }

  return { setCell, highlight: highlightFromList, flyTo, showDetail, selectPart, showCell, dispose };
}
