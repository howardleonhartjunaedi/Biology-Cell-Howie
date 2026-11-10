import * as THREE from 'three';
import { partMaterial } from '../../landing/scenes/cell-parts.js';
import { PROTEINS, SIZE } from '../membrane-model.js';
import { createFlow } from './flow.js';

const TOP = 4.5;
const BOTTOM = -4.5;

function crossDown(phase, lane, target, x, z, spread) {
  const y = TOP - phase * (TOP - BOTTOM);
  const wobble = spread * THREE.MathUtils.smoothstep(Math.abs(y), 1.1, 2.6);
  return target.set(x + lane.x * wobble, y, z + lane.z * wobble);
}

export function createDiffusion() {
  const group = new THREE.Group();
  const geometry = new THREE.SphereGeometry(0.16, 16, 12);
  const oxygen = createFlow({
    count: 36,
    geometry,
    material: partMaterial('#FF6B6B'),
    duration: 9,
    seed: 3,
    path: (phase, lane, target) => crossDown(phase, lane, target, lane.x * 5 - 1, lane.z * 3, 1.4),
  });
  const carbon = createFlow({
    count: 18,
    geometry,
    material: partMaterial('#9AA4AE'),
    duration: 11,
    seed: 5,
    path: (phase, lane, target) => crossDown(phase, lane, target, lane.x * 5 - 2, lane.z * 3, 1.4),
  });
  group.add(oxygen.mesh, carbon.mesh);
  return {
    group,
    update: (seconds) => {
      oxygen.update(seconds);
      carbon.update(seconds);
    },
    counts: () => {
      const above = oxygen.countAbove() + carbon.countAbove();
      return { out: above, in: 54 - above };
    },
  };
}

export function createFacilitated({ carrier }) {
  const group = new THREE.Group();
  const glucose = createFlow({
    count: 8,
    geometry: new THREE.CylinderGeometry(0.22, 0.22, 0.08, 6),
    material: partMaterial('#F2B544'),
    duration: 7,
    seed: 7,
    path: (phase, lane, target) => crossDown(phase, lane, target, PROTEINS.carrier.x, PROTEINS.carrier.z, 1.6),
  });
  const ions = createFlow({
    count: 10,
    geometry: new THREE.SphereGeometry(0.13, 12, 10),
    material: partMaterial('#B8F1EC'),
    duration: 5,
    seed: 9,
    path: (phase, lane, target) => crossDown(phase, lane, target, PROTEINS.channel.x, PROTEINS.channel.z, 1.4),
  });
  group.add(glucose.mesh, ions.mesh);
  let time = 0;
  return {
    group,
    update: (seconds) => {
      time += seconds;
      glucose.update(seconds);
      ions.update(seconds);
      const squeeze = Math.sin(time * 2.4);
      carrier.scale.set(1 + squeeze * 0.12, 1 - squeeze * 0.08, 1 + squeeze * 0.12);
      carrier.rotation.z = squeeze * 0.15;
    },
    dispose: () => {
      carrier.scale.set(1, 1, 1);
      carrier.rotation.z = 0;
    },
  };
}

export function createOsmosis() {
  const group = new THREE.Group();
  const water = createFlow({
    count: 40,
    geometry: new THREE.SphereGeometry(0.12, 12, 10),
    material: partMaterial('#6EC6FF'),
    duration: 8,
    seed: 11,
    path: (phase, lane, target) => crossDown(phase, lane, target, lane.x * (SIZE.x / 2 - 1), lane.z * 3, 1.2),
  });
  const solute = new THREE.InstancedMesh(new THREE.SphereGeometry(0.3, 16, 12), partMaterial('#E8D7A8'), 30);
  const matrix = new THREE.Matrix4();
  for (let i = 0; i < 30; i += 1) {
    const below = i < 24;
    matrix.makeTranslation(((i * 37) % 15) - 7, below ? -2 - (i % 3) : 2.4 + (i % 2), ((i * 17) % 6) - 3);
    solute.setMatrixAt(i, matrix);
  }
  group.add(water.mesh, solute);
  return { group, update: (seconds) => water.update(seconds) };
}
