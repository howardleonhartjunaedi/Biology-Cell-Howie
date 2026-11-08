import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { seededRandom } from './shared.js';

const SCHOOL_RADIUS = 9;
const SWIM_SPEED = 0.12;

function fishGeometry() {
  const body = new THREE.SphereGeometry(0.5, 32, 20);
  body.scale(1, 0.42, 0.22);
  const tail = new THREE.ConeGeometry(0.26, 0.42, 12);
  tail.rotateZ(-Math.PI / 2);
  tail.scale(1, 1, 0.12);
  tail.translate(-0.62, 0, 0);
  return mergeGeometries([body.toNonIndexed(), tail.toNonIndexed()]);
}

function addSwimWiggle(material, uniforms) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        float tailWeight = smoothstep(0.35, -0.85, position.x);
        float phase = instanceMatrix[3].x * 1.3 + instanceMatrix[3].y * 2.1;
        transformed.z += sin(position.x * 5.0 - uTime * 9.0 + phase) * 0.12 * tailWeight;`
      );
  };
}

export function createFishSchool({ count }) {
  const uniforms = { uTime: { value: 0 } };
  const material = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.3 });
  addSwimWiggle(material, uniforms);

  const mesh = new THREE.InstancedMesh(fishGeometry(), material, count);
  const random = seededRandom(41);
  const palette = ['#F2B544', '#1FC8C8', '#E8F4F2', '#FF7A59', '#B8F1EC'].map((hex) => new THREE.Color(hex));
  const fish = Array.from({ length: count }, (_, index) => {
    mesh.setColorAt(index, palette[index % palette.length]);
    return {
      angle: random() * Math.PI * 2,
      radius: SCHOOL_RADIUS * (0.55 + random() * 0.6),
      height: (random() - 0.5) * 4,
      scale: 0.35 + random() * 0.35,
      speed: SWIM_SPEED * (0.85 + random() * 0.3),
    };
  });
  fish[0].radius = SCHOOL_RADIUS;
  fish[0].height = 0;
  fish[0].scale = 0.8;

  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);

  function fishPosition(item, time, target) {
    const angle = item.angle + time * item.speed;
    return target.set(Math.cos(angle) * item.radius, item.height + Math.sin(time + item.angle) * 0.3, Math.sin(angle) * item.radius);
  }

  function update(time) {
    uniforms.uTime.value = time;
    fish.forEach((item, index) => {
      fishPosition(item, time, position);
      const heading = -(item.angle + time * item.speed + Math.PI / 2);
      quaternion.setFromAxisAngle(up, heading);
      scale.setScalar(item.scale);
      matrix.compose(position, quaternion, scale);
      mesh.setMatrixAt(index, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }

  function leader(time, target) {
    return fishPosition(fish[0], time, target);
  }

  return { mesh, update, leader, leaderData: fish[0] };
}
