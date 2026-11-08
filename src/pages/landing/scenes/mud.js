import * as THREE from 'three';
import { createDriftParticles, lerp, makeCamera, rangeT, seededRandom, smooth } from './shared.js';

const MUD = new THREE.Color('#1E1C17');
const BLACK = new THREE.Color('#000000');
const DARKEN_START = 0.7;

function createMudFloor() {
  const geometry = new THREE.PlaneGeometry(120, 120, 80, 80);
  const random = seededRandom(31);
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i += 1) {
    positions.setZ(i, (random() - 0.5) * 0.35 + Math.sin(positions.getX(i) * 0.3) * 0.25);
  }
  geometry.computeVertexNormals();
  const floor = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: '#3A3326', roughness: 1 }));
  floor.rotation.x = -Math.PI / 2;
  return floor;
}

export function createMudScene({ tier }) {
  const scene = new THREE.Scene();
  const camera = makeCamera(50);
  scene.background = MUD.clone();
  scene.fog = new THREE.FogExp2(MUD.clone(), 0.08);

  scene.add(createMudFloor());

  const sediment = createDriftParticles({
    count: tier === 'high' ? 1400 : 700,
    spread: new THREE.Vector3(30, 10, 30),
    color: '#8C7F66',
    size: 0.05,
    opacity: 0.5,
  });
  sediment.points.position.y = 4;
  scene.add(sediment.points);

  const hemi = new THREE.HemisphereLight('#9AA39A', '#1E1C17', 1.4);
  scene.add(hemi);

  function update(dt, progress, time) {
    sediment.update(time);

    const sink = smooth(rangeT(progress, 0, DARKEN_START));
    const dark = smooth(rangeT(progress, DARKEN_START, 1));
    camera.position.set(Math.sin(time * 0.1) * 0.4, lerp(5, 1.4, sink), lerp(10, 4, sink));
    camera.lookAt(0, lerp(1.5, 0.2, sink), -4);

    scene.background.copy(MUD).lerp(BLACK, dark);
    scene.fog.color.copy(scene.background);
    hemi.intensity = lerp(1.4, 0, dark);
    sediment.points.material.opacity = lerp(0.5, 0, dark);
  }

  return { scene, camera, update };
}
