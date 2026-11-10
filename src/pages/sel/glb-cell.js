// Memuat model sel unduhan (.glb, dikompresi Draco) dan menyiapkannya untuk Lab Sel:
// - sel hewan: "Animal cell 2.0" oleh montanna (CC BY 4.0)
// - sel tumbuhan: "Plant Cell | Biology" oleh Oliver/okchs (CC BY 4.0)
// Setiap mesh dipetakan ke satu organel (lihat docs/ASSETS.md), materialnya diganti dengan
// material "lab" kita supaya bisa menyala saat disorot dan cocok dengan ruang lab gelap.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { buildPeroxisomes } from './cell-models.js';
import { seededRandom } from '../landing/scenes/shared.js';

const TILT_TOWARD_CAMERA = THREE.MathUtils.degToRad(48);
const ELONGATED = 2.2;
const SPECK_SIZE = 0.1;

// Sel hewan: nama material di file → id organel di organel.json
const ANIMAL_BY_MATERIAL = {
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

// Sel tumbuhan: awalan nama node di file → id organel. Yang tidak ada di daftar disembunyikan
// (sitoskeleton dan lisosom tidak termasuk daftar organel sel tumbuhan di KONTEN-MATERI).
const PLANT_BY_NODE = [
  [/^cell_wall/, 'dinding-sel'],
  [/^lipid_bilayer/, 'membran-plasma'],
  [/^Disc_glass/, 'sitoplasma'],
  [/vacuole/, 'vakuola'],
  [/^(Cloner|Boole)/, 'kloroplas'],
  [/^(Nucleus|Nucleolus|chromatin|shell|Icosphere)/, 'nukleus'],
  [/^Sphere_00[25]/, 'mitokondria'],
  [/^golgi/, 'golgi'],
  [/^floating_ribosomes/, 'ribosom'],
  [/^rough_smooth_er/, 're-kasar'],
];

const CELLS = {
  hewan: {
    url: '/models/animal-cell.glb',
    organelleOf: (mesh) => ANIMAL_BY_MATERIAL[mesh.material.name],
    size: 5.4,
    drop: -0.45,
    shells: {
      sitoplasma: { darken: 0.22 },
    },
    peroxisomes: { spots: [[2.2, 0.12, 0.4], [-1.4, 0.16, 2.8], [1.4, 0.16, -1.6]], scale: 1.4 },
  },
  tumbuhan: {
    url: '/models/plant-cell.glb',
    organelleOf: (mesh) => PLANT_BY_NODE.find(([pattern]) => pattern.test(mesh.name))?.[1],
    size: 5.8,
    drop: -0.5,
    shells: {
      'membran-plasma': { color: '#8CC7A4' },
      sitoplasma: { color: '#2E6B57' },
    },
    // Warna asli dinding sel hampir hitam di ruang lab gelap; diganti hijau zaitun.
    colors: { 'dinding-sel': '#7E9B5C' },
    // RE kasar dan RE halus di model ini satu mesh, jadi keduanya menyorot mesh yang sama.
    aliases: { 're-kasar': ['re-halus'] },
    peroxisomes: { spots: [[9.2, 0.15, 1.8], [4.8, 0.15, 2.2], [8.8, 0.15, -1.0]], scale: 1.8 },
  },
};

function labMaterial(source, shell, color) {
  const base = (color ?? shell?.color) ? new THREE.Color(color ?? shell.color) : source.color.clone().offsetHSL(0, -0.12, -0.04 - (shell?.darken ?? 0));
  // Membran dan sitoplasma dibuat padat (tidak tembus pandang), sesuai permintaan Howard.
  const transparent = shell ? false : source.transparent;
  return new THREE.MeshPhysicalMaterial({
    name: source.name,
    color: base,
    emissive: base,
    emissiveIntensity: 0,
    roughness: 0.4,
    clearcoat: 0.5,
    clearcoatRoughness: 0.3,
    transparent,
    opacity: shell ? 1 : source.opacity,
    side: shell ? THREE.DoubleSide : source.side,
    depthWrite: !transparent,
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

// Sel hewan: Material.025 berisi sentriol (tabung panjang) dan lisosom (bola) dalam satu mesh.
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

function prepare(scene, config) {
  scene.updateMatrixWorld(true);
  const materials = new Map();
  const swaps = [];
  const unused = [];
  scene.traverse((child) => {
    if (!child.isMesh) return;
    const id = config.organelleOf(child);
    if (!id || (!child.isInstancedMesh && isSpeck(child))) {
      unused.push(child);
      return;
    }
    const key = `${child.material.name}|${id}`;
    if (!materials.has(key)) materials.set(key, labMaterial(child.material, config.shells[id], config.colors?.[id]));
    child.material = materials.get(key);
    child.userData.organelle = id;
    if (config.aliases?.[id]) child.userData.aliases = config.aliases[id];
    if (id === 'sentriol-lisosom') swaps.push(child);
  });
  swaps.forEach((mesh) => {
    mesh.parent.add(...splitCentriolesAndLysosomes(mesh));
    mesh.removeFromParent();
  });
  // Bagian yang tidak dipakai dibuang (bukan sekadar disembunyikan) supaya raycast lebih ringan.
  unused.forEach((mesh) => {
    mesh.removeFromParent();
    mesh.geometry.dispose();
  });
}

// Kedua model tidak punya peroksisom, jadi kita tambahkan peroksisom buatan sendiri di titik
// sitoplasma yang kosong (dicari dengan raycast dari atas, dalam koordinat model).
function addPeroxisomes(scene, { spots, scale }) {
  const peroxisomes = buildPeroxisomes(seededRandom(11), 1);
  peroxisomes.children.forEach((child, i) => {
    child.position.set(...spots[i]);
    child.scale.setScalar(scale);
  });
  scene.add(peroxisomes);
}

function fit(model, config) {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center);
  const pivot = new THREE.Group();
  pivot.add(model);
  pivot.scale.setScalar(config.size / Math.max(size.x, size.z));
  pivot.rotation.x = TILT_TOWARD_CAMERA;
  pivot.position.y = config.drop;
  return pivot;
}

export function loadCellModel(cellId) {
  const config = CELLS[cellId];
  const draco = new DRACOLoader().setDecoderPath('/draco/');
  const loader = new GLTFLoader().setDRACOLoader(draco);
  return loader.loadAsync(config.url).then((gltf) => {
    draco.dispose();
    prepare(gltf.scene, config);
    addPeroxisomes(gltf.scene, config.peroxisomes);
    const cell = new THREE.Group();
    cell.add(fit(gltf.scene, config));
    return cell;
  });
}
