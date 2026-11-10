// Sel hewan dari model "Animal cell 2.0" (montanna, CC BY 4.0), dikompresi dengan Draco.
// Setiap material di file .glb dipetakan ke satu organel (lihat docs/ASSETS.md), lalu diganti
// dengan material "lab" kita supaya bisa menyala saat disorot dan cocok dengan ruang lab gelap.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { buildPeroxisomes } from './cell-models.js';
import { seededRandom } from '../landing/scenes/shared.js';

const MODEL_URL = '/models/animal-cell.glb';
const TARGET_SIZE = 5.4;
const TILT_TOWARD_CAMERA = THREE.MathUtils.degToRad(48);
const DROP = -0.45;
const PEROXISOME_SPOTS = [[2.2, 0.12, 0.4], [-1.4, 0.16, 2.8], [1.4, 0.16, -1.6]];
const PEROXISOME_SCALE = 1.4;
const ELONGATED = 2.2;
const SPECK_SIZE = 0.1;

// Nama material di file → id organel di organel.json
const ORGANELLE_BY_MATERIAL = {
  Material: 'membran-plasma',
  'Material.004': 'sitoplasma',
  'Material.001': 'nukleus',
  'Material.003': 'nukleus',
  'Material.009': 'nukleus',
  'Material.010': 'nukleus',
  'Material.027': 'nukleus',
  'Material.005': 're-kasar',
  'Material.026': 're-halus',
  'Material.018': 'ribosom',
  'Material.006': 'golgi',
  'Material.015': 'golgi',
  'Material.008': 'mitokondria',
  'Material.007': 'mitokondria',
  'Material.025': 'sentriol-lisosom',
};

// Membran dan sitoplasma tembus pandang supaya organel di dalamnya tetap terlihat.
const SHELL = {
  'membran-plasma': { opacity: 0.5, side: THREE.DoubleSide },
  sitoplasma: { opacity: 0.62, side: THREE.DoubleSide, darken: 0.22 },
};

function labMaterial(source, id) {
  const shell = SHELL[id];
  const color = source.color.clone().offsetHSL(0, -0.12, -0.04 - (shell?.darken ?? 0));
  return new THREE.MeshPhysicalMaterial({
    name: source.name,
    color,
    emissive: color,
    emissiveIntensity: 0,
    roughness: 0.4,
    clearcoat: 0.5,
    clearcoatRoughness: 0.3,
    transparent: Boolean(shell),
    opacity: shell?.opacity ?? 1,
    side: shell?.side ?? source.side,
    depthWrite: !shell,
  });
}

// Memecah segitiga satu geometri menjadi "pulau" (bagian yang tidak saling menyambung).
// Hasilnya daftar indeks per pulau; titik-titiknya tetap dipakai bersama.
function islandIndices(geometry) {
  const index = geometry.index.array;
  const parent = new Int32Array(geometry.attributes.position.count).map((_, i) => i);
  const root = (i) => {
    while (parent[i] !== i) i = parent[i] = parent[parent[i]];
    return i;
  };
  for (let t = 0; t < index.length; t += 3) {
    parent[root(index[t + 1])] = root(index[t]);
    parent[root(index[t + 2])] = root(index[t]);
  }
  const groups = new Map();
  for (let t = 0; t < index.length; t += 3) {
    const key = root(index[t]);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(index[t], index[t + 1], index[t + 2]);
  }
  return [...groups.values()];
}

function isElongated(indices, position) {
  const box = new THREE.Box3();
  const point = new THREE.Vector3();
  indices.forEach((i) => box.expandByPoint(point.fromBufferAttribute(position, i)));
  const size = box.getSize(point);
  return Math.max(size.x, size.y, size.z) / Math.max(Math.min(size.x, size.y, size.z), 1e-4) > ELONGATED;
}

// Geometri baru yang hanya berisi titik-titik yang dipakai oleh `indices`
// (supaya kotak batasnya pas dengan bagian itu saja).
function compact(geometry, indices) {
  const remap = new Map();
  indices.forEach((i) => {
    if (!remap.has(i)) remap.set(i, remap.size);
  });
  const result = new THREE.BufferGeometry();
  Object.entries(geometry.attributes).forEach(([name, attribute]) => {
    const size = attribute.itemSize;
    const array = new attribute.array.constructor(remap.size * size);
    remap.forEach((to, from) => {
      for (let k = 0; k < size; k += 1) array[to * size + k] = attribute.getComponent(from, k);
    });
    result.setAttribute(name, new THREE.BufferAttribute(array, size, attribute.normalized));
  });
  result.setIndex(indices.map((i) => remap.get(i)));
  return result;
}

// Material.025 berisi sentriol (tabung panjang) dan lisosom (bola) dalam satu mesh.
function splitCentriolesAndLysosomes(mesh) {
  const lists = { sentriol: [], lisosom: [] };
  const position = mesh.geometry.attributes.position;
  islandIndices(mesh.geometry).forEach((indices) => lists[isElongated(indices, position) ? 'sentriol' : 'lisosom'].push(...indices));
  return Object.entries(lists)
    .filter(([, indices]) => indices.length)
    .map(([id, indices]) => {
      const part = new THREE.Mesh(compact(mesh.geometry, indices), mesh.material);
      part.applyMatrix4(mesh.matrix);
      part.userData.organelle = id;
      return part;
    });
}

// Bintik sangat kecil (sisa titik anotasi di file asli) disembunyikan.
function isSpeck(mesh) {
  mesh.geometry.computeBoundingBox();
  const size = mesh.geometry.boundingBox.getSize(new THREE.Vector3()).multiply(mesh.getWorldScale(new THREE.Vector3()));
  return Math.max(size.x, size.y, size.z) < SPECK_SIZE;
}

function prepare(scene) {
  scene.updateMatrixWorld(true);
  const materials = new Map();
  const swaps = [];
  scene.traverse((child) => {
    if (!child.isMesh) return;
    const id = ORGANELLE_BY_MATERIAL[child.material.name];
    if (!id || (!child.isInstancedMesh && isSpeck(child))) {
      child.visible = false;
      return;
    }
    if (!materials.has(child.material.name)) materials.set(child.material.name, labMaterial(child.material, id));
    child.material = materials.get(child.material.name);
    child.userData.organelle = id;
    if (id === 'sentriol-lisosom') swaps.push(child);
  });
  swaps.forEach((mesh) => {
    mesh.parent.add(...splitCentriolesAndLysosomes(mesh));
    mesh.removeFromParent();
  });
}

function fit(model) {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center);
  const pivot = new THREE.Group();
  pivot.add(model);
  pivot.scale.setScalar(TARGET_SIZE / Math.max(size.x, size.z));
  pivot.rotation.x = TILT_TOWARD_CAMERA;
  pivot.position.y = DROP;
  return pivot;
}

export function loadAnimalCell() {
  const draco = new DRACOLoader().setDecoderPath('/draco/');
  const loader = new GLTFLoader().setDRACOLoader(draco);
  return loader.loadAsync(MODEL_URL).then((gltf) => {
    draco.dispose();
    prepare(gltf.scene);
    // Model ini tidak punya peroksisom, jadi kita tambahkan peroksisom buatan sendiri
    // di titik sitoplasma yang kosong (dicari dengan raycast dari atas, koordinat model).
    const peroxisomes = buildPeroxisomes(seededRandom(11), 1);
    peroxisomes.children.forEach((child, i) => {
      child.position.set(...PEROXISOME_SPOTS[i]);
      child.scale.setScalar(PEROXISOME_SCALE);
    });
    gltf.scene.add(peroxisomes);
    const cell = new THREE.Group();
    cell.add(fit(gltf.scene));
    return cell;
  });
}
