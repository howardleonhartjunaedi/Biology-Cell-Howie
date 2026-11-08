import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { activePart } from '../dom-sync.js';
import { subjectShift } from './animal-cell.js';
import { createHighlighter, membraneMaterial, meshesOf, partMaterial } from './cell-parts.js';
import { createDriftParticles, lerp, makeCamera, rangeT, seededRandom, smooth } from './shared.js';

const WATER = new THREE.Color('#0A2A24');
const PART_COUNT = 3;
const SIZE = new THREE.Vector3(6.4, 4.2, 3.6);

function buildCell() {
  const cell = new THREE.Group();

  const wallMaterial = membraneMaterial('#9CCB6E');
  wallMaterial.opacity = 0.42;
  const wall = new THREE.Mesh(new RoundedBoxGeometry(SIZE.x, SIZE.y, SIZE.z, 6, 0.5), wallMaterial);
  cell.add(wall);

  const membrane = new THREE.Mesh(
    new RoundedBoxGeometry(SIZE.x - 0.35, SIZE.y - 0.35, SIZE.z - 0.35, 6, 0.4),
    new THREE.MeshStandardMaterial({ color: '#7FD6D0', transparent: true, opacity: 0.12, depthWrite: false })
  );
  cell.add(membrane);

  const vacuole = new THREE.Mesh(
    new RoundedBoxGeometry(SIZE.x * 0.62, SIZE.y * 0.6, SIZE.z * 0.55, 6, 0.8),
    partMaterial('#8FD3F0', { transparent: true, opacity: 0.55, depthWrite: false })
  );
  vacuole.position.x = 0.4;
  cell.add(vacuole);

  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.62, 24, 16), new THREE.MeshStandardMaterial({ color: '#3D7FC4', roughness: 0.5 }));
  nucleus.position.set(-2.3, 0.9, 0.6);
  cell.add(nucleus);

  const chloroplasts = new THREE.Group();
  const random = seededRandom(73);
  const chloroGeometry = new THREE.SphereGeometry(0.28, 16, 12);
  chloroGeometry.scale(1.6, 0.8, 1);
  const chloroMaterial = partMaterial('#3FA55A');
  for (let i = 0; i < 16; i += 1) {
    const chloro = new THREE.Mesh(chloroGeometry, chloroMaterial);
    const side = i % 4;
    const along = random() - 0.5;
    const half = SIZE.clone().multiplyScalar(0.5).subScalar(0.55);
    if (side === 0) chloro.position.set(along * SIZE.x * 0.8, half.y, (random() - 0.5) * SIZE.z * 0.6);
    if (side === 1) chloro.position.set(along * SIZE.x * 0.8, -half.y, (random() - 0.5) * SIZE.z * 0.6);
    if (side === 2) chloro.position.set(half.x, along * SIZE.y * 0.7, (random() - 0.5) * SIZE.z * 0.6);
    if (side === 3) chloro.position.set(-half.x, along * SIZE.y * 0.7, (random() - 0.5) * SIZE.z * 0.6);
    chloro.rotation.set(random() * 3, random() * 3, random() * 3);
    chloroplasts.add(chloro);
  }
  cell.add(chloroplasts);

  return { cell, groups: [[wall], meshesOf(chloroplasts), [vacuole]] };
}

export function createPlantCellScene({ tier }) {
  const scene = new THREE.Scene();
  const camera = makeCamera(45);
  scene.background = WATER.clone();
  scene.fog = new THREE.FogExp2(WATER.clone(), 0.022);

  const { cell, groups } = buildCell();
  scene.add(cell);
  const highlighter = createHighlighter(groups);

  const particles = createDriftParticles({
    count: tier === 'high' ? 400 : 200,
    spread: new THREE.Vector3(30, 20, 30),
    color: '#CFEFC4',
    size: 0.04,
    opacity: 0.35,
  });
  scene.add(particles.points);

  scene.add(new THREE.HemisphereLight('#E8FFE6', '#0A2A24', 1.1));
  const key = new THREE.DirectionalLight('#FFF4D6', 2);
  key.position.set(-5, 6, 6);
  const rim = new THREE.DirectionalLight('#4CC38A', 1.2);
  rim.position.set(6, -2, -6);
  scene.add(key, rim);

  function update(dt, progress, time) {
    particles.update(time);
    const arrive = smooth(rangeT(progress, 0, 0.18));
    cell.position.x = subjectShift();
    cell.rotation.y = -0.6 + time * 0.08 + progress * 1.2;
    cell.rotation.x = 0.35 + Math.sin(time * 0.2) * 0.08;
    camera.position.set(0, 0.4, lerp(4, 12, arrive));
    camera.lookAt(subjectShift() * 0.55, 0, 0);
    highlighter.update(dt, activePart(progress, PART_COUNT));
  }

  return { scene, camera, update };
}
