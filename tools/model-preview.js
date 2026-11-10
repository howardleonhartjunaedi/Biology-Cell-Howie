// Alat dev (tidak ikut build): buka /tools/model-preview.html?model=/models/animal-cell.glb
// - Tombol per material: tampilkan hanya material itu (untuk mengenali organel).
// - Klik model: catat nama material + koordinat titik (mode ?pick untuk posisi label).
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const params = new URLSearchParams(location.search);
const url = params.get('model') ?? '/models/animal-cell.glb';
const log = document.getElementById('log');
const panel = document.getElementById('panel');

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);
document.body.prepend(renderer.domElement);
const scene = new THREE.Scene();
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.01, 200);
camera.position.set(0, 6, 12);
const controls = new OrbitControls(camera, renderer.domElement);

const draco = new DRACOLoader().setDecoderPath('/draco/');
const loader = new GLTFLoader().setDRACOLoader(draco);
const groups = new Map();

loader.load(url, (gltf) => {
  scene.add(gltf.scene);
  gltf.scene.traverse((child) => {
    if (!child.isMesh) return;
    const name = child.material.name || '(tanpa nama)';
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push(child);
  });
  const all = document.createElement('button');
  all.textContent = 'Semua';
  all.onclick = () => show(null);
  panel.append(all);
  [...groups.keys()].sort().forEach((name) => {
    const button = document.createElement('button');
    button.textContent = `${name} (#${groups.get(name)[0].material.color.getHexString()})`;
    button.dataset.name = name;
    button.onclick = () => show(name);
    panel.append(button);
  });
  const box = new THREE.Box3().setFromObject(gltf.scene);
  controls.target.copy(box.getCenter(new THREE.Vector3()));
  window.__preview = { groups, show, camera, controls, scene };
});

function show(name) {
  groups.forEach((list, key) => list.forEach((mesh) => (mesh.visible = !name || key === name)));
  panel.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.name === name)));
}

const raycaster = new THREE.Raycaster();
renderer.domElement.addEventListener('click', (event) => {
  const pointer = new THREE.Vector2((event.clientX / innerWidth) * 2 - 1, -(event.clientY / innerHeight) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObject(scene, true).find((h) => h.object.visible);
  if (!hit) return;
  const p = hit.point.toArray().map((n) => Number(n.toFixed(2)));
  log.textContent = `${hit.object.material.name}  titik [${p.join(', ')}]`;
  console.log(hit.object.material.name, p);
});

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
});
