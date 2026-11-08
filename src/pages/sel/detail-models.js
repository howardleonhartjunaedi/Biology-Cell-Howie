import * as THREE from 'three';
import { partMaterial } from '../landing/scenes/cell-parts.js';
import { seededRandom } from '../landing/scenes/shared.js';

const CUT = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);

function part(id, anchor, ...meshes) {
  return { id, anchor: new THREE.Vector3(...anchor), meshes };
}

function cutMaterial(color, options = {}) {
  return partMaterial(color, { clippingPlanes: [CUT], side: THREE.DoubleSide, ...options });
}

function nukleus() {
  const group = new THREE.Group();
  const envelope = new THREE.Mesh(new THREE.SphereGeometry(2, 64, 48), cutMaterial('#3D7FC4'));
  const plasm = new THREE.Mesh(new THREE.SphereGeometry(1.9, 48, 32), cutMaterial('#21466F', { transparent: true, opacity: 0.6 }));
  const pores = new THREE.InstancedMesh(new THREE.TorusGeometry(0.09, 0.03, 8, 16), partMaterial('#B8F1EC'), 40);
  const random = seededRandom(5);
  const matrix = new THREE.Matrix4();
  for (let i = 0; i < 40; i += 1) {
    const dir = new THREE.Vector3(random() - 0.5, random() - 0.5, -random()).normalize();
    matrix.lookAt(new THREE.Vector3(), dir, new THREE.Vector3(0, 1, 0)).setPosition(dir.multiplyScalar(2.01));
    pores.setMatrixAt(i, matrix);
  }
  const nucleolus = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 24), partMaterial('#1E3F66'));
  nucleolus.position.set(0.4, 0.2, 0);
  const points = [];
  for (let i = 0; i < 60; i += 1) points.push(new THREE.Vector3(Math.sin(i * 0.7) * 1.3, Math.cos(i * 0.45) * 1.2, Math.sin(i * 0.33) * 0.8 - 0.5));
  const chromatin = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 240, 0.05, 8), partMaterial('#F2B544'));
  group.add(envelope, plasm, pores, nucleolus, chromatin);
  return { group, parts: [
    part('karioteka', [1.4, 1.4, 0], envelope),
    part('pori-nukleus', [-1.2, 1.2, -1.1], pores),
    part('nukleoplasma', [-0.9, -0.9, 0], plasm),
    part('nukleolus', [0.4, 0.2, 0], nucleolus),
    part('kromatin', [-1.0, 0.3, -0.3], chromatin),
  ] };
}

function mitokondria() {
  const group = new THREE.Group();
  const outer = new THREE.Mesh(new THREE.CapsuleGeometry(1.1, 2.6, 16, 48), cutMaterial('#FF7A59'));
  outer.rotation.z = Math.PI / 2;
  const inner = new THREE.Mesh(new THREE.CapsuleGeometry(0.95, 2.4, 16, 48), cutMaterial('#E5604A'));
  inner.rotation.z = Math.PI / 2;
  const matrix = new THREE.Mesh(new THREE.CapsuleGeometry(0.85, 2.3, 12, 32), cutMaterial('#2AA6A0', { transparent: true, opacity: 0.7 }));
  matrix.rotation.z = Math.PI / 2;
  const cristae = new THREE.Group();
  for (let i = 0; i < 7; i += 1) {
    const fold = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2, 1.5, 1, 6, 6), partMaterial('#F5A08A'));
    fold.position.set(-1.6 + i * 0.53, i % 2 ? 0.35 : -0.35, -0.2);
    cristae.add(fold);
  }
  group.add(outer, inner, matrix, cristae);
  return { group, parts: [
    part('membran-luar', [0, 1.1, -0.3], outer),
    part('membran-dalam', [1.9, 0.6, 0], inner),
    part('krista', [-0.5, 0.35, 0], ...cristae.children),
    part('matriks', [0.8, -0.5, 0], matrix),
  ] };
}

function kloroplas() {
  const group = new THREE.Group();
  const shape = (r, color, opts) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 64, 40), cutMaterial(color, opts));
    mesh.scale.set(1.8, 0.9, 1);
    return mesh;
  };
  const membrane = shape(1.5, '#3FA55A');
  const stroma = shape(1.38, '#B7E07A', { transparent: true, opacity: 0.55 });
  const stacks = new THREE.Group();
  const thylakoids = [];
  [-1.6, -0.6, 0.4, 1.4].forEach((x) => {
    for (let i = 0; i < 5; i += 1) {
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.08, 32), partMaterial('#2E7D4F'));
      disc.position.set(x, -0.3 + i * 0.13, -0.2);
      stacks.add(disc);
      thylakoids.push(disc);
    }
  });
  group.add(membrane, stroma, stacks);
  return { group, parts: [
    part('membran-kloroplas', [0, 1.3, -0.4], membrane),
    part('tilakoid', [-1.6, 0.35, 0], thylakoids[4]),
    part('grana', [0.4, 0.4, 0], ...thylakoids),
    part('stroma', [1.0, -0.8, 0], stroma),
  ] };
}

function golgi() {
  const group = new THREE.Group();
  const cisterns = [];
  for (let i = 0; i < 6; i += 1) {
    const sac = new THREE.Mesh(new THREE.TorusGeometry(2.2 - i * 0.12, 0.16, 16, 64, Math.PI * 0.85), partMaterial(i === 0 ? '#9ADBB0' : i === 5 ? '#FF7A59' : '#F2B544'));
    sac.rotation.z = Math.PI * 0.075;
    sac.position.y = -i * 0.38 + 1;
    group.add(sac);
    cisterns.push(sac);
  }
  const vesicles = new THREE.Group();
  [[2.4, -1.4], [2.0, -1.9], [-2.3, -1.5], [2.7, -0.9]].forEach(([x, y]) => {
    const v = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 16), partMaterial('#FFF4D6'));
    v.position.set(x, y, 0);
    vesicles.add(v);
  });
  group.add(vesicles);
  return { group, parts: [
    part('sisterna', [0, 1.5, 0], ...cisterns.slice(1, 5)),
    part('sisi-cis', [-2.1, 1.0, 0], cisterns[0]),
    part('sisi-trans', [1.7, -0.5, 0], cisterns[5]),
    part('vesikel', [2.4, -1.4, 0], ...vesicles.children),
  ] };
}

function re() {
  const group = new THREE.Group();
  const tube = (y, color) => new THREE.Mesh(new THREE.TorusGeometry(2 - y * 0.3, 0.22, 16, 80, Math.PI), cutMaterial(color));
  const rough = [tube(0, '#4CC38A'), tube(1, '#4CC38A')];
  rough.forEach((mesh, i) => (mesh.position.y = 0.9 - i * 0.6));
  const smooth = [tube(2, '#9ADBB0'), tube(3, '#9ADBB0')];
  smooth.forEach((mesh, i) => (mesh.position.y = -0.4 - i * 0.6));
  const dots = new THREE.InstancedMesh(new THREE.SphereGeometry(0.06, 10, 8), partMaterial('#E8D7A8'), 120);
  const matrix = new THREE.Matrix4();
  for (let i = 0; i < 120; i += 1) {
    const angle = (i / 60) * Math.PI;
    const ring = i < 60 ? 0 : 1;
    const radius = 2 - ring * 0.3 + 0.24;
    matrix.makeTranslation(Math.cos(angle) * radius, 0.9 - ring * 0.6, Math.sin(angle) * radius * 0.2);
    dots.setMatrixAt(i, matrix);
  }
  const lumen = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.12, 12, 60, Math.PI), partMaterial('#0E3B3A'));
  lumen.position.y = -0.4;
  group.add(...rough, ...smooth, dots, lumen);
  return { group, parts: [
    part('re-kasar', [1.9, 1.1, 0], ...rough, dots),
    part('re-halus', [-1.4, -0.6, 0], ...smooth),
    part('lumen', [0, 0.9, 0], lumen),
  ] };
}

const FULL = { nukleus, mitokondria, kloroplas, golgi, re };

export function buildDetail(id, cellMeshes) {
  if (FULL[id]) return FULL[id]();
  const group = new THREE.Group();
  const source = cellMeshes.get(id) ?? [];
  const box = new THREE.Box3();
  source.forEach((mesh) => {
    const copy = mesh.clone();
    mesh.updateWorldMatrix(true, false);
    mesh.matrixWorld.decompose(copy.position, copy.quaternion, copy.scale);
    group.add(copy);
    box.expandByObject(copy);
  });
  const size = box.getSize(new THREE.Vector3()).length() || 1;
  const center = box.getCenter(new THREE.Vector3());
  group.children.forEach((child) => child.position.sub(center));
  group.scale.setScalar(4.5 / size);
  return { group, parts: [] };
}
