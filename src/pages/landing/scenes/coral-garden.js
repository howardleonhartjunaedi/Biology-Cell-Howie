import * as THREE from 'three';
import { addSway, seededRandom } from './shared.js';

const CORAL_COLORS = ['#FF7A59', '#F2B544', '#E5735B', '#F4C9A8', '#D9584A'];

function branchGeometry() {
  const geometry = new THREE.CylinderGeometry(0.06, 0.1, 1, 6, 4);
  geometry.translate(0, 0.5, 0);
  return geometry;
}

function bumpyMound() {
  const geometry = new THREE.IcosahedronGeometry(1, 3);
  const positions = geometry.attributes.position;
  const point = new THREE.Vector3();
  for (let i = 0; i < positions.count; i += 1) {
    point.fromBufferAttribute(positions, i);
    const bump = 1 + Math.sin(point.x * 9) * Math.sin(point.y * 8) * Math.sin(point.z * 9) * 0.12;
    point.multiplyScalar(bump);
    point.y = Math.max(point.y, -0.2);
    positions.setXYZ(i, point.x, point.y, point.z);
  }
  geometry.computeVertexNormals();
  return geometry;
}

export function createCoralGarden({ center, branches, mounds }) {
  const group = new THREE.Group();
  group.position.copy(center);
  const random = seededRandom(91);

  const branchMaterial = new THREE.MeshStandardMaterial({ roughness: 0.75 });
  const sway = addSway(branchMaterial, { strength: 0.05, speed: 1.1 });
  const branchMesh = new THREE.InstancedMesh(branchGeometry(), branchMaterial, branches);
  const matrix = new THREE.Matrix4();
  const euler = new THREE.Euler();
  const quaternion = new THREE.Quaternion();

  for (let i = 0; i < branches; i += 1) {
    const cluster = Math.floor(i / 9);
    const clusterAngle = cluster * 2.4;
    const base = new THREE.Vector3(Math.cos(clusterAngle) * (2 + cluster * 0.9), 0, Math.sin(clusterAngle) * (2 + cluster * 0.9));
    base.x += (random() - 0.5) * 0.8;
    base.z += (random() - 0.5) * 0.8;
    euler.set((random() - 0.5) * 0.9, random() * Math.PI, (random() - 0.5) * 0.9);
    quaternion.setFromEuler(euler);
    const height = 0.8 + random() * 1.8;
    matrix.compose(base, quaternion, new THREE.Vector3(1, height, 1));
    branchMesh.setMatrixAt(i, matrix);
    branchMesh.setColorAt(i, new THREE.Color(CORAL_COLORS[cluster % CORAL_COLORS.length]));
  }
  group.add(branchMesh);

  const moundMesh = new THREE.InstancedMesh(bumpyMound(), new THREE.MeshStandardMaterial({ roughness: 0.9, flatShading: true }), mounds);
  for (let i = 0; i < mounds; i += 1) {
    const angle = random() * Math.PI * 2;
    const distance = 1.5 + random() * 7;
    const size = 0.5 + random() * 1.1;
    matrix.compose(
      new THREE.Vector3(Math.cos(angle) * distance, 0, Math.sin(angle) * distance),
      new THREE.Quaternion(),
      new THREE.Vector3(size, size * 0.7, size)
    );
    moundMesh.setMatrixAt(i, matrix);
    moundMesh.setColorAt(i, new THREE.Color(CORAL_COLORS[(i + 2) % CORAL_COLORS.length]).multiplyScalar(0.8));
  }
  group.add(moundMesh);

  function update(time) {
    sway.uTime.value = time;
  }

  return { group, update };
}
