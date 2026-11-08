import * as THREE from 'three';
import { activePart } from '../dom-sync.js';
import { addWobble, capsule, createHighlighter, membraneMaterial, meshesOf, partMaterial, stackedArcs } from './cell-parts.js';
import { useLabLighting } from '../../../core/materials.js';
import { createDriftParticles, lerp, makeCamera, rangeT, smooth } from './shared.js';

const WATER = new THREE.Color('#06303A');
const PART_COUNT = 6;

export function subjectShift() {
  return window.innerWidth > 900 ? 2.6 : 0;
}

function buildCell(uniforms) {
  const cell = new THREE.Group();

  const membraneMat = membraneMaterial('#7FD6D0');
  addWobble(membraneMat, uniforms, 0.12);
  const membrane = new THREE.Mesh(new THREE.IcosahedronGeometry(3.2, 12), membraneMat);
  membrane.scale.set(1.15, 0.92, 1);
  cell.add(membrane);

  const nucleus = new THREE.Group();
  nucleus.position.set(-0.3, 0.2, 0);
  nucleus.add(new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), partMaterial('#3D7FC4', { transparent: true, opacity: 0.85 })));
  const nucleolus = new THREE.Mesh(new THREE.SphereGeometry(0.38, 20, 14), partMaterial('#1E3F66'));
  nucleolus.position.set(0.2, 0.15, 0.4);
  nucleus.add(nucleolus);
  cell.add(nucleus);

  const mitochondria = new THREE.Group();
  [[1.8, -0.6, 0.6, 0.6], [-1.6, -1.2, 0.8, -0.4], [0.6, 1.7, -0.6, 1.2], [1.2, 0.9, 1.4, 2.1], [-1.9, 0.9, -0.8, 0.9]].forEach(([x, y, z, rot]) => {
    const mito = capsule(0.22, 0.6, '#FF7A59');
    mito.position.set(x, y, z);
    mito.rotation.set(rot, rot * 0.5, 1.2 + rot);
    mitochondria.add(mito);
  });
  cell.add(mitochondria);

  const reGolgi = new THREE.Group();
  const er = stackedArcs({ count: 4, radius: 1.55, tube: 0.085, arc: Math.PI * 1.3, gap: 0.14, color: '#4CC38A' });
  er.position.copy(nucleus.position);
  er.rotation.set(0.2, 0.4, 2.2);
  const golgi = stackedArcs({ count: 5, radius: 0.55, tube: 0.1, arc: Math.PI * 0.9, gap: 0.16, color: '#F2B544' });
  golgi.position.set(1.4, -1.2, -0.3);
  golgi.rotation.set(0.6, -0.5, 0.9);
  reGolgi.add(er, golgi);
  cell.add(reGolgi);

  const lysosomes = new THREE.Group();
  [[0.4, -1.9, 0.5], [2.1, 0.3, -0.7], [-1.0, -0.4, 1.7]].forEach(([x, y, z]) => {
    const lyso = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), partMaterial('#E5534B'));
    lyso.position.set(x, y, z);
    lysosomes.add(lyso);
  });
  cell.add(lysosomes);

  const centrioles = new THREE.Group();
  centrioles.position.set(0.9, 0.2, 1.4);
  const centrioleA = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.42, 9), partMaterial('#E8F4F2'));
  const centrioleB = centrioleA.clone();
  centrioleB.rotation.z = Math.PI / 2;
  centrioleB.position.x = 0.25;
  centrioles.add(centrioleA, centrioleB);
  cell.add(centrioles);

  return {
    cell,
    groups: [[membrane], meshesOf(nucleus), meshesOf(mitochondria), meshesOf(reGolgi), meshesOf(lysosomes), meshesOf(centrioles)],
  };
}

export function createAnimalCellScene({ tier, renderer }) {
  const scene = new THREE.Scene();
  const camera = makeCamera(45);
  scene.background = WATER.clone();
  scene.fog = new THREE.FogExp2(WATER.clone(), 0.025);

  const uniforms = { uTime: { value: 0 } };
  const { cell, groups } = buildCell(uniforms);
  scene.add(cell);
  const highlighter = createHighlighter(groups);

  const particles = createDriftParticles({
    count: tier === 'high' ? 500 : 250,
    spread: new THREE.Vector3(30, 20, 30),
    color: '#9FE3E0',
    size: 0.04,
    opacity: 0.4,
  });
  scene.add(particles.points);

  useLabLighting(scene, renderer, { intensity: 0.7 });

  function update(dt, progress, time) {
    uniforms.uTime.value = time;
    particles.update(time);

    const arrive = smooth(rangeT(progress, 0, 0.18));
    cell.position.x = subjectShift();
    cell.rotation.y = time * 0.12 + progress * 1.5;
    cell.rotation.x = Math.sin(time * 0.2) * 0.12;
    camera.position.set(0, lerp(0.6, 0.3, arrive), lerp(4, 11, arrive));
    camera.lookAt(subjectShift() * 0.55, 0, 0);

    highlighter.update(dt, activePart(progress, PART_COUNT));
  }

  return { scene, camera, update };
}
