import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { partMaterial, stackedArcs } from '../landing/scenes/cell-parts.js';
import { seededRandom } from '../landing/scenes/shared.js';

export const CUT_PLANE = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.15);
export const SHELL_IDS = ['membran-plasma', 'sitoplasma', 'dinding-sel'];

function shellMaterial(color, opacity, side = THREE.DoubleSide) {
  return new THREE.MeshPhysicalMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0,
    roughness: 0.3,
    clearcoat: 0.6,
    transparent: true,
    opacity,
    side,
    depthWrite: false,
    clippingPlanes: [CUT_PLANE],
  });
}

function tag(object, id) {
  object.traverse((child) => {
    if (child.isMesh) child.userData.organelle = id;
  });
  object.userData.organelle = id;
  return object;
}

function addTagged(group, object, id) {
  group.add(tag(object, id));
  return object;
}

function place(group, mesh, [x, y, z], rotation = [0, 0, 0]) {
  mesh.position.set(x, y, z);
  mesh.rotation.set(...rotation);
  group.add(mesh);
  return mesh;
}

function nucleus(position, scale = 1) {
  const group = new THREE.Group();
  const envelope = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), partMaterial('#3D7FC4', { clippingPlanes: [CUT_PLANE], side: THREE.DoubleSide }));
  const nucleolus = new THREE.Mesh(new THREE.SphereGeometry(0.36, 32, 20), partMaterial('#1E3F66'));
  nucleolus.position.set(0.15, 0.1, 0.1);
  group.add(envelope, nucleolus);
  group.position.copy(position);
  group.scale.setScalar(scale);
  return group;
}

function scatter(random, count, radius, make) {
  const group = new THREE.Group();
  for (let i = 0; i < count; i += 1) {
    const direction = new THREE.Vector3(random() - 0.5, random() - 0.5, random() - 0.5).normalize();
    const distance = radius * (0.45 + random() * 0.5);
    const mesh = make(i);
    mesh.position.copy(direction.multiplyScalar(distance));
    mesh.rotation.set(random() * 3, random() * 3, random() * 3);
    group.add(mesh);
  }
  return group;
}

function ribosomes(random, count, radius) {
  const mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.045, 8, 6), partMaterial('#E8D7A8'), count);
  const matrix = new THREE.Matrix4();
  for (let i = 0; i < count; i += 1) {
    const point = new THREE.Vector3(random() - 0.5, random() - 0.5, random() - 0.5).normalize().multiplyScalar(radius * (0.3 + random() * 0.65));
    matrix.makeTranslation(point.x, point.y, point.z);
    mesh.setMatrixAt(i, matrix);
  }
  return mesh;
}

function sharedOrganelles(cell, random, { radius, nucleusAt }) {
  addTagged(cell, nucleus(nucleusAt), 'nukleus');

  const mitoMaterial = partMaterial('#FF7A59');
  addTagged(cell, scatter(random, 5, radius, () => new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.55, 10, 24), mitoMaterial)), 'mitokondria');

  const rough = stackedArcs({ count: 4, radius: 1.55, tube: 0.085, arc: Math.PI * 1.1, gap: 0.16, color: '#4CC38A' });
  rough.position.copy(nucleusAt);
  rough.rotation.set(0.3, 0.3, 2.4);
  tag(rough, 're-kasar');
  cell.add(rough);

  const smooth = stackedArcs({ count: 3, radius: 1.0, tube: 0.07, arc: Math.PI * 0.9, gap: 0.18, color: '#9ADBB0' });
  place(cell, smooth, [nucleusAt.x - 0.6, nucleusAt.y - 1.5, 0.2], [0.4, -0.2, 0.8]);
  tag(smooth, 're-halus');

  addTagged(cell, ribosomes(random, 140, radius), 'ribosom');

  const golgi = stackedArcs({ count: 5, radius: 0.55, tube: 0.1, arc: Math.PI * 0.9, gap: 0.16, color: '#F2B544' });
  place(cell, golgi, [1.4, -1.1, -0.2], [0.6, -0.5, 0.9]);
  tag(golgi, 'golgi');

  const peroxisomeMaterial = partMaterial('#D8B4A0');
  addTagged(cell, scatter(random, 3, radius, () => new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 16), peroxisomeMaterial)), 'peroksisom');
}

export function buildAnimalCell() {
  const cell = new THREE.Group();
  const random = seededRandom(11);
  const membrane = new THREE.Mesh(new THREE.SphereGeometry(3, 64, 48), shellMaterial('#7FD6D0', 0.35));
  membrane.scale.set(1.12, 0.9, 1);
  tag(membrane, 'membran-plasma');
  const cytoplasm = new THREE.Mesh(new THREE.SphereGeometry(2.92, 48, 32), shellMaterial('#1B5560', 0.5, THREE.BackSide));
  cytoplasm.scale.copy(membrane.scale);
  tag(cytoplasm, 'sitoplasma');
  cell.add(membrane, cytoplasm);

  sharedOrganelles(cell, random, { radius: 2.4, nucleusAt: new THREE.Vector3(-0.3, 0.2, -0.3) });

  const lysoMaterial = partMaterial('#E5534B');
  addTagged(cell, scatter(random, 4, 2.4, () => new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 16), lysoMaterial)), 'lisosom');

  const centrioles = new THREE.Group();
  const tube = new THREE.CylinderGeometry(0.09, 0.09, 0.45, 18);
  const centrioleMaterial = partMaterial('#E8F4F2');
  const a = new THREE.Mesh(tube, centrioleMaterial);
  const b = new THREE.Mesh(tube, centrioleMaterial);
  b.rotation.z = Math.PI / 2;
  b.position.x = 0.26;
  centrioles.add(a, b);
  place(cell, centrioles, [1.0, 0.6, 0.6]);
  tag(centrioles, 'sentriol');
  return cell;
}

export function buildPlantCell() {
  const cell = new THREE.Group();
  const random = seededRandom(23);
  const size = new THREE.Vector3(6.4, 4.4, 4);
  const wall = new THREE.Mesh(new RoundedBoxGeometry(size.x, size.y, size.z, 6, 0.45), shellMaterial('#9CCB6E', 0.45));
  tag(wall, 'dinding-sel');
  const membrane = new THREE.Mesh(new RoundedBoxGeometry(size.x - 0.3, size.y - 0.3, size.z - 0.3, 6, 0.35), shellMaterial('#7FD6D0', 0.25));
  tag(membrane, 'membran-plasma');
  const cytoplasm = new THREE.Mesh(new RoundedBoxGeometry(size.x - 0.4, size.y - 0.4, size.z - 0.4, 4, 0.3), shellMaterial('#18463C', 0.5, THREE.BackSide));
  tag(cytoplasm, 'sitoplasma');
  cell.add(wall, membrane, cytoplasm);

  const vacuole = new THREE.Mesh(new RoundedBoxGeometry(3.6, 2.4, 2.2, 6, 0.8), partMaterial('#8FD3F0', { transparent: true, opacity: 0.55, depthWrite: false }));
  place(cell, vacuole, [0.5, -0.1, -0.4]);
  tag(vacuole, 'vakuola');

  sharedOrganelles(cell, random, { radius: 2.0, nucleusAt: new THREE.Vector3(-2.2, 0.9, -0.2) });
  const byId = (id) => cell.children.find((child) => child.userData.organelle === id);
  byId('nukleus').scale.setScalar(0.7);
  ['re-kasar', 're-halus'].forEach((id) => {
    byId(id).scale.setScalar(0.62);
    byId(id).position.x += 0.7;
  });

  const chloroGeometry = new THREE.SphereGeometry(0.28, 32, 20);
  chloroGeometry.scale(1.6, 0.8, 1);
  const chloroMaterial = partMaterial('#3FA55A');
  const chloroplasts = new THREE.Group();
  for (let i = 0; i < 14; i += 1) {
    const chloro = new THREE.Mesh(chloroGeometry, chloroMaterial);
    const top = i % 2 === 0;
    chloro.position.set((random() - 0.5) * 5.4, top ? 1.75 : -1.75, (random() - 0.5) * 2.6);
    chloro.rotation.set(random(), random() * 3, random());
    chloroplasts.add(chloro);
  }
  cell.add(chloroplasts);
  tag(chloroplasts, 'kloroplas');
  return cell;
}

export function organelleMeshes(cell) {
  const map = new Map();
  cell.traverse((child) => {
    if (!child.isMesh) return;
    const id = child.userData.organelle;
    if (!map.has(id)) map.set(id, []);
    map.get(id).push(child);
  });
  return map;
}
