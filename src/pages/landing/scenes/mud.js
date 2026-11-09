import * as THREE from 'three';
import { createDriftParticles, lerp, makeCamera, rangeT, seededRandom, smooth } from './shared.js';
import { createDepthDust } from './depth.js';

// Kerikil di dasar lumpur sepanjang jalur kamera: benda dekat ini bergeser cepat saat kamera turun,
// jadi lumpur terasa sebagai dasar yang luas, bukan bidang datar.
function createPebbles(count) {
  const random = seededRandom(64);
  const mesh = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.25, 1), new THREE.MeshStandardMaterial({ color: '#4A4234', roughness: 0.95 }), count);
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  for (let i = 0; i < count; i += 1) {
    const size = 0.3 + random() * random() * 2.2;
    quaternion.setFromEuler(new THREE.Euler(random() * 3, random() * 3, random() * 3));
    matrix.compose(new THREE.Vector3((random() - 0.5) * 18, size * 0.08, -12 + random() * 20), quaternion, new THREE.Vector3(size, size * 0.6, size));
    mesh.setMatrixAt(i, matrix);
  }
  return mesh;
}

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
  const floor = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: '#4E4535', roughness: 1 }));
  floor.rotation.x = -Math.PI / 2;
  return floor;
}

export function createMudScene({ tier }) {
  const scene = new THREE.Scene();
  const camera = makeCamera(50);
  scene.background = MUD.clone();
  scene.fog = new THREE.FogExp2(MUD.clone(), 0.06);

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

  scene.add(createPebbles(tier === 'low' ? 60 : 140));
  const dust = createDepthDust({ tier, color: '#8C7F66' });
  scene.add(dust.group);

  const hemi = new THREE.HemisphereLight('#9AA39A', '#1E1C17', 1.4);
  scene.add(hemi);
  // Cahaya rendah dari samping memunculkan relief lumpur dan bayangan kerikil (petunjuk kedalaman).
  const grazing = new THREE.DirectionalLight('#C9BFA6', 1.2);
  grazing.position.set(-6, 3, 2);
  scene.add(grazing);

  function update(dt, progress, time) {
    sediment.update(time);

    const sink = smooth(rangeT(progress, 0, DARKEN_START));
    const dark = smooth(rangeT(progress, DARKEN_START, 1));
    camera.position.set(Math.sin(time * 0.1) * 0.4, lerp(5, 1.4, sink), lerp(10, 4, sink));
    camera.lookAt(0, lerp(1.5, 0.2, sink), -4);
    dust.update(time, camera);
    dust.group.visible = dark < 0.95;

    scene.background.copy(MUD).lerp(BLACK, dark);
    scene.fog.color.copy(scene.background);
    hemi.intensity = lerp(1.4, 0, dark);
    grazing.intensity = lerp(1.2, 0, dark);
    sediment.points.material.opacity = lerp(0.5, 0, dark);
  }

  return { scene, camera, update };
}
