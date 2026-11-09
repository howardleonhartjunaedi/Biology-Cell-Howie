import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { partMaterial } from '../../landing/scenes/cell-parts.js';
import { PROTEINS } from '../membrane-model.js';
import { lerpPath } from './flow.js';

const P = PROTEINS.pump;
const INSIDE_Y = -3.6;
const OUTSIDE_Y = 3.6;
const NA_SLOTS = [-0.35, 0, 0.35];
const K_SLOTS = [-0.22, 0.22];

function starGeometry() {
  const a = new THREE.TetrahedronGeometry(0.32);
  const b = new THREE.TetrahedronGeometry(0.32);
  b.rotateX(Math.PI);
  return mergeGeometries([a, b]);
}

const v = (x, y, z = 0) => new THREE.Vector3(P.x + x, y, P.z + z);
const smooth = (t) => t * t * (3 - 2 * t);

export function createPump({ pump }, state) {
  const group = new THREE.Group();
  const naMaterial = partMaterial('#FF9F43', { emissiveIntensity: 0.35 });
  const kMaterial = partMaterial('#E5534B', { emissiveIntensity: 0.3 });
  const na = NA_SLOTS.map(() => new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 16), naMaterial));
  const k = K_SLOTS.map(() => new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.34), kMaterial));
  const atp = new THREE.Mesh(starGeometry(), partMaterial('#FFE066', { emissive: '#FFE066', emissiveIntensity: 0.4 }));
  const phosphate = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), partMaterial('#FFE066'));
  group.add(...na, ...k, atp, phosphate);

  const glow = pump.material;
  const baseEmissive = glow.emissiveIntensity;
  // Pompa dibuat tembus pandang selama mode ini, supaya ion yang menempel di dalamnya tetap terlihat.
  Object.assign(glow, { transparent: true, opacity: 0.55, depthWrite: false });

  function place(meshes, slots, paths, t) {
    meshes.forEach((mesh, i) => {
      lerpPath(paths(slots[i], i), smooth(t), mesh.position);
      mesh.visible = true;
    });
  }

  function update() {
    const { step, progress } = state;
    const t = progress;
    glow.emissiveIntensity = 0.25;

    const naIn = (s) => [v(s * 3 - 1.5, INSIDE_Y, s * 2), v(s, -0.35)];
    const naOut = (s) => [v(s, 0.35), v(s * 3 + 1.5, OUTSIDE_Y, s * 2)];
    const kIn = (s) => [v(s * 3 - 1.2, OUTSIDE_Y, s * 2), v(s, 0.35)];
    const kDown = (s) => [v(s, -0.35), v(s * 3 + 1.2, INSIDE_Y, s * 2)];

    if (step === 0) place(na, NA_SLOTS, naIn, t);
    if (step === 1) place(na, NA_SLOTS, (s) => [v(s, -0.35), v(s, 0.35)], t);
    if (step === 2) place(na, NA_SLOTS, naOut, t);
    na.forEach((mesh) => (mesh.visible = step <= 2));

    if (step === 3) place(k, K_SLOTS, kIn, t);
    if (step === 4) place(k, K_SLOTS, (s) => [v(s, 0.35), v(s, -0.35)], t);
    if (step === 5) place(k, K_SLOTS, kDown, t);
    k.forEach((mesh) => (mesh.visible = step >= 3));

    atp.visible = step === 1;
    if (atp.visible) {
      lerpPath([v(-1.6, INSIDE_Y), v(0, -1.1)], smooth(Math.min(1, t * 1.6)), atp.position);
      atp.scale.setScalar(1 - smooth(Math.max(0, t - 0.6) / 0.4) * 0.9);
      atp.rotation.y += 0.05;
    }
    phosphate.visible = step >= 1 && step <= 4;
    phosphate.position.copy(v(0.85, -0.7));
    if (step === 4) phosphate.position.lerp(v(1.8, INSIDE_Y + 1), smooth(t));

    const open = step === 1 || step === 2 || step === 3;
    const shape = open ? 1 : 0;
    pump.scale.set(1 - shape * 0.12, 1 + shape * 0.08, 1);
    pump.rotation.z = shape * 0.12;
  }

  function dispose() {
    glow.emissiveIntensity = baseEmissive;
    Object.assign(glow, { transparent: false, opacity: 1, depthWrite: true });
    pump.scale.set(1, 1, 1);
    pump.rotation.z = 0;
  }

  return { group, update, dispose };
}
