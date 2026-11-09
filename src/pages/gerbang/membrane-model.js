import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { partMaterial } from '../landing/scenes/cell-parts.js';

export const SIZE = { x: 16, z: 8 };
export const HEAD_Y = 0.9;
const SPACING = 0.5;
export const PROTEINS = {
  integral: new THREE.Vector3(-4.5, 0, -0.5),
  channel: new THREE.Vector3(-0.6, 0, 0.6),
  carrier: new THREE.Vector3(2.6, 0, 0.4),
  pump: new THREE.Vector3(5.8, 0, 0),
  peripheral: new THREE.Vector3(-2.4, -1.25, 2.2),
};

function tag(object, part) {
  object.traverse((child) => (child.userData.part = part));
  return object;
}

function tailGeometry() {
  const a = new THREE.CylinderGeometry(0.05, 0.05, 0.75, 6);
  a.translate(-0.08, -0.45, 0);
  const b = a.clone();
  b.translate(0.16, 0, 0);
  return mergeGeometries([a, b]);
}

function blockedByProtein(x, z) {
  return Object.values(PROTEINS).some((p) => p.y === 0 && Math.hypot(p.x - x, p.z - z) < 1.05);
}

function lipidLayer(sign) {
  const positions = [];
  for (let x = -SIZE.x / 2; x <= SIZE.x / 2; x += SPACING) {
    for (let z = -SIZE.z / 2; z <= SIZE.z / 2; z += SPACING) {
      const jitter = ((x * 13.1 + z * 7.3) % 1) * 0.08;
      if (!blockedByProtein(x, z)) positions.push([x + jitter, z - jitter]);
    }
  }
  const heads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.22, 16, 12), partMaterial('#4FB8D9'), positions.length);
  const tails = new THREE.InstancedMesh(tailGeometry(), partMaterial('#F2D49B'), positions.length);
  const matrix = new THREE.Matrix4();
  const flip = new THREE.Matrix4().makeRotationX(sign > 0 ? 0 : Math.PI);
  positions.forEach(([x, z], i) => {
    matrix.makeTranslation(x, HEAD_Y * sign, z).multiply(flip);
    heads.setMatrixAt(i, matrix);
    tails.setMatrixAt(i, matrix);
  });
  const group = new THREE.Group();
  group.add(heads, tails);
  return tag(group, 'fosfolipid');
}

function carbChain(start, length) {
  const group = new THREE.Group();
  const material = partMaterial('#F2B544');
  for (let i = 0; i < length; i += 1) {
    const bead = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), material);
    bead.position.set(start.x + Math.sin(i * 1.3) * 0.15, start.y + i * 0.2, start.z + (i % 2) * 0.12);
    group.add(bead);
  }
  return group;
}

export function buildMembrane() {
  const membrane = new THREE.Group();
  const outer = lipidLayer(1);
  const inner = lipidLayer(-1);
  membrane.add(outer, inner);

  const integral = new THREE.Mesh(new THREE.CapsuleGeometry(0.75, 1.6, 12, 32), partMaterial('#E5735B'));
  integral.position.copy(PROTEINS.integral);
  membrane.add(tag(integral, 'protein-integral'));

  const glyco = carbChain(new THREE.Vector3(PROTEINS.integral.x, 1.7, PROTEINS.integral.z), 6);
  membrane.add(tag(glyco, 'glikoprotein'));

  const glycolipid = carbChain(new THREE.Vector3(-6.5, 1.15, -2), 5);
  membrane.add(tag(glycolipid, 'glikolipid'));

  const channel = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 2.2, 32, 1, true), partMaterial('#2FA39A', { side: THREE.DoubleSide }));
  channel.position.copy(PROTEINS.channel);
  membrane.add(tag(channel, 'protein-integral'));

  const carrier = new THREE.Mesh(new THREE.CapsuleGeometry(0.7, 1.3, 12, 32), partMaterial('#8BC34A'));
  carrier.position.copy(PROTEINS.carrier);
  membrane.add(tag(carrier, 'protein-integral'));

  const pump = new THREE.Mesh(new THREE.CapsuleGeometry(0.85, 1.6, 12, 32), partMaterial('#E8D7A8'));
  pump.position.copy(PROTEINS.pump);
  membrane.add(tag(pump, 'protein-integral'));

  const peripheral = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 20), partMaterial('#B98A6A'));
  peripheral.scale.set(1.3, 0.7, 1);
  peripheral.position.copy(PROTEINS.peripheral);
  membrane.add(tag(peripheral, 'protein-perifer'));

  return { membrane, outer, inner, carrier, pump, channel };
}
