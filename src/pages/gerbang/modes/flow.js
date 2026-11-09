import * as THREE from 'three';
import { seededRandom } from '../../landing/scenes/shared.js';

const matrix = new THREE.Matrix4();
const position = new THREE.Vector3();
const quaternion = new THREE.Quaternion();
const scale = new THREE.Vector3(1, 1, 1);

export function createFlow({ count, geometry, material, duration, path, seed = 1 }) {
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  const random = seededRandom(seed);
  const items = Array.from({ length: count }, (_, index) => ({
    phase: index / count,
    lane: new THREE.Vector3(random() * 2 - 1, random(), random() * 2 - 1),
  }));

  function update(seconds) {
    items.forEach((item, index) => {
      item.phase = (item.phase + seconds / duration) % 1;
      path(item.phase, item.lane, position);
      quaternion.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, item.phase * 6 + index);
      matrix.compose(position, quaternion, scale);
      mesh.setMatrixAt(index, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }

  function countAbove(y = 0) {
    let above = 0;
    for (let i = 0; i < count; i += 1) {
      mesh.getMatrixAt(i, matrix);
      position.setFromMatrixPosition(matrix);
      if (position.y > y) above += 1;
    }
    return above;
  }

  update(0);
  return { mesh, update, countAbove };
}

export function lerpPath(points, t, target) {
  const segments = points.length - 1;
  const scaled = Math.min(t * segments, segments - 0.0001);
  const index = Math.floor(scaled);
  return target.lerpVectors(points[index], points[index + 1], scaled - index);
}
