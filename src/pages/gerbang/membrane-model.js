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
  peripheral: new THREE.Vector3(-2.4, -1.3, 2.2),
};

function tag(object, part) {
  object.traverse((child) => (child.userData.part = part));
  return object;
}

// Angka acak yang selalu sama (susunan membran tidak berubah setiap halaman dibuka).
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ---------- Fosfolipid ---------- */

// Dua ekor asam lemak. Ekor kedua punya "tekukan" (ikatan rangkap pada asam lemak tak jenuh).
function tailGeometry() {
  const straight = new THREE.CylinderGeometry(0.045, 0.04, 0.78, 8);
  straight.translate(-0.08, -0.47, 0);
  const upper = new THREE.CylinderGeometry(0.045, 0.045, 0.4, 8);
  upper.translate(0.08, -0.28, 0);
  const lower = new THREE.CylinderGeometry(0.045, 0.04, 0.42, 8);
  lower.translate(0, -0.21, 0);
  lower.rotateZ(0.42);
  lower.translate(0.08, -0.47, 0);
  const neck = new THREE.CylinderGeometry(0.06, 0.06, 0.2, 8);
  neck.rotateZ(Math.PI / 2);
  neck.translate(0, -0.12, 0);
  return mergeGeometries([straight, upper, lower, neck]);
}

function blockedByProtein(x, z) {
  return Object.values(PROTEINS).some((p) => p.y === 0 && Math.hypot(p.x - x, p.z - z) < 1.35);
}

function lipidLayer(sign, seed) {
  const rand = seeded(seed);
  const positions = [];
  for (let x = -SIZE.x / 2; x <= SIZE.x / 2; x += SPACING) {
    for (let z = -SIZE.z / 2; z <= SIZE.z / 2; z += SPACING) {
      const px = x + (rand() - 0.5) * 0.12;
      const pz = z + (rand() - 0.5) * 0.12;
      if (!blockedByProtein(px, pz)) positions.push([px, pz]);
    }
  }
  const heads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.22, 20, 14), partMaterial('#ffffff'), positions.length);
  const tails = new THREE.InstancedMesh(tailGeometry(), partMaterial('#F2D49B', { roughness: 0.55, clearcoat: 0.2 }), positions.length);
  const base = new THREE.Color('#4FB8D9');
  const color = new THREE.Color();
  const matrix = new THREE.Matrix4();
  const flip = new THREE.Matrix4().makeRotationX(sign > 0 ? 0 : Math.PI);
  const spin = new THREE.Matrix4();
  positions.forEach(([x, z], i) => {
    // Membran itu "cair": tiap fosfolipid sedikit naik-turun dan berputar berbeda.
    const lift = (rand() - 0.5) * 0.08;
    spin.makeRotationY(rand() * Math.PI * 2);
    matrix.makeTranslation(x, HEAD_Y * sign + lift, z).multiply(flip).multiply(spin);
    heads.setMatrixAt(i, matrix);
    tails.setMatrixAt(i, matrix);
    color.copy(base).offsetHSL((rand() - 0.5) * 0.02, 0, (rand() - 0.5) * 0.08);
    heads.setColorAt(i, color);
  });
  const group = new THREE.Group();
  group.add(heads, tails);
  return tag(group, 'fosfolipid');
}

/* ---------- Protein ---------- */

// Permukaan protein dibuat bergelombang (seperti protein globular di buku), bukan kapsul licin.
function lumpy(geometry, amount, seed) {
  const pos = geometry.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 1) {
    v.fromBufferAttribute(pos, i);
    const n =
      Math.sin(v.x * 3.1 + seed) * Math.sin(v.y * 2.7 + seed * 1.7) * Math.sin(v.z * 3.3 + seed * 0.6) +
      0.45 * Math.sin(v.x * 7.3 + v.z * 5.1 + seed) * Math.sin(v.y * 6.1 + seed);
    const length = Math.hypot(v.x, v.z) || 1;
    v.x += (v.x / length) * n * amount;
    v.z += (v.z / length) * n * amount;
    v.y += n * amount * 0.4;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geometry.computeVertexNormals();
  return geometry;
}

// Satu subunit = tabung membulat yang sedikit miring (mirip heliks protein yang menembus membran).
function subunit(radius, height, x, z, tilt = 0) {
  const geometry = new THREE.CapsuleGeometry(radius, height, 10, 24);
  geometry.rotateZ(tilt);
  geometry.translate(x, 0, z);
  return geometry;
}

function blob(radius, x, y, z, scale = [1, 1, 1]) {
  const geometry = new THREE.SphereGeometry(radius, 32, 20);
  geometry.scale(...scale);
  geometry.translate(x, y, z);
  return geometry;
}

// PROTEIN_SCALE dibuat besar supaya protein menonjol di atas dan bawah lapisan kepala fosfolipid
// (seperti gambar model mozaik fluida di buku), tidak tenggelam di antara kepala-kepala biru.
const PROTEIN_SCALE = [1.2, 1.4, 1.2];

function proteinMesh(parts, color, seed, amount = 0.07, options = {}) {
  const merged = mergeGeometries(parts);
  merged.scale(...PROTEIN_SCALE);
  const geometry = lumpy(merged, amount, seed);
  return new THREE.Mesh(geometry, partMaterial(color, { roughness: 0.5, clearcoat: 0.35, emissiveIntensity: 0.12, ...options }));
}

// Protein integral pembawa glikoprotein: empat subunit menembus membran + kepala di sisi luar.
function integralProtein() {
  return proteinMesh(
    [
      subunit(0.34, 1.7, -0.3, -0.25, 0.08),
      subunit(0.34, 1.8, 0.32, -0.2, -0.1),
      subunit(0.32, 1.6, -0.2, 0.32, -0.06),
      subunit(0.3, 1.65, 0.3, 0.3, 0.1),
      blob(0.55, 0, 1.25, 0, [1.1, 0.7, 1]),
      blob(0.42, 0.1, -1.25, 0.05, [1, 0.6, 1]),
    ],
    '#E5735B',
    1.3
  );
}

// Saluran protein: lima subunit melingkar dengan lubang di tengah (jalur ion).
function channelProtein() {
  const ring = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2;
    return subunit(0.3, 2.2, Math.cos(a) * 0.58, Math.sin(a) * 0.58, 0);
  });
  return proteinMesh(ring, '#2FA39A', 2.2, 0.05);
}

// Protein pembawa: dua lobus dengan celah di tengah (tempat glukosa menempel).
function carrierProtein() {
  return proteinMesh(
    [
      subunit(0.42, 1.5, -0.42, 0, 0.12),
      subunit(0.42, 1.5, 0.42, 0, -0.12),
      blob(0.5, -0.3, 1.1, 0.1, [1, 0.6, 1]),
      blob(0.5, 0.3, 1.1, -0.1, [1, 0.6, 1]),
    ],
    '#8BC34A',
    3.1
  );
}

// Pompa Na⁺/K⁺: badan besar di membran + domain di sitoplasma (tempat ATP menempel).
function pumpProtein() {
  return proteinMesh(
    [
      subunit(0.45, 1.7, -0.45, -0.1, 0.06),
      subunit(0.45, 1.8, 0.45, 0.05, -0.06),
      subunit(0.38, 1.5, 0, 0.5, 0),
      blob(0.75, 0.15, -1.45, 0.1, [1.15, 0.75, 1]),
      blob(0.45, -0.2, 1.25, -0.1, [1.2, 0.6, 1]),
    ],
    '#E8D7A8',
    4.4
  );
}

function peripheralProtein() {
  return proteinMesh([blob(0.5, -0.3, 0, 0, [1.1, 0.75, 1]), blob(0.42, 0.35, 0.05, 0.15, [1, 0.7, 1]), blob(0.3, 0.05, -0.1, -0.35)], '#B98A6A', 5.7, 0.06);
}

/* ---------- Rantai karbohidrat ---------- */

// Oligosakarida bercabang: manik-manik gula dihubungkan batang tipis.
function carbChain(start, length) {
  const group = new THREE.Group();
  const sugar = partMaterial('#F2B544', { roughness: 0.45 });
  const link = partMaterial('#C9933A', { roughness: 0.6 });
  const beadGeometry = new THREE.IcosahedronGeometry(0.1, 2);
  const linkGeometry = new THREE.CylinderGeometry(0.025, 0.025, 1, 6);
  const points = [];
  for (let i = 0; i < length; i += 1) points.push(new THREE.Vector3(start.x + Math.sin(i * 1.3) * 0.14, start.y + i * 0.21, start.z + (i % 2) * 0.1));
  const fork = points[Math.floor(length / 2)];
  points.push(fork.clone().add(new THREE.Vector3(0.2, 0.14, 0.05)), fork.clone().add(new THREE.Vector3(0.38, 0.3, 0.02)));
  points.forEach((p) => {
    const bead = new THREE.Mesh(beadGeometry, sugar);
    bead.position.copy(p);
    group.add(bead);
  });
  const joins = points.slice(1, length).map((p, i) => [points[i], p]);
  joins.push([fork, points[length]], [points[length], points[length + 1]]);
  joins.forEach(([a, b]) => {
    const stick = new THREE.Mesh(linkGeometry, link);
    stick.position.copy(a).add(b).multiplyScalar(0.5);
    stick.scale.y = a.distanceTo(b);
    stick.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    group.add(stick);
  });
  return group;
}

export function buildMembrane() {
  const membrane = new THREE.Group();
  const outer = lipidLayer(1, 3);
  const inner = lipidLayer(-1, 9);
  membrane.add(outer, inner);

  const integral = integralProtein();
  integral.position.copy(PROTEINS.integral);
  membrane.add(tag(integral, 'protein-integral'));

  const glyco = carbChain(new THREE.Vector3(PROTEINS.integral.x, 2.2, PROTEINS.integral.z), 6);
  membrane.add(tag(glyco, 'glikoprotein'));

  const glycolipid = carbChain(new THREE.Vector3(-6.5, 1.15, -2), 5);
  membrane.add(tag(glycolipid, 'glikolipid'));

  const channel = channelProtein();
  channel.position.copy(PROTEINS.channel);
  membrane.add(tag(channel, 'protein-integral'));

  const carrier = carrierProtein();
  carrier.position.copy(PROTEINS.carrier);
  membrane.add(tag(carrier, 'protein-integral'));

  const pump = pumpProtein();
  pump.position.copy(PROTEINS.pump);
  membrane.add(tag(pump, 'protein-integral'));

  const peripheral = peripheralProtein();
  peripheral.position.copy(PROTEINS.peripheral);
  membrane.add(tag(peripheral, 'protein-perifer'));

  return { membrane, outer, inner, carrier, pump, channel };
}
